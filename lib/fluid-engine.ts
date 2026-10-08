import {
  FULLSCREEN_VERTEX_SOURCE,
  bindProgram,
  createGL,
  getUniforms,
  linkProgram,
  releaseGL,
  type GL,
  type GLCanvas,
} from "./gl"

// The shader works in a "world" space where the viewport is WORLD_SCALE units tall. That is the density
// the artwork was tuned at (~1.75 device pixel ratio) and it now stays identical on every display.
const WORLD_SCALE = 1.75
const TRAIL_CAPACITY = 24
const MAX_PIXELS = 2.2e6
const MIN_SCALE = 0.5
const IDLE_FRAME_MS = 32

const fragmentSource = /* glsl */ `#version 300 es
precision highp float;
precision highp int;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform vec2 uVelocity;
uniform vec4 uTrailPoints[24];
uniform vec2 uTrailVelocities[24];
uniform float uTrailAges[24];
uniform int uTrailCount;
uniform float uHoleIntensity;
uniform float uDarkMode;
uniform float uWorld;
uniform float uLineWidth;

out vec4 fragColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec2 domainWarp(vec2 p, float scale, float time, vec2 offset) {
  return vec2(
    snoise(vec3(p * scale + offset.x, time)),
    snoise(vec3(p * scale + offset.y, time))
  );
}

// Curl noise for fluid-like rotation
vec2 curlNoise(vec2 p, float time) {
  float eps = 0.01;
  float n1 = snoise(vec3(p.x, p.y + eps, time));
  float n2 = snoise(vec3(p.x, p.y - eps, time));
  float n3 = snoise(vec3(p.x + eps, p.y, time));
  float n4 = snoise(vec3(p.x - eps, p.y, time));
  float dx = (n1 - n2) / (2.0 * eps);
  float dy = (n3 - n4) / (2.0 * eps);
  return vec2(dx, -dy);
}

// Fluid distortion field - subtle for liquid feel
vec2 fluidDistort(vec2 uv, float time, float strength) {
  vec2 curl1 = curlNoise(uv * 1.5, time * 0.2) * 0.06;
  vec2 curl2 = curlNoise(uv * 3.0 + curl1, time * 0.3) * 0.03;
  return (curl1 + curl2) * strength;
}

// Single noise field with domain warping
float getNoiseField(vec2 uv) {
  float time = uTime * 0.08;
  vec2 warp = domainWarp(uv, 0.8, time * 0.5, vec2(0.0, 0.0)) * 0.4;
  vec2 warped = uv * 1.5 + warp;
  return snoise(vec3(warped, time)) * 0.5 + 0.5;
}

// Draw isoline at threshold - returns 1.0 for outline, 0.0 otherwise
float isoline(float value, float threshold, float lineWidth) {
  float edge = fwidth(value) * lineWidth;
  return smoothstep(threshold - edge, threshold, value)
       - smoothstep(threshold, threshold + edge, value);
}

// Metaball field contribution - smooth falloff for blending
float metaballField(float dist, float radius) {
  if (dist >= radius) return 0.0;
  float t = dist / radius;
  float t2 = t * t;
  return 1.0 - t2 * t2 * (3.0 - 2.0 * t2);
}

// Calculate meteor/mushroom shape - bulbous front, tapered tail
float getOrganicDist(vec2 uv, vec2 center, vec2 velocity, float size, float time, float seed) {
  vec2 toCenter = uv - center;

  float speed = length(velocity);
  vec2 dir = speed > 0.0003 ? normalize(velocity) : vec2(1.0, 0.0);
  vec2 perpDir = vec2(-dir.y, dir.x);

  float warpTime = time * 0.3 + seed;
  vec2 warp1 = domainWarp(uv * 1.0, 0.4, warpTime, vec2(seed * 5.0, seed * 11.0)) * 0.05;
  vec2 warpedToCenter = toCenter + warp1;

  float alongDir = dot(warpedToCenter, dir);
  float perpToDir = dot(warpedToCenter, perpDir);

  float frontScale = 1.05;
  float backScale = 1.3 + speed * 1.5;
  backScale = min(backScale, 2.0);

  float scaleAlong;
  if (alongDir > 0.0) {
    scaleAlong = alongDir / frontScale;
  } else {
    scaleAlong = alongDir / backScale;
  }

  float taperFactor = 1.2;
  if (alongDir < 0.0 && speed > 0.1) {
    float tailPos = -alongDir / size;
    taperFactor = 1.2 + tailPos * speed * 1.5;
    taperFactor = min(taperFactor, 2.0);
  }

  return length(vec2(scaleAlong, perpToDir * taperFactor)) / size;
}

// Fluid trail blob - smooth liquid appearance
float getTrailBlob(vec2 uv, float aspect, out float holeBlob) {
  holeBlob = 0.0;
  if (uTrailCount == 0) return 0.0;

  float time = uTime;
  vec2 uvAspect = vec2(uv.x * aspect, uv.y);

  // Broad phase: a point only influences pixels within ~2.2 sizes (+ noise warp margins).
  // Skipping everything else is exact and removes most of the per-pixel noise work.
  bool near = false;
  for (int i = 0; i < 24; i++) {
    if (i >= uTrailCount) break;
    vec4 tp = uTrailPoints[i];
    if (tp.x < 0.0) continue;
    float fade = 1.0 - uTrailAges[i];
    fade = fade * fade;
    if (fade < 0.02) continue;
    float size = (0.16 + min(length(uTrailVelocities[i]) * 0.25, 0.08)) * (0.4 + fade * 0.6);
    vec2 d = uvAspect - vec2(tp.x * aspect, tp.y);
    float reach = size * 2.2 + 0.16;
    if (dot(d, d) < reach * reach) {
      near = true;
      break;
    }
  }
  if (!near) return 0.0;

  vec2 fluidUV = uvAspect + fluidDistort(uvAspect, time * 0.06, 0.15);

  float totalField = 0.0;

  for (int i = 0; i < 24; i++) {
    if (i >= uTrailCount) break;

    vec4 tp = uTrailPoints[i];
    if (tp.x < 0.0) continue;

    vec2 pos = vec2(tp.x * aspect, tp.y);
    vec2 vel = uTrailVelocities[i];
    float age = uTrailAges[i];

    float fade = 1.0 - age;
    fade = fade * fade;
    if (fade < 0.02) continue;

    float speed = length(vel);
    float seed = float(i) * 1.7 + 0.3;

    float baseSize = 0.16;
    float sizeBoost = min(speed * 0.25, 0.08);
    float headTailRatio = 0.4 + fade * 0.6;
    float size = (baseSize + sizeBoost) * headTailRatio;

    vec2 toPoint = fluidUV - pos;
    float reach = size * 2.2 + 0.08;
    if (dot(toPoint, toPoint) > reach * reach) continue;

    float dist = getOrganicDist(fluidUV, pos, vel, size, time * 0.04, seed);
    float fieldContrib = metaballField(dist, 1.0) * fade;

    totalField = totalField + fieldContrib - totalField * fieldContrib * 0.6;
  }

  float mainBlob = smoothstep(0.25, 0.45, totalField);

  // Single hole blob - elongated ellipse, not influenced by meteor effect
  if (uHoleIntensity > 0.02 && mainBlob > 0.1) {
    vec2 vel = uVelocity * 100.0;
    vec2 mouseAspect = vec2(uMouse.x * aspect, uMouse.y);
    float speed = length(vel);
    vec2 dir = speed > 0.01 ? normalize(vel) : vec2(1.0, 0.0);
    vec2 perpDir = vec2(-dir.y, dir.x);

    float holeSize = 0.05 + min(speed * 0.08, 0.05);

    vec2 toHole = fluidUV - mouseAspect;
    vec2 warp = domainWarp(fluidUV * 1.0, 0.4, time * 0.012 + 50.0, vec2(250.0, 550.0)) * 0.04;
    vec2 warpedHole = toHole + warp;

    float elongation = 1.3 + speed * 1.0;
    elongation = min(elongation, 2.0);
    float alongHole = dot(warpedHole, dir) / elongation;
    float perpHole = dot(warpedHole, perpDir) * 1.25;

    float holeDist = length(vec2(alongHole, perpHole)) / holeSize;
    float holeField = metaballField(holeDist, 1.0);

    holeBlob = smoothstep(0.2, 0.4, holeField) * uHoleIntensity;
  }

  return mainBlob;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution * uWorld;
  float aspect = uResolution.x / uResolution.y;
  vec2 uvAspect = vec2(uv.x * aspect, uv.y);

  // Mouse distortion
  vec2 mouseAspect = vec2(uMouse.x * aspect, uMouse.y);
  float mouseDist = distance(uvAspect, mouseAspect);
  float influence = smoothstep(0.3, 0.0, mouseDist);
  vec2 mouseOffset = (uvAspect - mouseAspect) * influence * uMouseInfluence;

  float noise = getNoiseField(uvAspect + mouseOffset);

  // Tailwind stone palette (light mode)
  vec3 bgColorLight = vec3(0.961, 0.961, 0.957);
  vec3 lineColorLight = vec3(0.839, 0.827, 0.820);
  vec3 blobColorLight = vec3(0.873, 0.863, 0.857);
  vec3 fillColorLight = vec3(0.749, 0.731, 0.720);

  // Tailwind stone palette (dark mode)
  vec3 bgColorDark = vec3(0.047, 0.039, 0.035);
  vec3 lineColorDark = vec3(0.267, 0.251, 0.235);
  vec3 blobColorDark = vec3(0.090, 0.078, 0.071);
  vec3 fillColorDark = vec3(0.267, 0.251, 0.235);

  vec3 bgColor = mix(bgColorLight, bgColorDark, uDarkMode);
  vec3 lineColor = mix(lineColorLight, lineColorDark, uDarkMode);
  vec3 blobColor = mix(blobColorLight, blobColorDark, uDarkMode);
  vec3 fillColor = mix(fillColorLight, fillColorDark, uDarkMode);

  float line1 = isoline(noise, 0.40, uLineWidth);
  float line2 = isoline(noise, 0.55, uLineWidth);
  float line3 = isoline(noise, 0.70, uLineWidth);

  float bandLow = smoothstep(0.38, 0.42, noise);
  float bandHigh = 1.0 - smoothstep(0.53, 0.57, noise);
  float filledRegion = bandLow * bandHigh;

  vec3 color = bgColor;

  float holeBlob;
  float mainBlob = getTrailBlob(uv, aspect, holeBlob);

  if (mainBlob > 0.1) {
    color = mix(color, blobColor, mainBlob);
  }

  if (mainBlob > 0.1 && filledRegion > 0.1) {
    float regionIntensity = filledRegion * mainBlob * 0.85;
    color = mix(color, fillColor, regionIntensity);
  }

  if (holeBlob > 0.1) {
    color = mix(color, bgColor, holeBlob);
  }

  color = mix(color, lineColor, line1);
  color = mix(color, lineColor, line2);
  color = mix(color, lineColor, line3);

  fragColor = vec4(color, 1.0);
}
`

const uniformNames = [
  "uTime",
  "uResolution",
  "uMouse",
  "uMouseInfluence",
  "uVelocity",
  "uTrailPoints",
  "uTrailVelocities",
  "uTrailAges",
  "uTrailCount",
  "uHoleIntensity",
  "uDarkMode",
  "uWorld",
  "uLineWidth",
] as const

type Uniforms = Record<(typeof uniformNames)[number], WebGLUniformLocation | null>

interface TrailPoint {
  x: number
  y: number
  vx: number
  vy: number
  time: number
  fadeStart: number | null
}

export interface FluidEngineOptions {
  reducedMotion: boolean
  coarse: boolean
  finePointer: boolean
  deviceRatio: number
  // CSS pixels
  width: number
  height: number
  dark: boolean
  paused: boolean
}

export interface FluidEngineCallbacks {
  onReveal: () => void
  onFail: () => void
}

// The engine owns the GL context and the render loop. It has no DOM dependency, so it runs the same way
// inside a worker (OffscreenCanvas) or on the main thread.
export interface FluidEngine {
  resize: (width: number, height: number, deviceRatio: number) => void
  // x/y are relative to the canvas (0..1, y growing downwards); timeMs is on this thread's performance.now() clock.
  pointer: (x: number, y: number, timeMs: number) => void
  setDark: (dark: boolean) => void
  setPaused: (paused: boolean) => void
  setHidden: (hidden: boolean) => void
  dispose: () => void
}

const requestFrame = (callback: FrameRequestCallback) =>
  typeof requestAnimationFrame === "function"
    ? requestAnimationFrame(callback)
    : (setTimeout(() => callback(performance.now()), 16) as unknown as number)

const cancelFrame = (id: number) => {
  if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(id)
  else clearTimeout(id)
}

export function createFluidEngine(
  canvas: GLCanvas,
  options: FluidEngineOptions,
  callbacks: FluidEngineCallbacks,
): FluidEngine | null {
  const context = createGL(canvas, {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "default",
  })
  if (!context) return null
  const gl: GL = context

  const startTime = performance.now()
  const maxTrailPoints = options.coarse ? 8 : 12

  let cssWidth = options.width
  let cssHeight = options.height
  let deviceRatio = options.deviceRatio
  let paused = options.paused
  let hidden = false
  let darkMode = options.dark ? 1 : 0
  let disposed = false
  let contextLost = false
  let ready = false
  let revealed = false
  let frameId = 0
  let frameQueued = false
  let sizeDirty = true
  let uniforms: Uniforms | null = null

  // --- adaptive resolution -------------------------------------------------
  // Render scale (drawing buffer pixels per CSS pixel) starts under a pixel budget and drops while the
  // pointer trail makes frames slow; the scale that failed is remembered so it never oscillates.
  let learnedCeiling = Number.POSITIVE_INFINITY
  let scale = 1
  let averageFrameMs = 16.7
  let activeFrames = 0
  let slowStreak = 0
  let fastStreak = 0
  let lastActiveFrameAt = 0

  function maxScale() {
    const cap = options.coarse ? Math.min(deviceRatio, 1) : Math.min(deviceRatio, 1.5)
    const area = Math.max(1, cssWidth * cssHeight)
    return Math.max(MIN_SCALE, Math.min(cap, learnedCeiling, Math.sqrt(MAX_PIXELS / area)))
  }

  function applySize() {
    if (!uniforms) return
    sizeDirty = false
    const width = Math.max(1, Math.round(cssWidth * scale))
    const height = Math.max(1, Math.round(cssHeight * scale))
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
    gl.viewport(0, 0, width, height)
    gl.uniform2f(uniforms.uResolution, width, height)
    gl.uniform1f(uniforms.uLineWidth, Math.max(1, 0.857 * scale))
  }

  function setScale(next: number) {
    scale = Math.max(MIN_SCALE, next)
    sizeDirty = true
    averageFrameMs = 16.7
    activeFrames = 0
    slowStreak = 0
    fastStreak = 0
  }

  function trackFrameCost(now: number) {
    if (lastActiveFrameAt && now - lastActiveFrameAt < 100) {
      const frameMs = now - lastActiveFrameAt
      activeFrames++
      if (activeFrames > 20) {
        averageFrameMs = averageFrameMs * 0.9 + Math.min(frameMs, 100) * 0.1
        if (averageFrameMs > 23) {
          slowStreak++
          fastStreak = 0
        } else if (averageFrameMs < 18.5) {
          fastStreak++
          slowStreak = 0
        } else {
          slowStreak = 0
          fastStreak = 0
        }

        if (slowStreak > 12 && scale > MIN_SCALE) {
          learnedCeiling = Math.min(learnedCeiling, scale * 0.9)
          setScale(scale * 0.82)
        } else if (fastStreak > 240 && scale < maxScale()) {
          setScale(Math.min(maxScale(), scale * 1.12))
        }
      }
    } else {
      activeFrames = 0
      averageFrameMs = 16.7
      slowStreak = 0
      fastStreak = 0
    }
    lastActiveFrameAt = now
  }

  // --- pointer trail -------------------------------------------------------
  const trailBuffer: TrailPoint[] = []
  const trailPoints = new Float32Array(TRAIL_CAPACITY * 4)
  const trailVelocities = new Float32Array(TRAIL_CAPACITY * 2)
  const trailAges = new Float32Array(TRAIL_CAPACITY)

  let targetX = 0.5 * WORLD_SCALE
  let targetY = 0.5 * WORLD_SCALE
  let mouseX = targetX
  let mouseY = targetY
  let velocityX = 0
  let velocityY = 0
  let lastPointerX = 0.5
  let lastPointerY = 0.5
  let lastPointerTime = 0
  let lastPointTime = 0
  let lastDirX = 0
  let lastDirY = 0
  let lastPointerAt = -Infinity
  let holeIntensity = 0

  const POINT_FRICTION = 0.98
  const NORMAL_DECAY = 0.5
  const DIRECTION_FADE = 0.3
  const MIN_POINT_INTERVAL = 0.03
  const DIRECTION_THRESHOLD = Math.cos((60 * Math.PI) / 180)

  function handlePointer(normalizedX: number, normalizedY: number, now: number) {
    if (!options.finePointer || options.reducedMotion) return

    const x = normalizedX
    const y = 1.0 - normalizedY
    const currentTime = (now - startTime) * 0.001
    lastPointerAt = now

    const dt = currentTime - lastPointerTime
    if (dt > 0 && dt < 0.1) {
      velocityX = velocityX * 0.6 + ((x - lastPointerX) / dt) * 0.4
      velocityY = velocityY * 0.6 + ((y - lastPointerY) / dt) * 0.4
    }

    lastPointerX = x
    lastPointerY = y
    lastPointerTime = currentTime
    targetX = x * WORLD_SCALE
    targetY = y * WORLD_SCALE

    if (currentTime - lastPointTime < MIN_POINT_INTERVAL) return

    const speed = Math.hypot(velocityX, velocityY)
    if (speed < 0.05) return

    lastPointTime = currentTime

    const dirX = velocityX / speed
    const dirY = velocityY / speed

    if (Math.hypot(lastDirX, lastDirY) > 0.001 && dirX * lastDirX + dirY * lastDirY < DIRECTION_THRESHOLD) {
      for (const point of trailBuffer) {
        if (point.fadeStart === null) point.fadeStart = currentTime
      }
    }

    lastDirX = dirX
    lastDirY = dirY

    const velocityScale = Math.min(speed * 0.004, 0.012)
    trailBuffer.push({
      x: targetX,
      y: targetY,
      vx: dirX * velocityScale,
      vy: dirY * velocityScale,
      time: currentTime,
      fadeStart: null,
    })

    if (trailBuffer.length > maxTrailPoints) trailBuffer.shift()
  }

  // --- rendering -----------------------------------------------------------
  function updateTrail(currentTime: number) {
    let i = 0
    while (i < trailBuffer.length) {
      const point = trailBuffer[i]
      const expired =
        point.fadeStart !== null
          ? currentTime - point.fadeStart > DIRECTION_FADE
          : currentTime - point.time > NORMAL_DECAY
      if (expired) {
        trailBuffer.splice(i, 1)
        continue
      }
      point.x += point.vx
      point.y += point.vy
      point.vx *= POINT_FRICTION
      point.vy *= POINT_FRICTION
      i++
    }

    for (let j = 0; j < trailBuffer.length; j++) {
      const point = trailBuffer[j]
      const fade = Math.max(
        0,
        Math.min(
          1,
          point.fadeStart !== null
            ? 1.0 - (currentTime - point.fadeStart) / DIRECTION_FADE
            : 1.0 - (currentTime - point.time) / NORMAL_DECAY,
        ),
      )
      trailPoints[j * 4] = point.x
      trailPoints[j * 4 + 1] = point.y
      trailPoints[j * 4 + 2] = point.vx
      trailPoints[j * 4 + 3] = point.vy
      trailVelocities[j * 2] = point.vx * 100
      trailVelocities[j * 2 + 1] = point.vy * 100
      trailAges[j] = 1.0 - fade
    }

    velocityX *= 0.92
    velocityY *= 0.92

    if (velocityX * 0.01 > 0.001 && trailBuffer.length > 0) {
      holeIntensity = Math.min(1, holeIntensity + 0.15)
    } else {
      holeIntensity = Math.max(0, holeIntensity - 0.055)
    }

    mouseX += (targetX - mouseX) * 0.15
    mouseY += (targetY - mouseY) * 0.15
  }

  function draw(timeSeconds: number) {
    if (!uniforms) return
    const count = trailBuffer.length

    gl.uniform1f(uniforms.uTime, timeSeconds)
    gl.uniform1f(uniforms.uDarkMode, darkMode)
    gl.uniform2f(uniforms.uMouse, mouseX, mouseY)
    gl.uniform2f(uniforms.uVelocity, velocityX * 0.01, velocityY * 0.01)
    gl.uniform1f(uniforms.uHoleIntensity, holeIntensity)
    gl.uniform1i(uniforms.uTrailCount, count)
    if (count > 0) {
      gl.uniform4fv(uniforms.uTrailPoints, trailPoints, 0, count * 4)
      gl.uniform2fv(uniforms.uTrailVelocities, trailVelocities, 0, count * 2)
      gl.uniform1fv(uniforms.uTrailAges, trailAges, 0, count)
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    if (!revealed) {
      revealed = true
      callbacks.onReveal()
    }
  }

  function schedule() {
    if (frameQueued || disposed) return
    frameQueued = true
    frameId = requestFrame(frame)
  }

  let lastRenderAt = -Infinity

  function frame(now: number) {
    frameQueued = false
    if (disposed || !ready || contextLost || paused || hidden) return

    if (sizeDirty) applySize()

    if (options.reducedMotion) {
      draw(0)
      return
    }

    const active = trailBuffer.length > 0 || holeIntensity > 0.001 || now - lastPointerAt < 600
    if (!active && now - lastRenderAt < IDLE_FRAME_MS - 2) {
      schedule()
      return
    }

    if (active) trackFrameCost(now)
    else lastActiveFrameAt = 0

    lastRenderAt = now
    const timeSeconds = (now - startTime) * 0.001
    updateTrail(timeSeconds)
    draw(timeSeconds)
    schedule()
  }

  async function init() {
    const program = await linkProgram(gl, FULLSCREEN_VERTEX_SOURCE, fragmentSource)
    if (disposed || contextLost) return
    if (!program) {
      callbacks.onFail()
      return
    }

    bindProgram(gl, program)
    gl.bindVertexArray(gl.createVertexArray())
    uniforms = getUniforms(gl, program, uniformNames)
    gl.uniform1f(uniforms.uMouseInfluence, 0.03)
    gl.uniform1f(uniforms.uWorld, WORLD_SCALE)

    setScale(maxScale())
    applySize()
    ready = true
    schedule()
  }

  function handleContextLost(event: Event) {
    event.preventDefault()
    contextLost = true
    ready = false
  }

  function handleContextRestored() {
    contextLost = false
    revealed = false
    void init()
  }

  canvas.addEventListener("webglcontextlost", handleContextLost)
  canvas.addEventListener("webglcontextrestored", handleContextRestored)

  void init()

  return {
    resize(width, height, ratio) {
      cssWidth = width
      cssHeight = height
      deviceRatio = ratio
      setScale(maxScale())
      schedule()
    },
    pointer: handlePointer,
    setDark(dark) {
      darkMode = dark ? 1 : 0
      schedule()
    },
    setPaused(next) {
      paused = next
      if (!next) schedule()
    },
    setHidden(next) {
      hidden = next
      if (!next) schedule()
    },
    dispose() {
      disposed = true
      cancelFrame(frameId)
      canvas.removeEventListener("webglcontextlost", handleContextLost)
      canvas.removeEventListener("webglcontextrestored", handleContextRestored)
      releaseGL(gl)
    },
  }
}
