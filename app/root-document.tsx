import { JetBrains_Mono } from "next/font/google"
import Script from "next/script"
import type { ReactNode } from "react"
import { preload } from "react-dom"
import { motionBootScript } from "@/lib/motion"
import { htmlLangs, type SiteLocale } from "@/lib/site"
import { Providers } from "./providers"
import "./globals.css"

// Text face of the whole site (the display face lives in lib/fonts.ts). One variable file with every weight.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

// The document shell shared by every root layout: one per language ("/" and "/en") and the global 404. The server
// knows the language of each, so <html lang> is already right in the static HTML. `restoreChoice` is for pages that
// have no language of their own (the 404): they open in the language the visitor picked on an earlier visit.
export function RootDocument({
  locale,
  restoreChoice = false,
  children,
}: {
  locale: SiteLocale
  restoreChoice?: boolean
  children: ReactNode
}) {
  // The loader's ASCII art is fetched by the client; hinting it here starts the request during HTML parsing.
  preload("/loader-ascii-column-4.txt", { as: "fetch", crossOrigin: "anonymous" })

  return (
    <html lang={htmlLangs[locale]} className={jetbrainsMono.variable} suppressHydrationWarning>
      {/* overflow-x: clip (not hidden) keeps the body from becoming a scroll container, so position: sticky works. */}
      <body className="font-sans antialiased overflow-x-clip">
        {/* A visitor who paused the animations on an earlier visit gets a still page from the first paint. */}
        <Script id="motion-preference" strategy="beforeInteractive">
          {motionBootScript}
        </Script>
        <Providers locale={locale} restoreChoice={restoreChoice}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
