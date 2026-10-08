import type { Metadata } from "next"
import { ProjectRoute } from "@/components/portfolio/case-study/project-route"
import { caseStudySlugs } from "@/lib/case-studies"
import { getCaseStudyMetadata } from "@/lib/case-study-seo"

// One page per project, in Portuguese; the English twin is app/en/projects/[slug].
type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return getCaseStudyMetadata(slug, "pt-BR")
}

export default function ProjectPage({ params }: Props) {
  return <ProjectRoute params={params} locale="pt-BR" />
}
