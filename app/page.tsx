import { Hero } from "@/components/portfolio/hero"
import { About } from "@/components/portfolio/about"
import { Experience } from "@/components/portfolio/experience"
import { Projects } from "@/components/portfolio/projects"
import { Contact } from "@/components/portfolio/contact"
import { Footer } from "@/components/portfolio/footer"
import { Header } from "@/components/portfolio/header"
import { FluidBackground } from "@/components/portfolio/fluid-background"
import { LateralPinIndicator } from "@/components/portfolio/lateral-pin-indicator"

export default function Home() {
  return (
    <>
      <FluidBackground className="fixed inset-0 z-0" />
      <LateralPinIndicator />
      <main className="relative z-10 min-h-screen overflow-x-hidden">
        <Header />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
