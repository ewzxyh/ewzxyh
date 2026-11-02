# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences with equal weight (confirmed 2026-11-01):

- Companies and founders who could hire Ewzxyh Labs for a product (SaaS, dashboards, APIs, automations). They arrive from
  a shared link, LinkedIn or search, often on a phone, and want proof that the products are real and live.
- Recruiters and hiring managers evaluating Enzo Yoshida for a Product Engineer role. They want the roles, the scope of
  each project and a quick way to reach him.

## Product Purpose

The personal portfolio of Enzo Hideki Yoshida (ewzxyh.com, `/` in Portuguese, `/en` in English): show the products he
built and runs, explain his part in each, and turn a visit into a conversation (WhatsApp, e-mail or LinkedIn).

## Positioning

A Product Engineer who designs, builds and operates his own products in production (Grapnel, Grapnel para agentes,
LotoHub and its agency API), not only client mockups. Every project links to a live product or a case study with
real captures.

## Operating Context

- Visitors read on phones first; the site must lead with the work, not with intro animation.
- Each project has a case-study page (`/projetos/<slug>`, `/en/projects/<slug>`) with real screenshots.
- Content is single-sourced in `lib/profile.ts`, `lib/translations.ts` and `lib/case-studies/` and also published as
  markdown and llms.txt.

## Capabilities and Constraints

- Next.js 16 (App Router, static), GSAP and Lenis motion, a WebGL contour background in the hero only.
- One light theme only (the dark theme was removed on 2026-11-01).
- Motion is part of the identity: optimize animations before removing them, and ask before removing one.
- Respect `prefers-reduced-motion` and the site's own pause button.

## Brand Commitments

- Name and marks: Enzo Yoshida, Ewzxyh Labs, the EHY logo.
- Type: AT Amiga for display, JetBrains Mono for text.
- Monochrome stone palette with one orange marker square; hairline borders, square corners.
- Icons: Solar Linear (UI) and Phosphor (brand logos).
- Voice: plain, factual Portuguese and English; no hype, no invented numbers.

## Evidence on Hand

- Live products and their captures in `public/projects/<slug>/`.
- Numbers printed on the products themselves (prices, limits, counts) are the only figures used.
- Absent: client testimonials, revenue figures, traffic data. Do not invent them.

## Product Principles

1. Show the product: real captures or a faithful product demonstration, never generic visuals.
2. Proof before claims: projects come right after the introduction.
3. Two doors, equal weight: talk about a project, or review the profile.
4. Every animation earns its cost on a phone.

## Accessibility & Inclusion

WCAG 2.2 AA: visible focus, 44px touch targets, reduced motion honored, real alt text, bilingual content with the right
`lang`.
