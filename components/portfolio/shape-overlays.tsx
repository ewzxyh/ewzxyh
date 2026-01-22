"use client"

import { useEffect, useRef, useCallback } from "react"
import { gsap } from "gsap"

interface ShapeOverlaysProps {
  isActive?: boolean
  onComplete?: () => void
  onAlmostComplete?: () => void
}

export function ShapeOverlays({ isActive, onComplete, onAlmostComplete }: ShapeOverlaysProps) {
  const pathsRef = useRef<SVGPathElement[]>([])
  const isAnimatingRef = useRef(false)
  const initializedRef = useRef(false)

  const numPaths = 3
  const numPoints = 10
  const delayPointsMax = 0.3
  const delayPerPath = 0.2
  const duration = 0.9

  const allPointsRef = useRef<{ value: number }[][]>([])
  const pointsDelayRef = useRef<number[]>([])
  const isOpenedRef = useRef(true)

  const renderAll = useCallback(() => {
    const isOpened = isOpenedRef.current

    for (let i = 0; i < numPaths; i++) {
      const path = pathsRef.current[i]
      const points = allPointsRef.current[i]
      if (!path || !points) continue

      let d = ""
      d += isOpened ? `M 0 0 V ${points[0].value} C` : `M 0 ${points[0].value} C`

      for (let j = 0; j < numPoints - 1; j++) {
        const p = ((j + 1) / (numPoints - 1)) * 100
        const cp = p - (1 / (numPoints - 1)) * 100 / 2
        d += ` ${cp} ${points[j].value} ${cp} ${points[j + 1].value} ${p} ${points[j + 1].value}`
      }

      d += isOpened ? ` V 100 H 0` : ` V 0 H 0`
      path.setAttribute("d", d)
    }
  }, [])

  const toggle = useCallback(() => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true

    for (let i = 0; i < numPoints; i++) {
      pointsDelayRef.current[i] = Math.random() * delayPointsMax
    }

    const isOpened = isOpenedRef.current
    const targetValue = isOpened ? 0 : 100

    isOpenedRef.current = !isOpenedRef.current

    const totalDuration = duration + delayPointsMax + delayPerPath * (numPaths - 1)
    const almostCompleteDelay = Math.max(0, totalDuration - 0.5)

    gsap.delayedCall(almostCompleteDelay, () => {
      onAlmostComplete?.()
    })

    const masterTl = gsap.timeline({
      onUpdate: renderAll,
      onComplete: () => {
        isAnimatingRef.current = false
        onComplete?.()
      },
    })

    for (let i = 0; i < numPaths; i++) {
      const points = allPointsRef.current[i]
      // Top layer (last in DOM) animates first when closing
      const pathDelay = delayPerPath * (isOpened ? (numPaths - 1 - i) : i)

      for (let j = 0; j < numPoints; j++) {
        const pointDelay = pointsDelayRef.current[j]

        masterTl.to(
          points[j],
          {
            value: targetValue,
            duration: duration,
            ease: "power2.inOut",
          },
          pointDelay + pathDelay
        )
      }
    }
  }, [renderAll, onComplete, onAlmostComplete])

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    allPointsRef.current = []
    for (let i = 0; i < numPaths; i++) {
      const points: { value: number }[] = []
      for (let j = 0; j < numPoints; j++) {
        points.push({ value: 100 })
      }
      allPointsRef.current.push(points)
    }

    for (let i = 0; i < numPoints; i++) {
      pointsDelayRef.current[i] = 0
    }

    isOpenedRef.current = true
    renderAll()
  }, [renderAll])

  useEffect(() => {
    if (!initializedRef.current) return

    if (isActive === false && !isAnimatingRef.current) {
      toggle()
    }
  }, [isActive, toggle])

  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        ref={(el) => {
          if (el) pathsRef.current[0] = el
        }}
        fill="#525252"
      />
      <path
        ref={(el) => {
          if (el) pathsRef.current[1] = el
        }}
        fill="#6b6b6b"
      />
      <path
        ref={(el) => {
          if (el) pathsRef.current[2] = el
        }}
        fill="#858585"
      />
    </svg>
  )
}
