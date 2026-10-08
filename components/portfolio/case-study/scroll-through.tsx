"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { BrowserFrame } from "./frames"

gsap.registerPlugin(ScrollTrigger)

// A full-page capture inside a fixed-height browser frame. While the frame crosses the viewport, scrolling the page
// scrolls the capture from its top to its bottom (on larger screens the frame is pinned so the trip takes about a
// screen and a half). With reduced motion the frame simply scrolls on its own.
export function ScrollThrough({
  src,
  width,
  height,
  alt,
  address,
}: {
  src: string
  width: number
  height: number
  alt: string
  address?: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const frame = frameRef.current
    const image = imageRef.current
    if (!frame || !image || reducedMotion) return

    const distance = () => Math.max(0, image.offsetHeight - frame.offsetHeight)
    const mm = gsap.matchMedia()
    mm.add("(min-width: 768px)", () => {
      gsap.to(image, {
        y: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "center center",
          end: () => `+=${Math.min(distance(), window.innerHeight * 1.5)}`,
          pin: frame.parentElement,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      })
    })
    mm.add("(max-width: 767px)", () => {
      gsap.to(image, {
        y: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: frame, start: "top 80%", end: "bottom 20%", scrub: 0.5, invalidateOnRefresh: true },
      })
    })
    return () => mm.revert()
  }, [reducedMotion])

  return (
    <BrowserFrame address={address}>
      <div
        ref={frameRef}
        className={`relative h-[60svh] md:h-[72svh] ${reducedMotion ? "overflow-y-auto" : "overflow-hidden"}`}
      >
        <div ref={imageRef} className="will-change-transform">
          <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 1280px) 1200px, 100vw" className="block h-auto w-full" />
        </div>
      </div>
    </BrowserFrame>
  )
}
