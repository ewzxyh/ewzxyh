"use client"

import { useEffect, type ReactNode } from "react"
import { bind } from "cuelume"
import { ThemeProvider } from "next-themes"
import { CustomCursor } from "@/components/portfolio/custom-cursor"
import { FluidBackground } from "@/components/portfolio/fluid-background"
import { LoadingProvider, useLoading } from "@/components/portfolio/loading-context"
import { PageLoader } from "@/components/portfolio/page-loader"
import { SmoothScroll } from "@/components/smooth-scroll"
import { I18nProvider } from "@/lib/i18n"

const interactiveSelector =
  'a[href], button, input, select, textarea, summary, [role="button"], [role="link"], [role="switch"], [role="tab"]'
const toggleSelector =
  '[data-cuelume-toggle]:not([data-cuelume-toggle="press"]), [role="switch"], [aria-pressed], [aria-expanded], input[type="checkbox"], input[type="radio"]'

function InteractionSounds() {
  useEffect(() => {
    let observer: MutationObserver | undefined

    const wire = () => {
      document.querySelectorAll<HTMLElement>(interactiveSelector).forEach(element => {
        element.dataset.cuelumeHover = "tick"
        element.dataset.cuelumeToggle = element.matches(toggleSelector) ? "" : "press"
        delete element.dataset.cuelumePress
        delete element.dataset.cuelumeRelease
      })
    }

    const hydrationDelay = window.setTimeout(() => {
      wire()
      bind()
      observer = new MutationObserver(wire)
      observer.observe(document.body, { childList: true, subtree: true })
    }, 500)

    return () => {
      window.clearTimeout(hydrationDelay)
      observer?.disconnect()
    }
  }, [])

  return null
}

function DeferredBackground() {
  const { isAlmostComplete } = useLoading()
  return <FluidBackground className="fixed inset-0 z-0 pointer-events-none" defer={!isAlmostComplete} />
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <I18nProvider>
        <LoadingProvider>
          <InteractionSounds />
          <DeferredBackground />
          <PageLoader />
          <CustomCursor />
          <SmoothScroll>{children}</SmoothScroll>
        </LoadingProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
