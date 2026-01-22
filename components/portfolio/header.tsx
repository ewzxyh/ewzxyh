"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { useLoading } from "./loading-context"

gsap.registerPlugin(ScrollTrigger)

export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const isHiddenRef = useRef(false)
  const hasAnimatedRef = useRef(false)
  const { isAlmostComplete } = useLoading()

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
      className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 sm:py-4 opacity-0 -translate-y-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="#" className="block">
          <Logo className="h-6 sm:h-8 w-auto" animate />
        </a>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
