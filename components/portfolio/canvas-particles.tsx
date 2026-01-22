"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { gsap } from "gsap"

const PARTICLE_IMAGES = Array.from({ length: 21 }, (_, i) =>
  `https://assets.codepen.io/16327/flair-${2 + i}.png`
)

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

interface Particle {
  x: number
  y: number
  scale: number
  rotate: number
  img: HTMLImageElement
}

export function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const animationRef = useRef<gsap.core.Timeline | null>(null)
  const sizeRef = useRef({ cw: 0, ch: 0, radius: 0 })
  const isMobile = useIsMobile()

  const draw = useCallback(() => {
    const ctx = ctxRef.current
    const { cw, ch } = sizeRef.current
    if (!ctx || cw === 0 || ch === 0) return

    particlesRef.current.sort((a, b) => a.scale - b.scale)
    ctx.clearRect(0, 0, cw, ch)

    for (const p of particlesRef.current) {
      if (p.img.complete && p.img.naturalWidth > 0) {
        ctx.translate(cw / 2, ch / 2)
        ctx.rotate(p.rotate)
        ctx.drawImage(
          p.img,
          p.x,
          p.y,
          p.img.width * p.scale,
          p.img.height * p.scale
        )
        ctx.resetTransform()
      }
    }
  }, [])

  const initAnimation = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctxRef.current = ctx

    const cw = container.offsetWidth
    const ch = container.offsetHeight

    if (cw === 0 || ch === 0) return

    canvas.width = cw
    canvas.height = ch

    const radius = Math.max(cw, ch)
    sizeRef.current = { cw, ch, radius }

    const particleCount = isMobile ? 33 : 99

    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      const img = new Image()
      img.src = PARTICLE_IMAGES[i % PARTICLE_IMAGES.length]
      particles.push({
        x: 0,
        y: 0,
        scale: 0,
        rotate: 0,
        img,
      })
    }
    particlesRef.current = particles

    if (animationRef.current) {
      animationRef.current.kill()
    }

    const tl = gsap.timeline({ onUpdate: draw })
      .fromTo(particles, {
        x: (i: number) => {
          const angle = (i / particleCount) * Math.PI * 2 - Math.PI / 2
          return Math.cos(angle * 10) * radius
        },
        y: (i: number) => {
          const angle = (i / particleCount) * Math.PI * 2 - Math.PI / 2
          return Math.sin(angle * 10) * radius
        },
        scale: 0.6,
        rotate: 0,
      }, {
        duration: 5,
        ease: "sine",
        x: 0,
        y: 0,
        scale: 0,
        rotate: -3,
        stagger: { each: -0.05, repeat: -1 }
      }, 0)
      .seek(99)

    animationRef.current = tl
  }, [draw, isMobile])

  useEffect(() => {
    const timer = setTimeout(initAnimation, 100)

    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [initAnimation])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-[rgb(14,16,15)] overflow-hidden"
      style={{
        isolation: "isolate",
        contain: "strict",
        contentVisibility: "auto",
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          imageRendering: "auto",
          transform: "translateZ(0)",
        }}
      />
    </div>
  )
}
