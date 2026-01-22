"use client"

import dynamic from "next/dynamic"

const ThemeToggle = dynamic(
  () => import("./theme-toggle").then((mod) => mod.ThemeToggle),
  { ssr: false, loading: () => <div className="w-20 h-20" /> }
)

const LanguageToggle = dynamic(
  () => import("./language-toggle").then((mod) => mod.LanguageToggle),
  { ssr: false, loading: () => <div className="px-3 py-2 text-xs font-medium tracking-wider border border-border bg-background w-14 h-8" /> }
)

export function HeaderActions() {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-40 flex items-center gap-2">
      <LanguageToggle />
      <ThemeToggle />
    </div>
  )
}
