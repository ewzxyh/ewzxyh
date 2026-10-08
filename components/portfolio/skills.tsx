"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SquareAcademicCapIcon } from "@/components/ui/icons"
import { useI18n } from "@/lib/i18n"
import { type SkillCategory, skillCategories } from "@/lib/profile"
import { SectionHeading } from "./section-heading"

gsap.registerPlugin(ScrollTrigger)

function getIconUrl(iconName: string): string {
  const localIcons: Record<string, string> = {
    chatcase: "/chatcase-logo-icon.png",
    n8n: "/n8n.png",
    coolify: "/coolify-logo.svg",
    gsap: "/gsap.svg",
    webgl: "/webgl.svg",
    openai: "/openai.svg",
    claude: "/claude.svg",
    gemini: "/gemini.svg",
    // Simple Icons (CC0), in each brand's color.
    pix: "/pix.svg",
    stripe: "/stripe.svg",
    whatsapp: "/whatsapp.svg",
    meta: "/meta.svg",
    googleads: "/google-ads.svg",
  }

  if (localIcons[iconName]) {
    return localIcons[iconName]
  }

  const deviconMap: Record<string, string> = {
    react: "react/react-original.svg",
    expo: "expo/expo-original.svg",
    nextjs: "nextjs/nextjs-original.svg",
    typescript: "typescript/typescript-original.svg",
    javascript: "javascript/javascript-original.svg",
    tailwindcss: "tailwindcss/tailwindcss-original.svg",
    figma: "figma/figma-original.svg",
    threejs: "threejs/threejs-original.svg",
    nodejs: "nodejs/nodejs-original.svg",
    bun: "bun/bun-original.svg",
    // The "GO" wordmark reads better than the gopher at 18px.
    go: "go/go-original-wordmark.svg",
    php: "php/php-original.svg",
    laravel: "laravel/laravel-original.svg",
    openapi: "openapi/openapi-original.svg",
    postgresql: "postgresql/postgresql-original.svg",
    mysql: "mysql/mysql-original.svg",
    supabase: "supabase/supabase-original.svg",
    prisma: "prisma/prisma-original.svg",
    redis: "redis/redis-original.svg",
    git: "git/git-original.svg",
    docker: "docker/docker-original.svg",
    linux: "linux/linux-original.svg",
    python: "python/python-original.svg",
    githubactions: "githubactions/githubactions-original.svg",
    vercel: "vercel/vercel-original.svg",
    cloudflare: "cloudflare/cloudflare-original.svg",
    nginx: "nginx/nginx-original.svg",
    bash: "bash/bash-original.svg",
    vite: "vitejs/vitejs-original.svg",
  }

  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${deviconMap[iconName] || `${iconName}/${iconName}-original.svg`}`
}

// Logos drawn in black (or nearly black) disappear on the dark theme, so they are inverted there.
const darkLogos = new Set(["nextjs", "threejs", "expo", "vercel", "prisma", "bash"])

// One category: its technologies as tiles, and a readout under them that says how Enzo uses the one pointed at,
// focused or tapped (it replaces the old floating tooltip, which could not wrap and overflowed on small screens).
function SkillGroup({ category, index }: { category: SkillCategory; index: number }) {
  const { t } = useI18n()
  const [active, setActive] = useState<number | null>(null)
  const skill = active === null ? null : category.skills[active]

  return (
    <div className="skill-category flex flex-col border-r border-b border-border p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase sm:text-sm">{t(category.titleKey)}</h4>
        <span className="font-mono text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")} · {category.skills.length}
        </span>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2" onMouseLeave={() => setActive(null)}>
        {category.skills.map((item, itemIndex) => (
          <li key={item.name}>
            <button
              type="button"
              onMouseEnter={() => setActive(itemIndex)}
              onFocus={() => setActive(itemIndex)}
              onClick={() => setActive(itemIndex)}
              aria-pressed={active === itemIndex}
              className={`skill-badge flex items-center gap-2 border px-2.5 py-2 text-sm transition-[background-color,border-color,translate] duration-200 hover:-translate-y-0.5 ${
                active === itemIndex ? "border-foreground/50 bg-card" : "border-border bg-card/40 hover:border-foreground/30"
              }`}
            >
              <Image
                src={getIconUrl(item.icon)}
                alt=""
                width={18}
                height={18}
                className={`size-[18px] object-contain ${darkLogos.has(item.icon) ? "dark:invert" : ""}`}
                unoptimized
              />
              <span className="text-foreground">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <p aria-live="polite" className="min-h-[3.25rem] border-t border-dashed border-border pt-4 font-mono text-xs leading-relaxed text-muted-foreground">
          {skill ? (
            <>
              <span className="text-foreground">&gt; {skill.name}</span> · {t(skill.descriptionKey)}
            </>
          ) : (
            <span className="opacity-70">&gt; {t("skills.hint")}</span>
          )}
        </p>
      </div>
    </div>
  )
}

export function Skills() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      // Categories stagger animation
      const categories = categoriesRef.current?.querySelectorAll(".skill-category")
      if (categories) {
        gsap.from(categories, {
          opacity: 0,
          y: 30,
          duration: 0.5,
          stagger: 0.15,
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Badges stagger animation
      const badges = categoriesRef.current?.querySelectorAll(".skill-badge")
      if (badges) {
        gsap.from(badges, {
          opacity: 0,
          scale: 0.8,
          duration: 0.4,
          stagger: 0.02,
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="pt-16 sm:pt-24">
      <div ref={titleRef} className="mb-8 sm:mb-12">
        <SectionHeading as="h3" label={t("skills.label")} title={t("skills.title")} description={t("skills.description")} />
      </div>

      <div ref={categoriesRef} className="grid border-t border-l border-border md:grid-cols-2 xl:grid-cols-3">
        {skillCategories.map((category, index) => (
          <SkillGroup key={category.titleKey} category={category} index={index} />
        ))}

        {/* What is being learned now */}
        <div className="skill-category flex flex-col border-r border-b border-border bg-card/40 p-5 sm:p-6">
          <h4 className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase sm:text-sm">
            <span aria-hidden="true" className="size-2 bg-orange-500" />
            {t("skills.learning")}
          </h4>
          <div className="mt-5 flex items-start gap-3">
            <SquareAcademicCapIcon aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-muted-foreground" />
            <p className="text-sm leading-relaxed text-pretty sm:text-base">{t("skills.learning.desc")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
