"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRightUpIcon } from "@/components/ui/icons"
import { useI18n } from "@/lib/i18n"
import { localize, type Project, projectHost, projects } from "@/lib/profile"

gsap.registerPlugin(ScrollTrigger)

const PROJECTS_SECTION_ID = "projects"

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t, locale } = useI18n()
  const cardRef = useRef<HTMLElement>(null)
  const title = localize(project.title, locale)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      // Card entrance animation. The delay staggers the cards of one row (up to three columns), so a card further
      // down the grid does not wait for the ones above it.
      gsap.from(card, {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    }, cardRef)

    // Hover animation
    const number = card.querySelector(".project-number")
    const corner = card.querySelector(".project-corner")
    const onEnter = () => {
      gsap.to(number, { scale: 1.1, opacity: 0.3, duration: 0.3 })
      gsap.to(corner, { borderColor: "var(--foreground)", duration: 0.3 })
    }
    const onLeave = () => {
      gsap.to(number, { scale: 1, opacity: 0.15, duration: 0.3 })
      gsap.to(corner, { borderColor: "transparent", duration: 0.3 })
    }
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
      className="group relative flex flex-col border border-border p-4 sm:p-6 md:p-8 bg-card/30 hover:bg-card/60 transition-colors duration-300"
    >
      {/* Corner Accent */}
      <div className="project-corner absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-t-2 border-transparent transition-colors duration-300" />

      {/* Project Number */}
      <span className="project-number text-4xl sm:text-6xl md:text-7xl font-bold text-foreground/15 absolute -top-2 sm:-top-4 -left-1 sm:-left-2 select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative flex flex-1 flex-col">
        {/* What it is and Enzo's part */}
        <p className="mb-2 text-[11px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {localize(project.kind, locale)} · {localize(project.context, locale)}
        </p>

        {/* Title */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-foreground transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
          {localize(project.description, locale)}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          {project.tags.map((tag) => {
            const label = localize(tag, locale)
            return (
              <span
                key={label}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[11px] sm:text-[13px] tracking-wider border border-border text-muted-foreground"
              >
                {label}
              </span>
            )
          })}
        </div>

        {/* Link to the live product, or why there is none */}
        <div className="mt-auto">
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title}: ${projectHost(project.url)} (${t("projects.newTab")})`}
              className="group/link inline-flex max-w-full items-center gap-1.5 text-xs sm:text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <span className="truncate">{projectHost(project.url)}</span>
              <ArrowRightUpIcon
                aria-hidden="true"
                strokeWidth={2}
                className="size-3.5 sm:size-4 shrink-0 transition-transform duration-300 group-hover/link:rotate-12"
              />
            </a>
          ) : (
            project.note && <span className="text-xs sm:text-sm text-muted-foreground/80">{localize(project.note, locale)}</span>
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
    <section
      ref={sectionRef}
      id={PROJECTS_SECTION_ID}
      className="relative py-16 sm:py-24 md:py-32 border-t border-border z-10"
    >
      <div className="w-full px-[clamp(1.25rem,3vw,4rem)]">
        {/* Section Header */}
        <div ref={headerRef} className="mb-10 sm:mb-16">
          <div>
            <span className="text-xs sm:text-sm text-muted-foreground tracking-[0.2em] sm:tracking-[0.3em] mb-2 block">
              {t("projects.section")}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              {t("projects.title")}
            </h2>
            <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              {t("projects.description")}
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  )
}
