"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ParallaxOptions {
  speed?: number
  direction?: "up" | "down"
}

export function useParallax<T extends HTMLElement>({ speed = 0.5, direction = "up" }: ParallaxOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const yPercent = direction === "up" ? -100 * speed : 100 * speed

    gsap.to(element, {
      yPercent,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === element) t.kill()
      })
    }
  }, [speed, direction])

  return ref
}

interface FadeInOptions {
  delay?: number
  duration?: number
  y?: number
  stagger?: number
}

export function useFadeIn<T extends HTMLElement>({ delay = 0, duration = 0.8, y = 50, stagger = 0.1 }: FadeInOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const children = element.children.length > 0 ? element.children : [element]

    gsap.fromTo(
      children,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === element) t.kill()
      })
    }
  }, [delay, duration, y, stagger])

  return ref
}
