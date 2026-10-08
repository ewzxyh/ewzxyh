"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { useI18n } from "@/lib/i18n"
import { onIdle } from "@/lib/idle"
import { useMounted } from "@/hooks/use-mounted"

const loadBatOverlay = () => import("./bat-overlay")
const BatOverlay = dynamic(loadBatOverlay, { ssr: false })

export function LanguageToggle() {
  const { locale, setLocale, isTransitioning, t } = useI18n()
  const mounted = useMounted()

  // Warm the overlay chunk so the first language switch does not wait for the network.
  useEffect(() => onIdle(() => void loadBatOverlay(), 5000), [])

  if (!mounted) return null

  const toggleLocale = () => {
    setLocale(locale === "pt-BR" ? "en-US" : "pt-BR")
  }

  return (
    <>
      {/* Language Toggle Button. Its name starts with the code it shows (WCAG 2.5.3) and says what pressing it does. */}
      <button
        type="button"
        data-cuelume-toggle
        onClick={toggleLocale}
        className="inline-flex h-9 flex-shrink-0 items-center border border-border bg-background px-2.5 text-xs font-medium tracking-wide text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background sm:h-10 sm:text-sm"
      >
        {locale === "pt-BR" ? "EN-US" : "PT-BR"}
        <span className="sr-only">, {t("nav.language")}</span>
      </button>

      {/* Bat Animation Overlay */}
      {isTransitioning && <BatOverlay />}
    </>
  )
}
