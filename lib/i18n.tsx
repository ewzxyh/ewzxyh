"use client"

import { createContext, use, useState, type ReactNode } from "react"
import { useMounted } from "@/hooks/use-mounted"

type Locale = "pt-BR" | "en-US"

const LOCALE_COOKIE = "preferred-locale"
const DAY_MS = 24 * 60 * 60 * 1000

type CookieStoreLike = {
  set: (options: {
    name: string
    value: string
    expires: number
    path: string
    sameSite: "lax"
  }) => Promise<void>
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return undefined
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return
  const expiresAt = Date.now() + days * DAY_MS
  const cookieStore = (window as Window & { cookieStore?: CookieStoreLike }).cookieStore

  if (cookieStore) {
    void cookieStore.set({ name, value, expires: expiresAt, path: "/", sameSite: "lax" })
    return
  }

  const expires = new Date(expiresAt).toUTCString()
  // biome-ignore lint/suspicious/noDocumentCookie: fallback for browsers without Cookie Store API.
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

const translations = {
  "pt-BR": {
    // Navigation
    "nav.about": "Sobre",
    "nav.experience": "Experiência",
    "nav.projects": "Projetos",
    "nav.contact": "Contato",
    "nav.openToWork": "Disponível para projetos",

    // Hero
    "hero.role": "PRODUCT ENGINEER · EWZXYH LABS",
    "hero.subtitle": "Transformo ideias e operações manuais em produtos digitais prontos para operar.",
    "hero.experience": "Da estratégia à execução, desenvolvo MVPs, SaaS, dashboards, integrações e automações para empresas que precisam lançar, centralizar ou escalar.",
    "hero.years": "ANOS EXP.",
    "hero.projects": "PROJETOS",
    "hero.operators": "OPERADORES",
    "hero.cta": "VER PROJETOS",
    "hero.contactCta": "FALAR SOBRE UM PROJETO",
    "hero.terminal": "ENZO_YOSHIDA://EWZXYH_LABS",

    // Services
    "services.eyebrow": "EWZXYH LABS // SERVIÇOS",
    "services.title": "Da ideia à operação",
    "services.description": "Enzo Yoshida lidera a Ewzxyh Labs para criar produtos e sistemas sob medida, unindo visão de produto, design e engenharia.",
    "services.products": "MVPs e SaaS",
    "services.products.desc": "Produtos digitais completos para validar, lançar e evoluir novas operações.",
    "services.systems": "Dashboards e integrações",
    "services.systems.desc": "Painéis e conexões entre sistemas para centralizar dados, pagamentos e decisões.",
    "services.automation": "Automação operacional",
    "services.automation.desc": "Fluxos que substituem tarefas manuais por processos rápidos, rastreáveis e escaláveis.",

    // About
    "about.section": "01 // SOBRE",
    "about.title": "Quem sou eu",
    "about.intro": "Sou",
    "about.description1": "Product Engineer — combino visão de produto com execução técnica para entregar soluções com impacto real.",
    "about.description2": "Com mais de 5 anos de experiência, não apenas codifico — proponho, itero e entrego recursos de ponta a ponta com foco em resultados para o usuário. Minha especialidade é construir produtos com",
    "about.description2.suffix": "que são rápidos, acessíveis e escaláveis.",
    "about.description3": "Atualmente trabalho com autonomia em decisões de produto e arquitetura. Fundei a",
    "about.description3.suffix": "como minha empresa para produtos próprios, projetos independentes e desenvolvimento sob medida.",
    "about.status": "Disponível para projetos e oportunidades",
    "about.product": "Pensamento de Produto",
    "about.product.desc": "Foco em resultados, não apenas entregas.",
    "about.design": "Design UI/UX",
    "about.design.desc": "Interfaces intuitivas e experiências memoráveis.",
    "about.fullstack": "Full-Stack",
    "about.fullstack.desc": "Do banco de dados à interface do usuário.",
    "about.frontend": "Frontend",
    "about.backend": "Backend",
    "about.devops": "DevOps",
    "about.ai": "IA & Automação",

    // Skills
    "skills.title": "Habilidades",
    "skills.frontend": "Front-end",
    "skills.backend": "Back-end",
    "skills.automation": "Automação & DevOps",
    "skills.react.desc": "Biblioteca para construção de interfaces",
    "skills.expo.desc": "Framework React Native para apps mobile",
    "skills.nextjs.desc": "Framework React com SSR e SSG",
    "skills.typescript.desc": "JavaScript tipado para código robusto",
    "skills.javascript.desc": "Linguagem dinâmica para web",
    "skills.tailwind.desc": "CSS utilitário para estilização rápida",
    "skills.figma.desc": "Design de interfaces e prototipagem",
    "skills.threejs.desc": "Biblioteca 3D para web com WebGL",
    "skills.gsap.desc": "Biblioteca de animações profissional",
    "skills.vite.desc": "Ferramenta de build ultrarrápida para frontend",
    "skills.webgl.desc": "API gráfica 3D para navegadores",
    "skills.html5.desc": "Marcação semântica e acessível",
    "skills.css3.desc": "Estilização moderna e responsiva",
    "skills.nodejs.desc": "Runtime JavaScript no servidor",
    "skills.bun.desc": "Runtime JavaScript ultrarrápido",
    "skills.php.desc": "Linguagem para aplicações web",
    "skills.laravel.desc": "Framework PHP elegante e produtivo",
    "skills.restapi.desc": "Arquitetura para APIs web escaláveis",
    "skills.postgresql.desc": "Banco de dados relacional avançado",
    "skills.mysql.desc": "Banco de dados relacional popular",
    "skills.supabase.desc": "Backend como serviço com PostgreSQL",
    "skills.prisma.desc": "ORM moderno para TypeScript",
    "skills.redis.desc": "Cache e filas em memória",
    "skills.git.desc": "Controle de versão distribuído",
    "skills.docker.desc": "Containerização de aplicações",
    "skills.linux.desc": "Sistema operacional para servidores",
    "skills.vercel.desc": "Deploy e hospedagem para Next.js",
    "skills.cloudflare.desc": "CDN, DNS e segurança web",
    "skills.nginx.desc": "Servidor web e proxy reverso",
    "skills.coolify.desc": "PaaS self-hosted para deploy",
    "skills.n8n.desc": "Automação de fluxos de trabalho low-code",
    "skills.bash.desc": "Scripts e automação no terminal",
    "skills.python.desc": "Automação e scripts",
    "skills.githubactions.desc": "CI/CD e automação de workflows",
    "skills.chatcase.desc": "Plataforma de automação no-code",
    "skills.chatgpt.desc": "Assistente de IA da OpenAI",
    "skills.claude.desc": "Assistente de IA da Anthropic",
    "skills.gemini.desc": "Assistente de IA do Google",

    // Experience Section Headers
    "experience.work": "Experiência",
    "experience.education": "Educação",
    "experience.certificates": "Certificados",

    // Work Experience - Roles
    "experience.casepay.role": "Co-Founder & Lead Engineer",
    "experience.casepay.desc": "Co-fundador de gateway de pagamento focado em lotéricas, pequenos negócios, desenvolvedores, criadores independentes e SaaS. Desenvolvi a plataforma completa em Laravel, incluindo integração com APIs de pagamento, dashboard para gestão de transações, controle financeiro, sistema de repasses e segurança da aplicação. Landing page em Next.js. Integrado ao ecossistema Case e parceiros (LotoHub, CaseZap, ChatCase, ConectaLot, sites de lotéricas).",

    "experience.case.role": "Lead Product Engineer",
    "experience.case.desc": "Lidero o desenvolvimento do ecossistema técnico da Case, coordenando equipe de desenvolvedores. Criei CaseZap (SaaS para gestão de instâncias WhatsApp com dashboard, analytics, financeiro e automações), Case Dashboard (hub centralizado integrando todas as plataformas da Case e parceiros) e dezenas de sites, aplicações e landing pages para clientes diversos. Desenvolvo também plataformas e soluções sob medida. Gerencio Google Ads e obtive certificação de jogos de azar.",

    "experience.seloesgo.role": "Product Engineer",
    "experience.seloesgo.desc": "Inicialmente contratado como Designer, identifiquei oportunidade de automação e desenvolvi sistema completo integrado à API da ConectaLot que gera e distribui artes automaticamente para +630 lotéricos em Goiás. Reduzi tempo de criação de horas para segundos.",

    "experience.loteria.role": "Product Engineer",
    "experience.loteria.desc": "Responsável técnico pelo e-commerce loteriaamazonas.com.br. Desenvolvi o site em Next.js com CMS próprio, implementei automação de atendimento via WhatsApp e gerenciei Google Ads — incluindo a obtenção da certificação de jogos de azar.",

    "experience.loteria.intern.role": "Estagiário de TI",
    "experience.loteria.intern.desc": "Início da parceria com a Loteria Amazonas. Desenvolvi a primeira versão do site (landing page), mantive os portais WordPress e configurei automações no ChatCase. Também atuei com design gráfico e suporte.",

    "experience.lotohub.role": "Fundador",
    "experience.lotohub.desc": "Fundador de plataforma SaaS para geração e gestão automatizada de sites para lotéricas. O sistema permite criar, configurar e gerenciar múltiplos sites de forma centralizada, com e-commerce, integração de pagamentos e automação de atendimento. Utilizado pela Case Agência e parceiros.",

    "experience.lovtok.role": "Fundador",
    "experience.lovtok.desc": "A Lovtok é um e-commerce dedicado a promover o bem-estar sexual e o autocuidado.",

    "experience.ewzxyh.role": "Fundador",
    "experience.ewzxyh.desc": "Consultoria e desenvolvimento de aplicações sob medida. Atendo startups, empresas e empreendedores que precisam de soluções full-stack personalizadas — desde MVPs e dashboards até automações e integrações complexas.",

    // Education
    "experience.edu.nbcc": "Pós-graduação em Cibersegurança",
    "experience.edu.puc": "Análise e Desenvolvimento de Sistemas",
    "experience.edu.colegio": "Ensino Médio Completo",
    "experience.edu.escola": "Ensino Fundamental",
    "experience.location.canada": "Canadá",
    "experience.location.brazil": "Brasil",

    // Certificates
    "experience.cert.nextjs": "React 19 & Next.js 16 with App Router, Server Actions, Server Components, Tailwind CSS, TypeScript & REST API",
    "experience.cert.english.believer": "English Immersion Course - 1 Year Program",
    "experience.cert.java": "Complete Java Object-Oriented Programming + Projects",
    "experience.cert.postgres": "Complete PostgreSQL Course - From Beginner to Advanced",
    "experience.cert.vue": "Vue JS 2 - The Complete Guide (incl. Vue Router & Vuex)",
    "experience.cert.english.cultura": "English Course - Cultura Inglesa",
    "experience.cert.english.duolingo": "Certified English proficiency",

    // Projects
    "projects.section": "02 // TRABALHOS",
    "projects.title": "Projetos em destaque",
    // Contact
    "contact.section": "03 // CONTATO",
    "contact.title": "O que você precisa lançar, integrar ou automatizar?",
    "contact.description": "Conte brevemente o contexto. O contato é direto com Enzo Yoshida para projetos da Ewzxyh Labs ou oportunidades profissionais.",
    "contact.cta": "FALAR SOBRE MEU PROJETO",
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
    // Navigation
    "nav.about": "About",
    "nav.experience": "Experience",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "nav.openToWork": "Available for projects",

    // Hero
    "hero.role": "PRODUCT ENGINEER · EWZXYH LABS",
    "hero.subtitle": "I turn ideas and manual operations into digital products ready to run.",
    "hero.experience": "From strategy to execution, I build MVPs, SaaS, dashboards, integrations, and automations for companies that need to launch, centralize, or scale.",
    "hero.years": "YEARS EXP.",
    "hero.projects": "PROJECTS",
    "hero.operators": "OPERATORS",
    "hero.cta": "VIEW PROJECTS",
    "hero.contactCta": "DISCUSS A PROJECT",
    "hero.terminal": "ENZO_YOSHIDA://EWZXYH_LABS",

    // Services
    "services.eyebrow": "EWZXYH LABS // SERVICES",
    "services.title": "From idea to operation",
    "services.description": "Enzo Yoshida leads Ewzxyh Labs to build custom products and systems by combining product thinking, design, and engineering.",
    "services.products": "MVPs and SaaS",
    "services.products.desc": "Complete digital products to validate, launch, and evolve new operations.",
    "services.systems": "Dashboards and integrations",
    "services.systems.desc": "Interfaces and system connections that centralize data, payments, and decisions.",
    "services.automation": "Operational automation",
    "services.automation.desc": "Workflows that replace manual tasks with fast, traceable, and scalable processes.",

    // About
    "about.section": "01 // ABOUT",
    "about.title": "About me",
    "about.intro": "I'm a",
    "about.description1": "Product Engineer — I combine product vision with technical execution to deliver solutions that drive impact.",
    "about.description2": "With over 5 years of experience, I don't just code — I propose, iterate, and ship features end-to-end focused on user outcomes. My specialty is building products with",
    "about.description2.suffix": "that are fast, accessible, and scalable.",
    "about.description3": "Currently working with autonomy on product and architecture decisions. I founded",
    "about.description3.suffix": "as my company for proprietary products, independent projects, and custom development.",
    "about.status": "Available for projects and opportunities",
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

    // Skills
    "skills.title": "Skills",
    "skills.frontend": "Front-end",
    "skills.backend": "Back-end",
    "skills.automation": "Automation & DevOps",
    "skills.react.desc": "Library for building user interfaces",
    "skills.expo.desc": "React Native framework for mobile apps",
    "skills.nextjs.desc": "React framework with SSR and SSG",
    "skills.typescript.desc": "Typed JavaScript for robust code",
    "skills.javascript.desc": "Dynamic language for the web",
    "skills.tailwind.desc": "Utility-first CSS for fast styling",
    "skills.figma.desc": "Interface design and prototyping",
    "skills.threejs.desc": "3D library for web with WebGL",
    "skills.gsap.desc": "Professional animation library",
    "skills.vite.desc": "Ultra-fast frontend build tool",
    "skills.webgl.desc": "3D graphics API for browsers",
    "skills.html5.desc": "Semantic and accessible markup",
    "skills.css3.desc": "Modern and responsive styling",
    "skills.nodejs.desc": "JavaScript runtime on the server",
    "skills.bun.desc": "Ultra-fast JavaScript runtime",
    "skills.php.desc": "Language for web applications",
    "skills.laravel.desc": "Elegant and productive PHP framework",
    "skills.restapi.desc": "Architecture for scalable web APIs",
    "skills.postgresql.desc": "Advanced relational database",
    "skills.mysql.desc": "Popular relational database",
    "skills.supabase.desc": "Backend as a service with PostgreSQL",
    "skills.prisma.desc": "Modern ORM for TypeScript",
    "skills.redis.desc": "In-memory cache and queues",
    "skills.git.desc": "Distributed version control",
    "skills.docker.desc": "Application containerization",
    "skills.linux.desc": "Operating system for servers",
    "skills.vercel.desc": "Deploy and hosting for Next.js",
    "skills.cloudflare.desc": "CDN, DNS and web security",
    "skills.nginx.desc": "Web server and reverse proxy",
    "skills.coolify.desc": "Self-hosted PaaS for deploys",
    "skills.n8n.desc": "Low-code workflow automation",
    "skills.bash.desc": "Terminal scripts and automation",
    "skills.python.desc": "Automation and scripting",
    "skills.githubactions.desc": "CI/CD and workflow automation",
    "skills.chatcase.desc": "No-code automation platform",
    "skills.chatgpt.desc": "OpenAI's AI assistant",
    "skills.claude.desc": "Anthropic's AI assistant",
    "skills.gemini.desc": "Google's AI assistant",

    // Experience Section Headers
    "experience.work": "Work Experience",
    "experience.education": "Education",
    "experience.certificates": "Certificates",

    // Work Experience - Roles
    "experience.casepay.role": "Co-Founder & Lead Engineer",
    "experience.casepay.desc": "Co-founded a payment gateway focused on lottery retailers, small businesses, developers, independent builders and SaaS. Built the entire platform in Laravel, including payment API integrations, transaction management dashboard, financial control, transfer system and application security. Landing page in Next.js. Integrated with Case and partners ecosystem (LotoHub, CaseZap, ChatCase, ConectaLot, lottery retailer sites).",

    "experience.case.role": "Lead Product Engineer",
    "experience.case.desc": "I lead Case's technical ecosystem development, coordinating a team of developers. I built CaseZap (SaaS for WhatsApp instance management with dashboard, analytics, billing and automations), Case Dashboard (centralized hub integrating all Case and partner platforms), and dozens of sites, applications, and landing pages for various clients. I also build custom platforms and solutions. I manage Google Ads and obtained gambling certification.",

    "experience.seloesgo.role": "Product Engineer",
    "experience.seloesgo.desc": "Initially hired as Designer, identified automation opportunity and built a complete system integrated with ConectaLot API that auto-generates and distributes graphics to 630+ lottery operators in Goiás. Reduced creation time from hours to seconds.",

    "experience.loteria.role": "Product Engineer",
    "experience.loteria.desc": "Technical lead for loteriaamazonas.com.br e-commerce. Built the site in Next.js with custom CMS, implemented WhatsApp automation for customer service and managed Google Ads — including obtaining gambling certification.",

    "experience.loteria.intern.role": "IT Intern",
    "experience.loteria.intern.desc": "Started partnership with Loteria Amazonas. Developed the first version of the site (landing page), maintained WordPress portals and configured automations in ChatCase. Also worked with graphic design and support.",

    "experience.lotohub.role": "Founder",
    "experience.lotohub.desc": "Founded a SaaS platform for automated lottery retailer site generation and management. The system allows creating, configuring and managing multiple sites from a centralized dashboard, with e-commerce, payment integration and automated customer service. Used by Case Agência and partners.",

    "experience.lovtok.role": "Founder",
    "experience.lovtok.desc": "Lovtok is an e-commerce dedicated to promoting sexual wellness and self-care.",

    "experience.ewzxyh.role": "Founder",
    "experience.ewzxyh.desc": "Consulting and custom application development. I work with startups, companies and entrepreneurs who need tailored full-stack solutions — from MVPs and dashboards to automations and complex integrations.",

    // Education
    "experience.edu.nbcc": "Postgraduate in Cybersecurity",
    "experience.edu.puc": "Systems Analysis and Development",
    "experience.edu.colegio": "High School Diploma",
    "experience.edu.escola": "Elementary School",
    "experience.location.canada": "Canada",
    "experience.location.brazil": "Brazil",

    // Certificates
    "experience.cert.nextjs": "React 19 & Next.js 16 with App Router, Server Actions, Server Components, Tailwind CSS, TypeScript & REST API",
    "experience.cert.english.believer": "English Immersion Course - 1 Year Program",
    "experience.cert.java": "Complete Java Object-Oriented Programming + Projects",
    "experience.cert.postgres": "Complete PostgreSQL Course - From Beginner to Advanced",
    "experience.cert.vue": "Vue JS 2 - The Complete Guide (incl. Vue Router & Vuex)",
    "experience.cert.english.cultura": "English Course - Cultura Inglesa",
    "experience.cert.english.duolingo": "Certified English proficiency",

    // Projects
    "projects.section": "02 // WORK",
    "projects.title": "Featured Projects",
    // Contact
    "contact.section": "03 // CONTACT",
    "contact.title": "What do you need to launch, integrate, or automate?",
    "contact.description": "Share the context briefly. You will speak directly with Enzo Yoshida about Ewzxyh Labs projects or professional opportunities.",
    "contact.cta": "DISCUSS MY PROJECT",
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

export type TranslationKey = keyof typeof translations["pt-BR"]

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
  isTransitioning: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

function getInitialLocale(): Locale {
  if (typeof document === "undefined") return "pt-BR"
  const cookieLocale = getCookie(LOCALE_COOKIE)
  if (cookieLocale === "pt-BR" || cookieLocale === "en-US") {
    return cookieLocale
  }
  return "pt-BR"
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const mounted = useMounted()
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const activeLocale = mounted ? locale : "pt-BR"

  function setLocale(newLocale: Locale) {
    if (newLocale === locale) return

    setIsTransitioning(true)
    setCookie(LOCALE_COOKIE, newLocale, 365)

    setTimeout(() => {
      setLocaleState(newLocale)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 800)
    }, 400)
  }

  function t(key: TranslationKey): string {
    return translations[activeLocale][key] || key
  }

  return (
    <I18nContext.Provider value={{ locale: activeLocale, setLocale, t, isTransitioning }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = use(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
