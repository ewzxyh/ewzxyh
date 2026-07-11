"use client"

import { Github, Linkedin, Mail } from "lucide-react"
import localFont from "next/font/local"
import { SiWhatsapp } from "react-icons/si"
import { useI18n } from "@/lib/i18n"
import { useMounted } from "@/hooks/use-mounted"

const atAmiga = localFont({
  src: "../../app/fonts/AtAmiga-Regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
})

export function Footer() {
  const { t, locale } = useI18n()
  const mounted = useMounted()
  const currentYear = mounted ? new Date().getFullYear() : 2026

  const socialLinks = [
    { icon: Github, href: "https://github.com/ewzxyh", label: "GitHub" },
    { icon: Linkedin, href: locale === "en-US" ? "https://linkedin.com/in/ewzxyh?locale=en_US" : "https://linkedin.com/in/ewzxyh", label: "LinkedIn" },
    { icon: Mail, href: "mailto:yoshidaenzo@hotmail.com", label: "Email" },
    { icon: SiWhatsapp, href: locale === "en-US" ? "https://wa.me/5562984268492?text=Hello%2C%20I%20came%20from%20your%20portfolio%21" : "https://wa.me/5562984268492?text=Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio%21", label: "WhatsApp" },
  ]

  return (
    <footer className="border-t border-border py-6 sm:py-8 z-10 relative">
      <div className="w-full px-[clamp(1.25rem,3vw,4rem)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6">
          {/* Logo/Name */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium tracking-wider">EWZXYH_LABS</span>
          </div>

          {/* Copyright */}
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            {currentYear} Ewzxyh Labs. {t("footer.rights")}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={link.label}
              >
                <link.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            ))}
          </div>
        </div>
        <div className={`${atAmiga.className} relative mt-8 sm:mt-10 grid grid-cols-4 border-t border-b border-border/70 pointer-events-none select-none`} aria-hidden="true">
          <span className="absolute left-4 top-4 size-2.5 bg-orange-500 sm:size-3" />
          <span className="absolute right-4 top-4 size-2.5 bg-orange-500 sm:size-3" />
          <span className="absolute left-4 bottom-4 size-2.5 bg-orange-500 sm:size-3" />
          <span className="absolute right-4 bottom-4 size-2.5 bg-orange-500 sm:size-3" />
          {"LABS".split("").map((letter) => (
            <div key={letter} className="flex aspect-square items-center justify-center border-l border-border/70 p-[clamp(0.35rem,1.1vw,1.25rem)] first:border-l-0">
              <span className="text-[clamp(6rem,24vw,28rem)] leading-none text-foreground">
                {letter}
              </span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
