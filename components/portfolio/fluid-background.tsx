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

  float blobLayer(vec2 uv, float scale, float speed, vec2 warpOffset, vec2 noiseOffset, float warpStrength) {
    float time = uTime * speed;
    vec2 warp = domainWarp(uv, scale * 0.5, time * 0.5, warpOffset) * warpStrength;
    vec2 warped = uv * scale + warp + noiseOffset;
    float n = snoise(vec3(warped, time));
    return smoothstep(0.3, 0.7, n * 0.5 + 0.5);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float aspect = uResolution.x / uResolution.y;
    vec2 uvAspect = vec2(uv.x * aspect, uv.y);

    // Layer 1: Large, slow, background
    float layer1 = blobLayer(uvAspect, 1.5, 0.05, vec2(0.0, 0.0), vec2(0.0, 0.0), 0.3);

    // Layer 2: Medium, medium speed
    float layer2 = blobLayer(uvAspect, 2.5, 0.08, vec2(5.2, 1.3), vec2(10.0, 20.0), 0.4);

    // Layer 3: Small, faster, foreground
    float layer3 = blobLayer(uvAspect, 4.0, 0.12, vec2(1.7, 9.2), vec2(30.0, 40.0), 0.5);

    // Colors for subtle effect
    vec3 bgColor = vec3(0.96, 0.96, 0.94);   // #F5F5F0
    vec3 blobColor = vec3(0.90, 0.90, 0.86); // #E5E5DC

    // Composite back-to-front with opacity
    vec3 color = bgColor;
    color = mix(color, blobColor, layer1 * 0.4);  // Large, slow, back
    color = mix(color, blobColor, layer2 * 0.5);  // Medium, middle
    color = mix(color, blobColor, layer3 * 0.6);  // Small, fast, front

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
    }

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

    let animationId: number
    const startTime = performance.now()

    function animate() {
      uniforms.uTime.value = (performance.now() - startTime) * 0.001
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
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
