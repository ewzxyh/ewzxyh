import type { MetadataRoute } from "next"
import { getShareImages } from "@/lib/share-images"
import { alternateLanguages, pageUrl, type SiteLocale, siteLastModified, siteUrl } from "@/lib/site"

// Two public HTML pages, one per language, each listing both (hreflang reciprocity). The markdown twins and llms.txt
// are discovered through <link rel="alternate">, robots.txt and /llms.txt, so they are not listed here (a sitemap is
// for pages that should appear in search results).
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(alternateLanguages()).map(([code, path]) => [code, `${siteUrl}${path}`]),
  )

  const entry = (locale: SiteLocale, priority: number): MetadataRoute.Sitemap[number] => ({
    url: pageUrl(locale),
    lastModified: siteLastModified,
    changeFrequency: "monthly",
    priority,
    alternates: { languages },
    images: [`${siteUrl}/hero/enzo-yoshida-portrait.webp`, getShareImages(locale).og.url],
  })

  return [entry("pt-BR", 1), entry("en-US", 0.9)]
}
