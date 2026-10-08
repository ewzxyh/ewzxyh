import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getCaseStudy } from "@/lib/case-studies"
import { getCaseStudyJsonLd } from "@/lib/case-study-seo"
import type { SiteLocale } from "@/lib/site"
import { CaseStudyPage } from "./case-study-page"

type Params = Promise<{ slug: string }>

// The project URL is read inside <Suspense>: the route's static shell (the frame below) stays instant for navigations
// and prefetches, while every known slug is still prerendered in full at build time (generateStaticParams +
// ensureStatic = "navigation" on the root layouts).
async function ProjectBody({ params, locale }: { params: Params; locale: SiteLocale }) {
  const { slug } = await params
  if (!getCaseStudy(slug)) notFound()
  const jsonLd = getCaseStudyJsonLd(slug, locale)

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
      <CaseStudyPage slug={slug} />
    </>
  )
}

function ProjectShell() {
  return (
    <main className="relative z-10 min-h-screen px-(--gutter) pt-24 sm:pt-28 md:pt-32">
      <div className="h-[70svh] border border-border" />
    </main>
  )
}

export function ProjectRoute({ params, locale }: { params: Params; locale: SiteLocale }) {
  return (
    <Suspense fallback={<ProjectShell />}>
      <ProjectBody params={params} locale={locale} />
    </Suspense>
  )
}
