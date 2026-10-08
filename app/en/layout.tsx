import type { Metadata, Viewport } from "next"
import { RootDocument } from "@/app/root-document"
import { siteMetadata, siteViewport } from "@/lib/seo"

// Root layout of the English page ("/en"); see app/(pt)/layout.tsx.
export const metadata: Metadata = siteMetadata
export const viewport: Viewport = siteViewport
// Fully static, like the Portuguese layout (see app/(pt)/layout.tsx).
export const ensureStatic = "navigation"

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="en-US">{children}</RootDocument>
}
