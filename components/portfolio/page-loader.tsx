"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { gsap } from "gsap"
import { ShapeOverlays } from "./shape-overlays"
import { useLoading } from "./loading-context"

const logoPaths = [
  "M85.2494 5.73718C38.2427 5.73718 0 43.9798 0 90.9878C0 137.996 38.2427 176.239 85.2494 176.239H115.687C125.663 176.239 133.776 168.124 133.776 158.148C133.776 148.173 125.663 140.058 115.687 140.058H85.2494C58.1934 140.058 36.18 118.045 36.18 90.9878C36.18 63.9305 58.1934 41.9172 85.2494 41.9172H115.687C125.663 41.9172 133.776 33.8012 133.776 23.8278C133.776 13.8518 125.663 5.73718 115.687 5.73718H85.2494Z",
  "M59.2827 90.9879C59.2827 106.496 71.8547 119.071 87.3641 119.071C102.875 119.071 115.447 106.496 115.447 90.9879C115.447 75.4785 102.875 62.9066 87.3641 62.9066C71.8547 62.9066 59.2827 75.4785 59.2827 90.9879Z",
  "M184.869 135.558V161.595C184.869 172.849 193.995 181.976 205.249 181.976C216.505 181.976 225.632 172.849 225.632 161.595V135.558C225.632 115.12 242.261 98.4918 262.7 98.4918C283.139 98.4918 299.768 115.12 299.768 135.558V161.595C299.768 172.849 308.893 181.976 320.148 181.976C331.404 181.976 340.531 172.849 340.531 161.595V135.558C340.531 92.6425 305.616 57.7292 262.7 57.7292C219.783 57.7292 184.869 92.6425 184.869 135.558Z",
  "M184.869 24.0213C184.869 37.2879 195.623 48.0426 208.891 48.0426C222.156 48.0426 232.911 37.2879 232.911 24.0213C232.911 10.7546 222.156 0 208.891 0C195.623 0 184.869 10.7546 184.869 24.0213Z",
  "M483.576 20.3826V46.4186C483.576 66.8572 466.945 83.4839 446.507 83.4839C426.069 83.4839 409.44 66.8572 409.44 46.4186V20.3826C409.44 9.12662 400.313 0 389.057 0C377.803 0 368.676 9.12662 368.676 20.3826V46.4186C368.676 89.3332 403.589 124.245 446.507 124.245C489.424 124.245 524.339 89.3332 524.339 46.4186V20.3826C524.339 9.12662 515.212 0 503.956 0C492.701 0 483.576 9.12662 483.576 20.3826Z",
  "M476.295 157.955C476.295 171.221 487.051 181.976 500.316 181.976C513.584 181.976 524.339 171.221 524.339 157.955C524.339 144.688 513.584 133.933 500.316 133.933C487.051 133.933 476.295 144.688 476.295 157.955Z",
]

const lightGradients = [
  { id: "grad0", stops: [{ color: "#433636", offset: 0 }, { color: "#000000", offset: 1 }] },
  { id: "grad1", stops: [{ color: "#514242", offset: 0 }, { color: "#000000", offset: 1 }] },
  { id: "grad2", stops: [{ color: "#483939", offset: 0 }, { color: "#000000", offset: 1 }] },
  { id: "grad3", stops: [{ color: "#675050", offset: 0 }, { color: "#000000", offset: 1 }] },
  { id: "grad4", stops: [{ color: "#4A3E3E", offset: 0 }, { color: "#000000", offset: 1 }] },
  { id: "grad5", stops: [{ color: "#524141", offset: 0 }, { color: "#000000", offset: 1 }] },
]

const darkGradients = [
  { id: "grad0", stops: [{ color: "#C8C0C0", offset: 0 }, { color: "#ffffff", offset: 1 }] },
  { id: "grad1", stops: [{ color: "#BEBABA", offset: 0 }, { color: "#ffffff", offset: 1 }] },
  { id: "grad2", stops: [{ color: "#B5AFAF", offset: 0 }, { color: "#ffffff", offset: 1 }] },
  { id: "grad3", stops: [{ color: "#AAA1A1", offset: 0 }, { color: "#ffffff", offset: 1 }] },
  { id: "grad4", stops: [{ color: "#BAB0B0", offset: 0 }, { color: "#ffffff", offset: 1 }] },
  { id: "grad5", stops: [{ color: "#A19A9A", offset: 0 }, { color: "#ffffff", offset: 1 }] },
]

export function PageLoader() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [logoComplete, setLogoComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogoScreen, setShowLogoScreen] = useState(true)
  const { setLoadingComplete, setAlmostComplete } = useLoading()

  const containerRef = useRef<HTMLDivElement>(null)
  const logoSvgRef = useRef<SVGSVGElement>(null)
  const pathsRef = useRef<SVGPathElement[]>([])

  const isDark = mounted && resolvedTheme === "dark"
  const gradients = isDark ? darkGradients : lightGradients
  const strokeColor = isDark ? "#ffffff" : "#000000"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !logoSvgRef.current || logoComplete) return

    const paths = pathsRef.current.filter(Boolean)
    if (paths.length === 0) return

    const ctx = gsap.context(() => {
      paths.forEach((path) => {
        const length = path.getTotalLength()
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fillOpacity: 0,
          strokeOpacity: 1,
        })
      })

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => {
              setLogoComplete(true)
              setShowLogoScreen(false)
              setTimeout(() => setIsLoading(false), 100)
            },
          })
        },
      })

      paths.forEach((path, index) => {
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            duration: 0.5,
          },
          index * 0.1
        )
      })

      paths.forEach((path, index) => {
        tl.to(
          path,
          {
            fillOpacity: 1,
            strokeOpacity: 0,
            duration: 0.25,
            ease: "power2.out",
          },
          index === 0 ? "-=0.1" : `-=${0.15}`
        )
      })

      tl.to({}, { duration: 0.5 })
    }, logoSvgRef)

    return () => ctx.revert()
  }, [mounted, logoComplete])

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[100] bg-stone-200 dark:bg-stone-800" />
    )
  }

  return (
    <>
      {showLogoScreen && (
        <div
          ref={containerRef}
          className={`fixed inset-0 z-[100] flex items-center justify-center ${
            isDark ? "bg-stone-800" : "bg-stone-200"
          }`}
        >
          <svg
            ref={logoSvgRef}
            width="280"
            height="97"
            viewBox="0 0 525 182"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[60vw] max-w-[280px] h-auto"
          >
            <defs>
              {gradients.map((grad, i) => (
                <linearGradient
                  key={`${grad.id}-loader`}
                  id={`loader-${grad.id}`}
                  x1={i === 0 ? "-37.4297" : i === 1 ? "53.6536" : i === 2 ? "164.166" : i === 3 ? "190.266" : i === 4 ? "545.041" : "518.941"}
                  y1={i === 0 ? "198.991" : i === 1 ? "100.784" : i === 2 ? "23.4832" : i === 3 ? "-11.5033" : i === 4 ? "158.492" : "193.479"}
                  x2={i === 0 ? "189.722" : i === 1 ? "135.884" : i === 2 ? "342.72" : i === 3 ? "222.73" : i === 4 ? "366.487" : "486.477"}
                  y2={i === 0 ? "3.44307" : i === 1 ? "76.8882" : i === 2 ? "230.895" : i === 3 ? "50.4195" : i === 4 ? "-48.919" : "131.556"}
                  gradientUnits="userSpaceOnUse"
                >
                  {grad.stops.map((stop) => (
                    <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
                  ))}
                </linearGradient>
              ))}
            </defs>
            {logoPaths.map((d, i) => (
              <path
                key={i}
                ref={(el) => {
                  if (el) pathsRef.current[i] = el
                }}
                d={d}
                fill={`url(#loader-grad${i})`}
                stroke={strokeColor}
                strokeWidth="2"
                style={{ fillOpacity: 0, strokeOpacity: 1 }}
              />
            ))}
          </svg>
        </div>
      )}

      {logoComplete && (
        <ShapeOverlays
          isActive={isLoading}
          onComplete={setLoadingComplete}
          onAlmostComplete={setAlmostComplete}
        />
      )}
    </>
  )
}
