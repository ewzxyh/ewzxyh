"use client"

import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect } from "react"
import { useLoading } from "./loading-context"

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// Arriving at the home page with a section in the address (/#projects, from a project page's menu) scrolls there once
// the page is revealed. The browser's own jump happens too early: the pinned hero and the scroll-driven sections only
// get their final positions after GSAP measures them.
export function HashScroll() {
  const { isRevealing } = useLoading()

  useEffect(() => {
    if (!isRevealing) return
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return

    let frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      frame = requestAnimationFrame(() => {
        if (!document.getElementById(id)) return
        gsap.to(window, { duration: 0.9, scrollTo: { y: `#${CSS.escape(id)}`, offsetY: 80 }, ease: "power3.inOut" })
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [isRevealing])

  return null
}
