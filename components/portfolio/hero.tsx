"use client"

import { gsap } from "gsap"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import { ChevronDown, Terminal } from "lucide-react"
import dynamic from "next/dynamic"
import Image from "next/image"
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
import { ShaderImage } from "./shader-image"

gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrambleTextPlugin)

const UseAnimations = dynamic(() => import("react-useanimations"), {
  ssr: false
})
const atAmiga = localFont({
  src: "../../app/fonts/AtAmiga-Regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap"
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

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
}

export function Hero() {
  const { t, locale } = useI18n()
  const { isLoadingComplete } = useLoading()

  const animatedLinks = [
    { animation: github, href: "https://github.com/ewzxyh", label: "GitHub" },
    {
      animation: linkedin,
      href: locale === "en-US" ? "https://linkedin.com/in/ewzxyh?locale=en_US" : "https://linkedin.com/in/ewzxyh",
      label: "LinkedIn"
    },
    {
      animation: instagram,
      href: "https://instagram.com/yoshidaenzoh",
      label: "Instagram"
    },
    { animation: mail, href: "mailto:yoshidaenzo@hotmail.com", label: "Email" }
  ]

  const staticLinks = [
    {
      icon: SiWhatsapp,
      href:
        locale === "en-US"
          ? "https://wa.me/5562984268492?text=Hello%2C%20I%20came%20from%20your%20portfolio%21"
          : "https://wa.me/5562984268492?text=Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio%21",
      label: "WhatsApp"
    }
  ]
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const terminalTextRef = useRef<HTMLSpanElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)
  const mobileYoshidaRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const title = titleRef.current
    const name = nameRef.current
    const mobileYoshida = mobileYoshidaRef.current
    if (!title || !name || !mobileYoshida) return

    const fitName = () => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        name.style.transform = "none"
        if (mobileYoshida.offsetWidth > 0) {
          mobileYoshida.style.transform = `scaleX(${title.clientWidth / mobileYoshida.offsetWidth})`
        }
        return
      }
      mobileYoshida.style.transform = "none"
      if (name.offsetWidth > 0) {
        name.style.transform = `scaleX(${title.clientWidth / name.offsetWidth})`
      }
    }

    const observer = new ResizeObserver(fitName)
    observer.observe(title)
    document.fonts.ready.then(fitName)
    fitName()

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isLoadingComplete) return

    const terminalText = t("hero.terminal")
    const ctx = gsap.context(() => {
      const stats = statsRef.current?.children || []
      const socials = socialsRef.current?.children || []
      const corners = gsap.utils.toArray<HTMLElement>(".corner-decoration")

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(portraitRef.current, { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.35 })
        .fromTo(".hero-terminal", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.22 }, "-=0.2")
        .to(
          terminalTextRef.current,
          {
            duration: 0.35,
            text: terminalText,
            ease: "none"
          },
          "-=0.1"
        )
        .fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.25 }, "-=0.2")
        .to(
          nameRef.current,
          {
            duration: 0.55,
            scrambleText: {
              text: "ENZO YOSHIDA",
              chars: "upperCase",
              speed: 0.8
            }
          },
          "-=0.15"
        )
        .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2 }, "-=0.35")
        .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.22 }, "-=0.12")
        .fromTo(stats, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.22, stagger: 0.04 }, "-=0.12")
        .fromTo(socials, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.18, stagger: 0.04 }, "-=0.1")
        .fromTo(corners, { opacity: 0 }, { opacity: 0.5, duration: 0.18, stagger: 0.02 }, "-=0.2")

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false
      })

      gsap.to(contentRef.current, {
        yPercent: 20,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
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
            scrub: true
          }
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isLoadingComplete, t])

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen h-dvh max-h-dvh items-center justify-center overflow-hidden"
    >
      <div
        ref={contentRef}
        className="relative z-10 grid h-full w-full grid-cols-12 grid-rows-[minmax(0,1fr)_auto] gap-x-4 px-6 pb-6 pt-24 text-left sm:px-10 sm:pt-28 md:pb-8 lg:gap-x-8 lg:px-16"
      >
        <div
          ref={portraitRef}
          className="relative col-span-7 col-start-1 row-start-1 hidden aspect-[3/4] w-full self-start overflow-hidden border-x border-border opacity-0 md:block md:col-span-5 md:col-start-1 md:h-[min(54dvh,32rem)] md:w-auto"
        >
          <ShaderImage
            src="/hero/enzo-yoshida-portrait.webp"
            alt="Retrato de Enzo Yoshida"
            grayscale
            position="center"
            hoverOnly
            grain={0.035}
          />
        </div>

        <div className="relative z-20 col-span-12 col-start-1 row-start-1 flex min-h-0 flex-col items-start justify-start gap-5 md:col-span-5 md:col-start-8 md:justify-center md:gap-6">
          <div className="relative aspect-square w-full overflow-hidden md:hidden">
            <Image
              src="/hero/enzo-yoshida-mobile-source.webp"
              alt="Retrato de Enzo Yoshida"
              fill
              priority
              sizes="calc(100vw - 3rem)"
              className="object-cover grayscale"
            />
          </div>

          <div className="hero-terminal hidden items-center gap-2 border border-border bg-card/50 px-4 py-2 opacity-0 backdrop-blur-sm sm:inline-flex">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span ref={terminalTextRef} className="text-xs text-muted-foreground sm:text-sm">
              {t("hero.terminal")}
            </span>
            <span className="h-4 w-2 animate-pulse bg-foreground" />
          </div>

          <div className="mt-auto flex w-full flex-col gap-5 md:contents">
            <div className="flex w-full items-center gap-3 md:w-auto">
              <Button
                ref={ctaRef}
                onClick={scrollToProjects}
                className="group h-14 flex-1 border border-foreground bg-foreground px-4 text-sm text-background opacity-0 transition-colors duration-300 hover:bg-background hover:text-foreground md:flex-none md:px-7"
              >
                {t("hero.cta")}
                <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
              </Button>
              <Button
                onClick={scrollToContact}
                variant="outline"
                className="h-14 flex-1 border-foreground bg-background px-4 text-sm text-foreground md:hidden"
              >
                {t("nav.contact")}
              </Button>
            </div>

            <p
              ref={subtitleRef}
              className="max-w-[42ch] text-base leading-relaxed text-muted-foreground opacity-0 lg:text-lg"
            >
              {t("hero.subtitle")} <span className="font-medium text-foreground">Next.js</span>,{" "}
              <span className="font-medium text-foreground">React</span> {t("hero.and")}{" "}
              <span className="font-medium text-foreground">TypeScript</span>.
              <span className="mt-3 hidden text-sm opacity-70 md:block">{t("hero.experience")}</span>
            </p>
          </div>

          <div ref={statsRef} className="hidden items-center gap-5 text-xs [&>*]:opacity-0 lg:flex xl:gap-8">
            <div>
              <span className="block text-xl font-bold xl:text-2xl">4+</span>
              <span className="text-muted-foreground">{t("hero.years")}</span>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <span className="block text-xl font-bold xl:text-2xl">50+</span>
              <span className="text-muted-foreground">{t("hero.projects")}</span>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <span className="block text-xl font-bold xl:text-2xl">Next.js</span>
              <span className="text-muted-foreground">{t("hero.specialist")}</span>
            </div>
          </div>

          <div ref={socialsRef} className="hidden flex-wrap items-center gap-3 [&>*]:opacity-0 md:flex">
            {animatedLinks.map((link) => (
              <Tooltip key={link.label}>
                <TooltipTrigger
                  render={
                    // biome-ignore lint/a11y/useAnchorContent: Base UI renders the visible icon children into this anchor.
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group border border-border bg-card/50 p-2 text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background sm:p-2.5"
                      aria-label={link.label}
                    />
                  }
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
                  render={
                    // biome-ignore lint/a11y/useAnchorContent: Base UI renders the visible icon children into this anchor.
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group border border-border bg-card/50 p-2 text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background sm:p-2.5"
                      aria-label={link.label}
                    />
                  }
                >
                  <link.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-125 sm:h-6 sm:w-6" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{link.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            <PWAInstallButton variant="icon" />
          </div>
        </div>

        <h1
          ref={titleRef}
          className="pointer-events-none relative z-30 col-span-12 col-start-1 row-start-2 self-end overflow-hidden pb-1 text-6xl font-normal leading-none text-foreground opacity-0 sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem] 2xl:text-[12rem]"
        >
          <span className="mb-3 block text-lg italic opacity-60 md:text-lg md:not-italic">{t("hero.role")}</span>
          <span className={`${atAmiga.className} animate-flicker block md:hidden`}>
            <span className="block">ENZO</span>
            <span ref={mobileYoshidaRef} className="block w-max origin-left">
              YOSHIDA
            </span>
          </span>
          <span
            ref={nameRef}
            className={`${atAmiga.className} animate-flicker hidden w-max origin-left whitespace-nowrap md:block`}
          >
            ENZO YOSHIDA
          </span>
        </h1>
      </div>

      <div className="corner-decoration absolute left-4 top-4 h-10 w-10 border-l-2 border-t-2 border-border opacity-0 sm:left-8 sm:top-8 sm:h-16 sm:w-16" />
      <div className="corner-decoration absolute right-4 top-4 h-10 w-10 border-r-2 border-t-2 border-border opacity-0 sm:right-8 sm:top-8 sm:h-16 sm:w-16" />
      <div className="corner-decoration absolute bottom-4 left-4 h-10 w-10 border-b-2 border-l-2 border-border opacity-0 sm:bottom-8 sm:left-8 sm:h-16 sm:w-16" />
      <div className="corner-decoration absolute bottom-4 right-4 h-10 w-10 border-b-2 border-r-2 border-border opacity-0 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16" />
    </section>
  )
}
