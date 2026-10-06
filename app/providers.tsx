"use client"

import { useEffect, type ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { CustomCursor } from "@/components/portfolio/custom-cursor"
import { FluidBackground } from "@/components/portfolio/fluid-background"
import { LoadingProvider, useLoading } from "@/components/portfolio/loading-context"
import { PageLoader } from "@/components/portfolio/page-loader"
import { SmoothScroll } from "@/components/smooth-scroll"
import { onIdle } from "@/lib/idle"
import { I18nProvider } from "@/lib/i18n"

const interactiveSelector =
  'a[href], button, input, select, textarea, summary, [role="button"], [role="link"], [role="switch"], [role="tab"]'
const toggleSelector =
  '[data-cuelume-toggle]:not([data-cuelume-toggle="press"]), [role="switch"], [aria-pressed], [aria-expanded], input[type="checkbox"], input[type="radio"]'

function wireElement(element: HTMLElement) {
  element.dataset.cuelumeHover = "tick"
  element.dataset.cuelumeToggle = element.matches(toggleSelector) ? "" : "press"
  delete element.dataset.cuelumePress
  delete element.dataset.cuelumeRelease
}

function wireTree(root: ParentNode) {
  if (root instanceof HTMLElement && root.matches(interactiveSelector)) wireElement(root)
  root.querySelectorAll<HTMLElement>(interactiveSelector).forEach(wireElement)
}

function InteractionSounds() {
  const { isRevealing } = useLoading()

  useEffect(() => {
    // The loader covers the page until it starts revealing, so nobody interacts before that, and by then everything
    // has hydrated: data attributes added to server-rendered elements earlier would be reported as hydration mismatches.
    if (!isRevealing) return

    let observer: MutationObserver | undefined
    let cancelled = false

    // Sounds are a progressive enhancement: load the synth once the page is idle and only wire what changes.
    const cancelIdle = onIdle(async () => {
      const { bind } = await import("cuelume")
      if (cancelled) return

      wireTree(document)
      bind()

      observer = new MutationObserver((records) => {
        for (const record of records) {
          for (const node of record.addedNodes) {
            if (node instanceof HTMLElement) wireTree(node)
          }
        }
      })
      observer.observe(document.body, { childList: true, subtree: true })
    }, 2500)

    return () => {
      cancelled = true
      cancelIdle()
      observer?.disconnect()
    }
  }, [isRevealing])

  return null
}

function DeferredBackground() {
  const { isAlmostComplete } = useLoading()
  return <FluidBackground className="fixed inset-0 z-0 pointer-events-none" paused={!isAlmostComplete} />
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
