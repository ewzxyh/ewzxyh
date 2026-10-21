"use client"

import { useEffect, useRef } from "react"
import { DatabaseIcon, LightbulbIcon, PaletteIcon } from "@/components/ui/icons"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "@/lib/i18n"
import { BentoGallery } from "./bento-gallery"
import { DitherWave } from "./dither-wave"
import { SectionHeading } from "./section-heading"

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
  const bioRef = useRef<HTMLParagraphElement>(null)
  const waveRef = useRef<HTMLDivElement>(null)

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

      gsap.from(bioRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        scrollTrigger: {
          trigger: bioRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      // The wave band opens from the left as it comes into view
      gsap.from(waveRef.current, {
        clipPath: "inset(0 100% 0 0)",
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: waveRef.current,
          start: "top 85%",
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
          <div className="border border-border">
            {/* Who, in one paragraph. The roles themselves are in Experience. */}
            <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-16 lg:p-14">
              <div ref={headerRef}>
                <SectionHeading index="01" label={t("about.label")} title={t("about.title")} />
              </div>
              <p ref={bioRef} className="max-w-[40ch] text-xl leading-snug text-pretty text-muted-foreground sm:text-2xl xl:text-[1.75rem]">
                <Emphasis text={t("about.bio")} />
              </p>
            </div>

            <div ref={waveRef} className="border-t border-border">
              <DitherWave className="h-44 sm:h-60 lg:h-72" />
            </div>

            {/* How Enzo works */}
            <ul className="grid border-t border-border sm:grid-cols-3" aria-label={t("about.principles")}>
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
          </div>
        </div>
      </div>
    </section>
  )
}
