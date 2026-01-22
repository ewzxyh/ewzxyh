"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { gsap } from "gsap"

// Shared velocity proxy for all canvases
const velocityProxy = { v: 0, s: 0 }
let lastScrollY = 0
let lastScrollTime = 0
let velocityInitialized = false

function initScrollVelocity() {
  if (velocityInitialized) return
  velocityInitialized = true

  const clamp = gsap.utils.clamp(-2000, 2000)

  const handleScroll = () => {
    const now = performance.now()
    const dt = now - lastScrollTime
    if (dt > 0) {
      const dy = window.scrollY - lastScrollY
      const raw = clamp((dy / dt) * 1000) // px/s
      const norm = raw / 1000 // -2..2
      const strength = Math.min(1, Math.abs(norm))

      if (strength > velocityProxy.s) {
        velocityProxy.v = norm
        velocityProxy.s = strength
        gsap.to(velocityProxy, {
          v: 0,
          s: 0,
          duration: 0.8,
          ease: "sine.inOut",
          overwrite: true,
        })
      }
      lastScrollY = window.scrollY
      lastScrollTime = now
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true })
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vUvCover;
  uniform vec2 uTextureSize;
  uniform vec2 uQuadSize;
  uniform float uPositionY;

  void main() {
    vUv = uv;

    // "cover" mapping to preserve aspect ratio
    float texR = uTextureSize.x / uTextureSize.y;
    float quadR = uQuadSize.x / uQuadSize.y;
    vec2 s = vec2(1.0);
    if (quadR > texR) { s.y = texR / quadR; } else { s.x = quadR / texR; }

    // Apply vertical position offset (0 = top, 0.5 = center, 1 = bottom)
    vec2 offset = (1.0 - s) * vec2(0.5, uPositionY);
    vUvCover = vUv * s + offset;

    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uTextureSize;
  uniform vec2 uQuadSize;
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform float uVelocityStrength;
  uniform float uGrayscale;

  varying vec2 vUv;
  varying vec2 vUvCover;

  void main() {
    vec2 texCoords = vUvCover;

    // drive distortion amount from velocity strength
    float amt = 0.03 * uVelocityStrength;

    // small wave that doesn't depend on mouse
    float t = uTime * 0.8;
    texCoords.y += sin((texCoords.x * 8.0) + t) * amt;
    texCoords.x += cos((texCoords.y * 6.0) - t * 0.8) * amt * 0.6;

    // directional tint: push R/G/B differently by scroll direction
    float dir = sign(uScrollVelocity);
    vec2 tc = texCoords;

    float r = texture2D(uTexture, tc + vec2( amt * 0.50 * dir, 0.0)).r;
    float g = texture2D(uTexture, tc + vec2( amt * 0.25 * dir, 0.0)).g;
    float b = texture2D(uTexture, tc + vec2(-amt * 0.35 * dir, 0.0)).b;

    vec3 color = vec3(r, g, b);

    // Apply grayscale if enabled
    if (uGrayscale > 0.5) {
      float gray = dot(color, vec3(0.299, 0.587, 0.114));
      color = vec3(gray);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`

interface ShaderImageProps {
  src: string
  alt: string
  grayscale?: boolean
  position?: string
}

function parsePosition(pos: string): number {
  if (pos === "center") return 0.5
  if (pos === "top") return 0
  if (pos === "bottom") return 1
  const match = pos.match(/^(\d+(?:\.\d+)?)%$/)
  if (match) return Number.parseFloat(match[1]) / 100
  return 0.5
}

export function ShaderImage({ src, alt, grayscale = false, position = "center" }: ShaderImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const uniformsRef = useRef<Record<string, THREE.IUniform> | null>(null)
  const tickIdRef = useRef<number | null>(null)
  const isVisibleRef = useRef(true)

  useEffect(() => {
    initScrollVelocity()

    const container = containerRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    container.appendChild(renderer.domElement)
    renderer.domElement.style.position = "absolute"
    renderer.domElement.style.inset = "0"
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geom = new THREE.PlaneGeometry(2, 2)

    const posY = parsePosition(position)
    const uniforms: Record<string, THREE.IUniform> = {
      uTexture: { value: null },
      uTextureSize: { value: new THREE.Vector2(1, 1) },
      uQuadSize: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uScrollVelocity: { value: 0 },
      uVelocityStrength: { value: 0 },
      uGrayscale: { value: grayscale ? 1.0 : 0.0 },
      uPositionY: { value: posY },
    }
    uniformsRef.current = uniforms

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    })

    const mesh = new THREE.Mesh(geom, mat)
    scene.add(mesh)

    function layout() {
      if (!container) return
      const { width, height } = container.getBoundingClientRect()
      if (width === 0 || height === 0) return
      renderer.setSize(width, height, false)
      uniforms.uQuadSize.value.set(width, height)
    }

    // Only resize on window resize, not during Flip transforms
    const handleWindowResize = () => layout()
    window.addEventListener("resize", handleWindowResize)

    let last = performance.now()
    let textureLoaded = false
    let lastStrength = 0

    // Only render when visible
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0, rootMargin: "50px" }
    )
    observer.observe(container)

    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin("anonymous")
    loader.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      uniforms.uTexture.value = tex
      uniforms.uTextureSize.value.set(tex.image.width, tex.image.height)
      textureLoaded = true
      layout()
      // Render immediately when texture loads
      renderer.render(scene, camera)
    })

    function tick(now: number) {
      if (!textureLoaded || !isVisibleRef.current) return

      const dt = (now - last) * 0.001
      last = now

      // Only render when there's velocity or when velocity just stopped
      const hasVelocity = velocityProxy.s > 0.001
      const velocityStopped = lastStrength > 0.001 && velocityProxy.s <= 0.001

      if (hasVelocity || velocityStopped) {
        uniforms.uTime.value += dt
        uniforms.uScrollVelocity.value = velocityProxy.v
        uniforms.uVelocityStrength.value = velocityProxy.s
        renderer.render(scene, camera)
      }

      lastStrength = velocityProxy.s
    }

    gsap.ticker.add(tick)
    tickIdRef.current = tick as unknown as number

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener("resize", handleWindowResize)
      observer.disconnect()
      renderer.dispose()
      geom.dispose()
      mat.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [src, grayscale, position])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        isolation: "isolate",
        contain: "layout style paint",
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
      aria-label={alt}
    />
  )
}
