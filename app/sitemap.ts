import type { MetadataRoute } from "next"
import { caseStudySlugs, getCaseStudy } from "@/lib/case-studies"
import { getShareImages } from "@/lib/share-images"
import { alternateLanguages, pageUrl, projectPath, type SiteLocale, siteLastModified, siteUrl } from "@/lib/site"

// The public HTML pages, each in both languages and each listing both (hreflang reciprocity): the two home pages and
// one page per project. The markdown twins and llms.txt are discovered through <link rel="alternate">, robots.txt and
// /llms.txt, so they are not listed here (a sitemap is for pages that should appear in search results).
const absolute = (paths: Record<string, string>) => Object.fromEntries(Object.entries(paths).map(([code, path]) => [code, `${siteUrl}${path}`]))

export default function sitemap(): MetadataRoute.Sitemap {
  const homeLanguages = absolute(alternateLanguages())

  const home = (locale: SiteLocale, priority: number): MetadataRoute.Sitemap[number] => ({
    url: pageUrl(locale),
    lastModified: siteLastModified,
    changeFrequency: "monthly",
    priority,
    alternates: { languages: homeLanguages },
    images: [`${siteUrl}/hero/enzo-yoshida-portrait.webp`, getShareImages(locale).og.url],
  })

  const projects = caseStudySlugs.flatMap((slug) => {
    const media = getCaseStudy(slug)?.media
    const images = [media?.desktop?.src, media?.mobile?.src].filter(Boolean).map((src) => `${siteUrl}${src}`)
    const languages = absolute(alternateLanguages((locale) => projectPath(locale, slug)))
    return (["pt-BR", "en-US"] as const).map((locale) => ({
      url: `${siteUrl}${projectPath(locale, slug)}`,
      lastModified: siteLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages },
      images,
    }))
  })

  return [home("pt-BR", 1), home("en-US", 0.9), ...projects]
}
