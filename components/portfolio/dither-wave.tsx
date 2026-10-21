"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

// 8×8 Bayer matrix, as thresholds in 0..1: ordered dithering turns each smooth value into an on/off dot.
const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
].map((value) => (value + 0.5) / 64)

// Size of one dot in CSS pixels. The canvas holds one pixel per dot and the browser scales it up without smoothing.
const CELL = 4
const FRAME_MS = 1000 / 30
// Opaque black; the canvas is inverted on the dark theme, like the black brand logos.
const INK = 0xff000000

// Back to front: resting line (0 = top), swell, wavelength, speed, density at the crest and how fast it fades below.
const LAYERS = [
  { base: 0.36, amp: 0.12, freq: 4.6, speed: 0.32, phase: 0, tone: 0.16, fall: 1.4 },
  { base: 0.54, amp: 0.11, freq: 6.8, speed: -0.45, phase: 1.7, tone: 0.3, fall: 1.6 },
  { base: 0.72, amp: 0.09, freq: 9.2, speed: 0.6, phase: 3.1, tone: 0.5, fall: 1.2 },
]

// Three layered sine waves drawn as a 1-bit ordered dither: each one has a solid crest and a body that thins out
// below it. It only animates while on screen, and holds a still frame when motion is reduced.
export function DitherWave({ className = "" }: { className?: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const box = boxRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!box || !canvas || !ctx) return

    let cols = 0
    let rows = 0
    let image: ImageData | null = null
    let pixels = new Uint32Array(0)
    let crests = new Float32Array(0)
    let frame = 0
    let last = 0

    const draw = (time: number) => {
      if (!image) return
      for (let layer = 0; layer < LAYERS.length; layer++) {
        const { base, amp, freq, speed, phase } = LAYERS[layer]
        for (let x = 0; x < cols; x++) {
          const u = x / cols
          crests[layer * cols + x] =
            base + amp * (Math.sin(u * freq + time * speed + phase) + 0.4 * Math.sin(u * freq * 2.3 - time * speed * 1.6 + phase * 2))
        }
      }
      const crestWidth = 1.5 / rows
      for (let y = 0; y < rows; y++) {
        const v = y / rows
        const bayerRow = (y & 7) * 8
        for (let x = 0; x < cols; x++) {
          let value = 0
          for (let layer = 0; layer < LAYERS.length; layer++) {
            const depth = v - crests[layer * cols + x]
            if (depth < 0) continue
            const { tone, fall } = LAYERS[layer]
            value = Math.max(value, depth < crestWidth ? 1 : tone * (1 - depth * fall))
          }
          pixels[y * cols + x] = value > BAYER[bayerRow + (x & 7)] ? INK : 0
        }
      }
      ctx.putImageData(image, 0, 0)
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (now - last < FRAME_MS) return
      last = now
      draw(now / 1000)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    // The canvas is sized in whole dots and the box clips the remainder, so every dot stays exactly CELL px wide.
    const resize = () => {
      const nextCols = Math.ceil(box.clientWidth / CELL)
      const nextRows = Math.ceil(box.clientHeight / CELL)
      if (nextCols === cols && nextRows === rows) return
      cols = nextCols
      rows = nextRows
      if (!cols || !rows) return
      canvas.width = cols
      canvas.height = rows
      canvas.style.width = `${cols * CELL}px`
      canvas.style.height = `${rows * CELL}px`
      image = ctx.createImageData(cols, rows)
      pixels = new Uint32Array(image.data.buffer)
      crests = new Float32Array(cols * LAYERS.length)
      draw(performance.now() / 1000)
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reducedMotion) {
        if (!frame) frame = requestAnimationFrame(tick)
      } else {
        stop()
      }
    })
    resizeObserver.observe(box)
    intersectionObserver.observe(box)

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [reducedMotion])

  return (
    <div ref={boxRef} aria-hidden="true" className={`overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block [image-rendering:pixelated] dark:invert" />
    </div>
  )
}
