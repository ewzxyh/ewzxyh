"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "@/lib/i18n"
import { atAmiga } from "@/lib/fonts"
import {
  type CertificateItem,
  certificates,
  type EducationItem,
  education,
  educationStatusKeys,
  employmentTypes,
  type ExperienceItem,
  formatPeriod,
  localize,
  type Project,
  projects,
  type TagId,
  tagDescription,
  tagLabel,
  workExperience,
  workplaces,
} from "@/lib/profile"
import { projectPath } from "@/lib/site"
import { ArrowRightIcon, ArrowRightUpIcon, MedalRibbonStarIcon, SquareAcademicCapIcon } from "@/components/ui/icons"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SectionHeading } from "./section-heading"

gsap.registerPlugin(ScrollTrigger)

const EXPERIENCE_SECTION_ID = "experience"
const VISIBLE_TAGS = 6

// A chip with its one-line explanation on hover or focus.
function TagChip({ tag }: { tag: TagId }) {
  const { locale } = useI18n()
  return (
    <Tooltip>
      <TooltipTrigger className="skill-tag cursor-help border border-border px-1.5 py-0.5 text-[11px] text-foreground/80 transition-colors duration-200 hover:border-foreground/50 hover:bg-foreground/5 sm:px-2 sm:py-1 sm:text-xs">
        {tagLabel(tag, locale)}
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[220px] text-center">
        <p className="text-xs">{tagDescription(tag, locale)}</p>
      </TooltipContent>
    </Tooltip>
  )
}

function Logo({ src, alt, size, invertInDark }: { src?: string; alt: string; size: "sm" | "md"; invertInDark?: boolean }) {
  const box = size === "md" ? "size-10 sm:size-12" : "size-8"
  const image = size === "md" ? "size-6 sm:size-7" : "size-5"
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden border border-border bg-card ${box}`}>
      {src && (
        <Image src={src} alt={alt} width={28} height={28} className={`object-contain ${image} ${invertInDark ? "dark:invert" : ""}`} />
      )}
    </div>
  )
}

// One role on the timeline: who, what, when, the story, the stack, and the project pages it produced.
function WorkItem({ job }: { job: ExperienceItem }) {
  const { t, locale } = useI18n()
  const [showAllTags, setShowAllTags] = useState(false)
  const tags = showAllTags ? job.tags : job.tags.slice(0, VISIBLE_TAGS)
  const hidden = job.tags.length - tags.length
  const related = (job.projects ?? [])
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is Project => Boolean(project))

  return (
    <li className="experience-item relative pb-12 pl-9 last:pb-0 sm:pl-12">
      <span
        aria-hidden="true"
        className="timeline-dot absolute top-3 left-0 grid size-[15px] place-items-center border border-border bg-background"
      >
        <span className="size-[7px] bg-orange-500" />
      </span>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Logo src={job.logo} alt={job.company} size="md" invertInDark={job.invertLogoInDark} />
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{job.company}</h3>
            <p className="text-sm text-pretty text-muted-foreground">
              {t(job.roleKey)} <span className="opacity-70">· {employmentTypes[job.type][locale]}</span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 pl-[3.25rem] sm:flex-col sm:items-end sm:gap-1.5 sm:pl-0">
          <span className="font-mono text-xs whitespace-nowrap text-foreground/80 sm:text-sm">{formatPeriod(job.period, locale)}</span>
          <span className="border border-border px-1.5 py-0.5 text-[10px] tracking-wider text-muted-foreground uppercase sm:text-[11px]">
            {workplaces[job.workplace][locale]}
          </span>
        </div>
      </div>

      <p className="mt-4 max-w-[72ch] text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">{t(job.descKey)}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setShowAllTags(true)}
            aria-label={`${t("experience.moreTags")} (+${hidden})`}
            className="border border-dashed border-border px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground sm:py-1 sm:text-xs"
          >
            +{hidden}
          </button>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{t("experience.related")}</span>
          {related.map((project) => (
            <Link
              key={project.id}
              href={projectPath(locale, project.id)}
              prefetch={true}
              className="group inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
            >
              {localize(project.title, locale)}
              <ArrowRightIcon aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      )}
    </li>
  )
}

// The credential grids draw their lines with a 1px gap over a border-colored background, so an odd card out would
// leave a gray hole next to it; the last one takes the whole row instead.
const fillsRow = (index: number, count: number) => count % 2 === 1 && index === count - 1

function EducationCard({ item, wide }: { item: EducationItem; wide: boolean }) {
  const { t, locale } = useI18n()
  const status = item.status ? t(educationStatusKeys[item.status]) : null
  return (
    <article className={`credential-card flex gap-4 p-5 sm:p-6 ${status ? "bg-card" : "bg-background"} ${wide ? "sm:col-span-2 xl:col-span-1" : ""}`}>
      <Logo src={item.logo} alt={item.institution} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {status && (
            <span className="inline-flex items-center gap-1.5 bg-foreground/10 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-foreground uppercase sm:text-[11px]">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-green-500" />
              </span>
              {status}
            </span>
          )}
          <span className="border border-border px-1.5 py-0.5 text-[10px] tracking-wider text-muted-foreground uppercase sm:text-[11px]">
            {localize(item.location, locale)}
          </span>
        </div>
        <h4 className="mt-2.5 font-semibold text-pretty">{item.institution}</h4>
        <p className="mt-0.5 text-sm text-pretty text-muted-foreground">{t(item.degreeKey)}</p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">{formatPeriod(item.period, locale)}</p>
      </div>
    </article>
  )
}

function CertificateCard({ item, wide }: { item: CertificateItem; wide: boolean }) {
  const { t, locale } = useI18n()
  return (
    <article className={`credential-card flex flex-col bg-background p-5 sm:p-6 ${wide ? "sm:col-span-2" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Logo src={item.logo} alt={item.issuer} size="sm" />
          <span className="truncate text-xs text-muted-foreground">
            {item.issuer}
            {item.detail && <span className="text-foreground/80"> · {localize(item.detail, locale)}</span>}
          </span>
        </div>
        <span className="shrink-0 font-mono text-xs text-muted-foreground">{formatPeriod(item.period, locale)}</span>
      </div>
      <h4 className="mt-4 leading-snug font-semibold text-pretty">{localize(item.name, locale)}</h4>
      {item.description && <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{localize(item.description, locale)}</p>}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
      </div>
      {item.credentialUrl && (
        <a
          href={item.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link mt-auto inline-flex items-center gap-1 pt-5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRightUpIcon aria-hidden="true" strokeWidth={2} className="size-4 transition-transform group-hover/link:rotate-12" />
          {t("experience.credential")}
        </a>
      )}
    </article>
  )
}

export function Experience() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const workRef = useRef<HTMLOListElement>(null)
  const headersRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      headersRef.current.forEach((header) => {
        if (!header) return
        gsap.from(header, {
          opacity: 0,
          x: -30,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        })
      })

      // The timeline draws itself down the roles as they scroll by.
      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: workRef.current, start: "top 75%", end: "bottom 60%", scrub: true },
        },
      )

      gsap.from(".experience-item", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: workRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      for (const grid of gsap.utils.toArray<HTMLElement>(".credential-grid")) {
        gsap.from(grid.querySelectorAll(".credential-card"), {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const firstYear = Math.min(...workExperience.map((job) => Number(job.period.from.slice(0, 4))))

  return (
    <section ref={sectionRef} id={EXPERIENCE_SECTION_ID} className="relative z-10 border-t border-border">
      <div className="mx-auto w-full max-w-screen-2xl px-[clamp(1.25rem,3vw,4rem)] py-16 sm:py-24 md:py-32">
        {/* Work */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)] lg:gap-16">
          <div ref={(el) => { headersRef.current[0] = el }} className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading index="02" label={t("experience.label")} title={t("experience.work")} description={t("experience.description")} />
            <dl className="mt-8 grid grid-cols-2 border-t border-l border-border">
              <div className="border-r border-b border-border p-4 sm:p-5">
                <dd className={`${atAmiga.className} text-[clamp(2rem,4vw,3rem)] leading-none`}>{workExperience.length}</dd>
                <dt className="mt-2 text-xs text-muted-foreground sm:text-sm">{t("experience.roles")}</dt>
              </div>
              <div className="border-r border-b border-border p-4 sm:p-5">
                <dd className={`${atAmiga.className} text-[clamp(2rem,4vw,3rem)] leading-none`}>{firstYear}</dd>
                <dt className="mt-2 text-xs text-muted-foreground sm:text-sm">{t("experience.since")}</dt>
              </div>
            </dl>
          </div>

          <ol ref={workRef} className="relative">
            <span aria-hidden="true" className="timeline-line absolute top-3 bottom-3 left-[7px] w-px origin-top bg-border" />
            {workExperience.map((job) => (
              <WorkItem key={`${job.company}-${job.period.from}`} job={job} />
            ))}
          </ol>
        </div>

        {/* Education and certificates */}
        <div className="mt-20 grid gap-14 sm:mt-28 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] xl:gap-10">
          <div>
            <div ref={(el) => { headersRef.current[1] = el }} className="mb-6 flex items-center gap-2 sm:mb-8">
              <SquareAcademicCapIcon aria-hidden="true" className="size-5 text-muted-foreground sm:size-6" />
              <h3 className="text-lg font-semibold tracking-tight sm:text-2xl">{t("experience.education")}</h3>
              <span className="ml-auto font-mono text-xs text-muted-foreground">{String(education.length).padStart(2, "0")}</span>
            </div>
            <div className="credential-grid grid gap-px border border-border bg-border sm:grid-cols-2 xl:grid-cols-1">
              {education.map((item, index) => (
                <EducationCard key={`${item.institution}-${item.period.from}`} item={item} wide={fillsRow(index, education.length)} />
              ))}
            </div>
          </div>

          <div>
            <div ref={(el) => { headersRef.current[2] = el }} className="mb-6 flex items-center gap-2 sm:mb-8">
              <MedalRibbonStarIcon aria-hidden="true" className="size-5 text-muted-foreground sm:size-6" />
              <h3 className="text-lg font-semibold tracking-tight sm:text-2xl">{t("experience.certificates")}</h3>
              <span className="ml-auto font-mono text-xs text-muted-foreground">{String(certificates.length).padStart(2, "0")}</span>
            </div>
            <div className="credential-grid grid gap-px border border-border bg-border sm:grid-cols-2">
              {certificates.map((item, index) => (
                <CertificateCard
                  key={item.credentialUrl ?? localize(item.name, "en-US")}
                  item={item}
                  wide={fillsRow(index, certificates.length)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
