"use client"

import { gsap } from "gsap"
import { Flip } from "gsap/dist/Flip"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
import { useI18n } from "@/lib/i18n"
import { CanvasParticles } from "./canvas-particles"
import { ScrollFillLogo } from "./scroll-fill-logo"
import { ShaderImage } from "./shader-image"

gsap.registerPlugin(ScrollTrigger, Flip)

// `position` is the vertical focus in CSS object-position terms (0% = top of the image).
const localImagesByLocale = {
  "pt-BR": [
    { src: "/gallery/ewzxyh (1).webp", alt: "Interface de produto web por Enzo Yoshida", position: "45%" },
    { src: "/gallery/ewzxyh (3).webp", alt: "Dashboard SaaS desenvolvido por Enzo Yoshida", position: "45%" },
    { src: "", alt: "Animação do logotipo Enzo Yoshida", position: "center" },
    { src: "/gallery/ewzxyh (6).webp", alt: "Tela de automação para operação digital", position: "72%" },
    { src: "/gallery/ewzxyh (5).webp", alt: "Aplicação web com foco em conversão e gestão", position: "center" },
    { src: "/gallery/ewzxyh (4).webp", alt: "Experiência de usuário para produto digital", position: "center" },
    { src: "/gallery/ewzxyh (8).webp", alt: "Sistema web responsivo criado por Enzo Yoshida", position: "88%" },
    { src: "/gallery/ewzxyh (2).webp", alt: "Interface administrativa para produto SaaS", position: "28%" },
  ],
  "en-US": [
    { src: "/gallery/ewzxyh (1).webp", alt: "Web product interface by Enzo Yoshida", position: "45%" },
    { src: "/gallery/ewzxyh (3).webp", alt: "SaaS dashboard developed by Enzo Yoshida", position: "45%" },
    { src: "", alt: "Enzo Yoshida logo animation", position: "center" },
    { src: "/gallery/ewzxyh (6).webp", alt: "Automation screen for digital operations", position: "72%" },
    { src: "/gallery/ewzxyh (5).webp", alt: "Web application focused on conversion and management", position: "center" },
    { src: "/gallery/ewzxyh (4).webp", alt: "User experience for a digital product", position: "center" },
    { src: "/gallery/ewzxyh (8).webp", alt: "Responsive web system created by Enzo Yoshida", position: "88%" },
    { src: "/gallery/ewzxyh (2).webp", alt: "Administrative interface for a SaaS product", position: "28%" },
  ],
} as const

export function BentoGallery() {
  const { locale } = useI18n()
  const wrapRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let flipCtx: gsap.Context | null = null

    function createFlipAnimation() {
      const galleryElement = galleryRef.current
      if (!galleryElement) return

      const galleryItems = galleryElement.querySelectorAll(".bento-item")

      flipCtx?.revert()
      // A reverted Flip stays attached to its elements (`_flip`). Left there, the next Flip.getState() "finishes" it
      // and re-applies its old final layout, so the new animation would start from the previous viewport's size.
      for (const item of galleryItems) {
        delete (item as Element & { _flip?: unknown })._flip
      }
      gsap.set(galleryItems, { clearProps: "all" })
      galleryElement.classList.remove("bento-final")

      flipCtx = gsap.context(() => {
        galleryElement.classList.add("bento-final")
        const flipState = Flip.getState(galleryItems)
        galleryElement.classList.remove("bento-final")

        const flip = Flip.to(flipState, {
          simple: true,
          ease: "expoScale(1, 5)",
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: galleryElement,
            start: "center center",
            end: "+=100%",
            scrub: true,
            pin: wrapRef.current,
          },
        })

        tl.add(flip)

        return () => gsap.set(galleryItems, { clearProps: "all" })
      })
    }

    createFlipAnimation()

    // The final Flip state depends on the viewport size, so rebuild it when the size really changes.
    // Touch browsers fire resize while the URL bar collapses (height only): the layout is still valid.
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches
    let lastWidth = window.innerWidth
    let lastHeight = window.innerHeight
    let resizeTimeout: number | undefined

    const handleResize = () => {
      const widthChanged = window.innerWidth !== lastWidth
      const heightChanged = !coarsePointer && window.innerHeight !== lastHeight
      if (!widthChanged && !heightChanged) return

      lastWidth = window.innerWidth
      lastHeight = window.innerHeight
      window.clearTimeout(resizeTimeout)
      resizeTimeout = window.setTimeout(() => {
        createFlipAnimation()
        ScrollTrigger.refresh()
      }, 250)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.clearTimeout(resizeTimeout)
      window.removeEventListener("resize", handleResize)
      flipCtx?.revert()
    }
  }, [])

  return (
    <div ref={wrapRef} className="bento-wrap relative z-[60] bg-background">
      <div ref={galleryRef} className="bento-gallery">
        {localImagesByLocale[locale].map((image, index) => (
          <div key={image.src || "particles"} className="bento-item">
            {index === 2 ? (
              <div className="relative w-full h-full">
                <CanvasParticles />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScrollFillLogo />
                </div>
              </div>
            ) : (
              <ShaderImage src={image.src} alt={image.alt} position={image.position} grayscale />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
