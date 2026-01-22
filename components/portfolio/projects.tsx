"use client"

import { useEffect, useRef } from "react"
import { ExternalLink, Github, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "@/lib/i18n"

gsap.registerPlugin(ScrollTrigger)

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  github?: string
  demo?: string
  featured?: boolean
}

const projects: Project[] = [
  {
    id: "1",
    title: "Projeto 1",
    description:
      "Descrição do projeto. Explique o problema resolvido, tecnologias usadas e impacto.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Prisma"],
    github: "https://github.com/ewzxyh/projeto-1",
    demo: "https://projeto-1.vercel.app",
    featured: true,
  },
  {
    id: "2",
    title: "Projeto 2",
    description:
      "Descrição do projeto. Explique o problema resolvido, tecnologias usadas e impacto.",
    tags: ["React", "Node.js", "PostgreSQL"],
    github: "https://github.com/ewzxyh/projeto-2",
    featured: true,
  },
  {
    id: "3",
    title: "Projeto 3",
    description:
      "Descrição do projeto. Explique o problema resolvido, tecnologias usadas e impacto.",
    tags: ["Next.js", "Supabase", "Stripe"],
    demo: "https://projeto-3.vercel.app",
    featured: true,
  },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useI18n()
  const cardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      // Card entrance animation
      gsap.from(card, {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      // Hover animation setup
      const number = card.querySelector(".project-number")
      const corner = card.querySelector(".project-corner")

      card.addEventListener("mouseenter", () => {
        gsap.to(number, { scale: 1.1, opacity: 0.3, duration: 0.3 })
        gsap.to(corner, { borderColor: "var(--foreground)", duration: 0.3 })
      })

      card.addEventListener("mouseleave", () => {
        gsap.to(number, { scale: 1, opacity: 0.15, duration: 0.3 })
        gsap.to(corner, { borderColor: "transparent", duration: 0.3 })
      })
    }, cardRef)

    return () => ctx.revert()
  }, [index])

  return (
    <article
      ref={cardRef}
      className="group relative border border-border p-4 sm:p-6 md:p-8 bg-card/30 hover:bg-card/60 transition-colors duration-300"
    >
      {/* Corner Accent */}
      <div className="project-corner absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-t-2 border-transparent transition-colors duration-300" />

      {/* Project Number */}
      <span className="project-number text-4xl sm:text-6xl md:text-7xl font-bold text-foreground/15 absolute -top-2 sm:-top-4 -left-1 sm:-left-2 select-none">
        {project.id.padStart(2, "0")}
      </span>

      <div className="relative">
        {/* Title */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-foreground transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs tracking-wider border border-border text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t("projects.code")}
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t("projects.demo")}
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
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-16 sm:py-24 md:py-32 border-t border-border z-10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div ref={headerRef} className="flex items-end justify-between mb-10 sm:mb-16">
          <div>
            <span className="text-xs sm:text-sm text-muted-foreground tracking-[0.2em] sm:tracking-[0.3em] mb-2 block">
              {t("projects.section")}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              {t("projects.title")}
            </h2>
          </div>
          <Button
            variant="ghost"
            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            {t("projects.viewAll")}
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 sm:hidden">
          <Button variant="outline" className="w-full text-sm py-3">
            {t("projects.viewAllMobile")}
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
