"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "@/lib/i18n"
import { skillCategories, type Skill } from "@/lib/profile"

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

function SkillBadge({ skill }: { skill: Skill }) {
  const { t } = useI18n()

  return (
    <div
      className="skill-badge group relative flex items-center gap-2 px-3 py-2 border border-border bg-card/50 hover:bg-card hover:border-foreground/20 hover:-translate-y-0.5 hover:scale-105 transition-[background-color,border-color,translate,scale] duration-200 ease-out cursor-default"
    >
      <Image
        src={getIconUrl(skill.icon)}
        alt={skill.name}
        width={18}
        height={18}
        className="w-[18px] h-[18px] object-contain"
        unoptimized
      />
      <span className="text-sm text-foreground">{skill.name}</span>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
        {t(skill.descriptionKey)}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
      </div>
    </div>
  )
}

export function Skills() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
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
          stagger: 0.03,
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
    <div ref={sectionRef} className="pt-10 sm:pt-16 max-w-3xl mx-auto">
      <h3
        ref={titleRef}
        className="text-lg sm:text-xl font-bold tracking-tight mb-6 sm:mb-8"
      >
        {t("skills.title")}
      </h3>

      <div ref={categoriesRef} className="space-y-6 sm:space-y-8">
        {skillCategories.map((category) => (
          <div key={category.titleKey} className="skill-category">
            <h4 className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wider uppercase mb-3 sm:mb-4">
              {t(category.titleKey)}
            </h4>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {category.skills.map((skill) => (
                <SkillBadge key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
