"use client"

import { Boxes, Gauge, Workflow } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const services = [
  { icon: Boxes, title: "services.products", description: "services.products.desc" },
  { icon: Gauge, title: "services.systems", description: "services.systems.desc" },
  { icon: Workflow, title: "services.automation", description: "services.automation.desc" },
] as const

export function Services() {
  const { t } = useI18n()

  return (
    <section className="relative z-10 border-y border-border">
      <div className="w-full px-[clamp(1.25rem,3vw,4rem)]">
        <div className="grid lg:grid-cols-[1.05fr_1.95fr]">
          <div className="border-b border-border bg-card px-6 py-12 sm:px-8 sm:py-16 lg:border-b-0 lg:border-r lg:px-10 lg:py-20">
            <span className="mb-3 block text-xs tracking-[0.2em] text-muted-foreground sm:text-sm sm:tracking-[0.3em]">
              {t("services.eyebrow")}
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("services.title")}</h2>
            <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("services.description")}
            </p>
          </div>

          <div className="grid sm:grid-cols-3">
            {services.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="border-b border-border px-0 py-10 last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:py-16 sm:last:border-r-0 lg:px-8 lg:py-20"
              >
                <Icon className="mb-8 size-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-lg font-medium">{t(title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(description)}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
