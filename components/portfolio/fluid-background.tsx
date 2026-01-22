"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;

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

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float aspect = uResolution.x / uResolution.y;
    vec2 uvAspect = vec2(uv.x * aspect, uv.y);

    // Single noise field
    float noise = getNoiseField(uvAspect);

    // Colors - background and blobs are the SAME color
    vec3 bgColor = vec3(0.96, 0.96, 0.94);      // #F5F5F0
    vec3 lineColor = vec3(0.78, 0.78, 0.75);    // Subtle gray for outlines

    // Isolines at different thresholds - thinner lines (1.5 instead of 2.5)
    float outline1 = isoline(noise, 0.40, 1.5);  // Outer contour
    float outline2 = isoline(noise, 0.55, 1.5);  // Middle contour
    float outline3 = isoline(noise, 0.70, 1.5);  // Inner contour

    // Start with solid background color (no fill difference)
    vec3 color = bgColor;

    // Draw outlines only
    float allOutlines = max(max(outline1, outline2), outline3);
    color = mix(color, lineColor, allOutlines);

    gl_FragColor = vec4(color, 1.0);
  }
`

interface FluidBackgroundProps {
  className?: string
}

export function FluidBackground({ className = "" }: FluidBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    container.appendChild(renderer.domElement)
    renderer.domElement.style.position = "absolute"
    renderer.domElement.style.inset = "0"
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseInfluence: { value: 0.03 },
    }

    const targetMouse = new THREE.Vector2(0.5, 0.5)
    const currentMouse = new THREE.Vector2(0.5, 0.5)

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    function resize() {
      if (!container) return
      const { width, height } = container.getBoundingClientRect()
      if (width === 0 || height === 0) return
      renderer.setSize(width, height, false)
      uniforms.uResolution.value.set(width, height)
    }

    resize()
    window.addEventListener("resize", resize)

    function handlePointerMove(event: PointerEvent) {
      if (!container) return
      const rect = container.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = 1.0 - (event.clientY - rect.top) / rect.height
      targetMouse.set(x, y)
    }

    container.addEventListener("pointermove", handlePointerMove, { passive: true })

    let animationId: number
    const startTime = performance.now()

    function animate() {
      uniforms.uTime.value = (performance.now() - startTime) * 0.001
      currentMouse.lerp(targetMouse, 0.1)
      uniforms.uMouse.value.copy(currentMouse)
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
      container.removeEventListener("pointermove", handlePointerMove)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{
        isolation: "isolate",
        contain: "layout style paint",
      }}
    />
  )
}
