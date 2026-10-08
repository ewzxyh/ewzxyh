"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { createFluid, type FluidController } from "@/lib/fluid-renderer"
import { onIdle } from "@/lib/idle"
import { openGpuGate } from "@/lib/image-fx"

interface FluidBackgroundProps {
  className?: string
  // The shader is created and compiled right away but nothing is drawn, and the pointer is not tracked, while this is
  // true (the page loader still covers it, or the section it lives in is off screen).
  paused?: boolean
}

export function FluidBackground({ className = "", paused = false }: FluidBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<FluidController | null>(null)
  const pausedRef = useRef(paused)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create the GL context once the first paint is out so it never competes with hydration.
    const cancelIdle = onIdle(() => {
      controllerRef.current = createFluid(container, {
        reducedMotion,
        paused: pausedRef.current,
        onContextReady: openGpuGate,
      })
    }, 1500)

    return () => {
      cancelIdle()
      controllerRef.current?.dispose()
      controllerRef.current = null
    }
  }, [reducedMotion])

  useEffect(() => {
    pausedRef.current = paused
    controllerRef.current?.setPaused(paused)
  }, [paused])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`overflow-hidden pointer-events-none bg-stone-100 dark:bg-stone-950 ${className}`}
      style={{
        isolation: "isolate",
        contain: "layout style paint",
      }}
    />
  )
}
