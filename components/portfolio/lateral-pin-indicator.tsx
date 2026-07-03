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
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

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

      setIsVisible(titleRect.top <= startLine && projectsRect.bottom >= endLine)

      const total = projectsRect.bottom - contentRect.top
      const current = window.innerHeight - contentRect.top
      setProgress(total > 0 ? gsap.utils.clamp(0, 1, current / total) : 0)
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

  return (
    <div
      ref={containerRef}
      className={`hidden lg:flex fixed left-6 xl:left-10 top-1/2 -translate-y-1/2 z-30 items-start gap-4 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none"
      }`}
    >
      {/* Progress line */}
      <div className="relative h-28 w-px bg-border/50 mt-1">
        <div
          className="absolute top-0 left-0 w-full bg-foreground origin-top transition-transform duration-100"
          style={{ height: "100%", transform: `scaleY(${progress})` }}
        />
      </div>

      {/* Section indicators */}
      <div className="flex flex-col gap-5">
        {sections.map((section, index) => {
          const isActive = activeIndex === index
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className="flex items-center gap-3 group text-left"
            >
              {/* Number */}
              <span
                className={`text-[10px] font-mono tracking-wider transition-all duration-300 ${
                  isActive ? "text-foreground" : "text-muted-foreground/50 group-hover:text-muted-foreground"
                }`}
              >
                {section.number}
              </span>

              {/* Line */}
              <div
                className={`h-px bg-foreground transition-all duration-300 origin-left ${
                  isActive ? "w-6" : "w-0 group-hover:w-3"
                }`}
              />

              {/* Label */}
              <span
                className={`text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                  isActive ? "text-foreground" : "text-muted-foreground/40 group-hover:text-muted-foreground"
                }`}
              >
                {t(section.labelKey as never)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
