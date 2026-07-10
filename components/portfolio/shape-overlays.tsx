"use client"

import { useEffect, useRef, type RefObject } from "react"
import { gsap } from "gsap"

interface ShapeOverlaysProps {
  isActive?: boolean
}

const NUM_PATHS = 3
const NUM_POINTS = 10
const DELAY_POINTS_MAX = 0.3
const DELAY_PER_PATH = 0.2
const DURATION = 0.9

type OverlayPoints = { value: number }[][]

function renderAll(
  pathsRef: RefObject<SVGPathElement[]>,
  allPointsRef: RefObject<OverlayPoints>,
  isOpenedRef: RefObject<boolean>
) {
  const isOpened = isOpenedRef.current

  for (let i = 0; i < NUM_PATHS; i++) {
    const path = pathsRef.current[i]
    const points = allPointsRef.current[i]
    if (!path || !points) continue

    let d = ""
    d += isOpened ? `M 0 0 V ${points[0].value} C` : `M 0 ${points[0].value} C`

    for (let j = 0; j < NUM_POINTS - 1; j++) {
      const p = ((j + 1) / (NUM_POINTS - 1)) * 100
      const cp = p - (1 / (NUM_POINTS - 1)) * 100 / 2
      d += ` ${cp} ${points[j].value} ${cp} ${points[j + 1].value} ${p} ${points[j + 1].value}`
    }

    d += isOpened ? ` V 100 H 0` : ` V 0 H 0`
    path.setAttribute("d", d)
  }
}

function toggle(
  pathsRef: RefObject<SVGPathElement[]>,
  allPointsRef: RefObject<OverlayPoints>,
  pointsDelayRef: RefObject<number[]>,
  isOpenedRef: RefObject<boolean>,
  isAnimatingRef: RefObject<boolean>
) {
  if (isAnimatingRef.current) return
  isAnimatingRef.current = true

  for (let i = 0; i < NUM_POINTS; i++) {
    pointsDelayRef.current[i] = Math.random() * DELAY_POINTS_MAX
  }

  const isOpened = isOpenedRef.current
  const targetValue = isOpened ? 0 : 100

  isOpenedRef.current = !isOpenedRef.current

  const masterTl = gsap.timeline({
    onUpdate: () => renderAll(pathsRef, allPointsRef, isOpenedRef),
    onComplete: () => {
      isAnimatingRef.current = false
    },
  })

  for (let i = 0; i < NUM_PATHS; i++) {
    const points = allPointsRef.current[i]
    const pathDelay = DELAY_PER_PATH * (isOpened ? (NUM_PATHS - 1 - i) : i)

    for (let j = 0; j < NUM_POINTS; j++) {
      const pointDelay = pointsDelayRef.current[j]

      masterTl.to(
        points[j],
        {
          value: targetValue,
          duration: DURATION,
          ease: "power2.inOut",
        },
        pointDelay + pathDelay
      )
    }
  }
}

export function ShapeOverlays({ isActive }: ShapeOverlaysProps) {
  const pathsRef = useRef<SVGPathElement[]>([])
  const isAnimatingRef = useRef(false)
  const initializedRef = useRef(false)

  const allPointsRef = useRef<{ value: number }[][]>([])
  const pointsDelayRef = useRef<number[]>([])
  const isOpenedRef = useRef(true)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    allPointsRef.current = []
    for (let i = 0; i < NUM_PATHS; i++) {
      const points: { value: number }[] = []
      for (let j = 0; j < NUM_POINTS; j++) {
        points.push({ value: 100 })
      }
      allPointsRef.current.push(points)
    }

    for (let i = 0; i < NUM_POINTS; i++) {
      pointsDelayRef.current[i] = 0
    }

    isOpenedRef.current = true
    renderAll(pathsRef, allPointsRef, isOpenedRef)
  }, [])

  useEffect(() => {
    if (!initializedRef.current) return

    if (isActive === false && !isAnimatingRef.current) {
      toggle(pathsRef, allPointsRef, pointsDelayRef, isOpenedRef, isAnimatingRef)
    }
  }, [isActive])

  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        ref={(el) => {
          if (el) pathsRef.current[0] = el
        }}
        fill="#57534e"
      />
      <path
        ref={(el) => {
          if (el) pathsRef.current[1] = el
        }}
        fill="#78716c"
      />
      <path
        ref={(el) => {
          if (el) pathsRef.current[2] = el
        }}
        fill="#a8a29e"
      />
    </svg>
  )
}
