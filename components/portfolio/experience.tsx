"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "@/lib/i18n"
import { Briefcase, GraduationCap, Award, ChevronDown, ExternalLink, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

gsap.registerPlugin(ScrollTrigger)

const skillDescriptions: Record<string, { "pt-BR": string; "en-US": string }> = {
  // Frameworks & Languages
  "Laravel": { "pt-BR": "Framework PHP para desenvolvimento web elegante", "en-US": "PHP framework for elegant web application development" },
  "PHP": { "pt-BR": "Linguagem de script server-side para web", "en-US": "Server-side scripting language for web development" },
  "Next.js": { "pt-BR": "Framework React para aplicações de produção", "en-US": "React framework for production-grade applications" },
  "React.js": { "pt-BR": "Biblioteca JavaScript para interfaces de usuário", "en-US": "JavaScript library for building user interfaces" },
  "TypeScript": { "pt-BR": "Superset tipado de JavaScript para apps escaláveis", "en-US": "Typed superset of JavaScript for scalable apps" },
  "JavaScript": { "pt-BR": "Linguagem de programação dinâmica para web", "en-US": "Dynamic programming language for web development" },
  "Vue.js": { "pt-BR": "Framework JavaScript progressivo para UIs", "en-US": "Progressive JavaScript framework for UIs" },
  "Java": { "pt-BR": "Linguagem de programação orientada a objetos", "en-US": "Object-oriented programming language" },
  "Python": { "pt-BR": "Linguagem de programação versátil", "en-US": "Versatile programming language" },
  "Node.js": { "pt-BR": "Runtime JavaScript para desenvolvimento server-side", "en-US": "JavaScript runtime for server-side development" },

  // APIs & Backend
  "REST APIs": { "pt-BR": "Estilo arquitetural para sistemas distribuídos", "en-US": "Architectural style for distributed systems" },
  "API REST": { "pt-BR": "Estilo arquitetural para sistemas distribuídos", "en-US": "Architectural style for distributed systems" },
  "WhatsApp Business API": { "pt-BR": "API oficial para automação do WhatsApp", "en-US": "Official API for WhatsApp automation" },
  "PostgreSQL": { "pt-BR": "Banco de dados relacional open-source avançado", "en-US": "Advanced open-source relational database" },
  "MySQL": { "pt-BR": "Banco de dados relacional open-source popular", "en-US": "Popular open-source relational database" },
  "SQL": { "pt-BR": "Linguagem para gerenciar bancos relacionais", "en-US": "Language for managing relational databases" },

  // Frontend & Design
  "Tailwind CSS": { "pt-BR": "Framework CSS utility-first", "en-US": "Utility-first CSS framework" },
  "WebGL": { "pt-BR": "API JavaScript para gráficos 3D no navegador", "en-US": "JavaScript API for 3D graphics in browser" },
  "GSAP": { "pt-BR": "Biblioteca de animação profissional", "en-US": "Professional-grade animation library" },
  "Web design": { "pt-BR": "Criação de layouts visuais para websites", "en-US": "Creating visual layouts for websites" },
  "Design": { "pt-BR": "Design visual e experiência do usuário", "en-US": "Visual and user experience design" },
  "Design gráfico": { "pt-BR": "Comunicação visual através de gráficos", "en-US": "Visual communication through graphics" },
  "UX Design": { "pt-BR": "Design para experiência do usuário ideal", "en-US": "Designing for optimal user experience" },
  "Design de experiência do usuário (UX)": { "pt-BR": "Design para experiência do usuário ideal", "en-US": "Designing for optimal user experience" },

  // Product & Business
  "Product Development": { "pt-BR": "Processo de criação de produto end-to-end", "en-US": "End-to-end product creation process" },
  "Desenvolvimento de produtos": { "pt-BR": "Processo de criação de produto end-to-end", "en-US": "End-to-end product creation process" },
  "Product Engineer": { "pt-BR": "Engenharia com mentalidade de produto", "en-US": "Engineering with product mindset" },
  "SaaS": { "pt-BR": "Modelo de negócio Software as a Service", "en-US": "Software as a Service business model" },
  "Empreendedorismo": { "pt-BR": "Construir e escalar negócios", "en-US": "Building and scaling businesses" },
  "Gestão de projetos": { "pt-BR": "Planejamento e execução de projetos", "en-US": "Planning and executing projects" },
  "Gestão de vendas": { "pt-BR": "Estratégia e gestão de vendas", "en-US": "Sales strategy and management" },
  "Ideias de negócios": { "pt-BR": "Ideação e estratégia de negócios", "en-US": "Business ideation and strategy" },

  // Development
  "Full-Stack Development": { "pt-BR": "Desenvolvimento web end-to-end", "en-US": "End-to-end web development" },
  "Desenvolvimento full stack": { "pt-BR": "Desenvolvimento web end-to-end", "en-US": "End-to-end web development" },
  "Desenvolvimento de software": { "pt-BR": "Construção de soluções de software", "en-US": "Building software solutions" },
  "Desenvolvimento web": { "pt-BR": "Criação de aplicações web", "en-US": "Creating web applications" },
  "Desenvolvimento WordPress": { "pt-BR": "Construção de sites WordPress", "en-US": "Building WordPress sites" },
  "Aplicativos web": { "pt-BR": "Aplicações baseadas em web", "en-US": "Web-based applications" },

  // Automation & Tools
  "Automação": { "pt-BR": "Automatização de processos repetitivos", "en-US": "Automating repetitive processes" },
  "Automação de processos": { "pt-BR": "Otimização de fluxos de trabalho", "en-US": "Streamlining business workflows" },
  "Process Automation": { "pt-BR": "Automatização de fluxos de trabalho", "en-US": "Automating business workflows" },
  "Google Ads": { "pt-BR": "Plataforma de publicidade digital", "en-US": "Digital advertising platform" },
  "Team Leadership": { "pt-BR": "Liderança e gestão de equipes dev", "en-US": "Leading and managing dev teams" },
  "Consultoria de TI": { "pt-BR": "Consultoria e assessoria em TI", "en-US": "IT consulting and advisory" },

  // Security & Infrastructure
  "Payment Processing": { "pt-BR": "Processamento seguro de transações", "en-US": "Handling financial transactions securely" },
  "Segurança de aplicativos web": { "pt-BR": "Práticas de segurança para aplicações web", "en-US": "Web application security practices" },
  "Application Security": { "pt-BR": "Proteção de aplicações contra ameaças", "en-US": "Securing applications against threats" },
  "Infraestrutura de tecnologia da informação": { "pt-BR": "Gestão de infraestrutura de TI", "en-US": "IT infrastructure management" },
  "Suporte técnico": { "pt-BR": "Suporte técnico e troubleshooting", "en-US": "Technical support and troubleshooting" },

  // E-commerce & Marketing
  "Comércio eletrônico": { "pt-BR": "Comércio e vendas online", "en-US": "Online commerce and sales" },
  "E-commerce": { "pt-BR": "Comércio e vendas online", "en-US": "Online commerce and sales" },
  "Marketing": { "pt-BR": "Promoção de produtos e serviços", "en-US": "Promoting products and services" },
  "Apresentação de ideias": { "pt-BR": "Pitch e apresentação de conceitos", "en-US": "Pitching and presenting concepts" },

  // Media & Image
  "Processamento de imagem": { "pt-BR": "Manipulação e processamento de imagens", "en-US": "Image manipulation and processing" },
  "Geração de Imagem": { "pt-BR": "Geração automatizada de imagens", "en-US": "Automated image generation" },
  "Gestão de tecnologias": { "pt-BR": "Gestão de stack e decisões técnicas", "en-US": "Managing tech stack and decisions" },

  // Certificates
  "English": { "pt-BR": "Proficiência em inglês", "en-US": "English language proficiency" },
  "OOP": { "pt-BR": "Paradigma de Programação Orientada a Objetos", "en-US": "Object-Oriented Programming paradigm" },
  "Spring Boot": { "pt-BR": "Framework Java para microserviços", "en-US": "Java framework for microservices" },
  "Hibernate": { "pt-BR": "Framework ORM para Java", "en-US": "Java ORM framework" },
  "HAProxy": { "pt-BR": "Load balancer de alta disponibilidade", "en-US": "High availability load balancer" },
  "Linux": { "pt-BR": "Sistema operacional open-source", "en-US": "Open-source operating system" },
  "Vue Router": { "pt-BR": "Router oficial para Vue.js", "en-US": "Official router for Vue.js" },
  "Vuex": { "pt-BR": "Gerenciamento de estado para Vue.js", "en-US": "State management for Vue.js" },
}

interface ExperienceItem {
  company: string
  roleKey: string
  descKey: string
  period: string
  location: string
  type: string
  skills: string[]
  logo?: string
}

interface EducationItem {
  institution: string
  degreeKey: string
  period: string
  locationKey?: string
  logo?: string
  highlighted?: boolean
}

interface CertificateItem {
  nameKey: string
  issuer: string
  date: string
  skills: string[]
  credentialUrl?: string
  logo?: string
}

const workExperience: ExperienceItem[] = [
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
    company: "Ewzxyh Lab",
    roleKey: "experience.ewzxyh.role",
    descKey: "experience.ewzxyh.desc",
    period: "jan 2021 - Present",
    location: "Remota",
    type: "Autônomo",
    skills: ["Desenvolvimento de software", "Desenvolvimento de produtos", "Next.js", "PostgreSQL", "REST APIs", "React.js", "Full-Stack Development", "Consultoria de TI", "JavaScript", "WebGL", "Aplicativos web", "Design", "Design de experiência do usuário (UX)", "Web design"],
    logo: "/empresas/ewzxyh-logo-black.png",
  },
]

const education: EducationItem[] = [
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

const certificates: CertificateItem[] = [
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

function CertificateModal({
  url,
  onClose,
}: {
  url: string
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    )
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
    )

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 0.2,
      onComplete: onClose,
    })
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 bg-background/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="relative w-full h-full sm:w-[70vw] sm:h-[90vh] border-0 sm:border border-border bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 border-b border-border bg-background z-10">
          <span className="text-xs text-muted-foreground font-mono truncate max-w-[calc(100%-3rem)]">
            {url}
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <iframe
          src={url}
          className="w-full h-full pt-12"
          title="Certificate"
          allow="fullscreen"
        />
      </div>
    </div>
  )
}

function isUdemyUrl(url: string): boolean {
  return url.includes("udemy.com")
}

function ExpandableItem({
  title,
  subtitle,
  period,
  description,
  skills,
  logo,
  location,
  type,
  icon: Icon,
  credentialUrl,
  onOpenCertificate,
  highlighted,
}: {
  title: string
  subtitle: string
  period: string
  description?: string
  skills?: string[]
  logo?: string
  location?: string
  type?: string
  icon: typeof Briefcase
  credentialUrl?: string
  onOpenCertificate?: (url: string) => void
  highlighted?: boolean
}) {
  const { locale } = useI18n()
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isExpanded && skillsRef.current) {
      const skills = skillsRef.current.querySelectorAll(".skill-tag")
      gsap.fromTo(
        skills,
        { opacity: 0, y: 10, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.03, ease: "back.out(1.7)" }
      )
    }
  }, [isExpanded])

  return (
    <div
      ref={itemRef}
      className={`experience-item border-b border-border last:border-b-0 group relative ${
        highlighted ? 'bg-foreground/[0.025] dark:bg-foreground/[0.04] border-l-2 border-l-foreground/20' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex flex-col min-[400px]:flex-row min-[400px]:items-center gap-2 min-[400px]:gap-3 sm:gap-4 p-2.5 min-[320px]:p-3 sm:p-4 transition-all duration-300 text-left hover:bg-foreground/[0.02]"
      >
        <div className="flex items-center gap-2 min-[400px]:gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="relative flex-shrink-0 w-7 h-7 min-[320px]:w-8 min-[320px]:h-8 sm:w-10 sm:h-10 border border-border bg-card flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-foreground/30 group-hover:scale-105">
            {logo ? (
              <Image
                src={logo}
                alt={title}
                width={24}
                height={24}
                className="w-4 h-4 min-[320px]:w-5 min-[320px]:h-5 sm:w-6 sm:h-6 object-contain transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <Icon className="w-3.5 h-3.5 min-[320px]:w-4 min-[320px]:h-4 sm:w-5 sm:h-5 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 min-[320px]:gap-2 flex-wrap">
              <h4 className="font-medium text-[11px] min-[320px]:text-xs sm:text-sm transition-colors duration-300 group-hover:text-foreground">
                {title}
              </h4>
              {highlighted && (
                <span className="text-[7px] min-[320px]:text-[8px] sm:text-[9px] px-1 min-[320px]:px-1.5 py-0.5 bg-foreground/10 dark:bg-foreground/15 text-foreground/70 uppercase tracking-wider font-medium">
                  Upcoming
                </span>
              )}
              {location && (
                <span className="text-[8px] min-[320px]:text-[9px] sm:text-[10px] px-1 py-0.5 border border-border text-muted-foreground uppercase tracking-wider transition-all duration-300 group-hover:border-foreground/30 group-hover:text-foreground/70">
                  {location}
                </span>
              )}
            </div>
            <p className="text-[9px] min-[320px]:text-[10px] sm:text-xs text-muted-foreground truncate transition-colors duration-300">
              {subtitle}
              {type && <span className="ml-1 opacity-70">· {type}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between min-[400px]:justify-end gap-2 pl-9 min-[320px]:pl-10 min-[400px]:pl-0">
          <span className="text-[9px] min-[320px]:text-[10px] sm:text-xs text-muted-foreground font-mono transition-colors duration-300 group-hover:text-foreground/70">
            {period}
          </span>
          {(description || skills) && (
            <ChevronDown
              className={`w-3.5 h-3.5 min-[320px]:w-4 min-[320px]:h-4 text-muted-foreground transition-all duration-300 group-hover:text-foreground flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
            />
          )}
        </div>
      </button>

      {(description || skills) && (
        <div
          ref={contentRef}
          className={`grid transition-all duration-500 ease-out ${
            isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-2.5 min-[320px]:px-3 sm:px-4 pb-3 min-[320px]:pb-4 sm:pb-5 pl-9 min-[320px]:pl-10 min-[400px]:pl-14 sm:pl-[4.5rem]">
              {description && (
                <p className="text-[10px] min-[320px]:text-[11px] sm:text-xs text-muted-foreground leading-relaxed mb-3 min-[320px]:mb-4">
                  {description}
                </p>
              )}

              {skills && skills.length > 0 && (
                <div ref={skillsRef} className="flex flex-wrap gap-1 min-[320px]:gap-1.5">
                  {skills.map((skill) => {
                    const skillData = skillDescriptions[skill]
                    const description = skillData?.[locale]
                    return (
                      <Tooltip key={skill}>
                        <TooltipTrigger className="skill-tag text-[8px] min-[320px]:text-[9px] sm:text-[10px] px-1 min-[320px]:px-1.5 sm:px-2 py-0.5 sm:py-1 border border-border text-foreground/80 transition-all duration-200 hover:border-foreground/50 hover:bg-foreground/5 cursor-help">
                          {skill}
                        </TooltipTrigger>
                        {description && (
                          <TooltipContent side="top" className="max-w-[200px] text-center">
                            <p className="text-xs">{description}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    )
                  })}
                </div>
              )}

              {credentialUrl && (
                isUdemyUrl(credentialUrl) ? (
                  <a
                    href={credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 mt-3 min-[320px]:mt-4 text-[9px] min-[320px]:text-[10px] sm:text-xs text-muted-foreground transition-all duration-300 hover:text-foreground hover:gap-2 group/link"
                  >
                    <ExternalLink className="w-3 h-3 transition-transform duration-300 group-hover/link:rotate-12" />
                    Ver credencial
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenCertificate?.(credentialUrl)
                    }}
                    className="inline-flex items-center gap-1 mt-3 min-[320px]:mt-4 text-[9px] min-[320px]:text-[10px] sm:text-xs text-muted-foreground transition-all duration-300 hover:text-foreground hover:gap-2 group/link"
                  >
                    <ExternalLink className="w-3 h-3 transition-transform duration-300 group-hover/link:rotate-12" />
                    Ver credencial
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function Experience() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const workRef = useRef<HTMLDivElement>(null)
  const eduRef = useRef<HTMLDivElement>(null)
  const certRef = useRef<HTMLDivElement>(null)
  const headersRef = useRef<(HTMLDivElement | null)[]>([])
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      headersRef.current.forEach((header) => {
        if (!header) return
        gsap.from(header, {
          opacity: 0,
          x: -30,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        })
      })

      const animateSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return
        const items = ref.current.querySelectorAll(".experience-item")
        gsap.from(items, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      animateSection(workRef)
      animateSection(eduRef)
      animateSection(certRef)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <section ref={sectionRef} id="experience" className="relative z-10">
        <div className="max-w-6xl mx-auto px-2 min-[320px]:px-3 xs:px-4 sm:px-6 py-8 min-[320px]:py-10 sm:py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-6 min-[320px]:gap-8 sm:gap-12 lg:gap-16">
            {/* Work Experience */}
            <div ref={workRef} className="lg:col-span-2">
              <div
                ref={(el) => { headersRef.current[0] = el }}
                className="flex items-center gap-1.5 min-[320px]:gap-2 mb-3 min-[320px]:mb-4 sm:mb-6 group cursor-default"
              >
                <Briefcase className="w-3.5 h-3.5 min-[320px]:w-4 min-[320px]:h-4 sm:w-5 sm:h-5 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110 flex-shrink-0" />
                <h3 className="text-sm min-[320px]:text-base sm:text-lg font-semibold tracking-tight transition-colors duration-300 group-hover:text-foreground">
                  {t("experience.work")}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-2 min-[320px]:ml-4 transition-all duration-500 group-hover:from-foreground/30" />
              </div>

              <div className="border border-border bg-card/50">
                {workExperience.map((item, index) => (
                  <ExpandableItem
                    key={index}
                    title={item.company}
                    subtitle={t(item.roleKey as any)}
                    period={item.period}
                    description={t(item.descKey as any)}
                    skills={item.skills}
                    logo={item.logo}
                    location={item.location}
                    type={item.type}
                    icon={Briefcase}
                  />
                ))}
              </div>
            </div>

            {/* Education */}
            <div ref={eduRef}>
              <div
                ref={(el) => { headersRef.current[1] = el }}
                className="flex items-center gap-1.5 min-[320px]:gap-2 mb-3 min-[320px]:mb-4 sm:mb-6 group cursor-default"
              >
                <GraduationCap className="w-3.5 h-3.5 min-[320px]:w-4 min-[320px]:h-4 sm:w-5 sm:h-5 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110 flex-shrink-0" />
                <h3 className="text-sm min-[320px]:text-base sm:text-lg font-semibold tracking-tight transition-colors duration-300 group-hover:text-foreground">
                  {t("experience.education")}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-2 min-[320px]:ml-4 transition-all duration-500 group-hover:from-foreground/30" />
              </div>

              <div className="border border-border bg-card/50">
                {education.map((item, index) => (
                  <ExpandableItem
                    key={index}
                    title={item.institution}
                    subtitle={t(item.degreeKey as any)}
                    period={item.period}
                    location={item.locationKey ? t(item.locationKey as any) : undefined}
                    logo={item.logo}
                    icon={GraduationCap}
                    highlighted={item.highlighted}
                  />
                ))}
              </div>
            </div>

            {/* Certificates */}
            <div ref={certRef}>
              <div
                ref={(el) => { headersRef.current[2] = el }}
                className="flex items-center gap-1.5 min-[320px]:gap-2 mb-3 min-[320px]:mb-4 sm:mb-6 group cursor-default"
              >
                <Award className="w-3.5 h-3.5 min-[320px]:w-4 min-[320px]:h-4 sm:w-5 sm:h-5 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110 flex-shrink-0" />
                <h3 className="text-sm min-[320px]:text-base sm:text-lg font-semibold tracking-tight transition-colors duration-300 group-hover:text-foreground">
                  {t("experience.certificates")}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-2 min-[320px]:ml-4 transition-all duration-500 group-hover:from-foreground/30" />
              </div>

              <div className="border border-border bg-card/50">
                {certificates.map((item, index) => (
                  <ExpandableItem
                    key={index}
                    title={t(item.nameKey as any)}
                    subtitle={item.issuer}
                    period={item.date}
                    skills={item.skills}
                    credentialUrl={item.credentialUrl}
                    logo={item.logo}
                    icon={Award}
                    onOpenCertificate={setCertificateUrl}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {certificateUrl && (
        <CertificateModal
          url={certificateUrl}
          onClose={() => setCertificateUrl(null)}
        />
      )}
    </>
  )
}
