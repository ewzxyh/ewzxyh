import type { Metadata, Viewport } from "next"
import { RootDocument } from "@/app/root-document"
import { siteMetadata, siteViewport } from "@/lib/seo"

// Root layout of the Portuguese page ("/"). The English page has its own in app/en: a root layout per language is what
// lets <html lang> be right in the static HTML (https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout).
export const metadata: Metadata = siteMetadata
export const viewport: Viewport = siteViewport
// The portfolio is fully static: `next dev` and `next build` fail if anything under this layout starts rendering per
// request (cookies(), headers(), uncached data). The language choice and the foreign-visitor redirect live in the
// browser and in proxy.ts, outside the page render.
export const ensureStatic = "navigation"

export default function PortugueseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="pt-BR">{children}</RootDocument>
}
