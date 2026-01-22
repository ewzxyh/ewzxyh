# Architecture

**Analysis Date:** 2026-01-21

## Pattern Overview

**Overall:** Client-side Single Page Application (SPA) with Server Components

**Key Characteristics:**
- Next.js App Router with minimal server-side logic
- Heavy client-side animation and interaction (GSAP, Three.js, WebGL)
- Context-based state management for themes, internationalization, and loading states
- Component-driven architecture split between portfolio-specific and reusable UI components
- No backend API routes—this is a purely frontend portfolio application

## Layers

**Entry Point / Layout Layer:**
- Purpose: Root layout configuration, metadata, font setup, and global providers
- Location: `app/layout.tsx`, `app/providers.tsx`
- Contains: Metadata, Providers (ThemeProvider, I18nProvider, LoadingProvider), Global CSS setup
- Depends on: Next.js, next-themes, React Context providers
- Used by: All pages and components

**Page Layer:**
- Purpose: Route definitions and page-level component composition
- Location: `app/page.tsx`, `app/not-found.tsx`
- Contains: Home page composition (Hero, About, Projects, Contact, Footer)
- Depends on: Portfolio components from `components/portfolio`
- Used by: Next.js router

**Portfolio Components Layer (Feature-Specific):**
- Purpose: Self-contained feature components for the portfolio application
- Location: `components/portfolio/`
- Contains: Hero, About, Projects, Contact, Footer, Header, BentoGallery, LavaLamp, ShaderImage, CanvasParticles, etc.
- Depends on: GSAP, Three.js, React hooks, UI components, i18n context, loading context
- Used by: Main page layout and other portfolio components

**UI Components Layer (Reusable):**
- Purpose: Generic, reusable UI primitives built on Shadcn UI and Base UI
- Location: `components/ui/`
- Contains: Button, Card, Alert, Accordion, Dialog, Input, etc. (library components)
- Depends on: Shadcn UI, Radix UI, Tailwind CSS, Class Variance Authority
- Used by: Portfolio components and any custom implementations

**Context/State Layer:**
- Purpose: Global state management via React Context API
- Location: `lib/i18n.tsx`, `components/portfolio/loading-context.tsx`
- Contains: I18nProvider/useI18n (translations, locale switching), LoadingProvider/useLoading (page load state)
- Depends on: React Context, useState, useCallback
- Used by: All components that need translations or loading state

**Utilities/Helpers Layer:**
- Purpose: Helper functions and utilities
- Location: `lib/utils.ts`, `lib/gallery-blur.ts`, `hooks/use-parallax.ts`
- Contains: CSS class merging (`cn`), parallax/fade-in animations (useParallax, useFadeIn), gallery effects
- Depends on: clsx, tailwind-merge, GSAP, ScrollTrigger
- Used by: Components needing class utilities or animation logic

## Data Flow

**Initial Page Load:**

1. Browser requests `/` → Next.js serves `app/layout.tsx`
2. Layout wraps content with Providers (`ThemeProvider`, `I18nProvider`, `LoadingProvider`)
3. Layout mounts `app/page.tsx` which renders portfolio sections
4. `PageLoader` component activates and runs ShapeOverlays animation (500ms)
5. After delay, `setAlmostComplete()` fires → Hero animations begin
6. After animation completes, `setLoadingComplete()` fires
7. Page is interactive

**Component Rendering Flow:**

- `app/page.tsx` (server component) statically imports portfolio components
- Portfolio components are Client Components (`"use client"`)
- Each portfolio component has local `useEffect` hooks to register GSAP animations
- Animations trigger on scroll via ScrollTrigger plugin
- Context hooks (`useI18n`, `useLoading`) provide dynamic values

**State Management:**

- **Locale State:** `I18nProvider` wraps app with `locale` ("pt-BR" | "en-US"). Components call `useI18n()` to access `locale`, `t()` translation function, and `setLocale()` switcher
- **Loading State:** `LoadingProvider` wraps app with `isLoadingComplete`, `isAlmostComplete` flags. Components call `useLoading()` to check state or trigger transitions
- **Theme State:** `next-themes` ThemeProvider manages "dark"/"light" theme classes on `<html>` element
- No global data store (Redux/Zustand) needed—local component state + Context sufficient

## Key Abstractions

**Portfolio Section Components:**
- Purpose: Self-contained page sections with animations and content
- Examples: `components/portfolio/hero.tsx`, `components/portfolio/about.tsx`, `components/portfolio/projects.tsx`, `components/portfolio/contact.tsx`, `components/portfolio/footer.tsx`
- Pattern: Each is a `"use client"` component with `useRef` for animation targets and `useEffect` to set up GSAP animations on mount

**Animation Hooks:**
- Purpose: Reusable GSAP animation logic
- Examples: `hooks/use-parallax.ts` (exports `useParallax` and `useFadeIn`)
- Pattern: Generic `<T extends HTMLElement>` hooks return `ref` to attach to DOM elements; animations auto-initialize on mount

**Context Hooks:**
- Purpose: Provide access to global state
- Examples: `useI18n()` returns `{ locale, setLocale, t, isTransitioning }`, `useLoading()` returns `{ isLoadingComplete, isAlmostComplete, setLoadingComplete, setAlmostComplete }`
- Pattern: Each throws error if used outside provider boundary; provides memoized callbacks to prevent unnecessary re-renders

**Shader Components:**
- Purpose: WebGL-based visual effects using Three.js
- Examples: `components/portfolio/lava-lamp.tsx`, `components/portfolio/shader-image.tsx`
- Pattern: Initialize THREE.Scene, ShaderMaterial, and RAF loop in `useEffect`; clean up on unmount

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Browser loads `/`
- Responsibilities: Apply fonts, set metadata, wrap children with providers, render global styles

**Page:**
- Location: `app/page.tsx`
- Triggers: Browser navigates to `/`
- Responsibilities: Compose and render portfolio sections (Hero, About, Projects, Contact, Footer, LavaLamp)

**Page Loader:**
- Location: `components/portfolio/page-loader.tsx`
- Triggers: On mount (rendered in Providers)
- Responsibilities: Trigger loading animation on page load, signal when animation stages complete

## Error Handling

**Strategy:** Defensive error handling with Context consumer guards

**Patterns:**
- Context hooks (`useI18n`, `useLoading`) throw descriptive errors if called outside provider: `throw new Error("useI18n must be used within I18nProvider")`
- Component ref guards: Check `if (!element) return` before accessing DOM refs
- GSAP cleanup: Unsubscribe ScrollTriggers on unmount to prevent memory leaks
- No global error boundary—errors in animations won't break page (GSAP errors are logged to console)

## Cross-Cutting Concerns

**Logging:** None—console errors only from GSAP and browser runtime errors

**Validation:** Locale type-checked as `"pt-BR" | "en-US"` at Context level; translation keys validated via TypeScript `TranslationKey` type

**Authentication:** Not applicable—public portfolio, no auth required

**Internationalization:** I18nProvider wraps app; all user-facing strings use `t("key")` function from `useI18n()` hook. Switching locale triggers transition animation via `setIsTransitioning` flag

**Theme Management:** next-themes handles light/dark theme; components use Tailwind's `dark:` classes; ThemeToggle component switches via `setTheme()`

**Performance:**
- GSAP animations are GPU-accelerated via transform/opacity only (no layout thrashing)
- ScrollTrigger uses requestAnimationFrame for smooth scroll-linked animations
- useCallback memoization on Context to prevent unnecessary re-renders
- lazy component imports not used (small app, inlining is acceptable)

---

*Architecture analysis: 2026-01-21*
