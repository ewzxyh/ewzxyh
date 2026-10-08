"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { ArrowRightIcon, ArrowRightUpIcon } from "@/components/ui/icons"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { getCaseStudy } from "@/lib/case-studies"
import { atAmiga } from "@/lib/fonts"
import { useI18n } from "@/lib/i18n"
import { localize, type Project, projectHost, projects } from "@/lib/profile"
import { projectPath } from "@/lib/site"
import { BrowserFrame, PhoneFrame } from "./case-study/frames"
import { SectionHeading } from "./section-heading"

gsap.registerPlugin(ScrollTrigger)

const PROJECTS_SECTION_ID = "projects"
const pad = (value: number) => String(value).padStart(2, "0")

// Where the cards stick: below the header (the same values as --stack-top in globals.css), and the space kept free
// under each card's bottom edge (also the gap between cards).
const STACK_TOP_REM = { phone: 4.75, wide: 6 }
const STACK_GAP_PX = 20

function stackTopPx() {
  const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  return (window.innerWidth >= 768 ? STACK_TOP_REM.wide : STACK_TOP_REM.phone) * rem
}

// AT Amiga is wide: the size follows the longest word so a name never breaks mid-word.
function titleSize(title: string) {
  const longestWord = Math.max(...title.split(/\s+/).map((word) => word.length))
  if (longestWord <= 7) return "text-[clamp(2.5rem,6vw,5.5rem)]"
  if (longestWord <= 9) return "text-[clamp(2.1rem,4.6vw,4.25rem)]"
  return "text-[clamp(1.9rem,3.9vw,3.5rem)]"
}

// One project, the full width of the page. Cards are sticky in the same list, so each one slides up over the one
// before it while that one recedes (the scrubbed part lives in Projects).
function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const { t, locale } = useI18n()
  const study = getCaseStudy(project.id)
  const shot = study?.media.desktop
  const phone = study?.media.mobile
  const highlights = study?.highlights ?? []
  // Without a screenshot, the first number becomes the picture and the list below starts at the second.
  const visualStat = shot ? undefined : highlights[0]
  const stats = (shot ? highlights : highlights.slice(1)).slice(0, 2)
  const title = localize(project.title, locale)
  const titleId = `project-${project.id}`

  return (
    <li className="project-slide sticky" style={{ top: "var(--stack-top)", marginBottom: index < total - 1 ? STACK_GAP_PX : 0 }}>
      <article
        aria-labelledby={titleId}
        className="project-card group relative grid min-h-[calc(100svh-var(--stack-top)-20px)] origin-top overflow-hidden border border-border bg-background lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
      >
        {/* The product: its real interface, or for an internal system the number that sums it up */}
        <div className="relative flex flex-col justify-center border-b border-border bg-card p-4 sm:p-6 lg:order-2 lg:border-b-0 lg:border-l lg:p-10">
          {shot ? (
            <div className="relative lg:pr-[9%] lg:pb-8">
              <BrowserFrame address={project.url ? projectHost(project.url) : undefined}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={shot.src} alt="" fill sizes="(min-width: 1024px) 48vw, 100vw" className="project-shot object-cover object-top" />
                </div>
              </BrowserFrame>
              {phone && (
                <div className="absolute right-0 bottom-0 hidden w-[21%] lg:block">
                  <PhoneFrame>
                    <Image src={phone.src} alt="" width={phone.width} height={phone.height} sizes="11vw" className="block h-auto w-full" />
                  </PhoneFrame>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 border border-border bg-background p-6 text-center">
              <span className={`${atAmiga.className} text-[clamp(4rem,12vw,10rem)] leading-none text-foreground`}>
                {visualStat ? localize(visualStat.value, locale) : title.split(" ")[0]}
              </span>
              {visualStat && <span className="text-sm text-muted-foreground sm:text-base">{localize(visualStat.label, locale)}</span>}
            </div>
          )}
        </div>

        {/* What it is, what came out of it, where to read more */}
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:order-1 lg:p-12">
          <p className="flex items-center justify-between gap-4 text-xs tracking-[0.2em] text-muted-foreground uppercase sm:text-sm">
            <span className="flex items-center gap-3">
              <span aria-hidden="true" className="size-2 shrink-0 bg-orange-500" />
              {localize(project.kind, locale)} · {localize(project.context, locale)}
            </span>
            <span className="font-mono tracking-normal tabular-nums">
              {pad(index + 1)} / {pad(total)}
            </span>
          </p>

          <div className="flex flex-1 flex-col justify-center gap-5">
            <h3 id={titleId} className={`${atAmiga.className} ${titleSize(title)} leading-[0.95] font-normal break-words uppercase`}>
              {title}
            </h3>
            <p className="max-w-[52ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{localize(project.description, locale)}</p>
          </div>

          {stats.length > 0 && (
            <dl className="grid grid-cols-2 border-t border-border">
              {stats.map((stat) => (
                <div key={localize(stat.label, locale)} className="border-border pt-4 pr-4 odd:border-r even:pl-4">
                  <dd className="text-xl font-bold tracking-tight sm:text-2xl">{localize(stat.value, locale)}</dd>
                  <dt className="mt-1 text-xs leading-snug text-pretty text-muted-foreground sm:text-sm">{localize(stat.label, locale)}</dt>
                </div>
              ))}
            </dl>
          )}

          <p className="font-mono text-xs text-muted-foreground sm:text-sm">
            {project.tags.map((tag) => localize(tag, locale)).join("  /  ")}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {/* The whole card opens the case study; the live link sits above that overlay. */}
            <Link
              href={projectPath(locale, project.id)}
              prefetch={true}
              className="inline-flex h-12 items-center gap-2 border border-foreground bg-foreground px-5 text-sm text-background transition-colors duration-300 after:absolute after:inset-0 after:z-10 hover:bg-background hover:text-foreground"
            >
              {t("projects.caseStudy")}
              <span className="sr-only">: {title}</span>
              <ArrowRightIcon aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link relative z-20 inline-flex min-h-6 min-w-0 items-center gap-1.5 font-mono text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:text-sm"
              >
                <span className="truncate">{projectHost(project.url)}</span>
                <span className="sr-only"> ({t("projects.newTab")})</span>
                <ArrowRightUpIcon aria-hidden="true" strokeWidth={2} className="size-4 shrink-0 transition-transform group-hover/link:rotate-12" />
              </a>
            ) : (
              project.note && <span className="font-mono text-xs text-muted-foreground sm:text-sm">{localize(project.note, locale)}</span>
            )}
          </div>
        </div>

        {/* Darkens the card as the next one covers it */}
        <div aria-hidden="true" className="project-dim pointer-events-none absolute inset-0 z-30 bg-background opacity-0" />
      </article>
    </li>
  )
}

export function Projects() {
  const { t } = useI18n()
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)

  // Sticky geometry. A card taller than the space under the header sticks later (its bottom edge reaches the bottom of
  // the screen first), so nothing in it is ever out of reach.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const slides = Array.from(list.children) as HTMLElement[]

    let refreshTimer: number | undefined
    const place = () => {
      const stackTop = stackTopPx()
      const room = window.innerHeight - stackTop - STACK_GAP_PX
      let changed = false
      for (const slide of slides) {
        const top = `${Math.round(Math.min(stackTop, stackTop + room - slide.offsetHeight))}px`
        if (slide.style.top === top) continue
        slide.style.top = top
        changed = true
      }
      // The scrubbed effects below start and end where the cards stick: measure them again.
      if (changed) {
        window.clearTimeout(refreshTimer)
        refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
      }
    }

    place()
    const resizeObserver = new ResizeObserver(place)
    for (const slide of slides) resizeObserver.observe(slide)
    window.addEventListener("resize", place)
    return () => {
      window.clearTimeout(refreshTimer)
      resizeObserver.disconnect()
      window.removeEventListener("resize", place)
    }
  }, [])

  // Keyboard focus never lands on a card that a later one covers (WCAG 2.4.11): the page scrolls back to where that
  // card is on top of the stack.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const slides = Array.from(list.children) as HTMLElement[]

    const onFocusIn = (event: FocusEvent) => {
      const slide = (event.target as Element).closest(".project-slide") as HTMLElement | null
      const index = slide ? slides.indexOf(slide) : -1
      if (!slide || index < 0) return
      const bottom = slide.getBoundingClientRect().bottom
      const covered = slides.slice(index + 1).some((later) => later.getBoundingClientRect().top < bottom - 1)
      if (!covered) return
      const listTop = list.getBoundingClientRect().top + window.scrollY
      const natural = listTop + slides.slice(0, index).reduce((sum, previous) => sum + previous.offsetHeight + STACK_GAP_PX, 0)
      window.scrollTo({ top: natural - Number.parseFloat(slide.style.top || "0"), behavior: "instant" })
    }

    list.addEventListener("focusin", onFocusIn)
    return () => list.removeEventListener("focusin", onFocusIn)
  }, [])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const slides = Array.from(list.children) as HTMLElement[]

    if (reducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none reverse" },
      })

      // Where each card would be without sticky positioning, and where it sticks. Measured from the list (which is not
      // sticky) so the result does not depend on where the page is scrolled when ScrollTrigger refreshes.
      const naturalTop = (index: number) =>
        list.getBoundingClientRect().top +
        window.scrollY +
        slides.slice(0, index).reduce((sum, slide) => sum + slide.offsetHeight + STACK_GAP_PX, 0)
      const stuckAt = (index: number) => naturalTop(index) - Number.parseFloat(slides[index].style.top || "0")

      slides.forEach((slide, index) => {
        const card = slide.querySelector(".project-card")
        const shotImage = slide.querySelector(".project-shot")

        // The screenshot settles as its card rises into place.
        if (shotImage) {
          gsap.fromTo(
            shotImage,
            { scale: 1.08 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { start: () => naturalTop(index) - window.innerHeight, end: () => stuckAt(index), scrub: true, invalidateOnRefresh: true },
            },
          )
        }

        // While the next card slides up over this one, this one shrinks back and darkens.
        if (index < slides.length - 1 && card) {
          gsap
            .timeline({
              scrollTrigger: {
                start: () => naturalTop(index + 1) - window.innerHeight,
                end: () => stuckAt(index + 1),
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .to(card, { scale: 0.92, ease: "none" }, 0)
            .to(slide.querySelector(".project-dim"), { opacity: 0.6, ease: "none" }, 0)
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section ref={sectionRef} id={PROJECTS_SECTION_ID} className="relative z-10 border-t border-border py-16 sm:py-24 md:py-32">
      <div className="w-full px-(--gutter)">
        <div ref={headerRef} className="mb-10 flex flex-col justify-between gap-6 px-(--inset) sm:mb-16 lg:flex-row lg:items-end">
          <SectionHeading index="03" label={t("projects.label")} title={t("projects.title")} description={t("projects.description")} />
          <p className="font-mono text-xs text-muted-foreground lg:text-sm">
            {pad(projects.length)} {t("projects.count")}
          </p>
        </div>

        <ol ref={listRef} aria-label={t("projects.title")} className="project-stack relative">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} total={projects.length} />
          ))}
        </ol>
      </div>
    </section>
  )
}
