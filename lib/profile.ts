// Portfolio facts shared by the page and by everything generated for crawlers and agents
// (markdown twins, llms.txt, JSON-LD). Plain data: no JSX, no "use client".

import type { Locale, TranslationKey } from "./translations"

// Text that reads the same in both languages is a plain string; anything else carries both spellings.
export type Text = string | Record<Locale, string>

export function localize(text: Text, locale: Locale) {
  return typeof text === "string" ? text : text[locale]
}

// ---------- Periods ----------

// Months are "YYYY-MM". `to: "present"` marks something still running; without `to` it is a single date.
type Month = `${number}-${number}`

export interface Period {
  from: Month
  to?: Month | "present"
}

const monthNames: Record<Locale, string[]> = {
  "pt-BR": ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  "en-US": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
}

function formatMonth(value: Month, locale: Locale) {
  const [year, month] = value.split("-")
  return `${monthNames[locale][Number(month) - 1]} ${year}`
}

export function formatPeriod(period: Period, locale: Locale) {
  const start = formatMonth(period.from, locale)
  if (!period.to) return start
  const end = period.to === "present" ? (locale === "pt-BR" ? "atual" : "Present") : formatMonth(period.to, locale)
  return `${start} – ${end}`
}

// ---------- Tags (chips under jobs and certificates, each with a one-line tooltip) ----------

interface TagInfo {
  label: Text
  description: Record<Locale, string>
}

const tagCatalog = {
  // Languages and frameworks
  nextjs: { label: "Next.js", description: { "pt-BR": "Framework React para aplicações de produção", "en-US": "React framework for production apps" } },
  react: { label: "React", description: { "pt-BR": "Biblioteca JavaScript para interfaces", "en-US": "JavaScript library for user interfaces" } },
  typescript: { label: "TypeScript", description: { "pt-BR": "JavaScript tipado para apps escaláveis", "en-US": "Typed JavaScript for scalable apps" } },
  javascript: { label: "JavaScript", description: { "pt-BR": "A linguagem de programação da web", "en-US": "The programming language of the web" } },
  laravel: { label: "Laravel", description: { "pt-BR": "Framework PHP para aplicações web", "en-US": "PHP framework for web applications" } },
  php: { label: "PHP", description: { "pt-BR": "Linguagem server-side para a web", "en-US": "Server-side language for the web" } },
  go: { label: "Go", description: { "pt-BR": "Linguagem compilada para APIs e workers", "en-US": "Compiled language for APIs and workers" } },
  java: { label: "Java", description: { "pt-BR": "Linguagem orientada a objetos", "en-US": "Object-oriented programming language" } },
  vue: { label: "Vue.js", description: { "pt-BR": "Framework JavaScript progressivo", "en-US": "Progressive JavaScript framework" } },
  vueRouter: { label: "Vue Router", description: { "pt-BR": "Roteamento oficial do Vue.js", "en-US": "Official router for Vue.js" } },
  vuex: { label: "Vuex", description: { "pt-BR": "Gerenciamento de estado do Vue.js", "en-US": "State management for Vue.js" } },
  springBoot: { label: "Spring Boot", description: { "pt-BR": "Framework Java para APIs e serviços", "en-US": "Java framework for APIs and services" } },
  hibernate: { label: "Hibernate", description: { "pt-BR": "ORM para Java", "en-US": "Java ORM framework" } },
  oop: { label: { "pt-BR": "Orientação a objetos", "en-US": "OOP" }, description: { "pt-BR": "Programação orientada a objetos", "en-US": "Object-oriented programming" } },
  tailwind: { label: "Tailwind CSS", description: { "pt-BR": "CSS utilitário para estilizar rápido", "en-US": "Utility-first CSS framework" } },
  gsap: { label: "GSAP", description: { "pt-BR": "Biblioteca de animação profissional", "en-US": "Professional-grade animation library" } },
  webgl: { label: "WebGL", description: { "pt-BR": "Gráficos acelerados pela GPU no navegador", "en-US": "GPU-accelerated graphics in the browser" } },

  // Back end, data and infrastructure
  restApis: { label: { "pt-BR": "APIs REST", "en-US": "REST APIs" }, description: { "pt-BR": "Integração entre sistemas por HTTP", "en-US": "Connecting systems over HTTP" } },
  postgresql: { label: "PostgreSQL", description: { "pt-BR": "Banco de dados relacional open-source", "en-US": "Open-source relational database" } },
  mysql: { label: "MySQL", description: { "pt-BR": "Banco de dados relacional popular", "en-US": "Popular relational database" } },
  sql: { label: "SQL", description: { "pt-BR": "Linguagem de consulta a bancos relacionais", "en-US": "Query language for relational databases" } },
  haproxy: { label: "HAProxy", description: { "pt-BR": "Balanceamento de carga e alta disponibilidade", "en-US": "Load balancing and high availability" } },
  linux: { label: "Linux", description: { "pt-BR": "Sistema operacional de servidores", "en-US": "Server operating system" } },
  appSecurity: { label: { "pt-BR": "Segurança de aplicações", "en-US": "Application security" }, description: { "pt-BR": "Boas práticas de segurança em aplicações web", "en-US": "Security practices for web applications" } },

  // Payments, WhatsApp and marketing
  pix: { label: "PIX", description: { "pt-BR": "Pagamento instantâneo do Banco Central", "en-US": "Brazil's instant payment system" } },
  payments: { label: { "pt-BR": "Pagamentos", "en-US": "Payments" }, description: { "pt-BR": "Cobrança, confirmação e conciliação", "en-US": "Charging, confirmation and reconciliation" } },
  crm: { label: "CRM", description: { "pt-BR": "Histórico e relacionamento com clientes", "en-US": "Customer history and relationships" } },
  whatsappApi: { label: "WhatsApp Business API", description: { "pt-BR": "API oficial da Meta para o WhatsApp", "en-US": "Meta's official WhatsApp API" } },
  googleAds: { label: "Google Ads", description: { "pt-BR": "Campanhas e conversões no Google", "en-US": "Campaigns and conversions on Google" } },
  ecommerce: { label: "E-commerce", description: { "pt-BR": "Vendas e operação on-line", "en-US": "Online sales and operations" } },
  marketing: { label: "Marketing", description: { "pt-BR": "Divulgação de produtos e serviços", "en-US": "Promoting products and services" } },
  salesManagement: { label: { "pt-BR": "Gestão de vendas", "en-US": "Sales management" }, description: { "pt-BR": "Estratégia e operação de vendas", "en-US": "Sales strategy and operations" } },
  wordpress: { label: "WordPress", description: { "pt-BR": "Sites e lojas em WordPress", "en-US": "WordPress sites and stores" } },

  // Product, design and ways of working
  saas: { label: "SaaS", description: { "pt-BR": "Software vendido como serviço", "en-US": "Software as a service" } },
  productEngineering: { label: "Product Engineering", description: { "pt-BR": "Engenharia com mentalidade de produto", "en-US": "Engineering with a product mindset" } },
  productDevelopment: { label: { "pt-BR": "Desenvolvimento de produtos", "en-US": "Product development" }, description: { "pt-BR": "Da ideia ao produto em operação", "en-US": "From an idea to a product in operation" } },
  softwareDevelopment: { label: { "pt-BR": "Desenvolvimento de software", "en-US": "Software development" }, description: { "pt-BR": "Sistemas construídos sob medida", "en-US": "Custom-built software" } },
  fullStack: { label: { "pt-BR": "Desenvolvimento full-stack", "en-US": "Full-stack development" }, description: { "pt-BR": "Do banco de dados à interface", "en-US": "From the database to the interface" } },
  webApps: { label: { "pt-BR": "Aplicações web", "en-US": "Web applications" }, description: { "pt-BR": "Sistemas que rodam no navegador", "en-US": "Software that runs in the browser" } },
  teamLeadership: { label: { "pt-BR": "Liderança de equipe", "en-US": "Team leadership" }, description: { "pt-BR": "Coordenação de times de desenvolvimento", "en-US": "Leading development teams" } },
  techManagement: { label: { "pt-BR": "Gestão de tecnologia", "en-US": "Technology management" }, description: { "pt-BR": "Escolha de stack e decisões técnicas", "en-US": "Choosing the stack and making technical calls" } },
  itConsulting: { label: { "pt-BR": "Consultoria de TI", "en-US": "IT consulting" }, description: { "pt-BR": "Diagnóstico e orientação técnica", "en-US": "Technical diagnosis and advice" } },
  entrepreneurship: { label: { "pt-BR": "Empreendedorismo", "en-US": "Entrepreneurship" }, description: { "pt-BR": "Criar e escalar negócios", "en-US": "Building and scaling businesses" } },
  automation: { label: { "pt-BR": "Automação", "en-US": "Automation" }, description: { "pt-BR": "Tarefas repetitivas feitas por sistemas", "en-US": "Repetitive tasks handled by software" } },
  processAutomation: { label: { "pt-BR": "Automação de processos", "en-US": "Process automation" }, description: { "pt-BR": "Fluxos que substituem trabalho manual", "en-US": "Workflows that replace manual work" } },
  imageProcessing: { label: { "pt-BR": "Processamento de imagem", "en-US": "Image processing" }, description: { "pt-BR": "Manipulação de imagens por código", "en-US": "Manipulating images in code" } },
  imageGeneration: { label: { "pt-BR": "Geração de imagens", "en-US": "Image generation" }, description: { "pt-BR": "Artes geradas automaticamente", "en-US": "Automatically generated artwork" } },
  design: { label: "Design", description: { "pt-BR": "Design visual e de experiência", "en-US": "Visual and experience design" } },
  uxDesign: { label: { "pt-BR": "Design de UX", "en-US": "UX design" }, description: { "pt-BR": "Experiência do usuário", "en-US": "User experience" } },
  graphicDesign: { label: { "pt-BR": "Design gráfico", "en-US": "Graphic design" }, description: { "pt-BR": "Comunicação visual", "en-US": "Visual communication" } },
  webDesign: { label: "Web design", description: { "pt-BR": "Layout e visual de sites", "en-US": "Website layout and visuals" } },
  english: { label: { "pt-BR": "Inglês", "en-US": "English" }, description: { "pt-BR": "Proficiência em inglês", "en-US": "English proficiency" } },
} satisfies Record<string, TagInfo>

export type TagId = keyof typeof tagCatalog

export function tagLabel(id: TagId, locale: Locale) {
  return localize(tagCatalog[id].label, locale)
}

export function tagDescription(id: TagId, locale: Locale) {
  return tagCatalog[id].description[locale]
}

// ---------- Experience, education and certificates ----------

export const employmentTypes = {
  "self-employed": { "pt-BR": "Autônomo", "en-US": "Self-employed" },
  freelance: { "pt-BR": "Freelance", "en-US": "Freelance" },
} satisfies Record<string, Record<Locale, string>>

export const workplaces = {
  remote: { "pt-BR": "Remoto", "en-US": "Remote" },
} satisfies Record<string, Record<Locale, string>>

export interface ExperienceItem {
  company: string
  roleKey: TranslationKey
  descKey: TranslationKey
  period: Period
  workplace: keyof typeof workplaces
  type: keyof typeof employmentTypes
  tags: TagId[]
  logo?: string
  // A black logo on a transparent background, drawn white in the dark theme.
  invertLogoInDark?: boolean
}

export type EducationStatus = "in-progress" | "upcoming"

export const educationStatusKeys: Record<EducationStatus, TranslationKey> = {
  "in-progress": "experience.status.inProgress",
  upcoming: "experience.status.upcoming",
}

export interface EducationItem {
  institution: string
  degreeKey: TranslationKey
  period: Period
  location: Text
  status?: EducationStatus
  logo?: string
}

export interface CertificateItem {
  name: Text
  issuer: string
  period: Period
  // Printed after the issuer: the course length or the score.
  detail?: Text
  // Shown when the item is opened.
  description?: Text
  tags: TagId[]
  credentialUrl?: string
  logo?: string
}

// The studio first, then the products and roles by relevance; every role is still running.
export const workExperience: ExperienceItem[] = [
  {
    company: "Ewzxyh Labs",
    roleKey: "experience.ewzxyh.role",
    descKey: "experience.ewzxyh.desc",
    period: { from: "2021-01", to: "present" },
    workplace: "remote",
    type: "self-employed",
    tags: ["productDevelopment", "softwareDevelopment", "fullStack", "nextjs", "react", "javascript", "postgresql", "restApis", "webApps", "webgl", "design", "uxDesign", "webDesign", "itConsulting"],
    logo: "/empresas/ewzxyh-logo-black.png",
    invertLogoInDark: true,
  },
  {
    company: "CasePay",
    roleKey: "experience.casepay.role",
    descKey: "experience.casepay.desc",
    period: { from: "2025-11", to: "present" },
    workplace: "remote",
    type: "self-employed",
    tags: ["nextjs", "pix", "payments", "crm", "restApis", "appSecurity", "laravel", "entrepreneurship"],
    logo: "/empresas/casepay.png",
  },
  {
    company: "Case Agência Digital",
    roleKey: "experience.case.role",
    descKey: "experience.case.desc",
    period: { from: "2024-02", to: "present" },
    workplace: "remote",
    type: "freelance",
    tags: ["nextjs", "typescript", "react", "laravel", "restApis", "whatsappApi", "googleAds", "saas", "fullStack", "teamLeadership", "webgl", "gsap", "postgresql", "productDevelopment"],
    logo: "/empresas/caselogoicon.png",
  },
  {
    company: "LotoHub",
    roleKey: "experience.lotohub.role",
    descKey: "experience.lotohub.desc",
    period: { from: "2024-12", to: "present" },
    workplace: "remote",
    type: "self-employed",
    tags: ["saas", "productEngineering", "productDevelopment", "nextjs", "typescript", "go", "restApis", "ecommerce", "softwareDevelopment"],
    logo: "/empresas/lotohublogo.webp",
  },
  {
    company: "SELOESGO",
    roleKey: "experience.seloesgo.role",
    descKey: "experience.seloesgo.desc",
    period: { from: "2021-09", to: "present" },
    workplace: "remote",
    type: "freelance",
    tags: ["productEngineering", "processAutomation", "imageGeneration", "imageProcessing", "nextjs", "restApis", "whatsappApi", "postgresql", "design"],
    logo: "/empresas/seloesgologo.jpeg",
  },
  {
    company: "Loteria Amazonas",
    roleKey: "experience.loteria.role",
    descKey: "experience.loteria.desc",
    period: { from: "2024-12", to: "present" },
    workplace: "remote",
    type: "freelance",
    tags: ["nextjs", "ecommerce", "automation", "googleAds", "techManagement"],
    logo: "/empresas/rainhalogo.png",
  },
  {
    company: "Lovtok",
    roleKey: "experience.lovtok.role",
    descKey: "experience.lovtok.desc",
    period: { from: "2021-07", to: "present" },
    workplace: "remote",
    type: "self-employed",
    tags: ["ecommerce", "wordpress", "googleAds", "marketing", "uxDesign", "graphicDesign", "salesManagement", "entrepreneurship"],
    logo: "/empresas/lovtoklogo.jpeg",
  },
]

export const education: EducationItem[] = [
  {
    institution: "New Brunswick Community College (NBCC)",
    degreeKey: "experience.edu.nbcc",
    period: { from: "2026-09", to: "2028-05" },
    location: { "pt-BR": "Canadá", "en-US": "Canada" },
    status: "in-progress",
    logo: "/estudo/nbcc.jpg",
  },
  {
    institution: "PUC Goiás",
    degreeKey: "experience.edu.puc",
    period: { from: "2021-02", to: "2024-12" },
    location: { "pt-BR": "Brasil", "en-US": "Brazil" },
    logo: "/estudo/pucgoias_logo.jpeg",
  },
  {
    institution: "Colégio WR",
    degreeKey: "experience.edu.colegio",
    period: { from: "2019-01", to: "2021-12" },
    location: { "pt-BR": "Brasil", "en-US": "Brazil" },
    logo: "/estudo/wr.png",
  },
  {
    institution: "Escola Interamérica",
    degreeKey: "experience.edu.escola",
    period: { from: "2011-01", to: "2018-12" },
    location: { "pt-BR": "Brasil", "en-US": "Brazil" },
    logo: "/estudo/interamerica.jpg",
  },
]

// Newest first. Course titles, lengths, instructors and dates come from the public credential pages.
export const certificates: CertificateItem[] = [
  {
    name: { "pt-BR": "Curso de React JS 19 e Next.js 15", "en-US": "React JS 19 and Next.js 15 Course" },
    issuer: "Udemy",
    period: { from: "2025-10" },
    detail: { "pt-BR": "83,5 h", "en-US": "83.5 h" },
    description: {
      "pt-BR": "Instrutores: Luiz Otávio Miranda e Tales Calogi Malaquias.",
      "en-US": "Instructors: Luiz Otávio Miranda and Tales Calogi Malaquias.",
    },
    tags: ["nextjs", "react", "typescript", "tailwind", "restApis"],
    credentialUrl: "https://www.udemy.com/certificate/UC-b627ea8a-f5cf-4546-b57d-96303228436d/",
    logo: "/certificados/udemy_logo.jpeg",
  },
  {
    name: "Duolingo English Test",
    issuer: "Duolingo",
    period: { from: "2025-09" },
    detail: "110/160 · CEFR B2",
    description: {
      "pt-BR": "Inglês intermediário superior (B2): entende textos técnicos complexos e conversa com fluência.",
      "en-US": "Upper intermediate English (B2): understands complex technical texts and converses fluently.",
    },
    tags: ["english"],
    logo: "/certificados/duolingo_english_test__logo.jpeg",
  },
  {
    name: { "pt-BR": "Curso de inglês por imersão (programa de 1 ano)", "en-US": "English Immersion Course (1-year program)" },
    issuer: "Believer Inglês por Imersão",
    period: { from: "2025-03" },
    tags: ["english"],
    logo: "/certificados/believer.png",
  },
  {
    name: { "pt-BR": "Java COMPLETO: Programação Orientada a Objetos + Projetos", "en-US": "Complete Java: Object-Oriented Programming + Projects" },
    issuer: "Udemy",
    period: { from: "2024-11" },
    detail: "54 h",
    description: { "pt-BR": "Instrutor: Nelio Alves.", "en-US": "Instructor: Nelio Alves." },
    tags: ["java", "oop", "springBoot", "hibernate", "postgresql"],
    credentialUrl: "https://www.udemy.com/certificate/UC-fef74280-d7e8-44c2-b3ce-ca4ec4a8796e/",
    logo: "/certificados/udemy_logo.jpeg",
  },
  {
    name: { "pt-BR": "Curso completo de PostgreSQL: do básico ao avançado", "en-US": "Complete PostgreSQL Course: From Beginner to Advanced" },
    issuer: "Udemy",
    period: { from: "2024-11" },
    detail: { "pt-BR": "48,5 h", "en-US": "48.5 h" },
    description: { "pt-BR": "Instrutor: Vitor Mazuco.", "en-US": "Instructor: Vitor Mazuco." },
    tags: ["postgresql", "sql", "haproxy", "linux"],
    credentialUrl: "https://www.udemy.com/certificate/UC-4896293f-c9bd-4b86-812e-6932927d2a01/",
    logo: "/certificados/udemy_logo.jpeg",
  },
  {
    name: { "pt-BR": "Curso Vue JS 2: O Guia Completo (incl. Vue Router e Vuex)", "en-US": "Vue JS 2: The Complete Guide (incl. Vue Router & Vuex)" },
    issuer: "Udemy",
    period: { from: "2024-04" },
    detail: "43 h",
    description: {
      "pt-BR": "Instrutores: Leonardo Moura Leitão, Cod3r e Maximilian Schwarzmüller.",
      "en-US": "Instructors: Leonardo Moura Leitão, Cod3r and Maximilian Schwarzmüller.",
    },
    tags: ["vue", "javascript", "vueRouter", "vuex"],
    credentialUrl: "https://www.udemy.com/certificate/UC-7aa963e5-e616-4bf9-b4ab-3aea7a3e5a0a/",
    logo: "/certificados/udemy_logo.jpeg",
  },
  {
    name: { "pt-BR": "Curso de inglês", "en-US": "English Course" },
    issuer: "Cultura Inglesa",
    period: { from: "2016-01", to: "2019-10" },
    tags: ["english"],
    logo: "/certificados/cultura_inglesa_logo.jpeg",
  },
]

// ---------- Projects ----------

export interface Project {
  id: string
  title: Text
  // What it is and what Enzo's part was, printed above the title ("SaaS · Founder").
  kind: Text
  context: Text
  description: Text
  tags: Text[]
  url?: string
  // Shown instead of a link when there is no public page.
  note?: Text
}

// "https://api.example.com/docs/" -> "api.example.com/docs"
export function projectHost(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

export const projects: Project[] = [
  {
    id: "grapnel",
    title: "Grapnel",
    kind: "SaaS",
    context: { "pt-BR": "Produto próprio", "en-US": "Own product" },
    description: {
      "pt-BR":
        "Um link que distribui os contatos das campanhas entre os vendedores no WhatsApp. Conecta os números por QR Code, mostra cliques e conversas por campanha e avisa por e-mail quando um número desconecta.",
      "en-US":
        "One link that spreads campaign contacts across a sales team on WhatsApp. It connects numbers by QR code, shows clicks and conversations per campaign and sends an email when a number disconnects.",
    },
    tags: ["Next.js", "Stripe", "WhatsApp", { "pt-BR": "API e webhooks", "en-US": "API and webhooks" }],
    url: "https://grapnel.com.br",
  },
  {
    id: "lotohub",
    title: "LotoHub",
    kind: "SaaS",
    context: { "pt-BR": "Fundador", "en-US": "Founder" },
    description: {
      "pt-BR":
        "Cria o site de uma lotérica em minutos, com bolões, resultados, endereço e botão de WhatsApp. Prévia antes de pagar, bolões cadastrados por foto ou importados do Marketplace CAIXA, artes para divulgar e domínio próprio.",
      "en-US":
        "Builds a lottery retailer's website in minutes, with lottery pools, results, address and a WhatsApp button. Preview before paying, pools added from a photo or imported from the CAIXA Marketplace, promo artwork and a custom domain.",
    },
    tags: ["Next.js", "Supabase", "Stripe", "Multi-tenant"],
    url: "https://lotohub.com.br",
  },
  {
    id: "casepay",
    title: "CasePay",
    kind: { "pt-BR": "Pagamentos e CRM", "en-US": "Payments and CRM" },
    context: { "pt-BR": "Cofundador", "en-US": "Co-founder" },
    description: {
      "pt-BR":
        "PIX, CRM e aviso ao cliente em um só fluxo para lotéricas: a cobrança PIX Copia e Cola sai em segundos, o pagamento é confirmado sozinho, o cliente é avisado e o CRM guarda o histórico. Inclui métricas da operação e metas por atendente.",
      "en-US":
        "PIX payments, a CRM and customer notices in one flow for lottery retailers: the PIX charge is ready in seconds, payment is confirmed automatically, the customer is notified and the CRM keeps the history. Includes operational metrics and per-agent goals.",
    },
    tags: ["Next.js", "PIX", "CRM", { "pt-BR": "Notificações", "en-US": "Notifications" }],
    url: "https://casepay.com.br",
  },
  {
    id: "seloesgo",
    title: { "pt-BR": "SELOESGO Automação", "en-US": "SELOESGO Automation" },
    kind: { "pt-BR": "Automação", "en-US": "Automation" },
    context: "SELOESGO",
    description: {
      "pt-BR":
        "Sistema integrado à ConectaLot que gera e distribui artes automaticamente para mais de 630 lotéricas em Goiás, reduzindo uma rotina manual de horas para segundos.",
      "en-US":
        "System integrated with ConectaLot that automatically generates and distributes artwork to more than 630 lottery retailers in Goiás, cutting a manual routine from hours to seconds.",
    },
    tags: [{ "pt-BR": "Automação", "en-US": "Automation" }, "ConectaLot API", { "pt-BR": "Geração de imagens", "en-US": "Image generation" }, "Design Ops"],
    note: { "pt-BR": "Sistema interno", "en-US": "Internal system" },
  },
  {
    id: "marketplace-api",
    title: { "pt-BR": "API Loteria Marketplace", "en-US": "Loteria Marketplace API" },
    kind: "API",
    context: "LotoHub",
    description: {
      "pt-BR":
        "Mantém sincronizado o catálogo de bolões do Marketplace CAIXA e alimenta o LotoHub: coleta agendada, histórico de bolões, resultados e premiações oficiais, chaves de API com escopo e validade, limite de 600 leituras por minuto e auditoria das consultas à CAIXA.",
      "en-US":
        "Keeps the CAIXA Marketplace lottery pool catalog in sync and feeds LotoHub: scheduled collection, pool history, official results and prizes, scoped API keys with expiry, a 600 reads per minute limit and an audit trail of every request to CAIXA.",
    },
    tags: ["Go", "OpenAPI", "Worker", "Rate limiting"],
    url: "https://api.loteriamarketplace.com.br/docs",
  },
  {
    id: "casezap",
    title: "CaseZap",
    kind: "SaaS",
    context: "Case",
    description: {
      "pt-BR":
        "Gerenciador de instâncias de WhatsApp com painel, métricas, financeiro e automações. Também funciona como canal de WhatsApp dentro da ChatCase.",
      "en-US":
        "WhatsApp instance manager with a dashboard, analytics, billing and automations. It also works as a WhatsApp channel inside ChatCase.",
    },
    tags: ["Next.js", "WhatsApp", "Dashboard"],
    note: { "pt-BR": "Acesso para clientes", "en-US": "Customer access only" },
  },
  {
    id: "chatcase",
    title: "ChatCase",
    kind: { "pt-BR": "Chatbots e automação", "en-US": "Chatbots and automation" },
    context: "Case",
    description: {
      "pt-BR":
        "Plataforma de chatbots e automação com IA, parceira verificada da Meta na API oficial do WhatsApp. Desenvolvi o site, os geradores de link para WhatsApp e para lotéricas e a integração com o CaseZap.",
      "en-US":
        "AI chatbot and automation platform, a verified Meta Business Partner on the official WhatsApp API. I built the website, the WhatsApp and lottery link generators and the CaseZap integration.",
    },
    tags: ["Next.js", "WhatsApp Business API", "Chatbots", { "pt-BR": "IA", "en-US": "AI" }],
    url: "https://chatcase.com.br",
  },
  {
    id: "loteria-amazonas",
    title: "Loteria Amazonas",
    kind: "E-commerce",
    context: { "pt-BR": "Cliente", "en-US": "Client" },
    description: {
      "pt-BR":
        "Site da lotérica Rainha do Jogo, em Goiânia desde 1989: vitrine de bolões oficiais da CAIXA com fechamento pelo WhatsApp, comprovante com nome e CPF, resultados, CMS próprio e campanhas no Google Ads.",
      "en-US":
        "Website for the Rainha do Jogo lottery retailer, in Goiânia since 1989: a storefront for official CAIXA lottery pools that closes sales on WhatsApp, receipts with name and tax ID, results, a custom CMS and Google Ads campaigns.",
    },
    tags: ["Next.js", "CMS", "WhatsApp", "Google Ads"],
    url: "https://loteriaamazonas.com.br",
  },
  {
    id: "loteria-caseshop",
    title: "Loteria CaseShop",
    kind: "E-commerce",
    context: "Case",
    description: {
      "pt-BR":
        "Loja de bolões on-line da lotérica CaseShop: prêmios estimados e resultados de todas as loterias da CAIXA, compra de cotas e atendimento pelo WhatsApp.",
      "en-US":
        "Online lottery pool store for the CaseShop lottery retailer: estimated prizes and results for every CAIXA lottery, quota purchases and WhatsApp support.",
    },
    tags: ["Next.js", "Supabase", "E-commerce"],
    url: "https://caseshop.com.br",
  },
  {
    id: "caseshop",
    title: "CaseShop",
    kind: "Landing page",
    context: "Case",
    description: {
      "pt-BR":
        "Página da CaseShop, plataforma que transforma o WhatsApp em loja: catálogo, atendimento com IA, recuperação de carrinho, campanhas e métricas.",
      "en-US":
        "Landing page for CaseShop, a platform that turns WhatsApp into a store: catalog, AI-assisted service, cart recovery, campaigns and analytics.",
    },
    tags: ["Next.js", "Chat commerce", "Landing page"],
    url: "https://caseshop.vercel.app",
  },
  {
    id: "lorenzpay",
    title: "LorenzPay",
    kind: "Landing page",
    context: { "pt-BR": "Cliente", "en-US": "Client" },
    description: {
      "pt-BR":
        "Página da LorenzPay, serviço de recebimento por PIX que assume a defesa contra contestações MED 2.0. Explica o fluxo em etapas, traz perguntas frequentes e leva ao contato pelo WhatsApp.",
      "en-US":
        "Landing page for LorenzPay, a PIX collection service that takes over the defense against MED 2.0 disputes. It explains the flow step by step, answers common questions and leads to WhatsApp contact.",
    },
    tags: ["Next.js", "PIX", "Landing page"],
    url: "https://lorenzpay.vercel.app",
  },
]

// ---------- Skills ----------

export interface Skill {
  name: string
  icon: string
  descriptionKey: TranslationKey
}

export interface SkillCategory {
  titleKey: TranslationKey
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    titleKey: "skills.frontend",
    skills: [
      { name: "Next.js", icon: "nextjs", descriptionKey: "skills.nextjs.desc" },
      { name: "React", icon: "react", descriptionKey: "skills.react.desc" },
      { name: "TypeScript", icon: "typescript", descriptionKey: "skills.typescript.desc" },
      { name: "JavaScript", icon: "javascript", descriptionKey: "skills.javascript.desc" },
      { name: "Tailwind CSS", icon: "tailwindcss", descriptionKey: "skills.tailwind.desc" },
      { name: "GSAP", icon: "gsap", descriptionKey: "skills.gsap.desc" },
      { name: "WebGL", icon: "webgl", descriptionKey: "skills.webgl.desc" },
      { name: "Three.js", icon: "threejs", descriptionKey: "skills.threejs.desc" },
      { name: "Figma", icon: "figma", descriptionKey: "skills.figma.desc" },
      { name: "Vite", icon: "vite", descriptionKey: "skills.vite.desc" },
      { name: "Expo", icon: "expo", descriptionKey: "skills.expo.desc" },
    ],
  },
  {
    titleKey: "skills.backend",
    skills: [
      { name: "Node.js", icon: "nodejs", descriptionKey: "skills.nodejs.desc" },
      { name: "Bun", icon: "bun", descriptionKey: "skills.bun.desc" },
      { name: "Go", icon: "go", descriptionKey: "skills.go.desc" },
      { name: "Laravel", icon: "laravel", descriptionKey: "skills.laravel.desc" },
      { name: "PHP", icon: "php", descriptionKey: "skills.php.desc" },
      { name: "REST API", icon: "openapi", descriptionKey: "skills.restapi.desc" },
      { name: "PostgreSQL", icon: "postgresql", descriptionKey: "skills.postgresql.desc" },
      { name: "MySQL", icon: "mysql", descriptionKey: "skills.mysql.desc" },
      { name: "Supabase", icon: "supabase", descriptionKey: "skills.supabase.desc" },
      { name: "Prisma", icon: "prisma", descriptionKey: "skills.prisma.desc" },
      { name: "Redis", icon: "redis", descriptionKey: "skills.redis.desc" },
    ],
  },
  {
    titleKey: "skills.integrations",
    skills: [
      { name: "PIX", icon: "pix", descriptionKey: "skills.pix.desc" },
      { name: "Stripe", icon: "stripe", descriptionKey: "skills.stripe.desc" },
      { name: "WhatsApp", icon: "whatsapp", descriptionKey: "skills.whatsapp.desc" },
      { name: "Meta Pixel", icon: "meta", descriptionKey: "skills.meta.desc" },
      { name: "Google Ads", icon: "googleads", descriptionKey: "skills.googleads.desc" },
    ],
  },
  {
    titleKey: "skills.infra",
    skills: [
      { name: "Vercel", icon: "vercel", descriptionKey: "skills.vercel.desc" },
      { name: "Docker", icon: "docker", descriptionKey: "skills.docker.desc" },
      { name: "Coolify", icon: "coolify", descriptionKey: "skills.coolify.desc" },
      { name: "Nginx", icon: "nginx", descriptionKey: "skills.nginx.desc" },
      { name: "Cloudflare", icon: "cloudflare", descriptionKey: "skills.cloudflare.desc" },
      { name: "Linux", icon: "linux", descriptionKey: "skills.linux.desc" },
      { name: "Git", icon: "git", descriptionKey: "skills.git.desc" },
      { name: "GitHub Actions", icon: "githubactions", descriptionKey: "skills.githubactions.desc" },
      { name: "Bash", icon: "bash", descriptionKey: "skills.bash.desc" },
    ],
  },
  {
    titleKey: "skills.ai",
    skills: [
      { name: "n8n", icon: "n8n", descriptionKey: "skills.n8n.desc" },
      { name: "ChatCase", icon: "chatcase", descriptionKey: "skills.chatcase.desc" },
      { name: "OpenAI", icon: "openai", descriptionKey: "skills.openai.desc" },
      { name: "Claude", icon: "claude", descriptionKey: "skills.claude.desc" },
      { name: "Gemini", icon: "gemini", descriptionKey: "skills.gemini.desc" },
    ],
  },
]
