"use client"

import { ArrowRightIcon, LetterIcon, WhatsappIcon } from "@/components/ui/icons"
import { useI18n } from "@/lib/i18n"
import { socialProfiles } from "@/lib/site"

const CONTACT_SECTION_ID = "contact"

export function Contact() {
  const { t, locale } = useI18n()

  const linkedinUrl = locale === "en-US" ? `${socialProfiles.linkedin}?locale=en_US` : socialProfiles.linkedin

  const whatsappMessage = locale === "en-US"
    ? "Hello%2C%20Enzo.%20I%20came%20from%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
    : "Ol%C3%A1%2C%20Enzo.%20Vim%20pelo%20seu%20portf%C3%B3lio%20e%20quero%20conversar%20sobre%20um%20projeto."

  const emailHref = locale === "en-US"
    ? "mailto:yoshidaenzo@hotmail.com?subject=Web%20product%20project"
    : "mailto:yoshidaenzo@hotmail.com?subject=Projeto%20de%20produto%20web"

  return (
    <section id={CONTACT_SECTION_ID} className="relative py-16 sm:py-24 md:py-32 border-t border-border z-10">
      <div className="w-full px-[calc(var(--gutter)+var(--inset))] text-center">
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
          href={emailHref}
          className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base tracking-wider border border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-all duration-300"
        >
          <LetterIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          {t("contact.cta")}
          <ArrowRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" />
        </a>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/5562984268492?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base tracking-wider border border-foreground bg-background text-foreground hover:bg-foreground hover:text-background transition-all duration-300 mt-4"
        >
          <WhatsappIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          WhatsApp
          <ArrowRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" />
        </a>

        {/* Alternative */}
        <p className="mt-5 sm:mt-6 text-xs sm:text-sm text-muted-foreground">
          {t("contact.alternative")}{" "}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </section>
  )
}
