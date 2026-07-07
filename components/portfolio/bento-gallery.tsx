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

const localImagesByLocale = {
  "pt-BR": [
    { src: "/gallery/ewzxyh (1).webp", alt: "Interface de produto web por Enzo Yoshida", position: "55%" },
    { src: "/gallery/ewzxyh (3).webp", alt: "Dashboard SaaS desenvolvido por Enzo Yoshida", position: "55%" },
    { src: "", alt: "Animação do logotipo Enzo Yoshida", position: "center" },
    { src: "/gallery/ewzxyh (6).webp", alt: "Tela de automação para operação digital", position: "28%" },
    { src: "/gallery/ewzxyh (5).webp", alt: "Aplicação web com foco em conversão e gestão", position: "center" },
    { src: "/gallery/ewzxyh (4).webp", alt: "Experiência de usuário para produto digital", position: "center" },
    { src: "/gallery/ewzxyh (8).webp", alt: "Sistema web responsivo criado por Enzo Yoshida", position: "12%" },
    { src: "/gallery/ewzxyh (2).webp", alt: "Interface administrativa para produto SaaS", position: "72%" },
  ],
  "en-US": [
    { src: "/gallery/ewzxyh (1).webp", alt: "Web product interface by Enzo Yoshida", position: "55%" },
    { src: "/gallery/ewzxyh (3).webp", alt: "SaaS dashboard developed by Enzo Yoshida", position: "55%" },
    { src: "", alt: "Enzo Yoshida logo animation", position: "center" },
    { src: "/gallery/ewzxyh (6).webp", alt: "Automation screen for digital operations", position: "28%" },
    { src: "/gallery/ewzxyh (5).webp", alt: "Web application focused on conversion and management", position: "center" },
    { src: "/gallery/ewzxyh (4).webp", alt: "User experience for a digital product", position: "center" },
    { src: "/gallery/ewzxyh (8).webp", alt: "Responsive web system created by Enzo Yoshida", position: "12%" },
    { src: "/gallery/ewzxyh (2).webp", alt: "Administrative interface for a SaaS product", position: "72%" },
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

    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        window.location.reload()
      }, 150)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      clearTimeout(resizeTimeout)
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
              <ShaderImage
                src={image.src}
                alt={image.alt}
                position={image.position}
                grayscale
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
