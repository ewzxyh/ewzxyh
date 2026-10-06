import { bindProgram, createGL, getUniforms, linkProgram, releaseGL, type GL } from "./gl"

// All images share ONE WebGL context. Each frame is rendered into a detached canvas and copied into the
// 2D canvas of the image that asked for it, so a page with many images no longer holds many GL contexts.

const vertexSource = /* glsl */ `#version 300 es
uniform vec2 uTextureSize;
uniform vec2 uQuadSize;
uniform float uPositionY;
out vec2 vUvCover;

void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));

  // "cover" mapping to preserve aspect ratio
  float texR = uTextureSize.x / uTextureSize.y;
  float quadR = uQuadSize.x / uQuadSize.y;
  vec2 s = vec2(1.0);
  if (quadR > texR) { s.y = texR / quadR; } else { s.x = quadR / texR; }

  vec2 offset = (1.0 - s) * vec2(0.5, uPositionY);
  vUvCover = p * s + offset;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`

const fragmentSource = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uScrollVelocity;
uniform float uVelocityStrength;
uniform float uGrayscale;
uniform float uGrain;

in vec2 vUvCover;
out vec4 fragColor;

void main() {
  vec2 texCoords = vUvCover;

  // drive distortion amount from velocity strength
  float amt = 0.03 * uVelocityStrength;

  float t = uTime * 0.8;
  texCoords.y += sin((texCoords.x * 8.0) + t) * amt;
  texCoords.x += cos((texCoords.y * 6.0) - t * 0.8) * amt * 0.6;

  // directional tint: push R/G/B differently by scroll direction
  float dir = sign(uScrollVelocity);
  vec2 tc = texCoords;

  float r = texture(uTexture, tc + vec2( amt * 0.50 * dir, 0.0)).r;
  float g = texture(uTexture, tc + vec2( amt * 0.25 * dir, 0.0)).g;
  float b = texture(uTexture, tc + vec2(-amt * 0.35 * dir, 0.0)).b;

  vec3 color = vec3(r, g, b);

  if (uGrayscale > 0.5) {
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    color = vec3(gray);
  }

  float noise = fract(sin(dot(gl_FragCoord.xy + uTime * 31.0, vec2(12.9898, 78.233))) * 43758.5453);
  color += (noise - 0.5) * uGrain;

  fragColor = vec4(color, 1.0);
}
`

const uniformNames = [
  "uTexture",
  "uTextureSize",
  "uQuadSize",
  "uPositionY",
  "uTime",
  "uScrollVelocity",
  "uVelocityStrength",
  "uGrayscale",
  "uGrain",
] as const

type Uniforms = Record<(typeof uniformNames)[number], WebGLUniformLocation | null>

interface Shared {
  gl: GL
  canvas: HTMLCanvasElement
  uniforms: Uniforms
}

let sharedPromise: Promise<Shared | null> | null = null
let sharedRefs = 0

// The first WebGL context of a page can block its thread for a long time while the GPU process wakes up.
// The background shader creates its context in a worker first; the main-thread context waits for that
// so the wait never lands on the main thread. The gate also opens when the worker path fails, and the
// timeout is only a safety net for a worker that never answers.
const GPU_GATE_TIMEOUT_MS = 8000
let openGate: () => void = () => {}
const gpuGate = new Promise<void>((resolve) => {
  openGate = resolve
})

export function openGpuGate() {
  openGate()
}

async function createShared(): Promise<Shared | null> {
  await Promise.race([gpuGate, new Promise((resolve) => setTimeout(resolve, GPU_GATE_TIMEOUT_MS))])
  const canvas = document.createElement("canvas")
  const gl = createGL(canvas, {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "default",
  })
  if (!gl) return null

  const program = await linkProgram(gl, vertexSource, fragmentSource)
  if (!program) {
    releaseGL(gl)
    return null
  }

  bindProgram(gl, program)
  gl.bindVertexArray(gl.createVertexArray())
  gl.activeTexture(gl.TEXTURE0)
  const uniforms = getUniforms(gl, program, uniformNames)
  gl.uniform1i(uniforms.uTexture, 0)
  return { gl, canvas, uniforms }
}

function acquireShared() {
  sharedRefs++
  sharedPromise ??= createShared()
  return sharedPromise
}

function releaseShared() {
  sharedRefs--
  if (sharedRefs > 0) return
  const pending = sharedPromise
  sharedPromise = null
  void pending?.then((shared) => {
    if (shared) releaseGL(shared.gl)
  })
}

export interface FxFrame {
  time: number
  velocity: number
  strength: number
}

export interface FxImageOptions {
  image: HTMLImageElement
  canvas: HTMLCanvasElement
  grayscale: boolean
  grain: number
  // CSS-like vertical focus: 0 = top of the image, 1 = bottom.
  focusY: number
}

export interface FxImage {
  resize: (cssWidth: number, cssHeight: number, ratio: number) => void
  draw: (frame: FxFrame) => void
  dispose: () => void
}

export async function createFxImage({ image, canvas, grayscale, grain, focusY }: FxImageOptions): Promise<FxImage | null> {
  const shared = await acquireShared()
  const context = canvas.getContext("2d", { alpha: false })
  if (!shared || !context) {
    releaseShared()
    return null
  }

  try {
    await image.decode()
  } catch {
    // Decoding errors surface again when the texture is uploaded.
  }

  const { gl, canvas: glCanvas, uniforms } = shared
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE)
  try {
    // sRGB texture + raw output keeps the same tonal curve the artwork was designed with.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, image)
  } catch {
    gl.deleteTexture(texture)
    releaseShared()
    return null
  }
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const textureWidth = image.naturalWidth
  const textureHeight = image.naturalHeight
  context.imageSmoothingEnabled = false

  return {
    resize(cssWidth, cssHeight, ratio) {
      const width = Math.max(1, Math.round(cssWidth * ratio))
      const height = Math.max(1, Math.round(cssHeight * ratio))
      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height
    },
    draw(frame) {
      const width = canvas.width
      const height = canvas.height
      if (!width || !height || gl.isContextLost()) return

      if (glCanvas.width < width || glCanvas.height < height) {
        glCanvas.width = Math.max(glCanvas.width, width)
        glCanvas.height = Math.max(glCanvas.height, height)
      }

      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.viewport(0, 0, width, height)
      gl.uniform2f(uniforms.uTextureSize, textureWidth, textureHeight)
      gl.uniform2f(uniforms.uQuadSize, width, height)
      gl.uniform1f(uniforms.uPositionY, 1 - focusY)
      gl.uniform1f(uniforms.uTime, frame.time)
      gl.uniform1f(uniforms.uScrollVelocity, frame.velocity)
      gl.uniform1f(uniforms.uVelocityStrength, frame.strength)
      gl.uniform1f(uniforms.uGrayscale, grayscale ? 1 : 0)
      gl.uniform1f(uniforms.uGrain, grain)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // GL's origin is bottom-left: the viewport occupies the bottom rows of the drawing buffer.
      context.drawImage(glCanvas, 0, glCanvas.height - height, width, height, 0, 0, width, height)
    },
    dispose() {
      if (!gl.isContextLost()) gl.deleteTexture(texture)
      releaseShared()
    },
  }
}
