"use client"

import { gsap } from "gsap"
import { Flip } from "gsap/dist/Flip"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { useI18n } from "@/lib/i18n"
import { ScrollFillLogo } from "./scroll-fill-logo"

gsap.registerPlugin(ScrollTrigger, Flip)

// Digital art pieces around the logo tile (index 2). The files are already grayscale: a CSS filter on images that the
// Flip resizes every scroll frame cost long frames on desktop. `position` is the vertical focus (0% = top).
const localImagesByLocale = {
  "pt-BR": [
    { src: "/gallery/ewzxyh (1).webp", alt: "Arte digital: cavaleiro com uma cruz diante de um incêndio", position: "45%" },
    { src: "/gallery/ewzxyh (3).webp", alt: "Arte digital: husky sorrindo entre formas 3D", position: "45%" },
    { src: "", alt: "", position: "center" },
    { src: "/gallery/ewzxyh (6).webp", alt: "Arte digital: chaveiro cheio de miniaturas", position: "72%" },
    { src: "/gallery/ewzxyh (5).webp", alt: "Arte digital: símbolos ligados por trilhas de circuito", position: "center" },
    { src: "/gallery/ewzxyh (4).webp", alt: "Arte digital: figura com chifres segurando um buraco negro", position: "center" },
    { src: "/gallery/ewzxyh (8).webp", alt: "Arte digital: rosto cromado diante de um sol, como capa de álbum", position: "88%" },
    { src: "/gallery/ewzxyh (2).webp", alt: "Arte digital: figura cromada entre formas 3D", position: "28%" },
  ],
  "en-US": [
    { src: "/gallery/ewzxyh (1).webp", alt: "Digital art: a knight holding a cross in front of a fire", position: "45%" },
    { src: "/gallery/ewzxyh (3).webp", alt: "Digital art: a smiling husky among 3D shapes", position: "45%" },
    { src: "", alt: "", position: "center" },
    { src: "/gallery/ewzxyh (6).webp", alt: "Digital art: a keychain full of trinkets", position: "72%" },
    { src: "/gallery/ewzxyh (5).webp", alt: "Digital art: symbols joined by circuit traces", position: "center" },
    { src: "/gallery/ewzxyh (4).webp", alt: "Digital art: a horned figure holding a black hole", position: "center" },
    { src: "/gallery/ewzxyh (8).webp", alt: "Digital art: a chrome face before a sun, like an album cover", position: "88%" },
    { src: "/gallery/ewzxyh (2).webp", alt: "Digital art: a chrome figure among 3D shapes", position: "28%" },
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
              // The logo draws itself as the tile grows to fill the screen.
              <div className="flex size-full items-center justify-center bg-card text-foreground">
                <ScrollFillLogo />
              </div>
            ) : (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 70vw, 45vw"
                className="object-cover"
                style={{ objectPosition: `center ${image.position}` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
