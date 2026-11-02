"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { CaseIcon, FolderKanbanIcon, LetterIcon, UserIcon, type Icon } from "@/components/ui/icons"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Logo } from "./logo"
import { LanguageToggle } from "./language-toggle"
import { MotionToggle } from "./motion-toggle"
import { useLoading } from "./loading-context"
import { useI18n, type TranslationKey } from "@/lib/i18n"
import { isHomePath, localePaths } from "@/lib/site"

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

interface NavItemConfig {
  id: string
  icon: Icon
  labelKey: TranslationKey
}

const navItems: NavItemConfig[] = [
  { id: "projects", icon: FolderKanbanIcon, labelKey: "nav.projects" },
  { id: "about-content", icon: UserIcon, labelKey: "nav.about" },
  { id: "experience", icon: CaseIcon, labelKey: "nav.experience" },
  { id: "contact", icon: LetterIcon, labelKey: "nav.contact" },
]

export function Header() {
  const { t, locale, isTransitioning } = useI18n()
  // On the home page the menu scrolls to its sections; elsewhere (project pages) it links to them.
  const onHome = isHomePath(usePathname())
  const homeHref = localePaths[locale]
  const sectionHref = (id: string) => (onHome ? `#${id}` : `${homeHref}#${id}`)
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!onHome) {
      setIsMenuOpen(false)
      return
    }
    event.preventDefault()
    scrollToSection(id)
  }
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const isHiddenRef = useRef(false)
  const hasAnimatedRef = useRef(false)
  const { isRevealing } = useLoading()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false)

    setTimeout(() => {
      window.history.pushState(null, "", `#${sectionId}`)
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: `#${sectionId}`, offsetY: 80 },
        ease: "power3.inOut",
      })
    }, 300)
  }

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

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
    if (!isRevealing || hasAnimatedRef.current) return
    hasAnimatedRef.current = true

    const header = headerRef.current
    if (!header) return

    gsap.fromTo(header, {
      opacity: 0,
      y: -16,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
    })
  }, [isRevealing])

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
      if (isMenuOpen) return // Keep header visible when menu is open

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

    // A hidden header comes back when the keyboard reaches one of its links (WCAG 2.4.11).
    header.addEventListener("focusin", showHeader)

    return () => {
      header.removeEventListener("focusin", showHeader)
      trigger.kill()
    }
  }, [isMenuOpen])

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-40 opacity-0 px-(--gutter) pt-2 sm:pt-3 md:pt-4"
    >
      <div className="relative w-full overflow-hidden border border-border bg-card/50 backdrop-blur-md">
        {/* Overlay during language transition */}
        {isTransitioning && (
          <div className="absolute inset-0 bg-card/50 backdrop-blur-md z-10 pointer-events-none" />
        )}

        {/* Main header bar */}
        <div className="px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 flex items-center justify-between gap-2">
          <Link
            href={homeHref}
            className="block flex-shrink-0"
            aria-label={locale === "en-US" ? "Enzo Yoshida - home page" : "Enzo Yoshida - página inicial"}
          >
            <Logo className="h-6 sm:h-6 md:h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label={t("nav.main")} className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={sectionHref(item.id)}
                onClick={(event) => handleNavClick(event, item.id)}
                className="group flex items-center gap-2 px-2.5 py-2 text-sm text-muted-foreground xl:px-3.5 hover:text-foreground transition-colors duration-200"
              >
                <item.icon className="size-4" />
                <span className="tracking-wide">{t(item.labelKey)}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Open to Work Badge - Desktop only, as tall as the square buttons next to it */}
            <div className="hidden lg:flex h-10 items-center gap-2 px-3 border border-green-500/30 bg-green-500/10 text-green-800">
              <span className="relative flex h-2.5 w-2.5">
                {/* ai-design-check-ignore-next-line pulse-for-live-only -- availability is a live status */}
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm font-medium">
                {t("nav.openToWork")}
              </span>
            </div>

            <MotionToggle />
            <LanguageToggle />

            {/* Mobile Menu Toggle */}
            <Button
              variant="quiet"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden"
              aria-label={isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span aria-hidden="true" className="relative block h-3.5 w-5">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-full bg-current transition-transform duration-300 ${
                    isMenuOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-0.5 w-full bg-current transition-opacity duration-200 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-3 h-0.5 w-full bg-current transition-transform duration-300 ${
                    isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {/* Closed, the menu is inert: its links can not take the keyboard focus while they are invisible. */}
        <div
          ref={menuRef}
          id="mobile-menu"
          inert={!isMenuOpen}
          className="md:hidden overflow-hidden border-t border-border/50"
          style={{ height: 0, opacity: 0 }}
        >
          <nav aria-label={t("nav.mobile")} className="px-3 py-4 flex flex-col">
            {navItems.map((item, index) => (
              <Link
                key={item.id}
                ref={(el) => { navItemsRef.current[index] = el }}
                href={sectionHref(item.id)}
                onClick={(event) => handleNavClick(event, item.id)}
                className={`group relative block w-full text-left py-4 overflow-hidden transition-transform duration-200 ease-ui active:scale-98 ${index < navItems.length - 1 ? "border-b border-border/30" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground transition-[color,translate] duration-200 ease-ui group-hover:translate-x-2 group-hover:text-muted-foreground">
                    {t(item.labelKey)}
                  </span>
                  <item.icon className="size-5 sm:size-6 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
                </div>

                {/* Hover line indicator */}
                <div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-foreground transition-transform duration-300 ease-ui group-hover:scale-x-100" />
              </Link>
            ))}

            {/* Mobile Open to Work Badge */}
            <div className="lg:hidden flex items-center gap-2 pt-3">
              <span className="relative flex h-2.5 w-2.5">
                {/* ai-design-check-ignore-next-line pulse-for-live-only -- availability is a live status */}
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-green-800">
                {t("nav.openToWork")}
              </span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
