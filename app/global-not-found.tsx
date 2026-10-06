import type { Metadata, Viewport } from "next"
import { NotFoundView } from "@/components/portfolio/not-found-view"
import { siteMetadata, siteViewport } from "@/lib/seo"
import { RootDocument } from "./root-document"

// 404 for every URL no route matches. With one root layout per language there is no single layout to build it from,
// so Next.js asks for a global one that renders its own <html> (experimental.globalNotFound in next.config.ts;
// https://nextjs.org/docs/app/api-reference/file-conventions/not-found#global-not-foundjs-experimental). Next adds
// noindex to it by itself; the site-wide "index, follow" would contradict it, so it is overridden here.
export const metadata: Metadata = {
  ...siteMetadata,
  title: { absolute: "404 | Enzo Yoshida" },
  robots: { index: false, follow: false },
}
export const viewport: Viewport = siteViewport

export default function GlobalNotFound() {
  return (
    <RootDocument locale="pt-BR" restoreChoice>
      <NotFoundView />
    </RootDocument>
  )
}
