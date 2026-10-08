// Metadata and JSON-LD of the project pages (/projetos/<slug> and /en/projects/<slug>). Everything stated here is
// also on the page, and the project is tied to the same Person as the home pages (`${siteUrl}/#person`).

import type { Metadata } from "next"
import { caseStudyTitle, getCaseStudy, getProject } from "./case-studies"
import { localize } from "./profile"
import { getShareImages } from "./share-images"
import {
  alternateLanguages,
  htmlLangs,
  localePaths,
  projectPath,
  type SiteLocale,
  siteLastModified,
  siteName,
  siteUrl,
  twitterHandle,
} from "./site"

const projectsLabel: Record<SiteLocale, string> = { "pt-BR": "Projetos", "en-US": "Projects" }

const openGraphLocales: Record<SiteLocale, string> = { "pt-BR": "pt_BR", "en-US": "en_US" }

export function getCaseStudyMetadata(slug: string, locale: SiteLocale): Metadata {
  const study = getCaseStudy(slug)
  // An unknown slug shows the 404 view, but notFound() runs inside the page's <Suspense> after the response started
  // streaming, so the not-found file's head never replaces the layout's: it is set here.
  if (!study) return { title: { absolute: `404 | ${siteName}` }, robots: { index: false, follow: false } }
  const title = caseStudyTitle(slug, locale)
  const description = localize(study.seoDescription, locale)
  const path = projectPath(locale, slug)
  const other: SiteLocale = locale === "pt-BR" ? "en-US" : "pt-BR"
  const image = study.media.og
    ? { url: study.media.og, width: 1200, height: 630, alt: localize(study.media.desktop?.alt ?? study.summary, locale), type: "image/jpeg" }
    : getShareImages(locale).og

  return {
    // The root layout's title template adds " | Enzo Yoshida".
    title,
    description,
    alternates: {
      canonical: path,
      languages: alternateLanguages((language) => projectPath(language, slug)),
    },
    openGraph: {
      type: "article",
      url: path,
      siteName,
      title: `${title} | ${siteName}`,
      description,
      locale: openGraphLocales[locale],
      alternateLocale: [openGraphLocales[other]],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      site: twitterHandle,
      creator: twitterHandle,
      title: `${title} | ${siteName}`,
      description,
      images: [image],
    },
  }
}

export function getCaseStudyJsonLd(slug: string, locale: SiteLocale) {
  const study = getCaseStudy(slug)
  const project = getProject(slug)
  if (!study || !project) return null
  const url = `${siteUrl}${projectPath(locale, slug)}`
  const home = `${siteUrl}${localePaths[locale]}`
  const name = localize(project.title, locale)
  const image = study.media.og ? `${siteUrl}${study.media.og}` : undefined

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `${caseStudyTitle(slug, locale)} | ${siteName}`,
        description: localize(study.seoDescription, locale),
        inLanguage: htmlLangs[locale],
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${url}#project` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        ...(image ? { primaryImageOfPage: image } : {}),
        dateModified: `${siteLastModified}T00:00:00-03:00`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteName, item: home },
          { "@type": "ListItem", position: 2, name: projectsLabel[locale], item: `${home}#projects` },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
      {
        "@type": "CreativeWork",
        "@id": `${url}#project`,
        name,
        description: localize(study.summary, locale),
        ...(study.links[0] ? { url: study.links[0].url } : {}),
        ...(image ? { image } : {}),
        creator: { "@id": `${siteUrl}/#person` },
        keywords: study.stack.join(", "),
        inLanguage: htmlLangs[locale],
      },
    ],
  }
}
