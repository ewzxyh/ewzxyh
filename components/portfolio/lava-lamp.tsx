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
  uniform float uHover;

  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float metaball(vec2 uv, vec2 center, float radius) {
    float d = length(uv - center);
    return radius / d;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float aspect = uResolution.x / uResolution.y;
    vec2 uvAspect = vec2(uv.x * aspect, uv.y);

    float t = uTime * 0.15;

    // Metaball centers com movimento orgânico
    vec2 p1 = vec2(
      0.3 * aspect + sin(t * 1.1) * 0.25 + snoise(vec2(t * 0.5, 0.0)) * 0.1,
      0.4 + cos(t * 0.9) * 0.25 + snoise(vec2(0.0, t * 0.5)) * 0.1
    );
    vec2 p2 = vec2(
      0.7 * aspect + cos(t * 0.8) * 0.2,
      0.6 + sin(t * 1.2) * 0.2
    );
    vec2 p3 = vec2(
      0.5 * aspect + sin(t * 0.7 + 2.0) * 0.3,
      0.3 + cos(t * 0.6) * 0.25
    );
    vec2 p4 = vec2(
      0.6 * aspect + cos(t * 0.9 + 1.0) * 0.25,
      0.7 + sin(t * 0.5 + 3.0) * 0.2
    );
    vec2 p5 = vec2(
      0.4 * aspect + sin(t * 0.6 + 4.0) * 0.2,
      0.5 + cos(t * 1.0 + 2.0) * 0.3
    );

    // Campo de metaballs
    float field = 0.0;
    field += metaball(uvAspect, p1, 0.15);
    field += metaball(uvAspect, p2, 0.12);
    field += metaball(uvAspect, p3, 0.18);
    field += metaball(uvAspect, p4, 0.10);
    field += metaball(uvAspect, p5, 0.14);

    // Mouse influence
    vec2 mouseAspect = vec2(uMouse.x * aspect, uMouse.y);
    float mouseDist = length(uvAspect - mouseAspect);
    float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * uHover;
    field += mouseInfluence * 0.5;

    // Colors
    vec3 bgColor = vec3(0.96, 0.96, 0.95);
    vec3 lineColor = vec3(0.5, 0.5, 0.48);
    vec3 fillColor = vec3(0.85, 0.83, 0.80);

    // Contour lines
    float lineWidth = 0.04;
    float line = 0.0;

    // Thresholds for contour lines
    float t1 = 0.3;
    float t2 = 0.5;
    float t3 = 0.75;
    float t4 = 1.0;
    float t5 = 1.5;

    line += smoothstep(t1 - lineWidth, t1, field) - smoothstep(t1, t1 + lineWidth, field);
    line += smoothstep(t2 - lineWidth, t2, field) - smoothstep(t2, t2 + lineWidth, field);
    line += smoothstep(t3 - lineWidth, t3, field) - smoothstep(t3, t3 + lineWidth, field);
    line += smoothstep(t4 - lineWidth, t4, field) - smoothstep(t4, t4 + lineWidth, field);
    line += smoothstep(t5 - lineWidth, t5, field) - smoothstep(t5, t5 + lineWidth, field);

    line = clamp(line, 0.0, 1.0);

    // Fill layer
    float fillThreshold = 0.6 - mouseInfluence * 0.3;
    float fill = smoothstep(fillThreshold - 0.15, fillThreshold + 0.15, field);
    float fillOpacity = 0.4 + uHover * 0.5;

    // Final composition
    vec3 color = bgColor;
    color = mix(color, fillColor, fill * fillOpacity);
    color = mix(color, lineColor, line * 0.9);

    gl_FragColor = vec4(color, 1.0);
  }
`

interface LavaLampProps {
  className?: string
}

export function LavaLamp({ className = "" }: LavaLampProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const hoverRef = useRef(0)
  const targetHoverRef = useRef(0)

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
      uHover: { value: 0 },
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

    function handleMouseMove(e: MouseEvent) {
      if (!container) return
      const rect = container.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - rect.left) / rect.width
      mouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height
    }

    function handleMouseEnter() {
      targetHoverRef.current = 1
    }

    function handleMouseLeave() {
      targetHoverRef.current = 0
    }

    resize()
    window.addEventListener("resize", resize)
    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    let animationId: number
    const startTime = performance.now()

    function animate() {
      uniforms.uTime.value = (performance.now() - startTime) * 0.001

      // Smooth hover transition
      hoverRef.current += (targetHoverRef.current - hoverRef.current) * 0.08
      uniforms.uHover.value = hoverRef.current

      // Smooth mouse follow
      uniforms.uMouse.value.x += (mouseRef.current.x - uniforms.uMouse.value.x) * 0.1
      uniforms.uMouse.value.y += (mouseRef.current.y - uniforms.uMouse.value.y) * 0.1

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
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
      className={`overflow-hidden cursor-crosshair ${className}`}
      style={{
        isolation: "isolate",
        contain: "layout style paint",
      }}
    />
  )
}
