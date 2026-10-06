"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "@/lib/i18n"

gsap.registerPlugin(ScrollTrigger)

interface Section {
  id: string
  labelKey: string
  number: string
}

const sections: Section[] = [
  { id: "about-content", labelKey: "nav.about", number: "01" },
  { id: "experience", labelKey: "nav.experience", number: "02" },
  { id: "projects", labelKey: "nav.projects", number: "03" },
]

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (!element) return

  gsap.to(window, {
    duration: 1,
    scrollTo: { y: element, offsetY: 100 },
    ease: "power3.inOut",
  })
}

export function LateralPinIndicator() {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let frame = 0
    let visible = false

    // Scroll progress is written straight to the DOM: no React render per scroll frame.
    function updateVisibility() {
      frame = 0

      const aboutTitle = document.querySelector("#about-content h2")
      const aboutContent = document.getElementById("about-content")
      const projects = document.getElementById("projects")
      if (!aboutTitle || !aboutContent || !projects) return

      const titleRect = aboutTitle.getBoundingClientRect()
      const contentRect = aboutContent.getBoundingClientRect()
      const projectsRect = projects.getBoundingClientRect()
      const startLine = window.innerHeight * 0.5
      const endLine = window.innerHeight * 0.4

      const nextVisible = titleRect.top <= startLine && projectsRect.bottom >= endLine
      if (nextVisible !== visible) {
        visible = nextVisible
        setIsVisible(nextVisible)
      }

      const total = projectsRect.bottom - contentRect.top
      const current = window.innerHeight - contentRect.top
      const progress = total > 0 ? gsap.utils.clamp(0, 1, current / total) : 0
      if (progressRef.current) progressRef.current.style.transform = `scaleY(${progress})`
    }

    function requestUpdate() {
      if (frame) return
      frame = window.requestAnimationFrame(updateVisibility)
    }

    updateVisibility()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)

    const ctx = gsap.context(() => {
      // Individual section triggers
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: `#${section.id}`,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        })
      })
    })

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      ctx.revert()
    }
  }, [])

  // The strip is exactly as wide as the page gutter (the same clamp the frame line and the section padding use), so
  // the rail and the numbers live in the margin and never sit on top of the content. The strip itself ignores the
  // pointer and only the buttons take it; the section name shows up on hover or keyboard focus.
  return (
    <div
      ref={containerRef}
      inert={!isVisible}
      className={`pointer-events-none fixed inset-y-0 left-0 z-30 hidden items-center justify-center transition-[opacity,translate] duration-500 lg:flex ${
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
      }`}
      style={{ width: "clamp(1.25rem, 3vw, 4rem)" }}
    >
      <div className="flex items-stretch">
        {/* Progress line */}
        <div className="relative w-px bg-border/50">
          <div
            ref={progressRef}
            className="absolute inset-0 origin-top bg-foreground transition-transform duration-100"
            style={{ transform: "scaleY(0)" }}
          />
        </div>

        {/* Section indicators */}
        <div className="flex flex-col gap-1">
          {sections.map((section, index) => {
            const isActive = activeIndex === index
            const label = t(section.labelKey as never)
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                aria-label={label}
                aria-current={isActive ? "location" : undefined}
                className="group pointer-events-auto relative flex h-7 items-center pr-1 pl-1.5 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground/60"
              >
                {/* Tick joining the rail to the number */}
                <span
                  aria-hidden="true"
                  className={`absolute top-1/2 left-0 h-px bg-foreground transition-[width] duration-300 ${
                    isActive ? "w-1.5" : "w-0 group-hover:w-1 group-focus-visible:w-1"
                  }`}
                />

                {/* Number */}
                <span
                  className={`font-mono text-xs tracking-wider transition-colors duration-300 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground/50 group-hover:text-foreground group-focus-visible:text-foreground"
                  }`}
                >
                  {section.number}
                </span>

                {/* Name, only while hovered or focused */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-full ml-2 -translate-x-1 -translate-y-1/2 whitespace-nowrap rounded-sm border border-border bg-background/95 px-2 py-1 font-medium text-[13px] text-foreground uppercase tracking-wider opacity-0 shadow-sm transition-[opacity,translate] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
