"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

const PARTICLE_IMAGES = Array.from({ length: 21 }, (_, i) =>
  `https://assets.codepen.io/16327/flair-${2 + i}.png`
)

// Upper bound for the canvas backing store (device-independent pixels), so very large screens stay cheap.
const MAX_PIXELS = 5e6

// Sprites are drawn a bit larger than their natural size so the small grid tile still feels full of shapes
// while they stay clearly apart from each other.
const SPRITE_SIZE = 1.3

interface Particle {
  x: number
  y: number
  scale: number
  rotate: number
  sprite: number
}

const byScale = (a: Particle, b: Particle) => a.scale - b.scale

export function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !container || !ctx) return

    const mobileQuery = window.matchMedia("(max-width: 768px)")
    let sprites: HTMLImageElement[] = []
    let particles: Particle[] = []
    let timeline: gsap.core.Timeline | null = null
    let resizeTimer = 0
    let disposed = false
    let visible = false
    let width = 0
    let height = 0
    let spriteScale = 1
    // Viewport the current picture was composed for.
    let builtWidth = 0
    let builtHeight = 0

    function draw() {
      if (!ctx || !width || !height) return

      particles.sort(byScale)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, width, height)

      for (const particle of particles) {
        const sprite = sprites[particle.sprite]
        if (!sprite?.naturalWidth) continue

        const scale = particle.scale * spriteScale
        const drawWidth = sprite.naturalWidth * scale
        if (drawWidth < 0.5) continue

        const cos = Math.cos(particle.rotate)
        const sin = Math.sin(particle.rotate)
        ctx.setTransform(cos, sin, -sin, cos, width / 2, height / 2)
        ctx.drawImage(sprite, particle.x, particle.y, drawWidth, sprite.naturalHeight * scale)
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0)
    }

    // The artwork lives far below the fold: images are only requested once the gallery is getting close.
    function loadSprites() {
      if (sprites.length > 0) return
      sprites = PARTICLE_IMAGES.map((src) => {
        const image = new Image()
        image.decoding = "async"
        image.addEventListener("load", () => {
          if (!disposed && (reducedMotion || !visible)) draw()
        })
        image.src = src
        return image
      })
    }

    // The vortex is composed once, for the largest size its tile ever reaches (the whole viewport, where the
    // gallery animation ends). The canvas is never resized while the gallery animates: `object-fit: cover`
    // scales this one picture along with the tile, so the particles keep flowing without a single blank frame
    // and keep their proportions from the small grid tile to full screen.
    function build() {
      timeline?.kill()
      if (!canvas) return

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      if (!viewportWidth || !viewportHeight) return

      builtWidth = viewportWidth
      builtHeight = viewportHeight
      const shrink = Math.min(1, Math.sqrt(MAX_PIXELS / (viewportWidth * viewportHeight)))
      width = Math.round(viewportWidth * shrink)
      height = Math.round(viewportHeight * shrink)
      spriteScale = shrink * SPRITE_SIZE

      canvas.width = width
      canvas.height = height

      const radius = Math.max(width, height)
      // Particles x stagger always add up to one 5 s cycle. Phones get twice the original 33 particles: the tile
      // shows a narrow slice of the picture now, so 33 would leave it almost empty at the start.
      const isMobile = mobileQuery.matches
      const particleCount = isMobile ? 66 : 99
      const staggerEach = isMobile ? -0.075 : -0.05

      particles = Array.from({ length: particleCount }, (_, i) => ({
        x: 0,
        y: 0,
        scale: 0,
        rotate: 0,
        sprite: i % PARTICLE_IMAGES.length,
      }))

      timeline = gsap
        .timeline({ onUpdate: draw, paused: reducedMotion || !visible })
        .fromTo(
          particles,
          {
            x: (i: number) => Math.cos(((i / particleCount) * Math.PI * 2 - Math.PI / 2) * 10) * radius,
            y: (i: number) => Math.sin(((i / particleCount) * Math.PI * 2 - Math.PI / 2) * 10) * radius,
            scale: 0.6,
            rotate: 0,
          },
          {
            duration: 5,
            ease: "sine",
            x: 0,
            y: 0,
            scale: 0,
            rotate: -3,
            stagger: { each: staggerEach, repeat: -1 },
          },
          0
        )
        .seek(99)

      // `seek` does not fire onUpdate: paint the first frame so the tile is never empty.
      draw()
    }

    // Everything is prepared before the gallery gets here; the timeline only runs while the tile is (almost) visible.
    const prepare = new IntersectionObserver(
      (entries) => {
        if (!entries[entries.length - 1]?.isIntersecting) return
        loadSprites()
        if (!timeline) build()
      },
      { rootMargin: "1200px 0px" }
    )
    prepare.observe(container)

    const visibility = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1]?.isIntersecting ?? false
        if (!timeline || reducedMotion) return
        timeline.paused(!visible)
        if (visible) draw()
      },
      { rootMargin: "400px 0px" }
    )
    visibility.observe(container)

    // Only a real viewport change recomposes the picture. Touch browsers also fire resize while the URL bar
    // collapses (height only), which must not restart the vortex.
    const handleResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        if (!timeline) return
        const widthChanged = window.innerWidth !== builtWidth
        const heightChanged = Math.abs(window.innerHeight - builtHeight) > builtHeight * 0.2
        if (widthChanged || heightChanged) build()
      }, 200)
    }
    window.addEventListener("resize", handleResize)
    mobileQuery.addEventListener("change", build)

    return () => {
      disposed = true
      window.clearTimeout(resizeTimer)
      prepare.disconnect()
      visibility.disconnect()
      window.removeEventListener("resize", handleResize)
      mobileQuery.removeEventListener("change", build)
      timeline?.kill()
    }
  }, [reducedMotion])

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
        className="block h-full w-full object-cover"
        style={{
          imageRendering: "auto",
          transform: "translateZ(0)",
        }}
      />
    </div>
  )
}
