"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePathname } from "next/navigation"
import { pathInLocale } from "@/lib/site"
import { useLoading } from "./portfolio/loading-context"

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const { isLoadingComplete } = useLoading()

  useEffect(() => {
    // Smoothed wheel scrolling is motion the user can opt out of.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    })
    // The page must not scroll underneath the loader; it is released when the loader is gone.
    lenis.stop()
    lenisRef.current = lenis

    lenis.on("scroll", ScrollTrigger.update)

    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isLoadingComplete) lenisRef.current?.start()
  }, [isLoadingComplete])

  // A client navigation (home ↔ a project page) starts the new page at the top, without Lenis easing over from the
  // previous position. Switching language also changes the pathname (it rewrites the address in place), but it must
  // keep the scroll position, so routes are compared in a single language.
  const pathname = usePathname()
  const route = pathInLocale(pathname, "pt-BR") ?? pathname
  const previousRoute = useRef(route)
  useEffect(() => {
    if (previousRoute.current === route) return
    previousRoute.current = route
    lenisRef.current?.scrollTo(0, { immediate: true, force: true })
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [route])

  return <>{children}</>
}
