"use client"

import { ArrowRightUpIcon, LetterIcon, LinkedinIcon, WhatsappIcon } from "@/components/ui/icons"
import { buttonVariants } from "@/components/ui/button-variants"
import { useI18n } from "@/lib/i18n"
import { socialProfiles } from "@/lib/site"
import { SectionHeading } from "./section-heading"
import { Heading } from "@/components/ui/heading"

const CONTACT_SECTION_ID = "contact"
const EMAIL = "yoshidaenzo@hotmail.com"

// Two doors with the same weight: someone with a project goes to WhatsApp, someone hiring goes to LinkedIn, and both
// can write an e-mail with the subject already filled in.
export function Contact() {
  const { t, locale } = useI18n()
  const en = locale === "en-US"

  const linkedinUrl = en ? `${socialProfiles.linkedin}?locale=en_US` : socialProfiles.linkedin
  const whatsappMessage = en
    ? "Hello%2C%20Enzo.%20I%20came%20from%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
    : "Ol%C3%A1%2C%20Enzo.%20Vim%20pelo%20seu%20portf%C3%B3lio%20e%20quero%20conversar%20sobre%20um%20projeto."
  const projectMail = `mailto:${EMAIL}?subject=${en ? "Web%20product%20project" : "Projeto%20de%20produto%20web"}`
  const hiringMail = `mailto:${EMAIL}?subject=${en ? "Product%20Engineer%20role" : "Vaga%20de%20Product%20Engineer"}`

  const doors = [
    {
      key: "clients",
      icon: WhatsappIcon,
      title: t("contact.clients.title"),
      description: t("contact.clients.desc"),
      action: { href: `https://wa.me/5562984268492?text=${whatsappMessage}`, label: t("contact.clients.cta") },
      email: projectMail,
    },
    {
      key: "hiring",
      icon: LinkedinIcon,
      title: t("contact.hiring.title"),
      description: t("contact.hiring.desc"),
      action: { href: linkedinUrl, label: t("contact.hiring.cta") },
      email: hiringMail,
    },
  ]

  return (
    <section id={CONTACT_SECTION_ID} className="relative z-10 border-t border-border bg-background py-16 sm:py-24 md:py-32">
      <div className="mx-auto w-full max-w-screen-2xl px-(--gutter)">
        <SectionHeading title={t("contact.title")} description={t("contact.description")} className="mb-10 px-(--inset) sm:mb-14" />

        <ul className="grid border border-border md:grid-cols-2">
          {doors.map(({ key, icon: Icon, title, description, action, email }) => (
            <li key={key} className="flex flex-col gap-6 border-b border-border p-6 last:border-b-0 sm:p-10 md:border-r md:border-b-0 md:last:border-r-0">
              <Icon aria-hidden="true" className="size-6 text-muted-foreground" />
              <div className="flex-1">
                <Heading size="lg">{title}</Heading>
                <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a href={action.href} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg" })}>
                  {action.label}
                  <ArrowRightUpIcon aria-hidden="true" strokeWidth={2} className="size-4" />
                  <span className="sr-only"> ({t("projects.newTab")})</span>
                </a>
                <a href={email} className={buttonVariants({ variant: "outline", size: "lg" })}>
                  <LetterIcon aria-hidden="true" className="size-4" />
                  {t("contact.email")}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
