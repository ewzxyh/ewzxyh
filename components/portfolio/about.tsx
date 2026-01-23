"use client"

import { useEffect, useRef } from "react"
import { Database, Lightbulb, Palette } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "@/lib/i18n"
import { BentoGallery } from "./bento-gallery"
import { Skills } from "./skills"

gsap.registerPlugin(ScrollTrigger)

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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="relative z-10">
      {/* Bento Gallery */}
      <BentoGallery />

      {/* About Content - rolls over the gallery */}
      <div id="about-content" className="relative z-10 py-16 sm:py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div ref={headerRef} className="mb-10 sm:mb-16 max-w-3xl mx-auto">
          <span className="text-xs sm:text-sm text-muted-foreground tracking-[0.2em] sm:tracking-[0.3em] mb-2 block">
            {t("about.section")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            {t("about.title")}
          </h2>
        </div>

        {/* Bio */}
        <div ref={bioRef} className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
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

          {/* Status */}
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border border-border bg-card/50 w-fit">
            <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500" />
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {t("about.status")}
            </span>
          </div>
        </div>

        {/* Skills Section */}
        <Skills />
        </div>
      </div>
    </section>
  )
}
