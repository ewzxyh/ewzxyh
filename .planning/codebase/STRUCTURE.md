# Codebase Structure

**Analysis Date:** 2026-01-21

## Directory Layout

```
ewzxyh/
├── app/                         # Next.js App Router pages and layouts
│   ├── layout.tsx               # Root layout with providers and metadata
│   ├── page.tsx                 # Home page composition
│   ├── providers.tsx            # Global context providers
│   └── not-found.tsx            # 404 page
├── components/
│   ├── portfolio/               # Feature-specific portfolio components
│   │   ├── index.ts             # Barrel file for exports
│   │   ├── hero.tsx             # Hero section with animations
│   │   ├── about.tsx            # About/skills section
│   │   ├── projects.tsx         # Featured projects
│   │   ├── contact.tsx          # Contact CTA section
│   │   ├── footer.tsx           # Footer
│   │   ├── header.tsx           # Navigation header
│   │   ├── header-actions.tsx   # Theme/language toggle buttons
│   │   ├── bento-gallery.tsx    # Grid gallery layout
│   │   ├── lava-lamp.tsx        # WebGL lava effect (Three.js)
│   │   ├── shader-image.tsx     # WebGL shader for images
│   │   ├── canvas-particles.tsx # Canvas particle effects
│   │   ├── page-loader.tsx      # Loading screen animation
│   │   ├── shape-overlays.tsx   # SVG shape animation for loader
│   │   ├── intro-loader.tsx     # Initial page load animation
│   │   ├── loading-context.tsx  # Loading state provider
│   │   ├── logo.tsx             # Branding logo
│   │   ├── theme-toggle.tsx     # Dark/light theme switcher
│   │   ├── language-toggle.tsx  # pt-BR/en-US locale switcher
│   │   ├── gsap-provider.tsx    # GSAP initialization helper
│   │   └── ...                  # Additional portfolio components
│   └── ui/                      # Reusable UI primitives (Shadcn UI)
│       ├── button.tsx           # Button component
│       ├── card.tsx             # Card component
│       ├── alert.tsx            # Alert component
│       ├── accordion.tsx        # Accordion component
│       └── ...                  # 40+ UI components
├── lib/
│   ├── i18n.tsx                 # Internationalization provider and hook
│   ├── utils.ts                 # Class merging utility (cn)
│   └── gallery-blur.ts          # Gallery blur/effect utilities
├── hooks/
│   └── use-parallax.ts          # GSAP parallax and fade-in animation hooks
├── public/                      # Static assets
├── .planning/
│   └── codebase/                # Codebase documentation (generated)
├── scripts/                     # Utility scripts
├── package.json                 # Dependencies (Next.js, React, GSAP, Three.js, etc.)
├── tsconfig.json                # TypeScript config with path alias @/*
├── biome.json                   # Biome linter/formatter config
├── tailwind.config.ts           # Tailwind CSS config
├── next.config.ts               # Next.js config
└── README.md                    # Project README
```

## Directory Purposes

**app:**
- Purpose: Next.js App Router pages, layouts, and route logic
- Contains: Server and Client components for page structure
- Key files: `layout.tsx` (root wrapper), `page.tsx` (home), `providers.tsx` (context setup)

**components/portfolio:**
- Purpose: Self-contained portfolio feature components with animations
- Contains: Hero, About, Projects, Contact, Footer, Header, and utility components (PageLoader, ShapeOverlays, etc.)
- Key files: `index.ts` (barrel export), `hero.tsx`, `about.tsx`, `projects.tsx`

**components/ui:**
- Purpose: Reusable UI primitives from Shadcn UI and Base UI
- Contains: Generic form inputs, layout components, dialogs, dropdowns
- Key files: `button.tsx`, `card.tsx`, `alert.tsx` (and 40+ others)

**lib:**
- Purpose: Shared utilities and providers
- Contains: i18n context provider, class merging utility, effect utilities
- Key files: `i18n.tsx` (translations), `utils.ts` (cn helper)

**hooks:**
- Purpose: Custom React hooks for reusable logic
- Contains: GSAP animation hooks
- Key files: `use-parallax.ts` (exports useParallax, useFadeIn)

**public:**
- Purpose: Static assets served directly
- Contains: Images, fonts, icons, etc.

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout that wraps all pages with providers
- `app/page.tsx`: Home page rendering portfolio sections
- `app/providers.tsx`: Global context wrappers (Theme, I18n, Loading)

**Configuration:**
- `package.json`: Dependencies and scripts (dev, build, start)
- `tsconfig.json`: TypeScript compiler options and path alias `@/*`
- `tailwind.config.ts`: Tailwind CSS customization
- `next.config.ts`: Next.js configuration
- `biome.json`: Biome linter/formatter rules (Ultracite preset)

**Core Logic:**
- `lib/i18n.tsx`: Internationalization state and translation lookup
- `components/portfolio/loading-context.tsx`: Loading animation state
- `hooks/use-parallax.ts`: GSAP animation initialization and ScrollTrigger setup

**Testing:**
- No test files found (testing not set up)

## Naming Conventions

**Files:**
- Portfolio components: PascalCase (e.g., `hero.tsx`, `about.tsx`)
- UI components: PascalCase, prefixed with functionality (e.g., `button.tsx`, `input.tsx`)
- Hooks: camelCase with `use-` prefix (e.g., `use-parallax.ts`)
- Utilities: camelCase (e.g., `utils.ts`, `gallery-blur.ts`)
- Contexts: camelCase, suffixed with `-context` (e.g., `loading-context.tsx`, `i18n.tsx`)

**Directories:**
- Feature folders: lowercase, plural (e.g., `components/`, `hooks/`, `scripts/`)
- Nested features: lowercase, descriptive (e.g., `components/portfolio/`, `components/ui/`)

**Code Exports:**
- Named exports for components: `export function Hero() { ... }`
- Barrel files for folders: `components/portfolio/index.ts` re-exports all portfolio components
- Hooks export both hook and types: `export function useI18n() { ... }`, `export function I18nProvider() { ... }`

## Where to Add New Code

**New Portfolio Feature/Section:**
- Implementation: `components/portfolio/{feature-name}.tsx`
- Add to exports: Update `components/portfolio/index.ts` to include new export
- Integrate: Import and render in `app/page.tsx`
- Pattern: Make it a `"use client"` component, use `useEffect` + `useRef` for GSAP animations, access i18n via `useI18n()`

**New UI Component (Reusable):**
- Implementation: `components/ui/{component-name}.tsx`
- Pattern: Base UI or Shadcn UI component, styled with Tailwind, use ClassVariance for variants
- No need to export from barrel—import directly when needed

**New Custom Hook:**
- Implementation: `hooks/use-{hook-name}.ts`
- Pattern: Export the hook function and any associated types
- Used by: Components that need reusable logic (animations, state, side effects)

**New Utility Function:**
- Implementation: Add to `lib/utils.ts` or create new file like `lib/{utility-name}.ts`
- Pattern: Export named functions or objects
- Used by: Imported directly where needed

**Internationalization Strings:**
- Update: `lib/i18n.tsx` translations object
- Pattern: Add key-value pair to both "pt-BR" and "en-US" sections
- Access: Components call `const { t } = useI18n()` then `t("key")`

## Special Directories

**app/:**
- Purpose: Next.js App Router structure
- Generated: No
- Committed: Yes
- Note: `layout.tsx` is mandatory; `page.tsx` is the home route; `.tsx` files auto-become routes

**components/portfolio/:**
- Purpose: Portfolio-specific features (not reusable in other projects)
- Generated: No
- Committed: Yes
- Note: Barrel export in `index.ts` simplifies imports

**components/ui/:**
- Purpose: Library of reusable components (Shadcn/Radix)
- Generated: Partially (created via Shadcn CLI `npx shadcn-ui@latest add`)
- Committed: Yes
- Note: Modified locally; don't re-generate from Shadcn

**.next/:**
- Purpose: Next.js build output and dev cache
- Generated: Yes (by `npm run build` or `npm run dev`)
- Committed: No (in `.gitignore`)
- Note: Contains compiled pages, server functions, and type definitions

**node_modules/:**
- Purpose: Installed npm dependencies
- Generated: Yes (by `npm install` or `bun install`)
- Committed: No (in `.gitignore`)
- Note: Lockfile is `bun.lock`

**.planning/codebase/:**
- Purpose: Codebase documentation (ARCHITECTURE.md, CONVENTIONS.md, etc.)
- Generated: Yes (by `/gsd:map-codebase` command)
- Committed: Yes
- Note: Reference docs for future development

---

*Structure analysis: 2026-01-21*
