import type { Metadata, Viewport } from "next"
import { RootDocument } from "@/app/root-document"
import { siteMetadata, siteViewport } from "@/lib/seo"

// Root layout of the Portuguese page ("/"). The English page has its own in app/en: a root layout per language is what
// lets <html lang> be right in the static HTML (https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout).
export const metadata: Metadata = siteMetadata
export const viewport: Viewport = siteViewport

export default function PortugueseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="pt-BR">{children}</RootDocument>
}
