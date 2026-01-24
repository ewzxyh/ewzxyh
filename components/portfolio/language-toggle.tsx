"use client"

import { useEffect, useState, useRef } from "react"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import { useTheme } from "next-themes"
import { useI18n } from "@/lib/i18n"
import batAnimation from "@/public/Batmans.json"

export function LanguageToggle() {
  const { locale, setLocale, isTransitioning } = useI18n()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isTransitioning && lottieRef.current) {
      lottieRef.current.goToAndPlay(0)
    }
  }, [isTransitioning])

  if (!mounted) return null

  const toggleLocale = () => {
    setLocale(locale === "pt-BR" ? "en-US" : "pt-BR")
  }

  return (
    <>
      {/* Language Toggle Button */}
      <button
        onClick={toggleLocale}
        className="px-2 py-1.5 text-[10px] sm:text-xs font-medium tracking-wide border border-border bg-background text-foreground hover:bg-foreground hover:text-background transition-all duration-300 flex-shrink-0"
        aria-label="Alternar idioma"
      >
        {locale === "pt-BR" ? "EN-US" : "PT-BR"}
      </button>

      {/* Bat Animation Overlay */}
      {isTransitioning && (
        <div className="flex fixed inset-0 z-[100] items-center justify-center pointer-events-none">
          <Lottie
            lottieRef={lottieRef}
            animationData={batAnimation}
            loop={false}
            autoplay={true}
            className="w-16 h-16 min-[320px]:w-20 min-[320px]:h-20 sm:w-24 sm:h-24"
            style={isDark ? { filter: "invert(1) brightness(0.8)" } : undefined}
          />
        </div>
      )}
    </>
  )
}
