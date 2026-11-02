"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
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
      <Button variant="quiet" size="chip" data-cuelume-toggle onClick={toggleLocale}>
        {/* ai-design-check-ignore-next-line sentence-case -- language codes are written in capitals */}
        {locale === "pt-BR" ? "EN-US" : "PT-BR"}
        <span className="sr-only">, {t("nav.language")}</span>
      </Button>

      {/* Bat Animation Overlay */}
      {isTransitioning && <BatOverlay />}
    </>
  )
}
