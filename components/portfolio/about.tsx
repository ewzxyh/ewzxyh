"use client"

import { useEffect, useRef } from "react"
import { DatabaseIcon, LightbulbIcon, PaletteIcon } from "@/components/ui/icons"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { atAmiga } from "@/lib/fonts"
import { useI18n } from "@/lib/i18n"
import { BentoGallery } from "./bento-gallery"
import { SectionHeading } from "./section-heading"
import { Skills } from "./skills"

gsap.registerPlugin(ScrollTrigger)

const highlightsData = [
  {
    icon: LightbulbIcon,
    titleKey: "about.product" as const,
    descKey: "about.product.desc" as const,
  },
  {
    icon: PaletteIcon,
    titleKey: "about.design" as const,
    descKey: "about.design.desc" as const,
  },
  {
    icon: DatabaseIcon,
    titleKey: "about.fullstack" as const,
    descKey: "about.fullstack.desc" as const,
  },
]

// Same numbers as the hero, plus the languages Enzo works in.
const facts = [
  { value: "5+", labelKey: "about.fact.years" as const },
  { value: "50+", labelKey: "about.fact.projects" as const },
  { value: "630+", labelKey: "about.fact.retailers" as const },
  { value: "2", labelKey: "about.fact.languages" as const },
]

const ABOUT_SECTION_ID = "about"
const ABOUT_CONTENT_ID = "about-content"

// The bio marks names with **double asterisks** (the markdown twins print them in bold); here they stand out in the
// foreground color.
function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, index) =>
        index % 2 === 1 ? (
          <span key={part} className="text-foreground font-medium">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}

export function About() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const bioRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

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

      // Facts count in one after the other, then the "now" lines
      gsap.from(panelRef.current?.querySelectorAll(".about-fact, .about-now") || [], {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.07,
        scrollTrigger: {
          trigger: panelRef.current,
          start: "top 80%",
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
      gsap.from(sectionRef.current?.querySelectorAll(".highlight-card") || [], {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current?.querySelector(".highlight-card"),
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id={ABOUT_SECTION_ID} className="relative z-[35]">
      {/* Bento Gallery */}
      <BentoGallery />

      {/* About Content - rolls over the gallery */}
      <div id={ABOUT_CONTENT_ID} className="relative z-10 py-16 sm:py-24 md:py-32">
        <div className="w-full max-w-screen-2xl mx-auto px-(--gutter)">
          <div className="grid border border-border lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)]">
            {/* Who, in numbers, and what is going on now */}
            <div ref={panelRef} className="flex flex-col gap-10 border-b border-border p-6 sm:p-10 lg:border-b-0 lg:border-r">
              <div ref={headerRef}>
                <SectionHeading index="01" label={t("about.label")} title={t("about.title")} />
              </div>

              <dl className="grid grid-cols-2 border-t border-l border-border">
                {facts.map((fact) => (
                  <div key={fact.labelKey} className="about-fact border-r border-b border-border p-4 sm:p-5">
                    <dd className={`${atAmiga.className} text-[clamp(2rem,4vw,3rem)] leading-none`}>{fact.value}</dd>
                    <dt className="mt-2 text-xs leading-snug text-pretty text-muted-foreground sm:text-sm">{t(fact.labelKey)}</dt>
                  </div>
                ))}
              </dl>

              <div>
                <p className="mb-3 text-xs tracking-[0.25em] text-muted-foreground uppercase">{t("about.now")}</p>
                <ul className="space-y-2.5 text-sm sm:text-base">
                  <li className="about-now flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-foreground" />
                    {t("about.now.studio")}
                  </li>
                  <li className="about-now flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-foreground" />
                    {t("about.now.study")}
                  </li>
                  <li className="about-now flex items-center gap-3 text-muted-foreground">
                    <span className="relative flex size-2.5 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-green-500" />
                    </span>
                    {t("about.status")}
                  </li>
                </ul>
              </div>
            </div>

            {/* Bio */}
            <div ref={bioRef} className="flex flex-col justify-center gap-5 p-6 sm:gap-6 sm:p-10 lg:p-14">
              <p className="text-lg leading-snug text-pretty text-muted-foreground sm:text-2xl">
                <Emphasis text={t("about.p1")} />
              </p>
              <p className="text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
                <Emphasis text={t("about.p2")} />
              </p>
              <p className="text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
                <Emphasis text={t("about.p3")} />
              </p>
            </div>
          </div>

          {/* How Enzo works */}
          <ul className="grid border-x border-b border-border sm:grid-cols-3" aria-label={t("about.principles")}>
            {highlightsData.map((item, index) => (
              <li
                key={item.titleKey}
                className="highlight-card group border-b border-border p-5 transition-colors duration-300 last:border-b-0 hover:bg-card sm:border-r sm:border-b-0 sm:p-7 sm:last:border-r-0"
              >
                <div className="flex items-center justify-between">
                  <item.icon className="size-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-6 font-medium sm:text-lg">{t(item.titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{t(item.descKey)}</p>
              </li>
            ))}
          </ul>

          {/* Skills Section */}
          <Skills />
        </div>
      </div>
    </section>
  )
}
