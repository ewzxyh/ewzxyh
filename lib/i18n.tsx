"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type Locale = "pt-BR" | "en-US"

const translations = {
  "pt-BR": {
    // Hero
    "hero.role": "PRODUCT ENGINEER",
    "hero.subtitle": "Transformando ideias em produtos de alta performance com",
    "hero.and": "e",
    "hero.experience": "4+ anos entregando valor real para usuários.",
    "hero.years": "ANOS EXP.",
    "hero.projects": "PROJETOS",
    "hero.specialist": "SPECIALIST",
    "hero.cta": "VER PROJETOS",
    "hero.terminal": "EWZXYH_LAB://PORTFOLIO",

    // About
    "about.section": "01 // SOBRE",
    "about.title": "Quem sou eu",
    "about.intro": "Sou",
    "about.description1": "Product Engineer — combino visão de produto com execução técnica para entregar soluções que geram impacto.",
    "about.description2": "Com mais de 4 anos de experiência, não apenas codifico — proponho, itero e entrego features end-to-end focando em outcomes para o usuário. Minha especialidade é construir produtos com",
    "about.description2.suffix": "que são rápidos, acessíveis e escaláveis.",
    "about.description3": "Atualmente trabalho com autonomia em decisões de produto e arquitetura. Fundei a",
    "about.description3.suffix": "como minha marca para projetos independentes e consultoria.",
    "about.status": "Disponível para novas oportunidades",
    "about.product": "Product Thinking",
    "about.product.desc": "Foco em outcomes, não apenas outputs.",
    "about.design": "Design UI/UX",
    "about.design.desc": "Interfaces intuitivas e experiências memoráveis.",
    "about.fullstack": "Full-Stack",
    "about.fullstack.desc": "Do banco de dados à interface do usuário.",
    "about.frontend": "Frontend",
    "about.backend": "Backend",
    "about.devops": "DevOps",
    "about.ai": "AI & Automação",

    // Projects
    "projects.section": "02 // TRABALHOS",
    "projects.title": "Projetos em destaque",
    "projects.viewAll": "Ver todos",
    "projects.viewAllMobile": "Ver todos os projetos",
    "projects.code": "Código",
    "projects.demo": "Demo",
    "projects.description": "Descrição do projeto. Explique o problema resolvido, tecnologias usadas e impacto.",

    // Contact
    "contact.section": "03 // CONTATO",
    "contact.title": "Vamos conversar?",
    "contact.description": "Estou sempre aberto a discutir novos projetos, ideias criativas ou oportunidades de trabalho.",
    "contact.cta": "ENTRE EM CONTATO",
    "contact.alternative": "Ou me encontre no",

    // Footer
    "footer.rights": "Todos os direitos reservados.",
    "footer.built": "Construído com",

    // 404
    "notFound.title": "Página não encontrada",
    "notFound.description": "Ops! A página que você está procurando não existe ou foi movida.",
    "notFound.backHome": "VOLTAR AO INÍCIO",
    "notFound.goBack": "VOLTAR",
  },
  "en-US": {
    // Hero
    "hero.role": "PRODUCT ENGINEER",
    "hero.subtitle": "Turning ideas into high-performance products with",
    "hero.and": "and",
    "hero.experience": "4+ years delivering real value to users.",
    "hero.years": "YEARS EXP.",
    "hero.projects": "PROJECTS",
    "hero.specialist": "SPECIALIST",
    "hero.cta": "VIEW PROJECTS",
    "hero.terminal": "EWZXYH_LAB://PORTFOLIO",

    // About
    "about.section": "01 // ABOUT",
    "about.title": "Who am I",
    "about.intro": "I'm a",
    "about.description1": "Product Engineer — I combine product vision with technical execution to deliver solutions that drive impact.",
    "about.description2": "With over 4 years of experience, I don't just code — I propose, iterate, and ship features end-to-end focused on user outcomes. My specialty is building products with",
    "about.description2.suffix": "that are fast, accessible, and scalable.",
    "about.description3": "Currently working with autonomy on product and architecture decisions. I founded",
    "about.description3.suffix": "as my brand for independent projects and consulting.",
    "about.status": "Available for new opportunities",
    "about.product": "Product Thinking",
    "about.product.desc": "Focus on outcomes, not just outputs.",
    "about.design": "Design UI/UX",
    "about.design.desc": "Intuitive interfaces and memorable experiences.",
    "about.fullstack": "Full-Stack",
    "about.fullstack.desc": "From database to user interface.",
    "about.frontend": "Frontend",
    "about.backend": "Backend",
    "about.devops": "DevOps",
    "about.ai": "AI & Automation",

    // Projects
    "projects.section": "02 // WORK",
    "projects.title": "Featured Projects",
    "projects.viewAll": "View all",
    "projects.viewAllMobile": "View all projects",
    "projects.code": "Code",
    "projects.demo": "Demo",
    "projects.description": "Project description. Explain the problem solved, technologies used, and impact.",

    // Contact
    "contact.section": "03 // CONTACT",
    "contact.title": "Let's talk?",
    "contact.description": "I'm always open to discussing new projects, creative ideas, or job opportunities.",
    "contact.cta": "GET IN TOUCH",
    "contact.alternative": "Or find me on",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.built": "Built with",

    // 404
    "notFound.title": "Page not found",
    "notFound.description": "Oops! The page you're looking for doesn't exist or has been moved.",
    "notFound.backHome": "BACK TO HOME",
    "notFound.goBack": "GO BACK",
  },
} as const

type TranslationKey = keyof typeof translations["pt-BR"]

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
  isTransitioning: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt-BR")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const setLocale = useCallback((newLocale: Locale) => {
    if (newLocale === locale) return

    setIsTransitioning(true)

    setTimeout(() => {
      setLocaleState(newLocale)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 800)
    }, 400)
  }, [locale])

  const t = useCallback((key: TranslationKey): string => {
    return translations[locale][key] || key
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isTransitioning }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
