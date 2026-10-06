// Metadata of the site. `siteMetadata` and `siteViewport` are the site-wide defaults every root layout shares (title
// template, robots, icons, metadataBase); `getPageMetadata` is everything that changes with the language, so the two
// home pages ("/" in Portuguese, "/en" in English) are built from the same function and cannot drift apart.

import type { Metadata, Viewport } from "next"
import { getShareImages } from "./share-images"
import {
  alternateLanguages,
  brandName,
  localePaths,
  pageDescription,
  pageTitle,
  personName,
  type SiteLocale,
  siteDescription,
  siteName,
  siteTitle,
  siteUrl,
  twitterHandle,
} from "./site"

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s | ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: personName, url: siteUrl }],
  creator: personName,
  publisher: brandName,
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      // Google's favicon crawler asks for a multiple of 48 px; this one also serves high-density tabs.
      { url: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { title: siteName, capable: false },
}

// The site opens in its dark theme (next-themes, no system detection), so the browser UI starts dark as well.
export const siteViewport: Viewport = {
  themeColor: "#0c0a09",
  colorScheme: "dark light",
}

const openGraphLocales: Record<SiteLocale, string> = { "pt-BR": "pt_BR", "en-US": "en_US" }

export function getPageMetadata(locale: SiteLocale): Metadata {
  const title = pageTitle(locale)
  const description = pageDescription(locale)
  const path = localePaths[locale]
  const other: SiteLocale = locale === "pt-BR" ? "en-US" : "pt-BR"
  const images = getShareImages(locale)

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: path,
      // Each language lists itself and the other one; both pages carry the same set, as Google requires.
      languages: alternateLanguages(),
      // Machine-readable twins of this page: agents that look for them find them without guessing paths.
      types: {
        "text/markdown": [
          { url: locale === "pt-BR" ? "/index.md" : "/en/index.md", title: `${siteName} (${locale}, Markdown)` },
        ],
        "text/plain": [{ url: "/llms.txt", title: "llms.txt" }],
      },
    },
    openGraph: {
      type: "website",
      url: path,
      siteName,
      title,
      description,
      locale: openGraphLocales[locale],
      alternateLocale: [openGraphLocales[other]],
      images: [images.og],
    },
    twitter: {
      card: "summary_large_image",
      site: twitterHandle,
      creator: twitterHandle,
      title,
      description,
      images: [images.x],
    },
  }
}
