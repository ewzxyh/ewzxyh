"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight } from "lucide-react"
import UseAnimations from "react-useanimations"
import github from "react-useanimations/lib/github"
import linkedin from "react-useanimations/lib/linkedin"
import mail from "react-useanimations/lib/mail"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import { SiWhatsapp } from "react-icons/si"
import { useI18n } from "@/lib/i18n"

gsap.registerPlugin(ScrollTrigger)

const SVG_PATHS = {
  curved: "M0 80 Q 50 160 100 80 L 100 100 L 0 100 Z",
  flat: "M0 80 Q 50 80 100 80 L 100 100 L 0 100 Z",
}

function MailIcon({ size, className }: { size: number; className?: string }) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  return (
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

export function CTAFooter() {
  const { t, locale } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const currentYear = new Date().getFullYear()

  const linkedinUrl = locale === "en-US"
    ? "https://linkedin.com/in/ewzxyh?locale=en_US"
    : "https://linkedin.com/in/ewzxyh"

  const whatsappMessage = locale === "en-US"
    ? "Hello%2C%20I%20came%20from%20your%20portfolio%21"
    : "Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio%21"

  useEffect(() => {
    if (!sectionRef.current || !pathRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(pathRef.current, {
        attr: { d: SVG_PATHS.curved }
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        onEnter: (self) => {
          const velocity = Math.abs(self.getVelocity())
          const variation = Math.min(velocity / 5000, 0.5)

          gsap.to(pathRef.current, {
            attr: { d: SVG_PATHS.flat },
            duration: 1.5 + variation,
            ease: `elastic.out(${1 + variation}, ${0.4 - variation * 0.2})`,
            overwrite: true,
          })
        },
        onLeaveBack: () => {
          gsap.to(pathRef.current, {
            attr: { d: SVG_PATHS.curved },
            duration: 0.5,
            ease: "power2.out",
            overwrite: true,
          })
        },
      })

      gsap.from(contentRef.current?.querySelectorAll(".animate-item") || [], {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative z-10">
      {/* Bouncy SVG Curve */}
      <div className="absolute top-0 left-0 right-0 h-20 -translate-y-full overflow-visible pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-20"
          style={{ transform: "translateY(1px)" }}
        >
          <defs>
            <linearGradient id="footer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="[stop-color:var(--foreground)]" stopOpacity="0.03" />
              <stop offset="100%" className="[stop-color:var(--foreground)]" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path
            ref={pathRef}
            d={SVG_PATHS.curved}
            fill="url(#footer-gradient)"
            className="transition-none"
          />
        </svg>
      </div>

      {/* CTA + Footer Content */}
      <div
        ref={contentRef}
        className="relative bg-gradient-to-b from-foreground/[0.03] to-foreground/[0.08]"
      >
        {/* Border Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* CTA Section */}
        <div className="py-16 sm:py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="animate-item text-xs sm:text-sm text-muted-foreground tracking-[0.2em] sm:tracking-[0.3em] mb-2 block">
              {t("contact.section")}
            </span>
            <h2 className="animate-item text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 sm:mb-6">
              {t("contact.title")}
            </h2>
            <p className="animate-item text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10">
              {t("contact.description")}
            </p>

            {/* CTAs */}
            <div className="animate-item flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:yoshidaenzo@hotmail.com"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base tracking-wider border border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-all duration-300"
              >
                <MailIcon size={20} className="mr-2" />
                {t("contact.cta")}
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href={`https://wa.me/5562984268492?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base tracking-wider border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <SiWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
                WhatsApp
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>

            {/* Alternative */}
            <p className="animate-item mt-5 sm:mt-6 text-xs sm:text-sm text-muted-foreground">
              {t("contact.alternative")}{" "}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline underline-offset-4 transition-all duration-300"
              >
                LinkedIn
              </a>
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="border-t border-border/50 py-6 sm:py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              {/* Logo/Name */}
              <div className="animate-item flex items-center gap-2 group cursor-default">
                <span className="text-xs sm:text-sm font-medium tracking-wider transition-all duration-300 group-hover:tracking-widest">
                  EWZXYH_LAB
                </span>
              </div>

              {/* Copyright */}
              <p className="animate-item text-xs sm:text-sm text-muted-foreground text-center">
                {currentYear} Enzo Yoshida. {t("footer.rights")}
              </p>

              {/* Social Links */}
              <div className="animate-item flex items-center gap-2 sm:gap-3">
                <a
                  href="https://github.com/ewzxyh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  aria-label="GitHub"
                >
                  <UseAnimations
                    animation={github}
                    size={20}
                    strokeColor="currentColor"
                  />
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <UseAnimations
                    animation={linkedin}
                    size={20}
                    strokeColor="currentColor"
                  />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  )
}
