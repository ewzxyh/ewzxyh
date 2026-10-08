"use client"

import { PauseIcon, PlayIcon } from "@/components/ui/icons"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useI18n } from "@/lib/i18n"
import { setMotionReduced } from "@/lib/motion"

// Pauses every animation that runs on its own (the hero background, the gallery vortex, blinking cursors) and the
// scroll-linked effects; pressing it again brings them back. The choice is remembered in this browser.
export function MotionToggle() {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const label = reduced ? t("motion.play") : t("motion.pause")

  return (
    <button
      type="button"
      onClick={() => setMotionReduced(!reduced)}
      title={label}
      className="flex size-9 flex-shrink-0 items-center justify-center border border-border bg-background text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background sm:size-10"
    >
      {reduced ? <PlayIcon aria-hidden="true" className="size-4" /> : <PauseIcon aria-hidden="true" className="size-4" />}
      <span className="sr-only">{label}</span>
    </button>
  )
}
