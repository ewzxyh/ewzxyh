"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { User, Briefcase, FolderKanban, Mail, type LucideIcon } from "lucide-react"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { useLoading } from "./loading-context"
import { useI18n } from "@/lib/i18n"

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

interface NavItemConfig {
  id: string
  icon: LucideIcon
  labelKey: string
}

const navItems: NavItemConfig[] = [
  { id: "about-content", icon: User, labelKey: "nav.about" },
  { id: "experience", icon: Briefcase, labelKey: "nav.experience" },
  { id: "projects", icon: FolderKanban, labelKey: "nav.projects" },
  { id: "contact", icon: Mail, labelKey: "nav.contact" },
]

export function Header() {
  const { t } = useI18n()
  const headerRef = useRef<HTMLElement>(null)
  const isHiddenRef = useRef(false)
  const hasAnimatedRef = useRef(false)
  const { isAlmostComplete } = useLoading()

  const scrollToSection = (sectionId: string) => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: `#${sectionId}`, offsetY: 80 },
      ease: "power3.inOut",
    })
  }

  useEffect(() => {
    if (!isAlmostComplete || hasAnimatedRef.current) return
    hasAnimatedRef.current = true

    const header = headerRef.current
    if (!header) return

    gsap.to(header, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    })
  }, [isAlmostComplete])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const showHeader = () => {
      if (!isHiddenRef.current) return
      isHiddenRef.current = false
      gsap.to(header, {
        yPercent: 0,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const hideHeader = () => {
      if (isHiddenRef.current) return
      isHiddenRef.current = true
      gsap.to(header, {
        yPercent: -100,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const trigger = ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (self.scroll() < 100) {
          showHeader()
          return
        }

        if (self.direction === 1) {
          hideHeader()
        } else {
          showHeader()
        }
      },
    })

    return () => {
      trigger.kill()
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 pt-3 sm:pt-4 opacity-0 -translate-y-4"
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-5 py-1.5 bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-between">
        <a href="#" className="block">
          <Logo className="h-7 sm:h-8 w-auto" animate />
        </a>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="group flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <item.icon className="w-4 h-4" />
              <span className="tracking-wide">{t(item.labelKey as any)}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Open to Work Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-2 border border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[10px] font-medium tracking-wide uppercase">
              {t("nav.openToWork" as any)}
            </span>
          </div>

          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
