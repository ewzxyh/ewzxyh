"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { Home } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { HeaderActions } from "@/components/portfolio/header-actions"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

export default function NotFound() {
  const { t } = useI18n()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // biome-ignore lint/suspicious/noExplicitAny: Lottie animation data type
  const [animationData, setAnimationData] = useState<any>(null)
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
    import("@/public/Not found.json").then((mod) => setAnimationData(mod.default))
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <HeaderActions />
      <div className="max-w-md w-full text-center">
        {animationData && (
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            className="w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 mx-auto"
            style={isDark ? { filter: "invert(1) brightness(0.85)" } : undefined}
          />
        )}

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">404</h1>

        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
          {t("notFound.title")}
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground mb-8">
          {t("notFound.description")}
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium tracking-wider border border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-all duration-300"
        >
          <Home className="w-4 h-4 mr-2" />
          {t("notFound.backHome")}
        </Link>

        <p className="mt-12 text-xs text-muted-foreground tracking-widest">
          EWZXYH_LAB://404
        </p>
      </div>
    </main>
  )
}
