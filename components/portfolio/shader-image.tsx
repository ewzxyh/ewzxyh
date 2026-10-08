"use client"

import { gsap } from "gsap"
import Image from "next/image"
import { useEffect, useRef, type ReactNode } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { createFxImage, type FxFrame, type FxImage } from "@/lib/image-fx"

// Scroll velocity shared by every image (drives the distortion while the page scrolls).
const velocityProxy = { v: 0, s: 0 }
const wakeListeners = new Set<() => void>()
let velocityInitialized = false

function initScrollVelocity() {
  if (velocityInitialized) return
  velocityInitialized = true

  const clamp = gsap.utils.clamp(-2000, 2000)
  let lastScrollY = window.scrollY
  let lastScrollTime = performance.now()

  window.addEventListener(
    "scroll",
    () => {
      const now = performance.now()
      const dt = now - lastScrollTime
      if (dt <= 0) return

      const norm = clamp(((window.scrollY - lastScrollY) / dt) * 1000) / 1000 // -2..2
      const strength = Math.min(1, Math.abs(norm))
      if (strength > velocityProxy.s) {
        velocityProxy.v = norm
        velocityProxy.s = strength
        gsap.to(velocityProxy, { v: 0, s: 0, duration: 0.8, ease: "sine.inOut", overwrite: true })
        for (const wake of wakeListeners) wake()
      }
      lastScrollY = window.scrollY
      lastScrollTime = now
    },
    { passive: true },
  )
}

// One animation frame loop for all images, alive only while at least one of them is animating.
const tickers = new Set<(now: number) => boolean>()
let frameId = 0

function loop(now: number) {
  frameId = 0
  for (const tick of tickers) {
    if (!tick(now)) tickers.delete(tick)
  }
  if (tickers.size > 0) frameId = requestAnimationFrame(loop)
}

function wake(tick: (now: number) => boolean) {
  tickers.add(tick)
  if (!frameId) frameId = requestAnimationFrame(loop)
}

function whenLoaded(image: HTMLImageElement) {
  if (image.complete && image.naturalWidth > 0) return Promise.resolve(true)
  return new Promise<boolean>((resolve) => {
    image.addEventListener("load", () => resolve(true), { once: true })
    image.addEventListener("error", () => resolve(false), { once: true })
  })
}

// Vertical focus in CSS object-position terms: 0 = top, 1 = bottom.
function parseFocusY(position: string) {
  if (position === "top") return 0
  if (position === "bottom") return 1
  const match = position.match(/^(\d+(?:\.\d+)?)%$/)
  return match ? Number.parseFloat(match[1]) / 100 : 0.5
}

interface ShaderImageProps {
  src?: string
  alt?: string
  sizes?: string
  grayscale?: boolean
  position?: string
  hoverOnly?: boolean
  grain?: number
  preload?: boolean
  // Upper bound for the canvas backing store (device pixels), so big tiles never get expensive.
  maxPixels?: number
  // How strong the wave and color split get at full effect (1 = the gallery's look).
  intensity?: number
  // Custom markup holding the <img> to use as the base layer and texture source (e.g. a <picture>).
  children?: ReactNode
}

export function ShaderImage({
  src,
  alt = "",
  sizes = "(max-width: 768px) 70vw, 45vw",
  grayscale = false,
  position = "center",
  hoverOnly = false,
  grain = 0,
  preload = false,
  maxPixels = 1.6e6,
  intensity = 1,
  children,
}: ShaderImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const image = container?.querySelector("img")
    if (!container || !canvas || !image || reducedMotion) return

    // Hover-only effects have no meaning on touch screens: keep the plain <img> there.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    if (hoverOnly && !finePointer) return
    if (!hoverOnly) initScrollVelocity()

    const ratio = Math.min(window.devicePixelRatio || 1, finePointer ? 2 : 1.5)
    const focusY = parseFocusY(position)
    const hover = { v: 0, s: 0 }
    const source = hoverOnly ? hover : velocityProxy

    let fx: FxImage | null = null
    let near = false
    let disposed = false
    let starting = false
    let time = 0
    let lastNow = 0
    let lastStrength = 0
    let bitmapWidth = 0
    let bitmapHeight = 0

    const draw = (frame: FxFrame) => fx?.draw(frame)

    // Gallery tiles change their layout size on every scroll frame (Flip animates width/height), so the
    // backing store is only reallocated when it drifts far from the box; the canvas covers in between.
    const sizeCanvas = () => {
      const cssWidth = container.clientWidth
      const cssHeight = container.clientHeight
      if (!fx || !cssWidth || !cssHeight) return

      const area = cssWidth * cssHeight * ratio * ratio
      const effectiveRatio = area > maxPixels ? ratio * Math.sqrt(maxPixels / area) : ratio
      const width = Math.round(cssWidth * effectiveRatio)
      const height = Math.round(cssHeight * effectiveRatio)
      const stale =
        !bitmapWidth || width > bitmapWidth * 1.2 || height > bitmapHeight * 1.2 || width < bitmapWidth * 0.55 || height < bitmapHeight * 0.55
      if (!stale) return

      bitmapWidth = width
      bitmapHeight = height
      fx.resize(cssWidth, cssHeight, effectiveRatio)
      draw({ time, velocity: 0, strength: 0 })
    }

    const tick = (now: number) => {
      if (!fx || !near) return false
      const dt = lastNow ? Math.min((now - lastNow) * 0.001, 0.1) : 0
      lastNow = now

      const animating = source.s > 0.001
      if (animating || lastStrength > 0.001) {
        time += dt
        draw({ time, velocity: source.v, strength: animating ? source.s * intensity : 0 })
      }
      lastStrength = animating ? source.s : 0
      if (!animating) lastNow = 0
      return animating
    }

    const wakeUp = () => {
      if (fx && near) wake(tick)
    }

    const start = async () => {
      if (starting) return
      starting = true
      if (!(await whenLoaded(image)) || disposed) return

      const created = await createFxImage({ image, canvas, grayscale, grain, focusY })
      if (!created) return
      if (disposed) {
        created.dispose()
        return
      }

      fx = created
      sizeCanvas()
      canvas.style.opacity = "1"
      wakeUp()
    }

    const intersection = new IntersectionObserver(
      (entries) => {
        near = entries[entries.length - 1]?.isIntersecting ?? false
        if (!near) return
        void start()
        wakeUp()
      },
      { rootMargin: "300px" },
    )
    intersection.observe(container)

    const resize = new ResizeObserver(sizeCanvas)
    resize.observe(container)

    const handleEnter = () => {
      gsap.to(hover, { s: 1, duration: 0.3, ease: "power2.out", overwrite: true })
      wakeUp()
    }
    const handleMove = (event: PointerEvent) => {
      hover.v = gsap.utils.clamp(-2, 2, event.movementX / 16 || 1)
    }
    const handleLeave = () => {
      gsap.to(hover, { v: 0, s: 0, duration: 0.45, ease: "power2.out", overwrite: true })
      wakeUp()
    }

    if (hoverOnly) {
      container.addEventListener("pointerenter", handleEnter)
      container.addEventListener("pointermove", handleMove)
      container.addEventListener("pointerleave", handleLeave)
    } else {
      wakeListeners.add(wakeUp)
    }

    return () => {
      disposed = true
      tickers.delete(tick)
      wakeListeners.delete(wakeUp)
      gsap.killTweensOf(hover)
      intersection.disconnect()
      resize.disconnect()
      container.removeEventListener("pointerenter", handleEnter)
      container.removeEventListener("pointermove", handleMove)
      container.removeEventListener("pointerleave", handleLeave)
      fx?.dispose()
      canvas.style.opacity = "0"
    }
  }, [grayscale, grain, hoverOnly, intensity, maxPixels, position, reducedMotion])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ isolation: "isolate", contain: "layout style paint" }}
    >
      {children ?? (
        <Image
          src={src ?? ""}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover"
          style={{
            objectPosition: `center ${position}`,
            filter: grayscale ? "grayscale(1)" : undefined,
          }}
        />
      )}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover opacity-0" />
    </div>
  )
}
