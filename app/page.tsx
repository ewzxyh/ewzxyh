import { Hero } from "@/components/portfolio/hero"
import { About } from "@/components/portfolio/about"
import { Experience } from "@/components/portfolio/experience"
import { Projects } from "@/components/portfolio/projects"
import { Contact } from "@/components/portfolio/contact"
import { Footer } from "@/components/portfolio/footer"
import { Header } from "@/components/portfolio/header"
import { LateralPinIndicator } from "@/components/portfolio/lateral-pin-indicator"
import {
  ogImagePath,
  personName,
  siteDescription,
  siteLastModified,
  siteName,
  siteUrl,
} from "@/lib/site"

const imageUrl = `${siteUrl}${ogImagePath}`
const websiteId = `${siteUrl}/#website`
const profilePageId = `${siteUrl}/#profile-page`
const personId = `${siteUrl}/#person`
const imageId = `${siteUrl}/#primary-image`

const profileJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: `${siteUrl}/`,
      name: siteName,
      description: siteDescription,
      inLanguage: "pt-BR",
      publisher: { "@id": personId },
      dateModified: siteLastModified,
    },
    {
      "@type": "ProfilePage",
      "@id": profilePageId,
      url: `${siteUrl}/`,
      name: siteName,
      description: siteDescription,
      inLanguage: "pt-BR",
      isPartOf: { "@id": websiteId },
      primaryImageOfPage: { "@id": imageId },
      mainEntity: { "@id": personId },
      dateModified: siteLastModified,
    },
    {
      "@type": "Person",
      "@id": personId,
      name: personName,
      alternateName: "ewzxyh",
      email: "mailto:yoshidaenzo@hotmail.com",
      url: `${siteUrl}/`,
      image: { "@id": imageId },
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
    {
      "@type": "ImageObject",
      "@id": imageId,
      url: imageUrl,
      contentUrl: imageUrl,
      width: 1200,
      height: 630,
      caption: `${siteName} - Product Engineer`,
      dateModified: siteLastModified,
    },
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
      >
        {JSON.stringify(profileJsonLd).replace(/</g, "\\u003c")}
      </script>
      <LateralPinIndicator />
      <main className="relative z-10 min-h-screen overflow-x-hidden before:pointer-events-none before:fixed before:inset-y-0 before:left-[clamp(1.25rem,3vw,4rem)] before:z-30 before:w-px before:bg-border/70 after:pointer-events-none after:fixed after:inset-y-0 after:right-[clamp(1.25rem,3vw,4rem)] after:z-30 after:w-px after:bg-border/70">
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
