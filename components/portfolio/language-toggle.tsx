"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { useI18n } from "@/lib/i18n"
import { onIdle } from "@/lib/idle"
import { useMounted } from "@/hooks/use-mounted"

const loadBatOverlay = () => import("./bat-overlay")
const BatOverlay = dynamic(loadBatOverlay, { ssr: false })

export function LanguageToggle() {
  const { locale, setLocale, isTransitioning } = useI18n()
  const mounted = useMounted()

  // Warm the overlay chunk so the first language switch does not wait for the network.
  useEffect(() => onIdle(() => void loadBatOverlay(), 5000), [])

  if (!mounted) return null

  const toggleLocale = () => {
    setLocale(locale === "pt-BR" ? "en-US" : "pt-BR")
  }

  return (
    <>
      {/* Language Toggle Button */}
      <button
        type="button"
        data-cuelume-toggle
        onClick={toggleLocale}
        className="px-2.5 py-2 text-xs sm:text-sm font-medium tracking-wide border border-border bg-background text-foreground hover:bg-foreground hover:text-background transition-all duration-300 flex-shrink-0"
        aria-label={locale === "pt-BR" ? "Alternar idioma" : "Switch language"}
      >
        {locale === "pt-BR" ? "EN-US" : "PT-BR"}
      </button>

      {/* Bat Animation Overlay */}
      {isTransitioning && <BatOverlay />}
    </>
  )
}
