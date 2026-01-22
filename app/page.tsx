import { Hero, About, Projects, Contact, Footer, Header, FluidBackground } from "@/components/portfolio"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />

      {/* Fluid Background Demo Section */}
      <section className="relative h-screen">
        <FluidBackground className="absolute inset-0" />
        <div className="relative z-10 flex items-center justify-center h-full pointer-events-none">
          <div className="text-center">
            <h2 className="text-4xl sm:text-6xl font-bold text-foreground mb-4">
              Fluid Background
            </h2>
            <p className="text-muted-foreground text-lg">
              Background fluido animado
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
