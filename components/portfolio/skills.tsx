"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "@/lib/i18n"
import { skillCategories } from "@/lib/profile"
import { SectionHeading } from "./section-heading"
import { Heading } from "@/components/ui/heading"

gsap.registerPlugin(ScrollTrigger)

const SKILLS_SECTION_ID = "skills"

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

// Only the tools that carry most of the work, grouped as the catalog groups them (front-end, back-end, payments,
// infra). The full list stays in lib/profile.ts and in the markdown twins.
const coreSkillNames = new Set(["Next.js", "React", "TypeScript", "GSAP", "Node.js", "Go", "PostgreSQL", "Supabase", "PIX", "Stripe", "WhatsApp", "Docker"])
const groups = skillCategories
  .map((category) => ({ titleKey: category.titleKey, skills: category.skills.filter((skill) => coreSkillNames.has(skill.name)) }))
  .filter((group) => group.skills.length > 0)

export function Skills() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        x: -30,
        duration: 0.6,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      for (const group of gsap.utils.toArray<HTMLElement>(".skill-group", listRef.current)) {
        gsap.from(group.querySelectorAll(".skill-tile"), {
          opacity: 0,
          y: 16,
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: group,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id={SKILLS_SECTION_ID} className="relative z-10 border-t border-border">
      <div className="mx-auto w-full max-w-screen-2xl px-(--gutter) py-16 sm:py-24 md:py-32">
        <div ref={titleRef} className="mb-10 px-(--inset) sm:mb-14">
          <SectionHeading title={t("skills.title")} description={t("skills.description")} />
        </div>

        <div ref={listRef} className="border-t border-border">
          {groups.map((group) => (
            <div
              key={group.titleKey}
              className="skill-group grid gap-5 border-b border-border px-(--inset) py-6 sm:py-8 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-10"
            >
              <Heading size="sm">{t(group.titleKey)}</Heading>
              <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="skill-tile group flex items-start gap-3">
                    {/* Grey until pointed at, so twelve brand colors do not compete with the page. */}
                    <Image
                      src={getIconUrl(skill.icon)}
                      alt=""
                      width={28}
                      height={28}
                      className="mt-0.5 size-7 shrink-0 object-contain grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                      unoptimized
                    />
                    <div className="min-w-0">
                      <p className="font-medium">{skill.name}</p>
                      <p className="mt-1 text-sm leading-snug text-pretty text-muted-foreground">{t(skill.descriptionKey)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
