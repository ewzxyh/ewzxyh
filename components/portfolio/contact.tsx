"use client"

import { Mail, ArrowRight } from "lucide-react"
import { SiWhatsapp } from "react-icons/si"
import { useI18n } from "@/lib/i18n"

export function Contact() {
  const { t, locale } = useI18n()

  const linkedinUrl = locale === "en-US"
    ? "https://linkedin.com/in/ewzxyh?locale=en_US"
    : "https://linkedin.com/in/ewzxyh"

  const whatsappMessage = locale === "en-US"
    ? "Hello%2C%20I%20came%20from%20your%20portfolio%21"
    : "Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio%21"

  return (
    <section id="contact" className="relative py-16 sm:py-24 md:py-32 border-t border-border z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Section Header */}
        <span className="text-xs sm:text-sm text-muted-foreground tracking-[0.2em] sm:tracking-[0.3em] mb-2 block">
          {t("contact.section")}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 sm:mb-6">
          {t("contact.title")}
        </h2>
        <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10">
          {t("contact.description")}
        </p>

        {/* CTA */}
        <a
          href="mailto:yoshidaenzo@hotmail.com"
          className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base tracking-wider border border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-all duration-300"
        >
          <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          {t("contact.cta")}
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" />
        </a>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/5562984268492?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base tracking-wider border border-foreground bg-background text-foreground hover:bg-foreground hover:text-background transition-all duration-300 mt-4"
        >
          <SiWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          WhatsApp
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" />
        </a>

        {/* Alternative */}
        <p className="mt-5 sm:mt-6 text-xs sm:text-sm text-muted-foreground">
          {t("contact.alternative")}{" "}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline underline-offset-4"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </section>
  )
}
