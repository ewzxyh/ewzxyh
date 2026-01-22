"use client"

import { useEffect, useRef } from "react"
import { Database, Globe, Layers, Lightbulb, Palette, Server, Zap } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "@/lib/i18n"
import { BentoGallery } from "./bento-gallery"

gsap.registerPlugin(ScrollTrigger)

const skillsData = [
  {
    categoryKey: "about.frontend" as const,
    icon: Layers,
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Shadcn UI"],
  },
  {
    categoryKey: "about.backend" as const,
    icon: Server,
    items: ["Node.js", "Bun", "PHP", "Laravel", "PostgreSQL", "Redis"],
  },
  {
    categoryKey: "about.devops" as const,
    icon: Globe,
    items: ["Vercel", "Coolify", "Docker", "CI/CD", "Git", "Linux"],
  },
  {
    categoryKey: "about.ai" as const,
    icon: Zap,
    items: ["n8n", "ChatCase", "Supabase pgvector", "WhatsApp API", "Resend", "Queues"],
  },
]

const highlightsData = [
  {
    icon: Lightbulb,
    titleKey: "about.product" as const,
    descKey: "about.product.desc" as const,
  },
  {
    icon: Palette,
    titleKey: "about.design" as const,
    descKey: "about.design.desc" as const,
  },
  {
    icon: Database,
    titleKey: "about.fullstack" as const,
    descKey: "about.fullstack.desc" as const,
  },
]

export function About() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const bioRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        opacity: 0,
        x: -30,
        duration: 0.6,
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      // Bio paragraphs stagger
      gsap.from(bioRef.current?.querySelectorAll("p") || [], {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: bioRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      // Highlights cards
      gsap.from(bioRef.current?.querySelectorAll(".highlight-card") || [], {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: bioRef.current?.querySelector(".highlight-card"),
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      // Skills boxes
      gsap.from(skillsRef.current?.children || [], {
        opacity: 0,
        x: 30,
        duration: 0.5,
        stagger: 0.15,
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="relative z-10">
      {/* Bento Gallery */}
      <BentoGallery />

      {/* About Content - rolls over the gallery */}
      <div className="relative z-10 py-16 sm:py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div ref={headerRef} className="mb-10 sm:mb-16">
          <span className="text-xs sm:text-sm text-muted-foreground tracking-[0.2em] sm:tracking-[0.3em] mb-2 block">
            {t("about.section")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            {t("about.title")}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16">
          {/* Bio */}
          <div ref={bioRef} className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-lg leading-relaxed text-muted-foreground">
              {t("about.intro")} <span className="text-foreground font-medium">Enzo Hideki Yoshida</span>,{" "}
              {t("about.description1")}
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              {t("about.description2")}{" "}
              <span className="text-foreground">Next.js</span>{" "}
              {t("about.description2.suffix")}
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              {t("about.description3")}{" "}
              <span className="text-foreground font-medium">Ewzxyh Lab</span>{" "}
              {t("about.description3.suffix")}
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">
              {highlightsData.map((item) => (
                <div key={item.titleKey} className="highlight-card p-3 sm:p-4 border border-border bg-card/50">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-2 sm:mb-3 text-muted-foreground" />
                  <h4 className="font-medium mb-1 text-sm sm:text-base">{t(item.titleKey)}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t(item.descKey)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div ref={skillsRef} className="space-y-4 sm:space-y-8">
            {skillsData.map((skillGroup) => (
              <div key={skillGroup.categoryKey} className="border border-border p-4 sm:p-6 bg-card/50">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <skillGroup.icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <h3 className="font-medium tracking-wider text-xs sm:text-sm">
                    {t(skillGroup.categoryKey).toUpperCase()}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm border border-border bg-secondary/50 text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Status */}
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border border-border bg-card/50">
              <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500" />
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {t("about.status")}
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
