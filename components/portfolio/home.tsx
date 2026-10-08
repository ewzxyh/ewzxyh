import { Hero } from "@/components/portfolio/hero"
import { Services } from "@/components/portfolio/services"
import { About } from "@/components/portfolio/about"
import { Experience } from "@/components/portfolio/experience"
import { Projects } from "@/components/portfolio/projects"
import { Contact } from "@/components/portfolio/contact"
import { Footer } from "@/components/portfolio/footer"
import { HashScroll } from "@/components/portfolio/hash-scroll"
import { Header } from "@/components/portfolio/header"
import { LateralPinIndicator } from "@/components/portfolio/lateral-pin-indicator"
import type { SiteLocale } from "@/lib/site"
import { getProfileJsonLd } from "@/lib/structured-data"

// The whole portfolio. "/" renders it in Portuguese and "/en" in English: the language comes from the address (see
// lib/i18n.tsx), and the structured data below is written for the language of the page it sits on.
export function Home({ locale }: { locale: SiteLocale }) {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(getProfileJsonLd(locale)).replace(/</g, "\\u003c")}</script>
      <LateralPinIndicator />
      <HashScroll />
      <main className="relative z-10 min-h-screen overflow-x-clip before:pointer-events-none before:fixed before:inset-y-0 before:left-(--gutter) before:z-30 before:w-px before:bg-border/70 after:pointer-events-none after:fixed after:inset-y-0 after:right-(--gutter) after:z-30 after:w-px after:bg-border/70">
        <Header />
        <Hero />
        <Services />
        <About />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
