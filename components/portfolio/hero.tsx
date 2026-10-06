"use client"

import { gsap } from "gsap"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  AltArrowDownIcon,
  GithubIcon,
  InstagramIcon,
  LetterIcon,
  LinkedinIcon,
  ProgrammingIcon,
  WhatsappIcon,
  type Icon as SolarIcon,
} from "@/components/ui/icons"
import { getImageProps } from "next/image"
import { useEffect, useId, useRef } from "react"
import type { IconType } from "react-icons"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { atAmiga } from "@/lib/fonts"
import { useI18n } from "@/lib/i18n"
import { useLoading } from "./loading-context"
import { ShaderImage } from "./shader-image"

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrambleTextPlugin)

const CORNERS = [
  "-left-1.5 -top-1.5 border-l-2 border-t-2",
  "-right-1.5 -top-1.5 border-r-2 border-t-2",
  "-bottom-1.5 -left-1.5 border-b-2 border-l-2",
  "-bottom-1.5 -right-1.5 border-b-2 border-r-2",
]

interface SocialLink {
  icon: SolarIcon | IconType
  href: string
  label: string
}

function getSocialLinks(locale: "pt-BR" | "en-US"): SocialLink[] {
  const whatsappText =
    locale === "en-US" ? "Hello%2C%20I%20came%20from%20your%20portfolio%21" : "Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio%21"

  return [
    { icon: GithubIcon, href: "https://github.com/ewzxyh", label: "GitHub" },
    {
      icon: LinkedinIcon,
      href: locale === "en-US" ? "https://linkedin.com/in/ewzxyh?locale=en_US" : "https://linkedin.com/in/ewzxyh",
      label: "LinkedIn",
    },
    { icon: InstagramIcon, href: "https://instagram.com/yoshidaenzoh", label: "Instagram" },
    { icon: LetterIcon, href: "mailto:yoshidaenzo@hotmail.com", label: "Email" },
    { icon: WhatsappIcon, href: `https://wa.me/5562984268492?text=${whatsappText}`, label: "WhatsApp" },
  ]
}

function SocialRail({ locale, label }: { locale: "pt-BR" | "en-US"; label: string }) {
  return (
    <nav
      aria-label={label}
      className="grid grid-cols-5 border-t border-border md:grid-cols-1 md:grid-rows-5 md:border-l md:border-t-0"
    >
      {getSocialLinks(locale).map(({ icon: Icon, href, label: name }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          data-hero-reveal=""
          className="hero-social group relative flex min-h-12 items-center justify-center border-r border-border bg-card/30 text-foreground opacity-0 transition-colors duration-300 last:border-r-0 hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background focus-visible:outline-none md:min-h-0 md:border-b md:border-r-0 md:last:border-b-0"
        >
          <Icon
            aria-hidden="true"
            className="size-6 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-125 group-focus-visible:scale-125"
          />
          <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
            {name}
          </span>
        </a>
      ))}
    </nav>
  )
}

function scrollToSection(sectionId: string) {
  gsap.to(window, {
    duration: 1,
    scrollTo: { y: `#${sectionId}`, offsetY: 80 },
    ease: "power3.inOut",
  })
}

export function Hero() {
  const { t, locale } = useI18n()
  const { isRevealing } = useLoading()
  const reducedMotion = useReducedMotion()
  const titleId = useId()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!isRevealing || !section || !content) return

    const pick = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, section)
    const corners = pick(".hero-corner")
    const words = pick(".hero-name-word")

    const ctx = gsap.context(() => {
      const hidden = pick("[data-hero-reveal]")

      if (reducedMotion) {
        gsap.set(hidden, { opacity: 1 })
        gsap.set(corners, { opacity: 0.5 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.fromTo(".hero-portrait", { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.7 })
        .fromTo(".hero-chip", { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.45")
        .fromTo(
          ".hero-chip-text",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.55, ease: "steps(30)" },
          "-=0.15"
        )
        .fromTo(".hero-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.4")
      words.forEach((word, index) => {
        tl.to(
          word,
          {
            duration: 0.6,
            ease: "none",
            scrambleText: { text: word.textContent ?? "", chars: "upperCase", speed: 0.8, tweenLength: false },
          },
          index === 0 ? "<" : "<+=0.08"
        )
      })
      tl.fromTo(".hero-statement", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.4")
        .fromTo(".hero-stat", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 }, "-=0.25")
        .fromTo(".hero-cta", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.07 }, "-=0.25")
        .fromTo(".hero-social", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.25, stagger: 0.05 }, "-=0.3")
        .fromTo(corners, { opacity: 0 }, { opacity: 0.5, duration: 0.3, stagger: 0.03 }, "-=0.3")
    }, section)

    // Pinning only makes sense when the hero fits in the viewport; smaller screens just scroll naturally.
    // Scroll-linked motion is skipped entirely for people who asked for reduced motion.
    const mm = gsap.matchMedia()
    if (reducedMotion) {
      return () => {
        mm.revert()
        ctx.revert()
      }
    }
    mm.add("(min-width: 768px) and (min-height: 600px)", () => {
      if (section.offsetHeight <= window.innerHeight + 8) {
        ScrollTrigger.create({ trigger: section, start: "top top", end: "bottom top", pin: true, pinSpacing: false })
      }
      // The next section slides over the pinned hero, so its content has to be gone before the two meet.
      // These use absolute scroll positions: a trigger shared with the pin would be measured after its spacer.
      const scrub = (fraction: number) => ({
        start: 0,
        end: () => section.offsetHeight * fraction,
        scrub: true,
        invalidateOnRefresh: true,
      })
      gsap.to(content, { yPercent: 10, ease: "none", scrollTrigger: scrub(0.45) })
      gsap.to(content, { opacity: 0, ease: "none", scrollTrigger: scrub(0.2) })
      corners.forEach((corner, i) => {
        gsap.to(corner, { y: (i % 2 === 0 ? -1 : 1) * 50, ease: "none", scrollTrigger: scrub(0.3) })
      })
    })
    mm.add("(max-width: 767px), (max-height: 599px)", () => {
      gsap.to(content, {
        opacity: 0.35,
        ease: "none",
        scrollTrigger: { trigger: section, start: "center top", end: "bottom top", scrub: true },
      })
    })

    return () => {
      mm.revert()
      ctx.revert()
    }
  }, [isRevealing, reducedMotion])

  const common = { alt: t("hero.imageAlt"), fill: true, quality: 75, loading: "eager", fetchPriority: "high" } as const
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: "/hero/enzo-yoshida-portrait.webp", sizes: "52vw" })
  const {
    props: { srcSet: mobileSrcSet, ...imageProps },
  } = getImageProps({ ...common, src: "/hero/enzo-yoshida-mobile-source.webp", sizes: "100vw" })

  return (
    <section
      ref={sectionRef}
      aria-labelledby={titleId}
      className="relative isolate flex min-h-svh flex-col overflow-hidden px-[clamp(1.25rem,3vw,4rem)] pb-4 pt-20 sm:pb-5 sm:pt-24 md:pb-6 md:pt-28"
    >
      <div ref={contentRef} className="relative z-10 flex flex-1 flex-col gap-3 sm:gap-4">
        <div className="relative grid flex-1 grid-cols-1 grid-rows-[minmax(13rem,1fr)_auto_auto] border border-border md:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)_3.75rem] md:grid-rows-1">
          {CORNERS.map((position) => (
            <span
              key={position}
              aria-hidden="true"
              className={`hero-corner pointer-events-none absolute z-30 size-6 border-foreground opacity-0 sm:size-8 ${position}`}
            />
          ))}

          <figure
            data-hero-reveal=""
            className="hero-portrait relative min-h-0 overflow-hidden border-b border-border opacity-0 md:border-b-0 md:border-r"
          >
            <ShaderImage grayscale hoverOnly grain={0.035} position="22%" maxPixels={3e6}>
              <picture>
                <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="52vw" />
                <img
                  {...imageProps}
                  srcSet={mobileSrcSet}
                  alt={imageProps.alt}
                  className="object-cover"
                  style={{ ...imageProps.style, objectPosition: "50% 22%", filter: "grayscale(1)" }}
                />
              </picture>
            </ShaderImage>
          </figure>

          <div className="@container relative z-20 flex flex-col justify-between gap-6 px-5 py-5 sm:px-6 sm:py-6 md:gap-4 md:px-[clamp(1.5rem,3vw,3.5rem)] md:py-[clamp(1.25rem,3vw,3rem)]">
            <div
              data-hero-reveal=""
              className="hero-chip w-fit max-w-full border border-border bg-card/70 px-3 py-1.5 opacity-0"
            >
              <span className="flex items-center gap-2 text-xs leading-snug tracking-[0.1em] text-muted-foreground sm:tracking-[0.14em] xl:text-sm">
                <ProgrammingIcon className="size-4 shrink-0 sm:size-[18px]" aria-hidden="true" />
                <span className="hero-chip-text min-w-0">{t("hero.role")}</span>
                <span aria-hidden="true" className="h-3.5 w-1.5 shrink-0 animate-pulse bg-foreground" />
              </span>
            </div>

            <p
              data-hero-reveal=""
              className="hero-statement max-w-[26ch] text-balance text-[clamp(1.25rem,2.3vw,3rem)] leading-[1.15] text-foreground opacity-0"
            >
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col gap-4 md:gap-5">
              <dl className="hidden grid-cols-3 divide-x divide-border border-y border-border md:[@media(min-height:720px)]:grid">
                {[
                  { value: "5+", label: t("hero.years") },
                  { value: "50+", label: t("hero.projects") },
                  { value: "630+", label: t("hero.operators") },
                ].map((stat) => (
                  <div
                    key={stat.value}
                    data-hero-reveal=""
                    className="hero-stat flex flex-col-reverse px-3 py-3 opacity-0 first:pl-0 last:pr-0 xl:px-4 xl:py-4"
                  >
                    <dt className="text-xs tracking-[0.12em] text-muted-foreground">{stat.label}</dt>
                    <dd className="text-xl font-bold xl:text-2xl">{stat.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="grid grid-cols-1 gap-3 @[19rem]:grid-cols-2">
                <button
                  type="button"
                  data-hero-reveal=""
                  onClick={() => scrollToSection("projects")}
                  className="hero-cta group inline-flex h-12 items-center justify-center gap-2 border border-foreground bg-foreground px-3 text-xs text-background opacity-0 transition-colors duration-300 hover:bg-background hover:text-foreground focus-visible:bg-background focus-visible:text-foreground focus-visible:outline-none sm:h-14 sm:text-sm"
                >
                  {t("hero.cta")}
                  <AltArrowDownIcon className="size-5 transition-transform group-hover:translate-y-1" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  data-hero-reveal=""
                  onClick={() => scrollToSection("contact")}
                  className="hero-cta inline-flex h-12 items-center justify-center border border-foreground bg-background/60 px-3 text-xs text-foreground opacity-0 transition-colors duration-300 hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background focus-visible:outline-none sm:h-14 sm:text-sm"
                >
                  {t("hero.contactCta")}
                </button>
              </div>
            </div>
          </div>

          <SocialRail locale={locale} label={t("hero.social")} />
        </div>

        <div className="hero-name-fit">
          <h1
            id={titleId}
            aria-label="Enzo Yoshida"
            data-hero-reveal=""
            className={`${atAmiga.className} hero-title hero-name pointer-events-none flex flex-col font-normal leading-[0.9] text-foreground opacity-0 md:flex-row md:gap-[0.35em]`}
          >
            <span aria-hidden="true" className="hero-name-word animate-flicker block">
              ENZO
            </span>
            <span aria-hidden="true" className="hero-name-word animate-flicker block">
              YOSHIDA
            </span>
          </h1>
        </div>
      </div>
    </section>
  )
}
