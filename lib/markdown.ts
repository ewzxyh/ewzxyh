// Markdown and plain-text renderings of the portfolio for crawlers, LLMs and agents.
//
// Every sentence here comes from the same data the page renders (lib/translations.ts and lib/profile.ts), so the
// markdown twins (/index.md, /about.md, ...), /llms.txt and /llms-full.txt can never drift from the site.

import { certificates, education, projectsByLocale, skillCategories, workExperience } from "./profile"
import {
  brandName,
  contactEmail,
  handle,
  pageUrl,
  personName,
  siteDescription,
  siteDescriptionEn,
  siteLastModified,
  siteName,
  siteUrl,
  socialProfiles,
  whatsappNumber,
} from "./site"
import { type Locale, translations, type TranslationKey } from "./translations"

export type DocId = "index" | "about" | "services" | "skills" | "experience" | "projects" | "contact"

export const docIds: readonly DocId[] = ["index", "about", "services", "skills", "experience", "projects", "contact"]

export const docLocales: readonly Locale[] = ["pt-BR", "en-US"]

// ---------- paths ----------

export function docPath(id: DocId, locale: Locale) {
  return locale === "pt-BR" ? `/${id}.md` : `/en/${id}.md`
}

export function docUrl(id: DocId, locale: Locale) {
  return `${siteUrl}${docPath(id, locale)}`
}

// ---------- small helpers ----------

const monthsEn: Record<string, string> = {
  jan: "Jan",
  fev: "Feb",
  mar: "Mar",
  abr: "Apr",
  mai: "May",
  jun: "Jun",
  jul: "Jul",
  ago: "Aug",
  set: "Sep",
  out: "Oct",
  nov: "Nov",
  dez: "Dec",
}

// Periods are stored the way the page prints them ("nov 2025 - Present"); each language gets its own spelling.
function formatPeriod(period: string, locale: Locale) {
  return period
    .split(/\s+-\s+/)
    .map((part) => {
      const [first, ...rest] = part.trim().split(/\s+/)
      const month = first.toLowerCase()
      if (month === "present") return locale === "pt-BR" ? "presente" : "Present"
      if (month in monthsEn) return [locale === "pt-BR" ? month : monthsEn[month], ...rest].join(" ")
      return part.trim()
    })
    .join(" – ")
}

function whatsappLink(locale: Locale) {
  const text = locale === "pt-BR" ? "Olá, vim pelo seu portfólio!" : "Hello, I came from your portfolio!"
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`
}

const tr = (locale: Locale, key: TranslationKey) => translations[locale][key]

// The page prints some chips and labels in Portuguese in both languages; the English markdown spells them out.
const enLabels: Record<string, string> = {
  Remota: "Remote",
  Autônomo: "Self-employed",
  "Segurança de aplicativos web": "Web application security",
  Empreendedorismo: "Entrepreneurship",
  "Automação de processos": "Process automation",
  Automação: "Automation",
  "Processamento de imagem": "Image processing",
  "Geração de Imagem": "Image generation",
  "Comércio eletrônico": "E-commerce",
  "Gestão de tecnologias": "Technology management",
  "Desenvolvimento de software": "Software development",
  "Desenvolvimento de produtos": "Product development",
  "Consultoria de TI": "IT consulting",
  "Design gráfico": "Graphic design",
  "Design de experiência do usuário (UX)": "User experience (UX) design",
  "Desenvolvimento WordPress": "WordPress development",
  "Gestão de vendas": "Sales management",
  "Gestão de projetos": "Project management",
  Marketing: "Marketing",
  "Aplicativo web": "Web application",
}
const label = (value: string, locale: Locale) => (locale === "en-US" ? (enLabels[value] ?? value) : value)

const bullet = (items: string[]) => items.map((item) => `- ${item}`).join("\n")

// ---------- copy that is not in the page dictionary ----------

const text = {
  "pt-BR": {
    pageTitle: `${personName} (${siteName}): Product Engineer`,
    summary: siteDescription,
    updated: "Atualizado em",
    language: "Idioma do conteúdo",
    facts: "Fatos rápidos",
    name: "Nome",
    alsoKnownAs: "também conhecido como",
    role: "Cargo",
    studio: "Estúdio",
    founder: "fundador",
    trackRecord: "Histórico",
    years: "anos de experiência",
    projects: "projetos",
    operators: "operadores",
    operatorsNote: "lotéricas de Goiás atendidas pela automação SELOESGO",
    languages: "Idiomas",
    languagesValue: "Português (Brasil) e inglês",
    availability: "Disponibilidade",
    site: "Site",
    profiles: "Perfis",
    contactLabel: "Contato",
    email: "E-mail",
    about: "Sobre",
    services: "Serviços",
    skills: "Habilidades",
    experienceTitle: "Experiência, educação e certificados",
    work: "Experiência profissional",
    education: "Educação",
    certificates: "Certificados",
    credential: "credencial",
    projectsTitle: "Projetos em destaque",
    contact: "Contato",
    faq: "Perguntas frequentes",
    notes: "Notas para assistentes de IA e agentes",
    tags: "Tecnologias e temas",
    description: "Descrição",
    type: "Tipo",
    location: "Local",
  },
  "en-US": {
    pageTitle: `${personName} (${siteName}): Product Engineer`,
    summary: siteDescriptionEn,
    updated: "Last updated",
    language: "Content language",
    facts: "Quick facts",
    name: "Name",
    alsoKnownAs: "also known as",
    role: "Role",
    studio: "Studio",
    founder: "founder",
    trackRecord: "Track record",
    years: "years of experience",
    projects: "projects",
    operators: "operators",
    operatorsNote: "lottery operators in Goiás served by the SELOESGO automation",
    languages: "Languages",
    languagesValue: "Portuguese (Brazil) and English",
    availability: "Availability",
    site: "Website",
    profiles: "Profiles",
    contactLabel: "Contact",
    email: "Email",
    about: "About",
    services: "Services",
    skills: "Skills",
    experienceTitle: "Experience, education and certificates",
    work: "Work experience",
    education: "Education",
    certificates: "Certificates",
    credential: "credential",
    projectsTitle: "Featured projects",
    contact: "Contact",
    faq: "Frequently asked questions",
    notes: "Notes for AI assistants and agents",
    tags: "Technologies and topics",
    description: "Description",
    type: "Type",
    location: "Location",
  },
} as const

function frontMatter(id: DocId, locale: Locale) {
  const t = text[locale]
  const titles: Record<DocId, string> = {
    index: t.pageTitle,
    about: `${t.about} | ${siteName}`,
    services: `${t.services} | ${brandName}`,
    skills: `${t.skills} | ${siteName}`,
    experience: `${t.work} | ${siteName}`,
    projects: `${t.projectsTitle} | ${siteName}`,
    contact: `${t.contact} | ${siteName}`,
  }
  return [
    "---",
    `title: ${titles[id]}`,
    `description: ${t.summary}`,
    `url: ${docUrl(id, locale)}`,
    `canonical: ${pageUrl(locale)}`,
    `language: ${locale}`,
    `updated: ${siteLastModified}`,
    "---",
    "",
  ].join("\n")
}

// ---------- sections ----------

function h(level: number, title: string) {
  return `${"#".repeat(level)} ${title}`
}

function factsBlock(locale: Locale, level: number) {
  const t = text[locale]
  return [
    h(level, t.facts),
    "",
    bullet([
      `**${t.name}:** ${personName} (${t.alsoKnownAs} ${siteName}, ${handle})`,
      `**${t.role}:** Product Engineer`,
      `**${t.studio}:** ${brandName} (${t.founder}: ${personName})`,
      `**${t.trackRecord}:** 5+ ${t.years}; 50+ ${t.projects}; 630+ ${t.operators} (${t.operatorsNote})`,
      `**${t.languages}:** ${t.languagesValue}`,
      `**${t.availability}:** ${tr(locale, "about.status")}`,
      `**${t.site}:** ${pageUrl(locale)}`,
      `**${t.contactLabel}:** [${contactEmail}](mailto:${contactEmail}), [WhatsApp](${whatsappLink(locale)})`,
    ]),
    "",
  ].join("\n")
}

function aboutSection(locale: Locale, level: number) {
  const t = text[locale]
  const intro = `${tr(locale, "about.intro")} **${personName}**, ${tr(locale, "about.description1")}`
  const second = `${tr(locale, "about.description2")} **Next.js** ${tr(locale, "about.description2.suffix")}`
  const third = `${tr(locale, "about.description3")} **${brandName}** ${tr(locale, "about.description3.suffix")}`
  const highlights = (["product", "design", "fullstack"] as const).map(
    (key) => `**${tr(locale, `about.${key}`)}:** ${tr(locale, `about.${key}.desc`)}`,
  )
  return [h(level, t.about), "", intro, "", second, "", third, "", bullet(highlights), "", `*${tr(locale, "about.status")}*`, ""].join("\n")
}

function servicesSection(locale: Locale, level: number) {
  const t = text[locale]
  const items = (["products", "systems", "automation"] as const).map(
    (key) => `**${tr(locale, `services.${key}`)}:** ${tr(locale, `services.${key}.desc`)}`,
  )
  return [h(level, `${t.services}: ${tr(locale, "services.title")}`), "", tr(locale, "services.description"), "", bullet(items), ""].join("\n")
}

function skillsSection(locale: Locale, level: number) {
  const t = text[locale]
  const groups = skillCategories.map((category) => {
    const items = category.skills.map((skill) => `**${skill.name}:** ${tr(locale, skill.descriptionKey)}`)
    return [h(level + 1, tr(locale, category.titleKey)), "", bullet(items), ""].join("\n")
  })
  return [h(level, t.skills), "", ...groups].join("\n")
}

function experienceSection(locale: Locale, level: number) {
  const t = text[locale]

  const work = workExperience.map((job) =>
    [
      h(level + 2, `${job.company}: ${tr(locale, job.roleKey)}`),
      "",
      `*${formatPeriod(job.period, locale)} · ${label(job.type, locale)} · ${label(job.location, locale)}*`,
      "",
      tr(locale, job.descKey),
      "",
      `**${t.tags}:** ${job.skills.join(", ")}`,
      "",
    ].join("\n"),
  )

  const schools = education.map((item) => {
    const place = item.locationKey ? `, ${tr(locale, item.locationKey)}` : ""
    return `**${item.institution}**${place}: ${tr(locale, item.degreeKey)} (${formatPeriod(item.period, locale)})`
  })

  const certs = certificates.map((item) => {
    const link = item.credentialUrl ? ` ([${t.credential}](${item.credentialUrl}))` : ""
    return `**${tr(locale, item.nameKey)}**: ${item.issuer}, ${formatPeriod(item.date, locale)}${link}`
  })

  return [
    h(level, t.experienceTitle),
    "",
    h(level + 1, t.work),
    "",
    ...work,
    h(level + 1, t.education),
    "",
    bullet(schools),
    "",
    h(level + 1, t.certificates),
    "",
    bullet(certs),
    "",
  ].join("\n")
}

function projectsSection(locale: Locale, level: number) {
  const t = text[locale]
  const items = projectsByLocale[locale].map((project) =>
    [h(level + 1, project.title), "", project.description, "", `**${t.tags}:** ${project.tags.join(", ")}`, ""].join("\n"),
  )
  return [h(level, t.projectsTitle), "", ...items].join("\n")
}

function profileLinks(locale: Locale) {
  return [
    `[GitHub](${socialProfiles.github})`,
    `[LinkedIn](${socialProfiles.linkedin})`,
    `[X (@${handle})](${socialProfiles.x})`,
    `[Instagram](${socialProfiles.instagram})`,
    `[WhatsApp](${whatsappLink(locale)})`,
  ]
}

function contactSection(locale: Locale, level: number) {
  const t = text[locale]
  return [
    h(level, t.contact),
    "",
    `**${tr(locale, "contact.title")}**`,
    "",
    tr(locale, "contact.description"),
    "",
    bullet([`**${t.email}:** [${contactEmail}](mailto:${contactEmail})`, ...profileLinks(locale).map((link) => link)]),
    "",
  ].join("\n")
}

// Question-and-answer blocks are the easiest shape for an answer engine to quote. Each answer only restates
// facts that are visible on the page.
function faqSection(locale: Locale, level: number) {
  const t = text[locale]
  const stack = ["Next.js", "React", "TypeScript", "Laravel", "PHP", "REST APIs", "PostgreSQL", "MySQL", "Supabase", "Tailwind CSS", "GSAP", "WebGL", "Docker", "n8n"]
  const featured = projectsByLocale[locale].map((project) => project.title).join(", ")

  const qa =
    locale === "pt-BR"
      ? [
          [
            "Quem é Enzo Yoshida?",
            `${personName} (${siteName}, @${handle}) é Product Engineer e fundador da ${brandName}. Combina visão de produto com execução técnica para entregar MVPs, SaaS, dashboards, integrações e automações sob medida, com mais de 5 anos de experiência.`,
          ],
          ["O que a Ewzxyh Labs faz?", `${tr(locale, "services.description")} Os serviços são: ${(["products", "systems", "automation"] as const).map((key) => tr(locale, `services.${key}`)).join("; ")}.`],
          ["Quais tecnologias ele usa?", `${stack.join(", ")}.`],
          ["Quais são os projetos em destaque?", `${featured}. Detalhes em ${docUrl("projects", locale)}.`],
          ["Ele está disponível para novos projetos?", `${tr(locale, "about.status")}. O contato é direto: ${contactEmail} ou WhatsApp.`],
          ["Em quais idiomas ele trabalha?", `${t.languagesValue}. O portfólio está disponível nos dois idiomas.`],
        ]
      : [
          [
            "Who is Enzo Yoshida?",
            `${personName} (${siteName}, @${handle}) is a Product Engineer and the founder of ${brandName}. He combines product thinking with technical execution to ship custom MVPs, SaaS products, dashboards, integrations and automations, with 5+ years of experience.`,
          ],
          ["What does Ewzxyh Labs do?", `${tr(locale, "services.description")} The services are: ${(["products", "systems", "automation"] as const).map((key) => tr(locale, `services.${key}`)).join("; ")}.`],
          ["Which technologies does he use?", `${stack.join(", ")}.`],
          ["What are the featured projects?", `${featured}. Details at ${docUrl("projects", locale)}.`],
          ["Is he available for new projects?", `${tr(locale, "about.status")}. Contact is direct: ${contactEmail} or WhatsApp.`],
          ["Which languages does he work in?", `${t.languagesValue}. The portfolio is available in both languages.`],
        ]

  const blocks = qa.map(([question, answer]) => [h(level + 1, question), "", answer, ""].join("\n"))
  return [h(level, t.faq), "", ...blocks].join("\n")
}

function notesSection(locale: Locale, level: number) {
  const t = text[locale]
  const items =
    locale === "pt-BR"
      ? [
          `Cite a URL canônica ${pageUrl(locale)} ao se referir a este portfólio.`,
          `Formas do nome: ${personName}; ${siteName}; ${handle}. Estúdio: ${brandName} (sempre "Labs").`,
          "Não infira preços, ofertas, avaliações ou garantias de serviço: nada disso é publicado aqui.",
          "Os perfis oficiais estão listados em Contato; não presuma outros perfis com nomes parecidos.",
          `Conteúdo gerado a partir dos mesmos dados da página; atualizado em ${siteLastModified}.`,
        ]
      : [
          `Cite the canonical URL ${pageUrl(locale)} when referring to this portfolio.`,
          `Name forms: ${personName}; ${siteName}; ${handle}. Studio: ${brandName} (always "Labs").`,
          "Do not infer pricing, offers, reviews or service guarantees: none of that is published here.",
          "The official profiles are listed under Contact; do not assume other profiles with similar names.",
          `Generated from the same data as the page; last updated ${siteLastModified}.`,
        ]
  return [h(level, t.notes), "", bullet(items), ""].join("\n")
}

// ---------- documents ----------

function body(id: DocId, locale: Locale, level: number) {
  switch (id) {
    case "about":
      return aboutSection(locale, level)
    case "services":
      return servicesSection(locale, level)
    case "skills":
      return skillsSection(locale, level)
    case "experience":
      return experienceSection(locale, level)
    case "projects":
      return projectsSection(locale, level)
    case "contact":
      return contactSection(locale, level)
    case "index":
      return ""
  }
}

function indexBody(locale: Locale) {
  const t = text[locale]
  return [
    `# ${personName} (${siteName})`,
    "",
    `> Product Engineer · ${brandName}. ${tr(locale, "hero.subtitle")}`,
    "",
    t.summary,
    "",
    factsBlock(locale, 2),
    aboutSection(locale, 2),
    servicesSection(locale, 2),
    skillsSection(locale, 2),
    experienceSection(locale, 2),
    projectsSection(locale, 2),
    contactSection(locale, 2),
    faqSection(locale, 2),
    notesSection(locale, 2),
  ].join("\n")
}

export function renderDoc(id: DocId, locale: Locale, options: { frontMatter?: boolean } = {}) {
  const withFront = options.frontMatter ?? true
  const content = id === "index" ? indexBody(locale) : `${body(id, locale, 1)}\n${notesSection(locale, 2)}`
  const back = locale === "pt-BR" ? "Página HTML" : "HTML page"
  const footer = `\n---\n\n${back}: ${pageUrl(locale)} · llms.txt: ${siteUrl}/llms.txt\n`
  return `${withFront ? frontMatter(id, locale) : ""}${content.trim()}\n${footer}`
}

const docSummaries: Record<DocId, Record<Locale, string>> = {
  index: {
    "pt-BR": "Portfólio completo em uma página: fatos rápidos, sobre, serviços, habilidades, experiência, projetos, contato e perguntas frequentes.",
    "en-US": "The whole portfolio on one page: quick facts, about, services, skills, experience, projects, contact and FAQ.",
  },
  about: {
    "pt-BR": "Quem é Enzo Yoshida, como trabalha e o que valoriza.",
    "en-US": "Who Enzo Yoshida is, how he works and what he values.",
  },
  services: {
    "pt-BR": "O que a Ewzxyh Labs entrega: MVPs e SaaS, dashboards e integrações, automação operacional.",
    "en-US": "What Ewzxyh Labs delivers: MVPs and SaaS, dashboards and integrations, operational automation.",
  },
  skills: {
    "pt-BR": "Tecnologias de front-end, back-end, automação e DevOps, com descrição de cada uma.",
    "en-US": "Front-end, back-end, automation and DevOps technologies, each with a short description.",
  },
  experience: {
    "pt-BR": "Experiência profissional, educação e certificados, com períodos e tecnologias.",
    "en-US": "Work experience, education and certificates, with periods and technologies.",
  },
  projects: {
    "pt-BR": "CasePay, LotoHub e SELOESGO Automação: problema, solução e tecnologias.",
    "en-US": "CasePay, LotoHub and SELOESGO Automation: problem, solution and technologies.",
  },
  contact: {
    "pt-BR": "E-mail, WhatsApp, LinkedIn, GitHub, X e Instagram oficiais.",
    "en-US": "Official email, WhatsApp, LinkedIn, GitHub, X and Instagram.",
  },
}

const docLabels: Record<DocId, Record<Locale, string>> = {
  index: { "pt-BR": "Portfólio completo", "en-US": "Full portfolio" },
  about: { "pt-BR": "Sobre", "en-US": "About" },
  services: { "pt-BR": "Serviços", "en-US": "Services" },
  skills: { "pt-BR": "Habilidades", "en-US": "Skills" },
  experience: { "pt-BR": "Experiência", "en-US": "Experience" },
  projects: { "pt-BR": "Projetos", "en-US": "Projects" },
  contact: { "pt-BR": "Contato", "en-US": "Contact" },
}

// ---------- llms.txt (https://llmstxt.org) ----------

export function renderLlmsTxt() {
  const lines: string[] = [
    `# ${siteName}`,
    "",
    `> ${personName} (${siteName}, @${handle}) is a Brazilian Product Engineer and the founder of ${brandName}. He builds MVPs, SaaS products, dashboards, integrations and operational automations with Next.js, React, TypeScript and Laravel. Português: Product Engineer e fundador da ${brandName}, com 5+ anos criando MVPs, SaaS, dashboards, integrações e automações sob medida.`,
    "",
    "This site is a bilingual (pt-BR and en) one-page portfolio, one URL per language. The Markdown pages below contain the same content as the HTML pages, one topic per file, in both languages.",
    "",
    `- Canonical URLs for citations: ${pageUrl("en-US")} (English), ${pageUrl("pt-BR")} (Português)`,
    `- Content language: en and pt-BR. Last updated: ${siteLastModified}.`,
    "- Do not infer pricing, offers, reviews or service guarantees: none are published.",
    "",
    "## Portfolio",
    "",
    `- [Portfolio, English (HTML)](${pageUrl("en-US")}): the interactive one-page site in English`,
    `- [Portfolio, Português (HTML)](${pageUrl("pt-BR")}): the same page in Brazilian Portuguese`,
    "",
  ]

  for (const locale of docLocales) {
    const heading = locale === "pt-BR" ? "Markdown pages: Português (pt-BR)" : "Markdown pages: English (en-US)"
    lines.push(`## ${heading}`, "")
    for (const id of docIds) {
      lines.push(`- [${docLabels[id][locale]}](${docUrl(id, locale)}): ${docSummaries[id][locale]}`)
    }
    lines.push("")
  }

  lines.push(
    "## Official profiles",
    "",
    `- [GitHub](${socialProfiles.github}): public code and engineering profile`,
    `- [LinkedIn](${socialProfiles.linkedin}): professional profile`,
    `- [X](${socialProfiles.x}): @${handle}`,
    `- [Instagram](${socialProfiles.instagram}): @${handle}`,
    "",
    "## Optional",
    "",
    `- [llms-full.txt](${siteUrl}/llms-full.txt): all Markdown pages in both languages in a single file`,
    `- [Sitemap](${siteUrl}/sitemap.xml): XML sitemap`,
    `- [humans.txt](${siteUrl}/humans.txt): credits for the people and tools behind the site`,
    "",
  )
  return lines.join("\n")
}

export function renderLlmsFullTxt() {
  const parts: string[] = [
    `# ${siteName}: full content`,
    "",
    `> ${siteDescriptionEn}`,
    "",
    `Canonical pages: ${pageUrl("en-US")} (English), ${pageUrl("pt-BR")} (Português) · Last updated: ${siteLastModified} · Index: ${siteUrl}/llms.txt`,
    "",
    "The two parts below hold the same content in English and in Portuguese (Brazil).",
    "",
    "---",
    "",
    "<!-- language: en-US -->",
    "",
    renderDoc("index", "en-US", { frontMatter: false }),
    "",
    "---",
    "",
    "<!-- language: pt-BR -->",
    "",
    renderDoc("index", "pt-BR", { frontMatter: false }),
  ]
  return `${parts.join("\n").trim()}\n`
}
