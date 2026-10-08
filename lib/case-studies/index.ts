// Case-study pages, one per project in lib/profile.ts, in the same order.

import { localize, projects } from "../profile"
import type { SiteLocale } from "../site"
import { casepay } from "./casepay"
import { caseshop } from "./caseshop"
import { casezap } from "./casezap"
import { chatcase } from "./chatcase"
import { grapnel } from "./grapnel"
import { lorenzpay } from "./lorenzpay"
import { loteriaAmazonas } from "./loteria-amazonas"
import { loteriaCaseshop } from "./loteria-caseshop"
import { lotohub } from "./lotohub"
import { marketplaceApi } from "./marketplace-api"
import { seloesgo } from "./seloesgo"
import type { CaseStudy } from "./types"

export type { CaseStudy, CaseStudyMedia, Shot } from "./types"

const all: Record<string, CaseStudy> = Object.fromEntries(
  [grapnel, lotohub, casepay, seloesgo, marketplaceApi, casezap, chatcase, loteriaAmazonas, loteriaCaseshop, caseshop, lorenzpay].map(
    (study) => [study.slug, study],
  ),
)

// Slugs in the order of the projects grid.
export const caseStudySlugs: string[] = projects.map((project) => project.id).filter((id) => id in all)

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return all[slug]
}

export function getProject(slug: string) {
  return projects.find((project) => project.id === slug)
}

const caseStudyLabel: Record<SiteLocale, string> = { "pt-BR": "estudo de caso", "en-US": "case study" }

// "Grapnel: estudo de caso"; the root layout's title template adds " | Enzo Yoshida".
export function caseStudyTitle(slug: string, locale: SiteLocale) {
  const project = getProject(slug)
  return project ? `${localize(project.title, locale)}: ${caseStudyLabel[locale]}` : slug
}

// The projects before and after this one in the grid (wrapping around), for the links at the end of a page.
export function adjacentProjects(slug: string) {
  const index = caseStudySlugs.indexOf(slug)
  const count = caseStudySlugs.length
  return {
    previous: getProject(caseStudySlugs[(index - 1 + count) % count]),
    next: getProject(caseStudySlugs[(index + 1) % count]),
  }
}
