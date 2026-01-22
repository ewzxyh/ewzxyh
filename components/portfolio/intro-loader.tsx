"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { ShapeOverlays } from "./shape-overlays"
import { useLoading } from "./loading-context"

gsap.registerPlugin(MorphSVGPlugin)

// Logo paths data
const logoPaths = [
  "M85.2494 5.73718C38.2427 5.73718 0 43.9798 0 90.9878C0 137.996 38.2427 176.239 85.2494 176.239H115.687C125.663 176.239 133.776 168.124 133.776 158.148C133.776 148.173 125.663 140.058 115.687 140.058H85.2494C58.1934 140.058 36.18 118.045 36.18 90.9878C36.18 63.9305 58.1934 41.9172 85.2494 41.9172H115.687C125.663 41.9172 133.776 33.8012 133.776 23.8278C133.776 13.8518 125.663 5.73718 115.687 5.73718H85.2494Z",
  "M59.2827 90.9879C59.2827 106.496 71.8547 119.071 87.3641 119.071C102.875 119.071 115.447 106.496 115.447 90.9879C115.447 75.4785 102.875 62.9066 87.3641 62.9066C71.8547 62.9066 59.2827 75.4785 59.2827 90.9879Z",
  "M184.869 135.558V161.595C184.869 172.849 193.995 181.976 205.249 181.976C216.505 181.976 225.632 172.849 225.632 161.595V135.558C225.632 115.12 242.261 98.4918 262.7 98.4918C283.139 98.4918 299.768 115.12 299.768 135.558V161.595C299.768 172.849 308.893 181.976 320.148 181.976C331.404 181.976 340.531 172.849 340.531 161.595V135.558C340.531 92.6425 305.616 57.7292 262.7 57.7292C219.783 57.7292 184.869 92.6425 184.869 135.558Z",
  "M184.869 24.0213C184.869 37.2879 195.623 48.0426 208.891 48.0426C222.156 48.0426 232.911 37.2879 232.911 24.0213C232.911 10.7546 222.156 0 208.891 0C195.623 0 184.869 10.7546 184.869 24.0213Z",
  "M483.576 20.3826V46.4186C483.576 66.8572 466.945 83.4839 446.507 83.4839C426.069 83.4839 409.44 66.8572 409.44 46.4186V20.3826C409.44 9.12662 400.313 0 389.057 0C377.803 0 368.676 9.12662 368.676 20.3826V46.4186C368.676 89.3332 403.589 124.245 446.507 124.245C489.424 124.245 524.339 89.3332 524.339 46.4186V20.3826C524.339 9.12662 515.212 0 503.956 0C492.701 0 483.576 9.12662 483.576 20.3826Z",
  "M476.295 157.955C476.295 171.221 487.051 181.976 500.316 181.976C513.584 181.976 524.339 171.221 524.339 157.955C524.339 144.688 513.584 133.933 500.316 133.933C487.051 133.933 476.295 144.688 476.295 157.955Z",
]

// Initial circles that will morph to logo paths
const initialCircles = [
  "M67 91 A26 26 0 1 1 67 90.9 Z", // Circle for C
  "M87 91 A14 14 0 1 1 87 90.9 Z", // Circle for dot in C
  "M262 120 A30 30 0 1 1 262 119.9 Z", // Circle for n
  "M208 24 A12 12 0 1 1 208 23.9 Z", // Circle for dot above n
  "M446 60 A30 30 0 1 1 446 59.9 Z", // Circle for y
  "M500 158 A12 12 0 1 1 500 157.9 Z", // Circle for dot below y
]

export function IntroLoader() {
  const [isOverlayActive, setIsOverlayActive] = useState(true)
  const [showLogo, setShowLogo] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const logoContainerRef = useRef<HTMLDivElement>(null)
  const logoSvgRef = useRef<SVGSVGElement>(null)
  const pathsRef = useRef<SVGPathElement[]>([])
  const { setLoadingComplete } = useLoading()

  // Start overlay close after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOverlayActive(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Handle overlay complete - show logo
  const handleOverlayComplete = () => {
    setShowLogo(true)
  }

  // Animate logo after it appears
  useEffect(() => {
    if (!showLogo || !logoSvgRef.current || isComplete) return

    const paths = pathsRef.current.filter(Boolean)
    if (paths.length === 0) return

    const container = logoContainerRef.current
    if (!container) return

    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true)
        setLoadingComplete()
      },
    })

    // Initial state - circles scaled down
    gsap.set(container, { opacity: 1 })
    gsap.set(paths, { scale: 0, transformOrigin: "center center" })

    // Scale in circles with stagger
    tl.to(paths, {
      scale: 1,
      duration: 0.4,
      stagger: 0.05,
      ease: "back.out(1.7)",
    })

    // Morph circles to logo paths
    paths.forEach((path, i) => {
      tl.to(
        path,
        {
          morphSVG: logoPaths[i],
          duration: 0.6,
          ease: "power2.inOut",
        },
        "-=0.3"
      )
    })

    // Hold for a moment
    tl.to({}, { duration: 0.3 })

    // Animate logo up and fade out
    tl.to(container, {
      yPercent: -150,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
    })
  }, [showLogo, isComplete, setLoadingComplete])

  if (isComplete) return null

  return (
    <>
      <ShapeOverlays isActive={isOverlayActive} onComplete={handleOverlayComplete} />

      {showLogo && (
        <div
          ref={logoContainerRef}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <svg
            ref={logoSvgRef}
            width="300"
            height="104"
            viewBox="0 0 525 182"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {initialCircles.map((d, i) => (
              <path
                key={i}
                ref={(el) => {
                  if (el) pathsRef.current[i] = el
                }}
                d={d}
                fill="#858585"
              />
            ))}
          </svg>
        </div>
      )}
    </>
  )
}
