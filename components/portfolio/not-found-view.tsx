"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { Home2Icon } from "@/components/ui/icons"
import { useI18n } from "@/lib/i18n"
import { localePaths } from "@/lib/site"
import { HeaderActions } from "@/components/portfolio/header-actions"
import { useMounted } from "@/hooks/use-mounted"
import animationData from "@/public/Not found.json"
import { Heading } from "@/components/ui/heading"
import { buttonVariants } from "@/components/ui/button-variants"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

// Body of the 404 page; app/global-not-found.tsx wraps it in the document shell.
export function NotFoundView() {
  const { t, locale } = useI18n()
  const mounted = useMounted()

  return (
    <main id="content" tabIndex={-1} className="min-h-screen flex flex-col items-center justify-center px-6 focus-visible:outline-none">
      <HeaderActions />
      <div className="max-w-md w-full text-center">
        {mounted && animationData && (
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            className="w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 mx-auto"
          />
        )}

        <Heading as="h1" size="xl" className="mb-4">404</Heading>

        <Heading as="h2" size="md" className="mb-2">
          {t("notFound.title")}
        </Heading>

        <p className="text-sm sm:text-base text-muted-foreground mb-8">
          {t("notFound.description")}
        </p>

        <Link
          href={localePaths[locale]}
          className={buttonVariants()}
        >
          <Home2Icon aria-hidden="true" className="size-4" />
          {t("notFound.backHome")}
        </Link>

        <p className="mt-12 text-xs text-muted-foreground tracking-widest">
          EWZXYH_LABS://404
        </p>
      </div>
    </main>
  )
}
