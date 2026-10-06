"use client"

import Lottie from "lottie-react"
import { useTheme } from "next-themes"
import batAnimation from "@/public/Batmans.json"

// Split from the language toggle so the Lottie runtime only loads when a language switch needs it.
export default function BatOverlay() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div className="flex fixed inset-0 z-[100] items-center justify-center pointer-events-none">
      <Lottie
        animationData={batAnimation}
        loop={false}
        autoplay={true}
        className="w-16 h-16 min-[320px]:w-20 min-[320px]:h-20 sm:w-24 sm:h-24"
        style={isDark ? { filter: "invert(1) brightness(0.8)" } : undefined}
      />
    </div>
  )
}
