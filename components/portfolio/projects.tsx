"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { ArrowRightIcon, ArrowRightUpIcon } from "@/components/ui/icons"
import { getCaseStudy } from "@/lib/case-studies"
import { atAmiga } from "@/lib/fonts"
import { useI18n } from "@/lib/i18n"
import { localize, type Project, projectHost, projects } from "@/lib/profile"
import { projectPath } from "@/lib/site"
import { SectionHeading } from "./section-heading"

gsap.registerPlugin(ScrollTrigger)

const PROJECTS_SECTION_ID = "projects"
const pad = (value: number) => String(value).padStart(2, "0")

function ProjectCard({ project, index, featured }: { project: Project; index: number; featured: boolean }) {
  const { t, locale } = useI18n()
  const cardRef = useRef<HTMLElement>(null)
  const study = getCaseStudy(project.id)
  const shot = study?.media.desktop
  const metric = study?.highlights?.[0]
  const title = localize(project.title, locale)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      // Card entrance. The delay staggers the cards of one row (up to three columns), so a card further down the
      // grid does not wait for the ones above it.
      gsap.from(card, {
        opacity: 0,
        y: 50,
        scale: 0.97,
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      })
    }, cardRef)

    // Hover: the corner bracket lights up (the screenshot zoom is plain CSS).
    const corner = card.querySelector(".project-corner")
    const onEnter = () => gsap.to(corner, { borderColor: "var(--foreground)", duration: 0.3 })
    const onLeave = () => gsap.to(corner, { borderColor: "transparent", duration: 0.3 })
    card.addEventListener("mouseenter", onEnter)
    card.addEventListener("mouseleave", onLeave)

    return () => {
      card.removeEventListener("mouseenter", onEnter)
      card.removeEventListener("mouseleave", onLeave)
      ctx.revert()
    }
  }, [index])

  return (
    <article
      ref={cardRef}
      className={`group relative flex flex-col bg-background transition-colors duration-300 hover:bg-card/60 ${
        featured ? "md:col-span-2 lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]" : ""
      }`}
    >
      <div className="project-corner pointer-events-none absolute top-0 right-0 z-20 size-8 border-t-2 border-r-2 border-transparent sm:size-12" />

      {/* Screenshot, status and the project's headline number */}
      <div
        className={`relative aspect-[16/10] overflow-hidden border-b border-border bg-card ${
          featured ? "lg:aspect-auto lg:min-h-[24rem] lg:border-r lg:border-b-0" : ""
        }`}
      >
        {shot ? (
          <Image
            src={shot.src}
            alt=""
            fill
            sizes={featured ? "(min-width: 1024px) 55vw, (min-width: 768px) 100vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span aria-hidden="true" className={`${atAmiga.className} text-[clamp(3.5rem,9vw,6rem)] leading-none text-foreground/10 uppercase`}>
              {title.split(" ")[0]}
            </span>
          </div>
        )}
        <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 border border-border bg-background/85 px-2 py-1 text-[10px] tracking-[0.15em] text-foreground uppercase backdrop-blur-sm sm:text-[11px]">
          <span aria-hidden="true" className={`size-1.5 ${project.url ? "bg-green-500" : "bg-orange-500"}`} />
          {project.url ? t("projects.live") : localize(project.note ?? "", locale)}
        </span>
        {metric && (
          <span className="absolute bottom-3 left-3 z-10 max-w-[calc(100%-1.5rem)] border border-border bg-background/85 px-2.5 py-1.5 text-xs backdrop-blur-sm">
            <strong className="font-bold">{localize(metric.value, locale)}</strong>{" "}
            <span className="text-muted-foreground">{localize(metric.label, locale)}</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-7">
        <div className="flex items-center justify-between gap-3 text-[11px] tracking-[0.18em] text-muted-foreground uppercase sm:text-xs">
          <span>
            {localize(project.kind, locale)} · {localize(project.context, locale)}
          </span>
          <span className="font-mono tracking-normal">{pad(index + 1)}</span>
        </div>

        <h3 className={`mt-3 font-bold tracking-tight ${featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
          {/* The whole card opens the project page; the external link below sits above this overlay. */}
          <Link
            href={projectPath(locale, project.id)}
            prefetch={true}
            className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-foreground"
          >
            {title}
          </Link>
        </h3>

        <p className={`mt-3 text-sm leading-relaxed text-pretty text-muted-foreground ${featured ? "sm:text-base" : "line-clamp-4"}`}>
          {localize(project.description, locale)}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => {
            const label = localize(tag, locale)
            return (
              <span key={label} className="border border-border px-1.5 py-0.5 text-[11px] tracking-wider text-muted-foreground sm:text-xs">
                {label}
              </span>
            )
          })}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm">
          <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-foreground">
            {t("projects.caseStudy")}
            <ArrowRightIcon aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title}: ${projectHost(project.url)} (${t("projects.newTab")})`}
              className="group/link relative z-20 inline-flex min-w-0 items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="truncate">{projectHost(project.url)}</span>
              <ArrowRightUpIcon aria-hidden="true" strokeWidth={2} className="size-3.5 shrink-0 transition-transform group-hover/link:rotate-12" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export function Projects() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id={PROJECTS_SECTION_ID} className="relative z-10 border-t border-border py-16 sm:py-24 md:py-32">
      <div className="w-full px-[clamp(1.25rem,3vw,4rem)]">
        <div ref={headerRef} className="mb-10 flex flex-col justify-between gap-6 sm:mb-16 lg:flex-row lg:items-end">
          <SectionHeading index="03" label={t("projects.label")} title={t("projects.title")} description={t("projects.description")} />
          <p className="font-mono text-xs text-muted-foreground lg:text-sm">
            {pad(projects.length)} {t("projects.count")}
          </p>
        </div>

        {/* Hairline grid: the 1px gaps show the border color between the cards. grid-cols-1 keeps the phone column at
            the screen width; an implicit column would grow to fit the longest unbreakable line (a project's address). */}
        <div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} featured={index === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
