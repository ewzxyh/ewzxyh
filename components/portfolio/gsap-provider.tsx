"use client"

import { useEffect, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function GsapProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Refresh ScrollTrigger on resize
    const handleResize = () => ScrollTrigger.refresh()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return <>{children}</>
}
