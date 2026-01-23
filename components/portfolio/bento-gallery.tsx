"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Flip } from "gsap/dist/Flip"
import { CanvasParticles } from "./canvas-particles"
import { ScrollFillLogo } from "./scroll-fill-logo"
import { ShaderImage } from "./shader-image"

gsap.registerPlugin(ScrollTrigger, Flip)

const localImages = [
  { src: "/gallery/ewzxyh (1).png", alt: "Projeto 1", position: "55%" },
  { src: "/gallery/ewzxyh (3).png", alt: "Projeto 2", position: "55%" },
  { src: "", alt: "", position: "center" },
  { src: "/gallery/ewzxyh (6).png", alt: "Projeto 5", position: "28%" },
  { src: "/gallery/ewzxyh (5).png", alt: "Projeto 4", position: "center" },
  { src: "/gallery/ewzxyh (4).png", alt: "Projeto 3", position: "center" },
  { src: "/gallery/ewzxyh (8).webp", alt: "Projeto 6", position: "12%" },
  { src: "/gallery/ewzxyh (2).png", alt: "Projeto 7", position: "72%" },
]

// Fallback do CodePen enquanto não há imagens locais
const fallbackImages = [
  { src: "https://assets.codepen.io/16327/portrait-pattern-1.jpg", alt: "Pattern 1", position: "center" },
  { src: "https://assets.codepen.io/16327/portrait-image-12.jpg", alt: "Portrait 1", position: "center" },
  { src: "https://assets.codepen.io/16327/portrait-image-8.jpg", alt: "Portrait 2", position: "center" },
  { src: "https://assets.codepen.io/16327/portrait-pattern-2.jpg", alt: "Pattern 2", position: "center" },
  { src: "https://assets.codepen.io/16327/portrait-image-4.jpg", alt: "Portrait 3", position: "center" },
  { src: "https://assets.codepen.io/16327/portrait-image-3.jpg", alt: "Portrait 4", position: "center" },
  { src: "https://assets.codepen.io/16327/portrait-pattern-3.jpg", alt: "Pattern 3", position: "center" },
  { src: "https://assets.codepen.io/16327/portrait-image-1.jpg", alt: "Portrait 5", position: "center" },
]

export function BentoGallery() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const flipCtxRef = useRef<gsap.Context | null>(null)
  const [useLocal, setUseLocal] = useState(false)

  const galleryImages = useLocal ? localImages : fallbackImages

  // Verifica se imagens locais existem - só muda para local se encontrar
  useEffect(() => {
    fetch(localImages[0].src, { method: "HEAD" })
      .then((res) => {
        if (res.ok) setUseLocal(true)
      })
      .catch(() => {})
  }, [])

  const createFlipAnimation = useCallback(() => {
    const galleryElement = galleryRef.current
    if (!galleryElement) return

    const galleryItems = galleryElement.querySelectorAll(".bento-item")

    if (flipCtxRef.current) {
      flipCtxRef.current.revert()
    }
    galleryElement.classList.remove("bento-final")

    flipCtxRef.current = gsap.context(() => {
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
  }, [])

  useEffect(() => {
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
      if (flipCtxRef.current) {
        flipCtxRef.current.revert()
      }
    }
  }, [createFlipAnimation])

  return (
    <div ref={wrapRef} className="bento-wrap">
      <div ref={galleryRef} className="bento-gallery">
        {galleryImages.map((image, index) => (
          <div key={index} className="bento-item">
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
