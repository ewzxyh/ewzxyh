"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "@/lib/i18n"

gsap.registerPlugin(ScrollTrigger)

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  featured?: boolean
}

const projectsByLocale: Record<"pt-BR" | "en-US", Project[]> = {
  "pt-BR": [
    {
      id: "1",
      title: "CasePay",
      description:
        "Gateway de pagamentos para lotéricas e pequenos negócios, com checkout, dashboard financeiro, gestão de transações, repasses e integrações com o ecossistema Case.",
      tags: ["Laravel", "Next.js", "Pagamentos", "Dashboard"],
      featured: true,
    },
    {
      id: "2",
      title: "LotoHub",
      description:
        "SaaS para criação e gestão centralizada de sites de lotéricas, com e-commerce, painel administrativo, automação de atendimento e integração de pagamentos.",
      tags: ["Next.js", "Supabase", "Stripe", "SaaS"],
      featured: true,
    },
    {
      id: "3",
      title: "SELOESGO Automação",
      description:
        "Sistema integrado à ConectaLot que gera e distribui artes automaticamente para mais de 630 lotéricos em Goiás, reduzindo uma rotina manual de horas para segundos.",
      tags: ["Automação", "ConectaLot", "Design Ops", "API"],
      featured: true,
    },
  ],
  "en-US": [
    {
      id: "1",
      title: "CasePay",
      description:
        "Payment gateway for lottery retailers and small businesses, with checkout, financial dashboard, transaction management, payouts, and integrations with the Case ecosystem.",
      tags: ["Laravel", "Next.js", "Payments", "Dashboard"],
      featured: true,
    },
    {
      id: "2",
      title: "LotoHub",
      description:
        "SaaS for creating and centrally managing lottery retailer websites, with e-commerce, admin panel, support automation, and payment integration.",
      tags: ["Next.js", "Supabase", "Stripe", "SaaS"],
      featured: true,
    },
    {
      id: "3",
      title: "SELOESGO Automation",
      description:
        "System integrated with ConectaLot that automatically generates and distributes creative assets for more than 630 lottery retailers in Goiás, reducing a manual routine from hours to seconds.",
      tags: ["Automation", "ConectaLot", "Design Ops", "API"],
      featured: true,
    },
  ],
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
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
      </div>
    </article>
  )
}

export function Projects() {
  const { t, locale } = useI18n()
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
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projectsByLocale[locale].map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  )
}
