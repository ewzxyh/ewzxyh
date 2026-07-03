"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { SerwistProvider } from "@serwist/turbopack/react"
import { I18nProvider } from "@/lib/i18n"
import { PageLoader } from "@/components/portfolio/page-loader"
import { LoadingProvider, useLoading } from "@/components/portfolio/loading-context"
import { FluidBackground } from "@/components/portfolio/fluid-background"
import { SmoothScroll } from "@/components/smooth-scroll"
import { PWAInstallProvider } from "@/hooks/use-pwa-install"

function DeferredBackground() {
  const { isAlmostComplete } = useLoading()
  return <FluidBackground className="fixed inset-0 z-0 pointer-events-none" defer={!isAlmostComplete} />
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SerwistProvider swUrl="/serwist/sw.js" disable={process.env.NODE_ENV !== "production"}>
        <I18nProvider>
          <PWAInstallProvider>
            <LoadingProvider>
              <DeferredBackground />
              <PageLoader />
              <SmoothScroll>{children}</SmoothScroll>
            </LoadingProvider>
          </PWAInstallProvider>
        </I18nProvider>
      </SerwistProvider>
    </ThemeProvider>
  )
}
