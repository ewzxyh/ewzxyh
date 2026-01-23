"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { User, Briefcase, FolderKanban, Mail, type LucideIcon } from "lucide-react"
import UseAnimations from "react-useanimations"
import menu2 from "react-useanimations/lib/menu2"
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
  const menuRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const isHiddenRef = useRef(false)
  const hasAnimatedRef = useRef(false)
  const { isAlmostComplete } = useLoading()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = useCallback((sectionId: string) => {
    setIsMenuOpen(false)

    setTimeout(() => {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: `#${sectionId}`, offsetY: 80 },
        ease: "power3.inOut",
      })
    }, 300)
  }, [])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  // Animate menu open/close
  useEffect(() => {
    const menu = menuRef.current
    const items = navItemsRef.current.filter(Boolean)

    if (!menu) return

    if (isMenuOpen) {
      gsap.to(menu, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      })

      gsap.fromTo(items,
        {
          opacity: 0,
          y: -20,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.1,
        }
      )
    } else {
      gsap.to(items, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        stagger: 0.03,
        ease: "power2.in",
      })

      gsap.to(menu, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        delay: 0.1,
      })
    }
  }, [isMenuOpen])

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
      if (isHiddenRef.current || isMenuOpen) return
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
  }, [isMenuOpen])

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-40 px-2 sm:px-4 md:px-6 pt-2 sm:pt-3 md:pt-4 opacity-0 -translate-y-4"
    >
      <div className="max-w-[calc(100%-16px)] sm:max-w-4xl mx-auto bg-background/80 backdrop-blur-md border border-border/50 overflow-hidden">
        {/* Main header bar */}
        <div className="px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 flex items-center justify-between gap-2">
          <a href="#" className="block flex-shrink-0">
            <Logo className="h-6 sm:h-6 md:h-8 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
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

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Open to Work Badge - Desktop only */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-2 border border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase">
                {t("nav.openToWork" as any)}
              </span>
            </div>

            <ThemeToggle />
            <LanguageToggle />

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={toggleMenu}
              className="md:hidden flex items-center justify-center px-1.5 py-1.5 flex-shrink-0 border border-border bg-background"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <UseAnimations
                animation={menu2}
                size={16}
                reverse={isMenuOpen}
                strokeColor="currentColor"
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          ref={menuRef}
          className="md:hidden overflow-hidden border-t border-border/50"
          style={{ height: 0, opacity: 0 }}
        >
          <nav className="px-3 py-4 flex flex-col">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                ref={(el) => { navItemsRef.current[index] = el }}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`group relative w-full text-left py-3 sm:py-4 overflow-hidden transition-all duration-300 hover:pl-4 active:scale-[0.98] ${index < navItems.length - 1 ? "border-b border-border/30" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-muted-foreground">
                    {t(item.labelKey as any)}
                  </span>
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110" />
                </div>

                {/* Hover line indicator */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full" />
              </button>
            ))}

            {/* Mobile Open to Work Badge */}
            <div className="lg:hidden flex items-center gap-2 pt-3 border-t border-border/30">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {t("nav.openToWork" as any)}
              </span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
