"use client"

import { memo, useEffect, useRef } from "react"
import * as THREE from "three"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

function getAdaptivePixelRatio(): number {
  const dpr = window.devicePixelRatio || 1
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  if (isMobile) {
    return Math.min(dpr, 1.5)
  }
  return Math.min(dpr, 2)
}

const fragmentShader = /* glsl */ `
  #ifdef GL_ES
  precision mediump float;
  #else
  precision highp float;
  #endif

  uniform highp float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;
  uniform vec2 uVelocity;
  uniform vec4 uTrailPoints[24];   // xy = position, zw = velocity
  uniform vec2 uTrailVelocities[24];
  uniform float uTrailAges[24];    // 0 = new, 1 = old
  uniform int uTrailCount;
  uniform float uHoleIntensity;    // Persisted hole visibility
  uniform float uDarkMode;         // 0.0 = light, 1.0 = dark

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
  }

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
    // Smooth cubic falloff - creates nice metaball blending
    float t2 = t * t;
    return 1.0 - t2 * t2 * (3.0 - 2.0 * t2);
  }

  // Calculate meteor/mushroom shape - bulbous front, tapered tail
  float getOrganicDist(vec2 uv, vec2 center, vec2 velocity, float size, float time, float seed) {
    vec2 toCenter = uv - center;

    float speed = length(velocity);
    vec2 dir = speed > 0.0003 ? normalize(velocity) : vec2(1.0, 0.0);
    vec2 perpDir = vec2(-dir.y, dir.x);

    // Gentle domain warping for smooth organic curves
    float warpTime = time * 0.3 + seed;
    vec2 warp1 = domainWarp(uv * 1.0, 0.4, warpTime, vec2(seed * 5.0, seed * 11.0)) * 0.05;
    vec2 warpedToCenter = toCenter + warp1;

    // Position along movement direction (negative = behind, positive = ahead)
    float alongDir = dot(warpedToCenter, dir);
    float perpToDir = dot(warpedToCenter, perpDir);

    // Asymmetric scaling for meteor shape
    float frontScale = 1.05;  // Front (mushroom head) - subtle
    float backScale = 1.3 + speed * 1.5;  // Back (tail)
    backScale = min(backScale, 2.0);

    // Apply asymmetric scaling based on position
    float scaleAlong;
    if (alongDir > 0.0) {
      // Front - less elongation (bulbous)
      scaleAlong = alongDir / frontScale;
    } else {
      // Back - more elongation (tapered tail)
      scaleAlong = alongDir / backScale;
    }

    // Taper the width towards the tail
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

    // Subtle fluid distortion
    vec2 fluidUV = uvAspect + fluidDistort(uvAspect, time * 0.06, 0.15);

    float totalField = 0.0;

    // Accumulate all trail points as metaballs
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

      // Size varies - head (new) is larger, tail (old) is smaller
      float baseSize = 0.16;
      float sizeBoost = min(speed * 0.25, 0.08);
      // fade: 1.0 = new (head), 0.0 = old (tail)
      float headTailRatio = 0.4 + fade * 0.6;  // Head: 1.0, Tail: 0.4
      float size = (baseSize + sizeBoost) * headTailRatio;

      // Get smooth organic distance
      float dist = getOrganicDist(fluidUV, pos, vel, size, time * 0.04, seed);
      float fieldContrib = metaballField(dist, 1.0) * fade;

      // Strong metaball blending for cohesive shape
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

      // Hole at mouse center - grows with movement
      float holeSize = 0.05 + min(speed * 0.08, 0.05);

      // Elongated ellipse along movement direction
      vec2 toHole = fluidUV - mouseAspect;
      vec2 warp = domainWarp(fluidUV * 1.0, 0.4, time * 0.012 + 50.0, vec2(250.0, 550.0)) * 0.04;
      vec2 warpedHole = toHole + warp;

      // Elongate: longer in direction, narrower perpendicular
      float elongation = 1.3 + speed * 1.0;
      elongation = min(elongation, 2.0);
      float alongHole = dot(warpedHole, dir) / elongation;
      float perpHole = dot(warpedHole, perpDir) * 1.25;  // Slightly narrower

      float holeDist = length(vec2(alongHole, perpHole)) / holeSize;
      float holeField = metaballField(holeDist, 1.0);

      // Hole uses its own intensity (fades faster than outer)
      holeBlob = smoothstep(0.2, 0.4, holeField) * uHoleIntensity;
    }

    return mainBlob;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float aspect = uResolution.x / uResolution.y;
    vec2 uvAspect = vec2(uv.x * aspect, uv.y);

    // Mouse distortion
    vec2 mouseAspect = vec2(uMouse.x * aspect, uMouse.y);
    float mouseDist = distance(uvAspect, mouseAspect);
    float influence = smoothstep(0.3, 0.0, mouseDist);
    vec2 mouseOffset = (uvAspect - mouseAspect) * influence * uMouseInfluence;

    // Single noise field with mouse distortion
    float noise = getNoiseField(uvAspect + mouseOffset);

    // Colors - Tailwind stone palette (light mode)
    vec3 bgColorLight = vec3(0.961, 0.961, 0.957);     // stone-100 #f5f5f4
    vec3 lineColorLight = vec3(0.839, 0.827, 0.820);   // stone-300 #d6d3d1
    vec3 blobColorLight = vec3(0.873, 0.863, 0.857);   // between stone-200 and stone-300
    vec3 fillColorLight = vec3(0.749, 0.731, 0.720);   // between stone-300 and stone-400

    // Colors - Tailwind stone palette (dark mode)
    vec3 bgColorDark = vec3(0.047, 0.039, 0.035);      // stone-950 #0c0a09
    vec3 lineColorDark = vec3(0.267, 0.251, 0.235);    // stone-700 #44403c
    vec3 blobColorDark = vec3(0.090, 0.078, 0.071);    // darker than stone-900
    vec3 fillColorDark = vec3(0.267, 0.251, 0.235);    // stone-700 #44403c

    // Mix between light and dark based on mode
    vec3 bgColor = mix(bgColorLight, bgColorDark, uDarkMode);
    vec3 lineColor = mix(lineColorLight, lineColorDark, uDarkMode);
    vec3 blobColor = mix(blobColorLight, blobColorDark, uDarkMode);
    vec3 fillColor = mix(fillColorLight, fillColorDark, uDarkMode);

    // 3 isolines at key thresholds
    float line1 = isoline(noise, 0.40, 1.5);
    float line2 = isoline(noise, 0.55, 1.5);
    float line3 = isoline(noise, 0.70, 1.5);

    // Define middle filled region (between line1 0.40 and line2 0.55)
    float bandLow = smoothstep(0.38, 0.42, noise);    // Above line1
    float bandHigh = 1.0 - smoothstep(0.53, 0.57, noise);  // Below line2
    float filledRegion = bandLow * bandHigh;  // Middle band area

    // Start with solid background color
    vec3 color = bgColor;

    // Get trail blob and hole
    float holeBlob;
    float mainBlob = getTrailBlob(uv, aspect, holeBlob);

    // Draw outer blob (stone-200)
    if (mainBlob > 0.1) {
      color = mix(color, blobColor, mainBlob);
    }

    // Fill middle region with stone-400 where trail passes
    if (mainBlob > 0.1 && filledRegion > 0.1) {
      float regionIntensity = filledRegion * mainBlob * 0.85;
      color = mix(color, fillColor, regionIntensity);
    }

    // Cut hole through blob - reveal background
    if (holeBlob > 0.1) {
      color = mix(color, bgColor, holeBlob);
    }

    // Draw all isolines ON TOP with normal color
    color = mix(color, lineColor, line1);
    color = mix(color, lineColor, line2);
    color = mix(color, lineColor, line3);

    gl_FragColor = vec4(color, 1.0);
  }
`

interface FluidBackgroundProps {
  className?: string
  defer?: boolean
}

function FluidBackgroundComponent({ className = "", defer = false }: FluidBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Skip WebGL setup if user prefers reduced motion or deferred
    if (reducedMotion || defer) return

    const container = containerRef.current
    if (!container) return

    // Delay WebGL init to let loading animation complete smoothly
    let cancelled = false

    // Use requestIdleCallback for optimal scheduling, fallback to setTimeout
    const scheduleInit = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 150))
    const cancelInit = window.cancelIdleCallback || clearTimeout

    const initId = scheduleInit(() => {
      if (cancelled) return
      cleanupRef.current = initWebGL(container)
    })

    return () => {
      cancelled = true
      cancelInit(initId)
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [reducedMotion, defer])

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden pointer-events-none bg-stone-100 dark:bg-stone-950 ${className}`}
      style={{
        isolation: "isolate",
        contain: "layout style paint",
        willChange: "transform",
      }}
    />
  )
}

function initWebGL(container: HTMLDivElement): () => void {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  container.appendChild(renderer.domElement)
  renderer.domElement.style.position = "absolute"
  renderer.domElement.style.inset = "0"
  renderer.domElement.style.width = "100%"
  renderer.domElement.style.height = "100%"
  renderer.setPixelRatio(getAdaptivePixelRatio())

  let contextLost = false
  let isVisible = true
  const canvas = renderer.domElement

  function handleContextLost(event: Event) {
    event.preventDefault()
    contextLost = true
  }

  function handleContextRestored() {
    contextLost = false
    if (isVisible) animate()
  }

  function handleVisibilityChange() {
    isVisible = document.visibilityState === "visible"
    if (isVisible && !contextLost) animate()
  }

  canvas.addEventListener("webglcontextlost", handleContextLost, false)
  canvas.addEventListener("webglcontextrestored", handleContextRestored, false)
  document.addEventListener("visibilitychange", handleVisibilityChange)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const geometry = new THREE.PlaneGeometry(2, 2)

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uMouseInfluence: { value: 0.03 },
    uVelocity: { value: new THREE.Vector2(0, 0) },
    uTrailPoints: { value: new Array(24).fill(null).map(() => new THREE.Vector4(-1, -1, 0, 0)) },
    uTrailVelocities: { value: new Array(24).fill(null).map(() => new THREE.Vector2(0, 0)) },
    uTrailAges: { value: new Float32Array(24) },
    uTrailCount: { value: 0 },
    uHoleIntensity: { value: 0 },
    uDarkMode: { value: 0 },
  }

  const targetMouse = new THREE.Vector2(0.5, 0.5)
  const currentMouse = new THREE.Vector2(0.5, 0.5)

  interface TrailPoint {
    x: number
    y: number
    vx: number
    vy: number
    time: number
    fadeStart: number | null
  }

  const trailBuffer: TrailPoint[] = []
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  const MAX_TRAIL_POINTS = isMobile ? 8 : 12

  const currentVelocity = { x: 0, y: 0 }
  let lastPointerPos = { x: 0.5, y: 0.5 }
  let lastPointerTime = 0
  let lastPointTime = 0
  let lastDirection = { x: 0, y: 0 }

  const POINT_FRICTION = 0.98
  const NORMAL_DECAY = 0.5
  const DIRECTION_FADE = 0.3
  const MIN_POINT_INTERVAL = 0.03
  const DIRECTION_THRESHOLD = Math.cos(60 * Math.PI / 180)

  let holeIntensity = 0

  function checkDarkMode() {
    const isDark = document.documentElement.classList.contains("dark")
    uniforms.uDarkMode.value = isDark ? 1 : 0
  }
  checkDarkMode()

  const darkModeObserver = new MutationObserver(checkDarkMode)
  darkModeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  function resize() {
    const { width, height } = container.getBoundingClientRect()
    if (width === 0 || height === 0) return
    renderer.setSize(width, height, false)
    uniforms.uResolution.value.set(width, height)
  }

  resize()
  window.addEventListener("resize", resize)

  let animationId: number
  const startTime = performance.now()

  function handlePointerMove(event: PointerEvent) {
    const x = event.clientX / window.innerWidth
    const y = 1.0 - event.clientY / window.innerHeight
    const currentTime = (performance.now() - startTime) * 0.001

    const dt = currentTime - lastPointerTime
    if (dt > 0 && dt < 0.1) {
      const rawVelX = (x - lastPointerPos.x) / dt
      const rawVelY = (y - lastPointerPos.y) / dt
      currentVelocity.x = currentVelocity.x * 0.6 + rawVelX * 0.4
      currentVelocity.y = currentVelocity.y * 0.6 + rawVelY * 0.4
    }

    lastPointerPos = { x, y }
    lastPointerTime = currentTime

    if (currentTime - lastPointTime < MIN_POINT_INTERVAL) {
      targetMouse.set(x, y)
      return
    }

    const speed = Math.sqrt(currentVelocity.x ** 2 + currentVelocity.y ** 2)
    if (speed < 0.05) {
      targetMouse.set(x, y)
      return
    }

    lastPointTime = currentTime

    const dirX = currentVelocity.x / speed
    const dirY = currentVelocity.y / speed

    const lastSpeed = Math.sqrt(lastDirection.x ** 2 + lastDirection.y ** 2)
    if (lastSpeed > 0.001) {
      const dotProduct = dirX * lastDirection.x + dirY * lastDirection.y
      if (dotProduct < DIRECTION_THRESHOLD) {
        for (const point of trailBuffer) {
          if (point.fadeStart === null) {
            point.fadeStart = currentTime
          }
        }
      }
    }

    lastDirection = { x: dirX, y: dirY }

    const velScale = Math.min(speed * 0.004, 0.012)
    trailBuffer.push({
      x,
      y,
      vx: dirX * velScale,
      vy: dirY * velScale,
      time: currentTime,
      fadeStart: null,
    })

    if (trailBuffer.length > MAX_TRAIL_POINTS) {
      trailBuffer.shift()
    }

    targetMouse.set(x, y)
  }

  document.addEventListener("pointermove", handlePointerMove, { passive: true })

  function animate() {
    if (contextLost || !isVisible) return
    const currentTime = (performance.now() - startTime) * 0.001
    uniforms.uTime.value = currentTime

    let i = 0
    while (i < trailBuffer.length) {
      const point = trailBuffer[i]

      let shouldRemove = false
      if (point.fadeStart !== null) {
        const fadeAge = currentTime - point.fadeStart
        if (fadeAge > DIRECTION_FADE) {
          shouldRemove = true
        }
      } else {
        const age = currentTime - point.time
        if (age > NORMAL_DECAY) {
          shouldRemove = true
        }
      }

      if (shouldRemove) {
        trailBuffer.splice(i, 1)
        continue
      }

      point.x += point.vx
      point.y += point.vy
      point.vx *= POINT_FRICTION
      point.vy *= POINT_FRICTION

      i++
    }

    for (let j = 0; j < 24; j++) {
      if (j < trailBuffer.length) {
        const point = trailBuffer[j]
        let fade: number
        if (point.fadeStart !== null) {
          fade = 1.0 - (currentTime - point.fadeStart) / DIRECTION_FADE
        } else {
          fade = 1.0 - (currentTime - point.time) / NORMAL_DECAY
        }
        fade = Math.max(0, Math.min(1, fade))

        uniforms.uTrailPoints.value[j].set(point.x, point.y, point.vx, point.vy)
        uniforms.uTrailVelocities.value[j].set(point.vx * 100, point.vy * 100)
        uniforms.uTrailAges.value[j] = 1.0 - fade
      } else {
        uniforms.uTrailPoints.value[j].set(-1, -1, 0, 0)
        uniforms.uTrailVelocities.value[j].set(0, 0)
        uniforms.uTrailAges.value[j] = 1.0
      }
    }
    uniforms.uTrailCount.value = trailBuffer.length

    currentVelocity.x *= 0.92
    currentVelocity.y *= 0.92

    const velX = currentVelocity.x * 0.01
    const hasTrail = trailBuffer.length > 0
    if (velX > 0.001 && hasTrail) {
      holeIntensity = Math.min(1, holeIntensity + 0.15)
    } else {
      holeIntensity = Math.max(0, holeIntensity - 0.055)
    }
    uniforms.uHoleIntensity.value = holeIntensity

    uniforms.uVelocity.value.set(currentVelocity.x * 0.01, currentVelocity.y * 0.01)
    currentMouse.lerp(targetMouse, 0.15)
    uniforms.uMouse.value.copy(currentMouse)

    renderer.render(scene, camera)
    animationId = requestAnimationFrame(animate)
  }

  animate()

  return () => {
    cancelAnimationFrame(animationId)
    darkModeObserver.disconnect()
    document.removeEventListener("visibilitychange", handleVisibilityChange)
    window.removeEventListener("resize", resize)
    document.removeEventListener("pointermove", handlePointerMove)
    canvas.removeEventListener("webglcontextlost", handleContextLost)
    canvas.removeEventListener("webglcontextrestored", handleContextRestored)
    renderer.dispose()
    geometry.dispose()
    material.dispose()
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement)
    }
  }
}

export const FluidBackground = memo(FluidBackgroundComponent)
