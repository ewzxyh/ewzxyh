"use client"

import { gsap } from "gsap"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import { ChevronDown, Terminal } from "lucide-react"
import dynamic from "next/dynamic"
import localFont from "next/font/local"
import { useEffect, useRef } from "react"
import { SiWhatsapp } from "react-icons/si"
import github from "react-useanimations/lib/github"
import instagram from "react-useanimations/lib/instagram"
import linkedin from "react-useanimations/lib/linkedin"
import mail from "react-useanimations/lib/mail"
import { PWAInstallButton } from "@/components/pwa-install-button"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useI18n } from "@/lib/i18n"
import { useLoading } from "./loading-context"

gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrambleTextPlugin)

const UseAnimations = dynamic(() => import("react-useanimations"), { ssr: false })
const atAmiga = localFont({
  src: "../../app/fonts/AtAmiga-Regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
})

function MailIcon({ size, className }: { size: number; className?: string }) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover only replays a decorative icon animation; the parent anchor is the interactive control.
    <div
      style={{ width: size, height: size }}
      className={`${className} [&_path]:stroke-current`}
      onMouseEnter={() => {
        lottieRef.current?.goToAndPlay(0)
      }}
      onMouseLeave={() => {
        lottieRef.current?.goToAndStop(0)
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={mail.animationData}
        loop={false}
        autoplay={false}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}

function scrollToProjects() {
  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
}

export function Hero() {
  const { t, locale } = useI18n()
  const { isLoadingComplete } = useLoading()

  const animatedLinks = [
    { animation: github, href: "https://github.com/ewzxyh", label: "GitHub" },
    { animation: linkedin, href: locale === "en-US" ? "https://linkedin.com/in/ewzxyh?locale=en_US" : "https://linkedin.com/in/ewzxyh", label: "LinkedIn" },
    { animation: instagram, href: "https://instagram.com/yoshidaenzoh", label: "Instagram" },
    { animation: mail, href: "mailto:yoshidaenzo@hotmail.com", label: "Email" },
  ]

  const staticLinks = [
    { icon: SiWhatsapp, href: locale === "en-US" ? "https://wa.me/5562984268492?text=Hello%2C%20I%20came%20from%20your%20portfolio%21" : "https://wa.me/5562984268492?text=Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio%21", label: "WhatsApp" },
  ]
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const terminalTextRef = useRef<HTMLSpanElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!isLoadingComplete) return

    const terminalText = t("hero.terminal")

    const ctx = gsap.context(() => {
      const stats = statsRef.current?.children || []
      const socials = socialsRef.current?.children || []
      const corners = gsap.utils.toArray<HTMLElement>(".corner-decoration")

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(".hero-terminal", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.22 })
        .to(terminalTextRef.current, {
          duration: 0.35,
          text: terminalText,
          ease: "none",
        }, "-=0.1")
        .fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.25 }, "-=0.2")
        .to(nameRef.current, {
          duration: 0.55,
          scrambleText: {
            text: "ENZO YOSHIDA",
            chars: "upperCase",
            speed: 0.8,
          },
        }, "-=0.15")
        .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.22 }, "-=0.35")
        .fromTo(
          stats,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.22, stagger: 0.04 },
          "-=0.12"
        )
        .fromTo(
          socials,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.18, stagger: 0.04 },
          "-=0.1"
        )
        .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2 }, "-=0.1")
        .fromTo(corners, { opacity: 0 }, { opacity: 0.5, duration: 0.18, stagger: 0.02 }, "-=0.2")

      // Pin the hero section - About will scroll over it
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
      })

      // Parallax effect on content while pinned
      gsap.to(contentRef.current, {
        yPercent: 20,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })

      corners.forEach((el, i) => {
        gsap.to(el, {
          y: (i % 2 === 0 ? -1 : 1) * 50,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "50% top",
            scrub: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isLoadingComplete, t])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen h-dvh max-h-dvh flex items-center justify-center overflow-hidden"
    >

      <div ref={contentRef} className="relative z-10 w-full max-w-screen-2xl mx-auto px-[clamp(1.25rem,3vw,4rem)] text-center">
        <div className="hero-terminal opacity-0 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8 border border-border bg-card/50 backdrop-blur-sm">
          <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          <span
            ref={terminalTextRef}
            className="text-xs sm:text-sm text-muted-foreground tracking-wider"
          >
            {t("hero.terminal")}
          </span>
          <span className="w-1.5 sm:w-2 h-3 sm:h-4 bg-foreground animate-pulse" />
        </div>

        <h1
          ref={titleRef}
          className="opacity-0 text-2xl xs:text-3xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-3 sm:mb-4"
        >
          <span className="block text-muted-foreground text-sm sm:text-xl mb-1.5 sm:mb-2 font-normal tracking-[0.2em] sm:tracking-[0.3em]">
            {t("hero.role")}
          </span>
          <span ref={nameRef} className={`${atAmiga.className} animate-flicker`}>
            ENZO YOSHIDA
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="opacity-0 text-sm sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed"
        >
          {t("hero.subtitle")}{" "}
          <span className="text-foreground font-medium">Next.js</span>,{" "}
          <span className="text-foreground font-medium">React</span> {t("hero.and")}{" "}
          <span className="text-foreground font-medium">TypeScript</span>.
          <br />
          <span className="text-xs sm:text-sm opacity-70">
            {t("hero.experience")}
          </span>
        </p>

        <div ref={statsRef} className="[&>*]:opacity-0 flex flex-wrap justify-center gap-4 sm:gap-8 mb-8 sm:mb-10 text-xs sm:text-sm">
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold">4+</span>
            <span className="text-muted-foreground tracking-wider">{t("hero.years")}</span>
          </div>
          <div className="h-10 sm:h-12 w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold">50+</span>
            <span className="text-muted-foreground tracking-wider">{t("hero.projects")}</span>
          </div>
          <div className="h-10 sm:h-12 w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold">Next.js</span>
            <span className="text-muted-foreground tracking-wider">{t("hero.specialist")}</span>
          </div>
        </div>

        <div ref={socialsRef} className="[&>*]:opacity-0 flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          {animatedLinks.map((link) => (
            <Tooltip key={link.label}>
              <TooltipTrigger
                render={(
                  // biome-ignore lint/a11y/useAnchorContent: Base UI renders the visible icon children into this anchor.
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-2 sm:p-2.5 border border-border bg-card/50 text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                    aria-label={link.label}
                  />
                )}
              >
                {link.label === "Email" ? (
                  <MailIcon size={24} className="transition-transform duration-200 group-hover:scale-125" />
                ) : (
                  <UseAnimations
                    animation={link.animation}
                    size={24}
                    className="transition-transform duration-200 group-hover:scale-125"
                    strokeColor="currentColor"
                  />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{link.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {staticLinks.map((link) => (
            <Tooltip key={link.label}>
              <TooltipTrigger
                render={(
                  // biome-ignore lint/a11y/useAnchorContent: Base UI renders the visible icon children into this anchor.
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-2 sm:p-2.5 border border-border bg-card/50 text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                    aria-label={link.label}
                  />
                )}
              >
                <link.icon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-125 transition-transform duration-200" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{link.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          <PWAInstallButton variant="icon" />
        </div>

        <Button
          ref={ctaRef}
          onClick={scrollToProjects}
          variant="outline"
          className="group opacity-0 px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base tracking-wider !border !border-foreground !bg-background !text-foreground hover:!bg-foreground hover:!text-background transition-all duration-300"
        >
          {t("hero.cta")}
          <ChevronDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </Button>
      </div>

      <div className="corner-decoration absolute top-4 left-4 sm:top-8 sm:left-8 w-10 h-10 sm:w-16 sm:h-16 border-l-2 border-t-2 border-border opacity-0" />
      <div className="corner-decoration absolute top-4 right-4 sm:top-8 sm:right-8 w-10 h-10 sm:w-16 sm:h-16 border-r-2 border-t-2 border-border opacity-0" />
      <div className="corner-decoration absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-10 h-10 sm:w-16 sm:h-16 border-l-2 border-b-2 border-border opacity-0" />
      <div className="corner-decoration absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-16 sm:h-16 border-r-2 border-b-2 border-border opacity-0" />
    </section>
  )
}
