"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useI18n } from "@/lib/i18n"
import {
  certificates,
  education,
  educationStatusKeys,
  employmentTypes,
  formatPeriod,
  localize,
  type TagId,
  tagDescription,
  tagLabel,
  workExperience,
  workplaces,
} from "@/lib/profile"
import {
  AltArrowDownIcon,
  ArrowRightUpIcon,
  CaseIcon,
  CloseIcon,
  MedalRibbonStarIcon,
  SquareAcademicCapIcon,
  type Icon as SolarIcon,
} from "@/components/ui/icons"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

gsap.registerPlugin(ScrollTrigger)

const EXPERIENCE_SECTION_ID = "experience"

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
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={handleClose}
        aria-label="Close certificate preview"
      />
      <div
        ref={modalRef}
        className="relative z-10 w-full h-full sm:w-[70vw] sm:h-[90vh] border-0 sm:border border-border bg-background"
      >
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 border-b border-border bg-background z-10">
          <span className="text-xs text-muted-foreground font-mono truncate max-w-[calc(100%-3rem)]">
            {url}
          </span>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close certificate preview"
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <CloseIcon aria-hidden="true" className="w-6 h-6" />
          </button>
        </div>
        <iframe
          src={url}
          className="w-full h-full pt-12"
          title="Certificate"
          allow="fullscreen"
          sandbox="allow-scripts allow-popups"
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
  status,
  invertLogoInDark,
}: {
  title: string
  subtitle: string
  period: string
  description?: string
  skills?: TagId[]
  logo?: string
  location?: string
  type?: string
  icon: SolarIcon
  credentialUrl?: string
  onOpenCertificate?: (url: string) => void
  // A running course: the row is tinted and the label shows next to the title.
  status?: string
  invertLogoInDark?: boolean
}) {
  const { locale, t } = useI18n()
  const [isExpanded, setIsExpanded] = useState(false)
  // The details (skill tags with tooltips) are only mounted once an item is opened for the first time.
  const [hasOpened, setHasOpened] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const itemRef = useRef<HTMLDivElement>(null)

  const toggleExpanded = () => {
    if (hasOpened) {
      setIsExpanded((current) => !current)
      return
    }
    // Mount collapsed, wait for a painted frame, then expand so the height transition still plays.
    setHasOpened(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setIsExpanded(true)))
  }

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
        status ? 'bg-foreground/[0.025] dark:bg-foreground/[0.04] border-l-2 border-l-foreground/20' : ''
      }`}
    >
      <button
        type="button"
        onClick={toggleExpanded}
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
                className={`w-4 h-4 min-[320px]:w-5 min-[320px]:h-5 sm:w-6 sm:h-6 object-contain transition-transform duration-300 group-hover:scale-110 ${
                  invertLogoInDark ? "dark:invert" : ""
                }`}
              />
            ) : (
              <Icon className="w-3.5 h-3.5 min-[320px]:w-4 min-[320px]:h-4 sm:w-6 sm:h-6 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 min-[320px]:gap-2 flex-wrap">
              <h4 className="font-medium text-xs min-[320px]:text-[13px] sm:text-base transition-colors duration-300 group-hover:text-foreground">
                {title}
              </h4>
              {status && (
                <span className="text-[8px] min-[320px]:text-[9px] sm:text-[11px] px-1 min-[320px]:px-1.5 py-0.5 bg-foreground/10 dark:bg-foreground/15 text-foreground/70 uppercase tracking-wider font-medium">
                  {status}
                </span>
              )}
              {location && (
                <span className="text-[9px] min-[320px]:text-[10px] sm:text-[11px] px-1 py-0.5 border border-border text-muted-foreground uppercase tracking-wider transition-all duration-300 group-hover:border-foreground/30 group-hover:text-foreground/70">
                  {location}
                </span>
              )}
            </div>
            <p className="text-[10px] min-[320px]:text-[11px] sm:text-sm text-muted-foreground text-pretty transition-colors duration-300">
              {subtitle}
              {type && <span className="ml-1 opacity-70">· {type}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between min-[400px]:justify-end gap-2 pl-9 min-[320px]:pl-10 min-[400px]:pl-0">
          <span className="text-[10px] min-[320px]:text-[11px] sm:text-sm text-muted-foreground font-mono transition-colors duration-300 group-hover:text-foreground/70">
            {period}
          </span>
          {(description || skills) && (
            <AltArrowDownIcon
              className={`w-3.5 h-3.5 min-[320px]:w-4 min-[320px]:h-4 sm:w-5 sm:h-5 text-muted-foreground transition-all duration-300 group-hover:text-foreground flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
            />
          )}
        </div>
      </button>

      {(description || skills) && hasOpened && (
        <div
          ref={contentRef}
          className={`grid transition-all duration-500 ease-out ${
            isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-2.5 min-[320px]:px-3 sm:px-4 pb-3 min-[320px]:pb-4 sm:pb-5 pl-9 min-[320px]:pl-10 min-[400px]:pl-14 sm:pl-[4.5rem]">
              {description && (
                <p className="max-w-[88ch] text-[11px] min-[320px]:text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 min-[320px]:mb-4">
                  {description}
                </p>
              )}

              {skills && skills.length > 0 && (
                <div ref={skillsRef} className="flex flex-wrap gap-1 min-[320px]:gap-1.5">
                  {skills.map((skill) => (
                    <Tooltip key={skill}>
                      <TooltipTrigger className="skill-tag text-[9px] min-[320px]:text-[10px] sm:text-xs px-1 min-[320px]:px-1.5 sm:px-2 py-0.5 sm:py-1 border border-border text-foreground/80 transition-all duration-200 hover:border-foreground/50 hover:bg-foreground/5 cursor-help">
                        {tagLabel(skill, locale)}
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px] text-center">
                        <p className="text-xs">{tagDescription(skill, locale)}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              )}

              {credentialUrl && (
                isUdemyUrl(credentialUrl) ? (
                  <a
                    href={credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 mt-3 min-[320px]:mt-4 text-[10px] min-[320px]:text-[11px] sm:text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:gap-2 group/link"
                  >
                    <ArrowRightUpIcon strokeWidth={2} className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/link:rotate-12" />
                    {t("experience.credential")}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenCertificate?.(credentialUrl)
                    }}
                    className="inline-flex items-center gap-1 mt-3 min-[320px]:mt-4 text-[10px] min-[320px]:text-[11px] sm:text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:gap-2 group/link"
                  >
                    <ArrowRightUpIcon strokeWidth={2} className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/link:rotate-12" />
                    {t("experience.credential")}
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
  const { t, locale } = useI18n()
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
      <section ref={sectionRef} id={EXPERIENCE_SECTION_ID} className="relative z-10">
        <div className="w-full max-w-screen-2xl mx-auto px-[clamp(1.25rem,3vw,4rem)] py-8 min-[320px]:py-10 sm:py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-6 min-[320px]:gap-8 sm:gap-12 lg:gap-16">
            {/* Work Experience */}
            <div ref={workRef} className="lg:col-span-2">
              <div
                ref={(el) => { headersRef.current[0] = el }}
                className="flex items-center gap-1.5 min-[320px]:gap-2 mb-3 min-[320px]:mb-4 sm:mb-6 group cursor-default"
              >
                <CaseIcon className="w-3.5 h-3.5 min-[320px]:w-4 min-[320px]:h-4 sm:w-6 sm:h-6 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110 flex-shrink-0" />
                <h3 className="text-sm min-[320px]:text-base sm:text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-foreground">
                  {t("experience.work")}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-2 min-[320px]:ml-4 transition-all duration-500 group-hover:from-foreground/30" />
              </div>

              <div className="border border-border bg-card/50">
                {workExperience.map((item) => (
                  <ExpandableItem
                    key={`${item.company}-${item.period.from}`}
                    title={item.company}
                    subtitle={t(item.roleKey)}
                    period={formatPeriod(item.period, locale)}
                    description={t(item.descKey)}
                    skills={item.tags}
                    logo={item.logo}
                    location={workplaces[item.workplace][locale]}
                    type={employmentTypes[item.type][locale]}
                    icon={CaseIcon}
                    invertLogoInDark={item.invertLogoInDark}
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
                <SquareAcademicCapIcon className="w-3.5 h-3.5 min-[320px]:w-4 min-[320px]:h-4 sm:w-6 sm:h-6 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110 flex-shrink-0" />
                <h3 className="text-sm min-[320px]:text-base sm:text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-foreground">
                  {t("experience.education")}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-2 min-[320px]:ml-4 transition-all duration-500 group-hover:from-foreground/30" />
              </div>

              <div className="border border-border bg-card/50">
                {education.map((item) => (
                  <ExpandableItem
                    key={`${item.institution}-${item.period.from}`}
                    title={item.institution}
                    subtitle={t(item.degreeKey)}
                    period={formatPeriod(item.period, locale)}
                    location={localize(item.location, locale)}
                    logo={item.logo}
                    icon={SquareAcademicCapIcon}
                    status={item.status ? t(educationStatusKeys[item.status]) : undefined}
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
                <MedalRibbonStarIcon className="w-3.5 h-3.5 min-[320px]:w-4 min-[320px]:h-4 sm:w-6 sm:h-6 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110 flex-shrink-0" />
                <h3 className="text-sm min-[320px]:text-base sm:text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-foreground">
                  {t("experience.certificates")}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-2 min-[320px]:ml-4 transition-all duration-500 group-hover:from-foreground/30" />
              </div>

              <div className="border border-border bg-card/50">
                {certificates.map((item) => (
                  <ExpandableItem
                    key={item.credentialUrl ?? localize(item.name, "en-US")}
                    title={localize(item.name, locale)}
                    subtitle={item.issuer}
                    type={item.detail ? localize(item.detail, locale) : undefined}
                    period={formatPeriod(item.period, locale)}
                    description={item.description ? localize(item.description, locale) : undefined}
                    skills={item.tags}
                    credentialUrl={item.credentialUrl}
                    logo={item.logo}
                    icon={MedalRibbonStarIcon}
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
