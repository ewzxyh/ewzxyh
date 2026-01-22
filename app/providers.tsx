"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { I18nProvider } from "@/lib/i18n"
import { PageLoader } from "@/components/portfolio"
import { LoadingProvider } from "@/components/portfolio/loading-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <I18nProvider>
        <LoadingProvider>
          <PageLoader />
          {children}
        </LoadingProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
