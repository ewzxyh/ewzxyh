"use client"

import { useI18n } from "@/lib/i18n"

// The first stop of the keyboard on every page: it jumps over the header to the page content (WCAG 2.4.1). Hidden
// until it receives focus.
export function SkipLink() {
  const { t } = useI18n()
  return (
    <a
      href="#content"
      className="fixed top-3 left-3 z-[200] -translate-y-24 border border-foreground bg-background px-4 py-3 text-sm text-foreground transition-transform focus:translate-y-0"
    >
      {t("skip.content")}
    </a>
  )
}
