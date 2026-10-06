// JSON-LD for the two home pages: one linked @graph (WebSite, ProfilePage, Person, Organization, images).
//
// Everything stated here is also visible on the page (name, role, services, links), which is what Google asks of
// structured data. The graph also gives AI answer engines an unambiguous entity: who Enzo is, what Ewzxyh Labs
// sells, and which profiles belong to the same person. Property placement follows schema.org: worksFor belongs to
// the Person, founder to the Organization, and inLanguage only to the creative works (WebSite, ProfilePage).

import { getShareImages } from "./share-images"
import {
  brandName,
  contactEmail,
  handle,
  htmlLangs,
  pageDescription,
  pageTitle,
  pageUrl,
  personName,
  type SiteLocale,
  siteLastModified,
  siteName,
  siteUrl,
  socialProfiles,
} from "./site"
import { translations } from "./translations"

const ids = {
  website: `${siteUrl}/#website`,
  person: `${siteUrl}/#person`,
  organization: `${siteUrl}/#organization`,
  portrait: `${siteUrl}/#portrait`,
  shareImage: `${siteUrl}/#share-image`,
}

// Only the person's own profiles. LinkedIn /in/ and Instagram belong to Enzo, so the studio does not claim them.
const personProfiles = Object.values(socialProfiles)

const knowsAbout = [
  "Product engineering",
  "MVP development",
  "SaaS",
  "Next.js",
  "React",
  "TypeScript",
  "Laravel",
  "PHP",
  "REST APIs",
  "PostgreSQL",
  "MySQL",
  "Supabase",
  "Payment gateways",
  "WhatsApp Business API",
  "Workflow automation",
  "Dashboards and integrations",
  "GSAP",
  "WebGL",
]

// The repository's first commit; the page has existed since then.
const dateCreated = "2026-01-22T00:00:00-03:00"
const dateModified = `${siteLastModified}T00:00:00-03:00`

export function getProfileJsonLd(locale: SiteLocale) {
  const share = getShareImages(locale).og
  const copy = translations[locale]
  const description = pageDescription(locale)
  const profilePageId = `${pageUrl(locale)}#profile-page`

  const services = [
    { name: copy["services.products"], description: copy["services.products.desc"] },
    { name: copy["services.systems"], description: copy["services.systems.desc"] },
    { name: copy["services.automation"], description: copy["services.automation.desc"] },
  ]

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: `${siteUrl}/`,
        name: siteName,
        alternateName: [brandName, "ewzxyh.com"],
        inLanguage: [htmlLangs["pt-BR"], htmlLangs["en-US"]],
        publisher: { "@id": ids.person },
      },
      {
        "@type": "ProfilePage",
        "@id": profilePageId,
        url: pageUrl(locale),
        name: pageTitle(locale),
        description,
        inLanguage: htmlLangs[locale],
        isPartOf: { "@id": ids.website },
        about: { "@id": ids.person },
        mainEntity: { "@id": ids.person },
        primaryImageOfPage: { "@id": ids.portrait },
        image: { "@id": ids.shareImage },
        dateCreated,
        dateModified,
      },
      {
        "@type": "Person",
        "@id": ids.person,
        name: personName,
        givenName: "Enzo",
        additionalName: "Hideki",
        familyName: "Yoshida",
        alternateName: [siteName, handle],
        url: `${siteUrl}/`,
        mainEntityOfPage: { "@id": profilePageId },
        image: { "@id": ids.portrait },
        email: contactEmail,
        jobTitle: "Product Engineer",
        description,
        worksFor: { "@id": ids.organization },
        alumniOf: { "@type": "CollegeOrUniversity", name: "PUC-GO" },
        knowsLanguage: ["pt-BR", "en-US"],
        knowsAbout,
        sameAs: personProfiles,
      },
      {
        "@type": "Organization",
        "@id": ids.organization,
        name: brandName,
        url: `${siteUrl}/`,
        description: copy["services.description"],
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/favicon/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        founder: { "@id": ids.person },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: contactEmail,
          availableLanguage: ["Portuguese", "English"],
        },
        knowsAbout,
        makesOffer: services.map((service) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: service.name, description: service.description, provider: { "@id": ids.organization } },
        })),
      },
      {
        "@type": "ImageObject",
        "@id": ids.portrait,
        url: `${siteUrl}/hero/enzo-yoshida-portrait.webp`,
        contentUrl: `${siteUrl}/hero/enzo-yoshida-portrait.webp`,
        width: 1086,
        height: 1448,
        caption: copy["hero.imageAlt"],
      },
      {
        "@type": "ImageObject",
        "@id": ids.shareImage,
        url: share.url,
        contentUrl: share.url,
        width: share.width,
        height: share.height,
        caption: share.alt,
      },
    ],
  }
}
