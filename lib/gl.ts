export type GL = WebGL2RenderingContext
export type GLCanvas = HTMLCanvasElement | OffscreenCanvas

// Single oversized triangle that covers the viewport: no buffers or attributes needed.
export const FULLSCREEN_VERTEX_SOURCE = /* glsl */ `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`

export function createGL(canvas: GLCanvas, attributes: WebGLContextAttributes): GL | null {
  try {
    return (canvas as HTMLCanvasElement).getContext("webgl2", attributes)
  } catch {
    return null
  }
}

function compile(gl: GL, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

// Compiles and links without stalling the thread when KHR_parallel_shader_compile is available
// (the status is polled instead of queried synchronously, which would block until the driver finishes).
export function linkProgram(gl: GL, vertexSource: string, fragmentSource: string): Promise<WebGLProgram | null> {
  const parallel = gl.getExtension("KHR_parallel_shader_compile")
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource)
  const program = gl.createProgram()
  if (!vertex || !fragment || !program) return Promise.resolve(null)

  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)

  return new Promise((resolve) => {
    const poll = () => {
      if (gl.isContextLost()) {
        resolve(null)
        return
      }
      if (parallel && !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) {
        setTimeout(poll, 8)
        return
      }

      const linked = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean
      if (!linked && process.env.NODE_ENV !== "production") {
        console.error(
          "WebGL program failed to link:",
          gl.getProgramInfoLog(program),
          gl.getShaderInfoLog(vertex),
          gl.getShaderInfoLog(fragment),
        )
      }
      gl.detachShader(program, vertex)
      gl.detachShader(program, fragment)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      resolve(linked ? program : null)
    }
    poll()
  })
}

// Biome mistakes WebGL's `use*` methods for React hooks when they follow an early return, hence the wrapper. Since
// Biome 2.5 it flags the call inside a plain function too, so the wrapper also carries the suppression.
export function bindProgram(gl: GL, program: WebGLProgram) {
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGLRenderingContext.useProgram is not a React hook.
  gl.useProgram(program)
}

export function getUniforms<K extends string>(gl: GL, program: WebGLProgram, names: readonly K[]) {
  const locations = {} as Record<K, WebGLUniformLocation | null>
  for (const name of names) locations[name] = gl.getUniformLocation(program, name)
  return locations
}

// Frees the GPU context right away instead of waiting for garbage collection (matters with Strict Mode remounts).
export function releaseGL(gl: GL) {
  gl.getExtension("WEBGL_lose_context")?.loseContext()
}
