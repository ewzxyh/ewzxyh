"use client"

import { Github, Linkedin, Mail } from "lucide-react"
import { SiWhatsapp } from "react-icons/si"
import { useI18n } from "@/lib/i18n"

export function Footer() {
  const { t, locale } = useI18n()
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Github, href: "https://github.com/ewzxyh", label: "GitHub" },
    { icon: Linkedin, href: locale === "en-US" ? "https://linkedin.com/in/ewzxyh?locale=en_US" : "https://linkedin.com/in/ewzxyh", label: "LinkedIn" },
    { icon: Mail, href: "mailto:yoshidaenzo@hotmail.com", label: "Email" },
    { icon: SiWhatsapp, href: locale === "en-US" ? "https://wa.me/5562984268492?text=Hello%2C%20I%20came%20from%20your%20portfolio%21" : "https://wa.me/5562984268492?text=Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio%21", label: "WhatsApp" },
  ]

  return (
    <footer className="border-t border-border py-6 sm:py-8 bg-background z-10 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Logo/Name */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium tracking-wider">EWZXYH_LAB</span>
          </div>

          {/* Copyright */}
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            {currentYear} Enzo Yoshida. {t("footer.rights")}
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
      </div>
    </footer>
  )
}
