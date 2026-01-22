"use client"

import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"

export function HeaderActions() {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-40 flex items-center gap-2">
      <LanguageToggle />
      <ThemeToggle />
    </div>
  )
}
