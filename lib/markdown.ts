// Markdown and plain-text renderings of the portfolio for crawlers, LLMs and agents.
//
// Every sentence here comes from the same data the page renders (lib/translations.ts and lib/profile.ts), so the
// markdown twins (/index.md, /about.md, ...), /llms.txt and /llms-full.txt can never drift from the site.

import { caseStudySlugs, getCaseStudy } from "./case-studies"
import {
  certificates,
  education,
  educationStatusKeys,
  employmentTypes,
  formatPeriod,
  localize,
  projects,
  skillCategories,
  tagLabel,
  workExperience,
  workplaces,
} from "./profile"
import {
  brandName,
  contactEmail,
  handle,
  pageUrl,
  personName,
  projectPath,
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

function whatsappLink(locale: Locale) {
  const text = locale === "pt-BR" ? "Olá, vim pelo seu portfólio!" : "Hello, I came from your portfolio!"
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`
}

const tr = (locale: Locale, key: TranslationKey) => translations[locale][key]

const bullet = (items: string[]) => items.map((item) => `- ${item}`).join("\n")

// ---------- copy that is not in the page dictionary ----------

const text = {
  "pt-BR": {
    pageTitle: `${personName} (${siteName}): Product Engineer e desenvolvedor full-stack`,
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
    link: "Link",
    caseStudy: "Estudo de caso",
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
    link: "Link",
    caseStudy: "Case study",
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
      `**${t.role}:** ${locale === "pt-BR" ? "Product Engineer e desenvolvedor full-stack" : "Product Engineer"}`,
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
  // The bio already marks names with **, which is markdown bold.
  const paragraphs = (["about.p1", "about.p2", "about.p3"] as const).flatMap((key) => [tr(locale, key), ""])
  const highlights = (["product", "design", "fullstack"] as const).map(
    (key) => `**${tr(locale, `about.${key}`)}:** ${tr(locale, `about.${key}.desc`)}`,
  )
  return [h(level, t.about), "", ...paragraphs, bullet(highlights), "", `*${tr(locale, "about.status")}*`, ""].join("\n")
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
      `*${formatPeriod(job.period, locale)} · ${employmentTypes[job.type][locale]} · ${workplaces[job.workplace][locale]}*`,
      "",
      tr(locale, job.descKey),
      "",
      `**${t.tags}:** ${job.tags.map((tag) => tagLabel(tag, locale)).join(", ")}`,
      "",
    ].join("\n"),
  )

  const schools = education.map((item) => {
    const status = item.status ? `, ${tr(locale, educationStatusKeys[item.status]).toLowerCase()}` : ""
    return `**${item.institution}**, ${localize(item.location, locale)}: ${tr(locale, item.degreeKey)} (${formatPeriod(item.period, locale)}${status})`
  })

  const certs = certificates.map((item) => {
    const detail = item.detail ? `, ${localize(item.detail, locale)}` : ""
    const link = item.credentialUrl ? ` ([${t.credential}](${item.credentialUrl}))` : ""
    return `**${localize(item.name, locale)}**: ${item.issuer}${detail}, ${formatPeriod(item.period, locale)}${link}`
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
  const items = projects.map((project) => {
    const access = project.url ? `**${t.link}:** ${project.url}` : project.note ? `*${localize(project.note, locale)}*` : ""
    const caseStudy = getCaseStudy(project.id) ? `**${t.caseStudy}:** ${siteUrl}${projectPath(locale, project.id)}` : ""
    return [
      h(level + 1, localize(project.title, locale)),
      "",
      `*${localize(project.kind, locale)} · ${localize(project.context, locale)}*`,
      "",
      localize(project.description, locale),
      "",
      `**${t.tags}:** ${project.tags.map((tag) => localize(tag, locale)).join(", ")}`,
      ...(access ? ["", access] : []),
      ...(caseStudy ? ["", caseStudy] : []),
      "",
    ].join("\n")
  })
  return [h(level, t.projectsTitle), "", tr(locale, "projects.description"), "", ...items].join("\n")
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
  const stack = ["Next.js", "React", "TypeScript", "Go", "Laravel", "PHP", "REST APIs", "PostgreSQL", "MySQL", "Supabase", "PIX", "Stripe", "WhatsApp Business API", "Tailwind CSS", "GSAP", "WebGL", "Docker", "n8n"]
  const featured = projects.map((project) => localize(project.title, locale)).join(", ")

  const qa =
    locale === "pt-BR"
      ? [
          [
            "Quem é Enzo Yoshida?",
            `${personName} (${siteName}, @${handle}) é Product Engineer e desenvolvedor full-stack, fundador da ${brandName}. Combina visão de produto com execução técnica para entregar MVPs, SaaS, dashboards, integrações e automações sob medida, com mais de 5 anos de experiência.`,
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

const leadProjects = (locale: Locale) =>
  projects
    .slice(0, 4)
    .map((project) => localize(project.title, locale))
    .join(", ")

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
    "pt-BR": "Tecnologias de front-end, back-end, pagamentos e integrações, infra e IA, com descrição de cada uma.",
    "en-US": "Front-end, back-end, payments and integrations, infrastructure and AI technologies, each with a short description.",
  },
  experience: {
    "pt-BR": "Experiência profissional, educação e certificados, com períodos e tecnologias.",
    "en-US": "Work experience, education and certificates, with periods and technologies.",
  },
  projects: {
    "pt-BR": `${leadProjects("pt-BR")} e mais ${projects.length - 4} projetos: o que cada um faz, o papel de Enzo, tecnologias e links.`,
    "en-US": `${leadProjects("en-US")} and ${projects.length - 4} more projects: what each one does, Enzo's role, technologies and links.`,
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
    `> ${personName} (${siteName}, @${handle}) is a Brazilian Product Engineer and the founder of ${brandName}. He builds MVPs, SaaS products, dashboards, integrations and operational automations with Next.js. Português: Product Engineer e desenvolvedor full-stack, fundador da ${brandName}, com 5+ anos criando MVPs, SaaS, dashboards, integrações e automações sob medida com Next.js.`,
    "",
    "This site is a bilingual (pt-BR and en) portfolio: a one-page home per language, plus a case-study page per project. The Markdown pages below contain the same content as the home pages, one topic per file, in both languages.",
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
    "## Case studies (HTML)",
    "",
    "One page per project: the problem, what Enzo did, features, engineering decisions and screenshots. English link first, then Portuguese.",
    "",
  ]
  for (const slug of caseStudySlugs) {
    const study = getCaseStudy(slug)
    const project = projects.find((item) => item.id === slug)
    if (!study || !project) continue
    lines.push(
      `- [${localize(project.title, "en-US")}](${siteUrl}${projectPath("en-US", slug)}) ([pt-BR](${siteUrl}${projectPath("pt-BR", slug)})): ${localize(study.summary, "en-US")}`,
    )
  }
  lines.push("")

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
