// Who the site is and where it lives. Metadata, JSON-LD, sitemap, robots, llms.txt and the markdown twins all read
// from here, so a name, URL or handle is only ever written once.

// The production host. `www.ewzxyh.com` answers with a 301 to this apex, so the apex is the canonical one.
export const siteUrl = "https://ewzxyh.com"
// Role + one technical anchor (Next.js) + the product type. The full stack is listed where it fits (skills, JSON-LD).
export const siteTitle = "Enzo Yoshida | Product Engineer Next.js e SaaS"
export const siteTitleEn = "Enzo Yoshida | Product Engineer Next.js & SaaS"
export const siteName = "Enzo Yoshida"
export const personName = "Enzo Hideki Yoshida"
export const brandName = "Ewzxyh Labs"
export const handle = "ewzxyh"

// "Desenvolvedor full-stack" is how Portuguese speakers search for the role; "Product Engineer" is the identity.
export const siteDescription =
  "Product Engineer e desenvolvedor full-stack, fundador da Ewzxyh Labs. 5+ anos criando MVPs, SaaS, dashboards, integrações e automações sob medida com Next.js."
export const siteDescriptionEn =
  "Product Engineer and founder of Ewzxyh Labs, with 5+ years building MVPs, SaaS products, dashboards, integrations and custom automations with Next.js."

// Bump when the content of the page really changes: it feeds sitemap lastmod, JSON-LD dateModified and llms.txt.
export const siteLastModified = "2026-10-08"

export const contactEmail = "yoshidaenzo@hotmail.com"
export const whatsappNumber = "5562984268492"

export const twitterHandle = `@${handle}`

export const socialProfiles = {
  x: `https://x.com/${handle}`,
  linkedin: `https://www.linkedin.com/in/${handle}`,
  instagram: `https://www.instagram.com/${handle}`,
  github: `https://github.com/${handle}`,
} as const

// ---------- languages ----------
//
// Each language has its own URL: Portuguese at the root and English under /en. Search engines index a page per URL
// and ask for one language per URL, so the two are linked with hreflang instead of swapping text on a single address.

export type SiteLocale = "pt-BR" | "en-US"

export const localePaths: Record<SiteLocale, string> = { "pt-BR": "/", "en-US": "/en" }

// Value for <html lang> and Content-Language (English is not written for one country, so it is the bare language).
export const htmlLangs: Record<SiteLocale, string> = { "pt-BR": "pt-BR", "en-US": "en" }

export function pageUrl(locale: SiteLocale) {
  return `${siteUrl}${localePaths[locale]}`
}

// One page per project and language: /projetos/grapnel and /en/projects/grapnel.
export const projectBasePaths: Record<SiteLocale, string> = { "pt-BR": "/projetos", "en-US": "/en/projects" }

export function projectPath(locale: SiteLocale, slug: string) {
  return `${projectBasePaths[locale]}/${slug}`
}

const projectPathPattern = /^\/(?:projetos|en\/projects)\/([a-z0-9-]+)\/?$/

// The same page in another language: what the language switch, hreflang and proxy.ts use. Pages without a
// counterpart (the 404) return null and keep their address.
export function pathInLocale(pathname: string, locale: SiteLocale): string | null {
  if (Object.values(localePaths).includes(pathname)) return localePaths[locale]
  const project = pathname.match(projectPathPattern)
  return project ? projectPath(locale, project[1]) : null
}

export function isHomePath(pathname: string) {
  return Object.values(localePaths).includes(pathname)
}

export function localeFromPath(pathname: string): SiteLocale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en-US" : "pt-BR"
}

export function pageTitle(locale: SiteLocale) {
  return locale === "en-US" ? siteTitleEn : siteTitle
}

export function pageDescription(locale: SiteLocale) {
  return locale === "en-US" ? siteDescriptionEn : siteDescription
}

// Every language version of a page, plus the one search engines should pick when nothing matches the visitor.
// Defaults to the home page; project pages pass their own path builder.
export function alternateLanguages(pathFor: (locale: SiteLocale) => string = (locale) => localePaths[locale]): Record<string, string> {
  return {
    "pt-BR": pathFor("pt-BR"),
    en: pathFor("en-US"),
    "x-default": pathFor("en-US"),
  }
}
