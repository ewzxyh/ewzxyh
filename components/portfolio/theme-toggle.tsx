"use client"

import { useRef } from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "@/components/ui/icons"
import { useMounted } from "@/hooks/use-mounted"
import { useI18n } from "@/lib/i18n"
import { isMotionReduced } from "@/lib/motion"

// A square icon button like the pause and language buttons: the sun takes the page to the light theme, the moon to the
// dark one. The new theme still spreads from the button as a growing circle (View Transitions) where supported.
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const { t } = useI18n()
  const mounted = useMounted()
  const buttonRef = useRef<HTMLButtonElement>(null)

  // The theme is only known after mounting; until then the server render (dark, the default theme) is kept.
  const isDark = !mounted || resolvedTheme !== "light"
  const label = isDark ? t("theme.toLight") : t("theme.toDark")

  const toggleTheme = async () => {
    const button = buttonRef.current
    if (!button) return
    const newTheme = isDark ? "light" : "dark"

    if (!("startViewTransition" in document) || isMotionReduced()) {
      setTheme(newTheme)
      return
    }

    const transition = (document as unknown as { startViewTransition: (cb: () => void) => { ready: Promise<void> } }).startViewTransition(() => {
      setTheme(newTheme)
    })
    await transition.ready

    const { top, left, width, height } = button.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(Math.max(left, window.innerWidth - left), Math.max(top, window.innerHeight - top))

    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`] },
      { duration: 1000, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" },
    )
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      data-cuelume-toggle
      onClick={toggleTheme}
      title={label}
      className="flex size-9 flex-shrink-0 items-center justify-center border border-border bg-background text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background sm:size-10"
    >
      {isDark ? <SunIcon aria-hidden="true" className="size-[18px]" /> : <MoonIcon aria-hidden="true" className="size-[18px]" />}
      <span className="sr-only">{label}</span>
    </button>
  )
}
