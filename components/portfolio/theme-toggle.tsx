"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import toggleAnimation from "@/public/Toggle.json"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const isAnimatingRef = useRef(false)

  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  // Define o frame inicial baseado no tema atual (apenas quando não está animando)
  useEffect(() => {
    if (!mounted || isAnimatingRef.current) return

    const timer = setTimeout(() => {
      if (!lottieRef.current || isAnimatingRef.current) return

      // frame 24 = modo claro (sol), frame 122 = modo escuro (lua)
      const targetFrame = isDark ? 122 : 24
      lottieRef.current.goToAndStop(targetFrame, true)
    }, 100)

    return () => clearTimeout(timer)
  }, [isDark, mounted])

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current || !lottieRef.current || isAnimatingRef.current) return

    const newTheme = isDark ? "light" : "dark"
    isAnimatingRef.current = true

    // Configura a animação usando playSegments para controle preciso
    // frame 24 = modo claro (sol), frame 122 = modo escuro (lua)
    const lottie = lottieRef.current
    lottie.setSpeed(3.5)

    if (isDark) {
      // Dark -> Light: anima de 79 para 24
      lottie.playSegments([79, 24], true)
    } else {
      // Light -> Dark: anima de 24 para 122
      lottie.playSegments([24, 122], true)
    }

    setTimeout(() => {
      isAnimatingRef.current = false
    }, 800)

    const supportsViewTransitions = "startViewTransition" in document

    if (supportsViewTransitions) {
      const transition = (document as unknown as { startViewTransition: (cb: () => void) => { ready: Promise<void> } }).startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme)
        })
      })

      await transition.ready

      const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
      const x = left + width / 2
      const y = top + height / 2
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      )

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 1000,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    } else {
      setTheme(newTheme)
    }
  }, [isDark, setTheme])

  if (!mounted) return null

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="w-20 h-20 flex items-center justify-center"
      aria-label="Alternar tema"
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={toggleAnimation}
        autoplay={false}
        loop={false}
        style={{ width: "120%", height: "120%", pointerEvents: "none" }}
      />
    </button>
  )
}
