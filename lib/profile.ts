// Portfolio facts shared by the page and by everything generated for crawlers and agents
// (markdown twins, llms.txt, JSON-LD). Plain data: no JSX, no "use client".

import type { Locale, TranslationKey } from "./translations"

// ---------- Experience, education and certificates ----------

export interface ExperienceItem {
  company: string
  roleKey: TranslationKey
  descKey: TranslationKey
  period: string
  location: string
  type: string
  skills: string[]
  logo?: string
}

export interface EducationItem {
  institution: string
  degreeKey: TranslationKey
  period: string
  locationKey?: TranslationKey
  logo?: string
  highlighted?: boolean
}

export interface CertificateItem {
  nameKey: TranslationKey
  issuer: string
  date: string
  skills: string[]
  credentialUrl?: string
  logo?: string
}

export const workExperience: ExperienceItem[] = [
  {
    company: "CasePay",
    roleKey: "experience.casepay.role",
    descKey: "experience.casepay.desc",
    period: "nov 2025 - Present",
    location: "Remota",
    type: "Autônomo",
    skills: ["Laravel", "PHP", "REST APIs", "Next.js", "Segurança de aplicativos web", "Payment Processing", "Empreendedorismo", "MySQL"],
    logo: "/empresas/casepay.png",
  },
  {
    company: "Case Agência Digital",
    roleKey: "experience.case.role",
    descKey: "experience.case.desc",
    period: "fev 2024 - Present",
    location: "Remota",
    type: "Freelance",
    skills: ["Next.js", "TypeScript", "Laravel", "React.js", "REST APIs", "WhatsApp Business API", "Google Ads", "SaaS", "Full-Stack Development", "Team Leadership", "WebGL", "GSAP", "PostgreSQL", "Product Development"],
    logo: "/empresas/caselogoicon.png",
  },
  {
    company: "SELOESGO",
    roleKey: "experience.seloesgo.role",
    descKey: "experience.seloesgo.desc",
    period: "set 2021 - Present",
    location: "Remota",
    type: "Freelance",
    skills: ["Design", "Next.js", "Product Engineer", "REST APIs", "Automação de processos", "WhatsApp Business API", "Processamento de imagem", "Geração de Imagem", "PostgreSQL"],
    logo: "/empresas/seloesgologo.jpeg",
  },
  {
    company: "Loteria Amazonas",
    roleKey: "experience.loteria.role",
    descKey: "experience.loteria.desc",
    period: "dez 2024 - Present",
    location: "Remota",
    type: "Freelance",
    skills: ["Gestão de tecnologias", "Next.js", "Google Ads", "Automação", "Comércio eletrônico"],
    logo: "/empresas/rainhalogo.png",
  },
  {
    company: "LotoHub",
    roleKey: "experience.lotohub.role",
    descKey: "experience.lotohub.desc",
    period: "dez 2024 - Present",
    location: "Remota",
    type: "Autônomo",
    skills: ["SaaS", "Desenvolvimento de produtos", "Desenvolvimento de software", "Comércio eletrônico", "Product Engineer", "REST APIs", "Next.js", "TypeScript"],
    logo: "/empresas/lotohublogo.webp",
  },
  {
    company: "Lovtok",
    roleKey: "experience.lovtok.role",
    descKey: "experience.lovtok.desc",
    period: "jul 2021 - Present",
    location: "Remota",
    type: "Autônomo",
    skills: ["Google Ads", "Comércio eletrônico", "Marketing", "Design de experiência do usuário (UX)", "Design gráfico", "Desenvolvimento WordPress", "Gestão de vendas", "Empreendedorismo"],
    logo: "/empresas/lovtoklogo.jpeg",
  },
  {
    company: "Ewzxyh Labs",
    roleKey: "experience.ewzxyh.role",
    descKey: "experience.ewzxyh.desc",
    period: "jan 2021 - Present",
    location: "Remota",
    type: "Autônomo",
    skills: ["Desenvolvimento de software", "Desenvolvimento de produtos", "Next.js", "PostgreSQL", "REST APIs", "React.js", "Full-Stack Development", "Consultoria de TI", "JavaScript", "WebGL", "Aplicativos web", "Design", "Design de experiência do usuário (UX)", "Web design"],
    logo: "/empresas/ewzxyh-logo-black.png",
  },
]

export const education: EducationItem[] = [
  {
    institution: "NBCC",
    degreeKey: "experience.edu.nbcc",
    period: "set 2026 - mai 2028",
    locationKey: "experience.location.canada",
    logo: "/estudo/nbcc.jpg",
    highlighted: true,
  },
  {
    institution: "PUC-GO",
    degreeKey: "experience.edu.puc",
    period: "fev 2021 - dez 2024",
    locationKey: "experience.location.brazil",
    logo: "/estudo/pucgoias_logo.jpeg",
  },
  {
    institution: "Colégio WR",
    degreeKey: "experience.edu.colegio",
    period: "jan 2019 - dez 2021",
    locationKey: "experience.location.brazil",
    logo: "/estudo/wr.png",
  },
  {
    institution: "Escola Interamérica",
    degreeKey: "experience.edu.escola",
    period: "jan 2011 - dez 2018",
    locationKey: "experience.location.brazil",
    logo: "/estudo/interamerica.jpg",
  },
]

export const certificates: CertificateItem[] = [
  {
    nameKey: "experience.cert.nextjs",
    issuer: "Udemy",
    date: "set 2025",
    skills: ["Next.js", "Tailwind CSS", "TypeScript", "REST APIs", "React"],
    credentialUrl: "https://www.udemy.com/certificate/UC-b627ea8a-f5cf-4546-b57d-96303228436d/",
    logo: "/certificados/udemy_logo.jpeg",
  },
  {
    nameKey: "experience.cert.english.believer",
    issuer: "BELIEVER INGLÊS POR IMERSÃO",
    date: "mar 2025",
    skills: ["English"],
    logo: "/certificados/believer.png",
  },
  {
    nameKey: "experience.cert.java",
    issuer: "Udemy",
    date: "nov 2024",
    skills: ["Java", "OOP", "Spring Boot", "Hibernate", "PostgreSQL"],
    credentialUrl: "https://www.udemy.com/certificate/UC-fef74280-d7e8-44c2-b3ce-ca4ec4a8796e/",
    logo: "/certificados/udemy_logo.jpeg",
  },
  {
    nameKey: "experience.cert.postgres",
    issuer: "Udemy",
    date: "jun 2024",
    skills: ["PostgreSQL", "SQL", "HAProxy", "Linux"],
    credentialUrl: "https://www.udemy.com/certificate/UC-4896293f-c9bd-4b86-812e-6932927d2a01/",
    logo: "/certificados/udemy_logo.jpeg",
  },
  {
    nameKey: "experience.cert.vue",
    issuer: "Udemy",
    date: "abr 2024",
    skills: ["Vue.js", "JavaScript", "Vue Router", "Vuex"],
    credentialUrl: "https://www.udemy.com/certificate/UC-7aa963e5-e616-4bf9-b4ab-3aea7a3e5a0a/",
    logo: "/certificados/udemy_logo.jpeg",
  },
  {
    nameKey: "experience.cert.english.cultura",
    issuer: "Cultura Inglesa",
    date: "jan 2016 - out 2019",
    skills: ["English"],
    logo: "/certificados/cultura_inglesa_logo.jpeg",
  },
  {
    nameKey: "experience.cert.english.duolingo",
    issuer: "Duolingo English Test",
    date: "2024",
    skills: ["English"],
    credentialUrl: "https://certs.duolingo.com/4yw87od9hv48b53o",
    logo: "/certificados/duolingo_english_test__logo.jpeg",
  },
]

// ---------- Featured projects ----------

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  featured?: boolean
}

export const projectsByLocale: Record<Locale, Project[]> = {
  "pt-BR": [
    {
      id: "1",
      title: "CasePay",
      description:
        "Gateway de pagamentos para lotéricas e pequenos negócios, com checkout, dashboard financeiro, gestão de transações, repasses e integrações com o ecossistema Case.",
      tags: ["Laravel", "Next.js", "Pagamentos", "Dashboard"],
      featured: true,
    },
    {
      id: "2",
      title: "LotoHub",
      description:
        "SaaS para criação e gestão centralizada de sites de lotéricas, com e-commerce, painel administrativo, automação de atendimento e integração de pagamentos.",
      tags: ["Next.js", "Supabase", "Stripe", "SaaS"],
      featured: true,
    },
    {
      id: "3",
      title: "SELOESGO Automação",
      description:
        "Sistema integrado à ConectaLot que gera e distribui artes automaticamente para mais de 630 lotéricos em Goiás, reduzindo uma rotina manual de horas para segundos.",
      tags: ["Automação", "ConectaLot", "Design Ops", "API"],
      featured: true,
    },
  ],
  "en-US": [
    {
      id: "1",
      title: "CasePay",
      description:
        "Payment gateway for lottery retailers and small businesses, with checkout, financial dashboard, transaction management, payouts, and integrations with the Case ecosystem.",
      tags: ["Laravel", "Next.js", "Payments", "Dashboard"],
      featured: true,
    },
    {
      id: "2",
      title: "LotoHub",
      description:
        "SaaS for creating and centrally managing lottery retailer websites, with e-commerce, admin panel, support automation, and payment integration.",
      tags: ["Next.js", "Supabase", "Stripe", "SaaS"],
      featured: true,
    },
    {
      id: "3",
      title: "SELOESGO Automation",
      description:
        "System integrated with ConectaLot that automatically generates and distributes creative assets for more than 630 lottery retailers in Goiás, reducing a manual routine from hours to seconds.",
      tags: ["Automation", "ConectaLot", "Design Ops", "API"],
      featured: true,
    },
  ],
}

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
      { name: "React", icon: "react", descriptionKey: "skills.react.desc" },
      { name: "Expo", icon: "expo", descriptionKey: "skills.expo.desc" },
      { name: "Next.js", icon: "nextjs", descriptionKey: "skills.nextjs.desc" },
      { name: "TypeScript", icon: "typescript", descriptionKey: "skills.typescript.desc" },
      { name: "JavaScript", icon: "javascript", descriptionKey: "skills.javascript.desc" },
      { name: "Tailwind CSS", icon: "tailwindcss", descriptionKey: "skills.tailwind.desc" },
      { name: "Figma", icon: "figma", descriptionKey: "skills.figma.desc" },
      { name: "Three.js", icon: "threejs", descriptionKey: "skills.threejs.desc" },
      { name: "GSAP", icon: "gsap", descriptionKey: "skills.gsap.desc" },
      { name: "Vite", icon: "vite", descriptionKey: "skills.vite.desc" },
      { name: "WebGL", icon: "webgl", descriptionKey: "skills.webgl.desc" },
      { name: "PHP", icon: "php", descriptionKey: "skills.php.desc" },
    ],
  },
  {
    titleKey: "skills.backend",
    skills: [
      { name: "Node.js", icon: "nodejs", descriptionKey: "skills.nodejs.desc" },
      { name: "Bun", icon: "bun", descriptionKey: "skills.bun.desc" },
      { name: "PHP", icon: "php", descriptionKey: "skills.php.desc" },
      { name: "Laravel", icon: "laravel", descriptionKey: "skills.laravel.desc" },
      { name: "REST API", icon: "openapi", descriptionKey: "skills.restapi.desc" },
      { name: "PostgreSQL", icon: "postgresql", descriptionKey: "skills.postgresql.desc" },
      { name: "MySQL", icon: "mysql", descriptionKey: "skills.mysql.desc" },
      { name: "Supabase", icon: "supabase", descriptionKey: "skills.supabase.desc" },
      { name: "Prisma", icon: "prisma", descriptionKey: "skills.prisma.desc" },
      { name: "Redis", icon: "redis", descriptionKey: "skills.redis.desc" },
    ],
  },
  {
    titleKey: "skills.automation",
    skills: [
      { name: "Git", icon: "git", descriptionKey: "skills.git.desc" },
      { name: "Docker", icon: "docker", descriptionKey: "skills.docker.desc" },
      { name: "Linux", icon: "linux", descriptionKey: "skills.linux.desc" },
      { name: "Vercel", icon: "vercel", descriptionKey: "skills.vercel.desc" },
      { name: "Cloudflare", icon: "cloudflare", descriptionKey: "skills.cloudflare.desc" },
      { name: "Nginx", icon: "nginx", descriptionKey: "skills.nginx.desc" },
      { name: "Coolify", icon: "coolify", descriptionKey: "skills.coolify.desc" },
      { name: "n8n", icon: "n8n", descriptionKey: "skills.n8n.desc" },
      { name: "Bash", icon: "bash", descriptionKey: "skills.bash.desc" },
      { name: "GitHub Actions", icon: "githubactions", descriptionKey: "skills.githubactions.desc" },
      { name: "ChatCase", icon: "chatcase", descriptionKey: "skills.chatcase.desc" },
      { name: "ChatGPT", icon: "openai", descriptionKey: "skills.chatgpt.desc" },
      { name: "Claude", icon: "claude", descriptionKey: "skills.claude.desc" },
      { name: "Gemini", icon: "gemini", descriptionKey: "skills.gemini.desc" },
    ],
  },
]
