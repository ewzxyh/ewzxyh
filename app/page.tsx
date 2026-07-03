import { Hero } from "@/components/portfolio/hero"
import { About } from "@/components/portfolio/about"
import { Experience } from "@/components/portfolio/experience"
import { Projects } from "@/components/portfolio/projects"
import { Contact } from "@/components/portfolio/contact"
import { Footer } from "@/components/portfolio/footer"
import { Header } from "@/components/portfolio/header"
import { LateralPinIndicator } from "@/components/portfolio/lateral-pin-indicator"
import { siteDescription, siteName, siteUrl } from "@/lib/site"

const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${siteUrl}/#profile-page`,
  url: `${siteUrl}/`,
  name: siteName,
  description: siteDescription,
  inLanguage: "pt-BR",
  image: `${siteUrl}/og/enzo-yoshida-product-engineer.webp`,
  mainEntity: {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Enzo Hideki Yoshida",
    alternateName: "ewzxyh",
    email: "mailto:yoshidaenzo@hotmail.com",
    url: `${siteUrl}/`,
    image: `${siteUrl}/og/enzo-yoshida-product-engineer.webp`,
    jobTitle: "Product Engineer",
    sameAs: [
      "https://github.com/ewzxyh",
      "https://linkedin.com/in/ewzxyh",
      "https://instagram.com/yoshidaenzoh",
    ],
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "Laravel",
      "SaaS",
      "Payment systems",
      "Automation",
    ],
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd).replace(/</g, "\\u003c") }}
      />
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
