"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { Contact } from "@/components/portfolio/contact"
import { Footer } from "@/components/portfolio/footer"
import { Header } from "@/components/portfolio/header"
import { useLoading } from "@/components/portfolio/loading-context"
import { SectionHeading } from "@/components/portfolio/section-heading"
import { AltArrowDownIcon, ArrowRightIcon, ArrowRightUpIcon } from "@/components/ui/icons"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { adjacentProjects, caseStudySlugs, caseStudyTitle, getCaseStudy, getProject } from "@/lib/case-studies"
import { atAmiga } from "@/lib/fonts"
import { useI18n } from "@/lib/i18n"
import { localize, type Project, projectHost, type Text } from "@/lib/profile"
import { localePaths, projectPath, siteName } from "@/lib/site"
import { BrowserFrame, PhoneFrame } from "./frames"
import { ScrollThrough } from "./scroll-through"

gsap.registerPlugin(ScrollTrigger)

const pad = (value: number) => String(value).padStart(2, "0")

const CORNERS = [
  "-left-1.5 -top-1.5 border-l-2 border-t-2",
  "-right-1.5 -top-1.5 border-r-2 border-t-2",
  "-bottom-1.5 -left-1.5 border-b-2 border-l-2",
  "-bottom-1.5 -right-1.5 border-b-2 border-r-2",
]

function ProjectLink({ project, label, align }: { project: Project; label: string; align: "start" | "end" }) {
  const { locale } = useI18n()
  const study = getCaseStudy(project.id)
  const shot = study?.media.desktop
  return (
    <Link
      href={projectPath(locale, project.id)}
      prefetch={true}
      data-reveal=""
      className={`group relative flex min-h-56 flex-col justify-between gap-6 overflow-hidden border-border p-5 transition-colors duration-300 hover:bg-card sm:p-8 ${
        align === "end" ? "sm:items-end sm:text-right" : ""
      }`}
    >
      {shot && (
        <Image
          src={shot.src}
          alt=""
          width={shot.width}
          height={shot.height}
          sizes="(min-width: 640px) 50vw, 100vw"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-[opacity,scale] duration-500 group-hover:scale-[1.03] group-hover:opacity-[0.12]"
        />
      )}
      <span className="relative text-xs tracking-[0.25em] text-muted-foreground uppercase">{label}</span>
      <span className="relative">
        <span className={`${atAmiga.className} block text-[clamp(1.75rem,4vw,3.5rem)] leading-none uppercase`}>
          {localize(project.title, locale)}
        </span>
        <span className="mt-3 block text-xs tracking-[0.18em] text-muted-foreground uppercase">
          {localize(project.kind, locale)} · {localize(project.context, locale)}
        </span>
      </span>
    </Link>
  )
}

// A project page: facts, the product in a browser frame, the story, what Enzo did, features, engineering, the whole
// page scrolling inside a frame, and the way to the previous and next projects.
export function CaseStudyPage({ slug }: { slug: string }) {
  const { t, locale } = useI18n()
  const { isRevealing } = useLoading()
  const reducedMotion = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)

  const study = getCaseStudy(slug)
  const project = getProject(slug)
  const L = (text: Text) => localize(text, locale)

  // Switching language rewrites the address in place (lib/i18n.tsx); the title follows here.
  useEffect(() => {
    document.title = `${caseStudyTitle(slug, locale)} | ${siteName}`
  }, [slug, locale])

  // Entrance of the opening block once the loader is gone, then a single reveal for everything marked
  // [data-reveal] as it scrolls in, and a slow drift of the phone over the browser capture.
  useEffect(() => {
    const root = rootRef.current
    if (!root || !isRevealing) return
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root)
      if (reducedMotion) {
        gsap.set([...items, ".case-intro > *", ".case-meta > *", ".case-shot"], { opacity: 1 })
        return
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".case-corner", { opacity: 0 }, { opacity: 0.5, duration: 0.3, stagger: 0.04 })
        .fromTo(".case-intro > *", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 }, 0)
        .fromTo(".case-meta > *", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.04 }, 0.2)
        .fromTo(".case-shot", { opacity: 0, y: 40, clipPath: "inset(6% 0% 0% 0%)" }, { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 }, 0.25)

      gsap.set(items, { opacity: 0, y: 28 })
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out", overwrite: true }),
      })

      // Projects without captures (an internal tool) have no phone to move.
      if (root.querySelector(".case-phone")) {
        gsap.fromTo(
          ".case-phone",
          { yPercent: 12 },
          { yPercent: -6, ease: "none", scrollTrigger: { trigger: ".case-showcase", start: "top bottom", end: "bottom top", scrub: true } },
        )
      }
    }, root)
    return () => ctx.revert()
  }, [isRevealing, reducedMotion])

  if (!study || !project) return null

  const home = localePaths[locale]
  const { previous, next } = adjacentProjects(slug)
  const live = study.links[0]
  const address = live ? projectHost(live.url) : undefined
  const title = L(project.title)
  const { desktop, mobile, full, extra, phones } = study.media
  // The phone capture of the home screen, then any other phone screens, each with its caption.
  const phoneShots = [
    ...(mobile ? [{ shot: mobile, caption: t("case.mobile") }] : []),
    ...(phones ?? []).map((shot) => ({ shot, caption: L(shot.caption ?? shot.alt) })),
  ]
  // AT Amiga is wide: the size follows the longest word so a name like MARKETPLACE never breaks mid-word.
  const longestWord = Math.max(...title.split(/\s+/).map((word) => word.length))
  const titleSize =
    longestWord <= 7
      ? "text-[clamp(2.75rem,8.5vw,8rem)]"
      : longestWord <= 9
        ? "text-[clamp(2.5rem,6.6vw,6.5rem)]"
        : "text-[clamp(2.25rem,5.4vw,5.25rem)]"

  const meta: { label: string; value: string }[] = [
    { label: t("case.role"), value: L(study.role) },
    { label: t("case.client"), value: L(study.client) },
    ...(study.period ? [{ label: t("case.period"), value: L(study.period) }] : []),
    { label: t("case.status"), value: L(study.status) },
    { label: t("case.platform"), value: L(study.platform) },
  ]

  return (
    <main className="relative z-10 min-h-screen overflow-x-hidden before:pointer-events-none before:fixed before:inset-y-0 before:left-[clamp(1.25rem,3vw,4rem)] before:z-30 before:w-px before:bg-border/70 after:pointer-events-none after:fixed after:inset-y-0 after:right-[clamp(1.25rem,3vw,4rem)] after:z-30 after:w-px after:bg-border/70">
      <Header />

      <article ref={rootRef} aria-labelledby="case-title">
        {/* Opening: what it is, for whom, Enzo's part */}
        <section className="px-[clamp(1.25rem,3vw,4rem)] pt-24 sm:pt-28 md:pt-32">
          <div className="relative border border-border">
            {CORNERS.map((position) => (
              <span
                key={position}
                aria-hidden="true"
                className={`case-corner pointer-events-none absolute z-10 size-6 border-foreground opacity-0 sm:size-8 ${position}`}
              />
            ))}
            <div className="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
              <div className="case-intro flex flex-col gap-6 border-border p-5 sm:p-8 lg:border-r lg:p-12">
                <nav className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground opacity-0 sm:text-sm">
                  <Link href={`${home}#projects`} className="group inline-flex items-center gap-2 transition-colors hover:text-foreground">
                    <ArrowRightIcon aria-hidden="true" className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                    {t("case.back")}
                  </Link>
                  <span className="font-mono tracking-wider">
                    {t("case.position")} {pad(caseStudySlugs.indexOf(slug) + 1)} {t("case.of")} {pad(caseStudySlugs.length)}
                  </span>
                </nav>
                <p className="flex items-center gap-3 text-xs tracking-[0.25em] text-muted-foreground uppercase opacity-0 sm:text-sm">
                  <span aria-hidden="true" className="size-2 shrink-0 bg-orange-500" />
                  {L(project.kind)} · {L(project.context)}
                </p>
                <h1
                  id="case-title"
                  className={`${atAmiga.className} ${titleSize} leading-[0.92] font-normal break-words uppercase opacity-0`}
                >
                  {title}
                </h1>
                <p className="max-w-[44ch] text-lg leading-snug text-balance text-foreground opacity-0 sm:text-xl md:text-2xl">
                  {L(study.summary)}
                </p>
                <div className="flex flex-wrap gap-3 opacity-0">
                  {live && (
                    <a
                      href={live.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex h-12 items-center gap-2 border border-foreground bg-foreground px-5 text-sm text-background transition-colors duration-300 hover:bg-background hover:text-foreground"
                    >
                      {t("case.visit")}
                      <ArrowRightUpIcon aria-hidden="true" strokeWidth={2} className="size-4 transition-transform group-hover:rotate-12" />
                    </a>
                  )}
                  <a
                    href="#contact"
                    className="inline-flex h-12 items-center gap-2 border border-foreground px-5 text-sm transition-colors duration-300 hover:bg-foreground hover:text-background"
                  >
                    {t("case.contactCta")}
                    <AltArrowDownIcon aria-hidden="true" className="size-4" />
                  </a>
                </div>
              </div>

              <dl className="case-meta grid grid-cols-2 content-start border-t border-border lg:grid-cols-1 lg:border-t-0">
                {meta.map((item) => (
                  <div key={item.label} className="border-b border-r border-border p-4 opacity-0 even:border-r-0 sm:p-5 lg:border-r-0">
                    <dt className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{item.label}</dt>
                    <dd className="mt-1.5 text-sm text-pretty sm:text-base">{item.value}</dd>
                  </div>
                ))}
                <div className="col-span-2 p-4 opacity-0 sm:p-5 lg:col-span-1">
                  <dt className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{t("case.stack")}</dt>
                  <dd className="mt-2.5 flex flex-wrap gap-1.5">
                    {study.stack.map((item) => (
                      <span key={item} className="border border-border px-2 py-1 text-xs text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Proof before the story: the numbers printed on the product */}
        {study.highlights && study.highlights.length > 0 && (
          <section className="px-[clamp(1.25rem,3vw,4rem)] pt-6 sm:pt-8" aria-label={t("case.highlights")}>
            <dl className={`grid border border-border ${study.highlights.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {study.highlights.map((item) => (
                <div key={L(item.label)} data-reveal="" className="border-b border-border p-5 last:border-b-0 sm:border-r sm:border-b-0 sm:p-7 sm:last:border-r-0">
                  <dd className="text-3xl font-bold tracking-tight sm:text-4xl">{L(item.value)}</dd>
                  <dt className="mt-2 max-w-[34ch] text-sm text-pretty text-muted-foreground">{L(item.label)}</dt>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* The product */}
        <section className="case-showcase px-[clamp(1.25rem,3vw,4rem)] pt-8 pb-16 sm:pt-10 sm:pb-24 md:pb-32">
          {desktop ? (
            <div className="relative md:pr-[6%]">
              <BrowserFrame address={address} className="case-shot opacity-0">
                <Image
                  src={desktop.src}
                  alt={L(desktop.alt)}
                  width={desktop.width}
                  height={desktop.height}
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1536px) 1350px, (min-width: 768px) 88vw, 100vw"
                  className="block h-auto w-full"
                />
              </BrowserFrame>
              {mobile && (
                <div className="case-phone absolute right-0 -bottom-12 hidden w-[21%] max-w-[17rem] md:block">
                  <PhoneFrame>
                    <Image src={mobile.src} alt={L(mobile.alt)} width={mobile.width} height={mobile.height} sizes="18vw" className="block h-auto w-full" />
                  </PhoneFrame>
                </div>
              )}
            </div>
          ) : (
            <div className="case-shot relative grid min-h-[20rem] place-items-center overflow-hidden border border-border bg-card p-8 opacity-0 sm:min-h-[26rem]">
              <span
                aria-hidden="true"
                className={`${atAmiga.className} pointer-events-none absolute inset-0 grid place-items-center text-[clamp(7rem,24vw,20rem)] leading-none text-foreground/[0.07] uppercase`}
              >
                {title.split(" ")[0]}
              </span>
              <p className="relative flex items-center gap-3 text-xs tracking-[0.25em] text-muted-foreground uppercase sm:text-sm">
                <span aria-hidden="true" className="size-2 bg-orange-500" />
                {t("case.internal")}
              </p>
            </div>
          )}
        </section>

        {/* The challenge */}
        <section className="border-t border-border px-[clamp(1.25rem,3vw,4rem)] py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
            <SectionHeading index="01" label={t("case.challenge")} title={t("case.challenge")} className="lg:sticky lg:top-28 lg:self-start" />
            <div className="max-w-[68ch] space-y-5" data-reveal="">
              {study.challenge.map((paragraph) => (
                <p key={L(paragraph).slice(0, 32)} className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                  {L(paragraph)}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* What Enzo did: his own part, before the product it produced */}
        <section className="border-t border-border px-[clamp(1.25rem,3vw,4rem)] py-16 sm:py-24">
          <SectionHeading index="02" label={t("case.contributions")} title={t("case.contributions")} className="mb-10 sm:mb-14" />
          <ol className="grid border-t border-border md:grid-cols-2">
            {study.contributions.map((item, index) => (
              <li
                key={L(item)}
                data-reveal=""
                className="flex gap-5 border-b border-border py-5 md:px-6 md:odd:border-r md:odd:pl-0 sm:py-6"
              >
                <span className="font-mono text-xs text-muted-foreground tabular-nums">{pad(index + 1)}</span>
                <span className="text-base text-pretty sm:text-lg">{L(item)}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* The solution and its features */}
        <section className="border-t border-border px-[clamp(1.25rem,3vw,4rem)] py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
            <SectionHeading index="03" label={t("case.solution")} title={t("case.solution")} className="lg:sticky lg:top-28 lg:self-start" />
            <div className="max-w-[68ch] space-y-5" data-reveal="">
              {study.solution.map((paragraph) => (
                <p key={L(paragraph).slice(0, 32)} className="text-base leading-relaxed text-pretty text-foreground/90 sm:text-lg">
                  {L(paragraph)}
                </p>
              ))}
            </div>
          </div>
          <h3 className="mt-14 mb-6 text-xs tracking-[0.25em] text-muted-foreground uppercase sm:mt-20 sm:text-sm">{t("case.features")}</h3>
          <div className="grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
            {study.features.map((feature, index) => (
              <article
                key={L(feature.title)}
                data-reveal=""
                className="group border-r border-b border-border p-5 transition-colors duration-300 hover:bg-card sm:p-7"
              >
                <span className="font-mono text-xs text-muted-foreground tabular-nums">{pad(index + 1)}</span>
                <h3 className="mt-6 text-lg font-medium sm:text-xl">{L(feature.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{L(feature.description)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Engineering */}
        <section className="border-t border-border px-[clamp(1.25rem,3vw,4rem)] py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading index="04" label={t("case.engineering")} title={t("case.engineering")} />
              <div data-reveal="" className="mt-8 flex flex-wrap gap-1.5">
                {study.stack.map((item) => (
                  <span key={item} className="border border-border bg-card/50 px-2.5 py-1.5 text-xs text-foreground/80">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t border-border">
              {study.engineering.map((item) => (
                <div key={L(item.title)} data-reveal="" className="grid gap-2 border-b border-border py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
                  <h3 className="font-medium">{L(item.title)}</h3>
                  <p className="text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">{L(item.description)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The whole page, and more screens */}
        {(full || extra?.length || phoneShots.length > 0) && (
          <section className="border-t border-border px-[clamp(1.25rem,3vw,4rem)] py-16 sm:py-24">
            {full && (
              <>
                <SectionHeading index="05" label={t("case.fullPage")} title={t("case.fullPage")} description={t("case.fullPageHint")} className="mb-10 sm:mb-14" />
                <ScrollThrough src={full.src} width={full.width} height={full.height} alt={L(full.alt)} address={address} />
              </>
            )}

            {(extra?.length || phoneShots.length > 0) && (
              <div className={full ? "mt-16 sm:mt-24" : ""}>
                {full ? (
                  <h3 className="mb-8 text-xs tracking-[0.25em] text-muted-foreground uppercase sm:mb-10 sm:text-sm">{t("case.moreScreens")}</h3>
                ) : (
                  <SectionHeading index="05" label={t("case.moreScreens")} title={t("case.moreScreens")} className="mb-10 sm:mb-14" />
                )}
                <div className="space-y-12 sm:space-y-16">
                  {/* Each desktop screen with what it shows beside it */}
                  {extra?.map((shot) => (
                    <figure key={shot.src} data-reveal="" className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-12">
                      <BrowserFrame address={shot.address ?? address} className="lg:order-2">
                        <Image src={shot.src} alt={L(shot.alt)} width={shot.width} height={shot.height} sizes="(min-width: 1024px) 64vw, 100vw" className="block h-auto w-full" />
                      </BrowserFrame>
                      {shot.caption && (
                        <figcaption className="max-w-[46ch] text-base leading-relaxed text-pretty text-muted-foreground lg:order-1 lg:pt-10">{L(shot.caption)}</figcaption>
                      )}
                    </figure>
                  ))}
                  {phoneShots.length > 0 && (
                    <div className="flex flex-wrap items-start justify-center gap-10 sm:gap-16">
                      {phoneShots.map(({ shot, caption }) => (
                        <figure key={shot.src} data-reveal="" className="w-full max-w-[16rem]">
                          <PhoneFrame>
                            <Image src={shot.src} alt={L(shot.alt)} width={shot.width} height={shot.height} sizes="(min-width: 768px) 16rem, 70vw" className="block h-auto w-full" />
                          </PhoneFrame>
                          <figcaption className="mt-3 text-center text-sm text-muted-foreground">{caption}</figcaption>
                        </figure>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Previous and next */}
        <nav aria-label={t("case.back")} className="border-t border-border px-[clamp(1.25rem,3vw,4rem)]">
          <div className="grid divide-y divide-border border-x border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {previous && <ProjectLink project={previous} label={`← ${t("case.previous")}`} align="start" />}
            {next && <ProjectLink project={next} label={`${t("case.next")} →`} align="end" />}
          </div>
        </nav>
      </article>

      <Contact />
      <Footer />
    </main>
  )
}
