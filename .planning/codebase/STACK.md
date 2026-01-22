# Technology Stack

**Analysis Date:** 2026-01-21

## Languages

**Primary:**
- TypeScript 5.x - Entire application codebase (React components, utilities, configuration)

**Secondary:**
- JavaScript (JSX/TSX) - React component files
- GLSL - Fragment and vertex shaders in WebGL canvas components (`C:\Users\enzo\ewzxyh\components\portfolio\lava-lamp.tsx`)

## Runtime

**Environment:**
- Node.js (bundled via Bun)

**Package Manager:**
- Bun (`bun`) - Primary package manager and runtime
- Lockfile: `C:\Users\enzo\ewzxyh\bun.lock` (present)

## Frameworks

**Core:**
- Next.js 16.1.4 - Full-stack framework with App Router
- React 19.2.3 - UI component library
- React DOM 19.2.3 - DOM rendering

**UI/Component Libraries:**
- Shadcn UI 3.7.0 - Pre-built, accessible component library (configured at `C:\Users\enzo\ewzxyh\components.json`)
- Base UI (@base-ui/react) 1.1.0 - Unstyled component primitives
- Tailwind CSS 4.x - Utility-first CSS framework
- Tailwind PostCSS plugin (@tailwindcss/postcss) 4.x - PostCSS integration

**Animation & Graphics:**
- GSAP (gsap) 3.14.2 - Professional animation library with plugins (ScrollTrigger, TextPlugin, ScrambleTextPlugin)
- @gsap/react 2.1.2 - React integration for GSAP
- Three.js (three) 0.182.0 - 3D graphics library (used in WebGL shaders)
- @types/three 0.182.0 - TypeScript types for Three.js

**Interactive Components:**
- Embla Carousel (embla-carousel-react) 9.0.0-rc01 - Headless carousel library
- React Resizable Panels (react-resizable-panels) 4.4.1 - Draggable resize panels
- React Day Picker (react-day-picker) 9.13.0 - Headless date picker
- Input OTP (input-otp) 1.4.2 - OTP input component

**Animation & Lottie:**
- Lottie React (lottie-react) 2.4.1 - Lottie animations for React
- DotLottie React (@lottiefiles/dotlottie-react) 0.17.13 - DotLottie format support
- DotLottie Web (@lottiefiles/dotlottie-web) 0.61.0 - Web implementation
- React Useanimations (react-useanimations) 2.10.0 - SVG animation library (GitHub, LinkedIn, Instagram, Mail icons)

**Data Visualization:**
- Recharts 2.15.4 - React charting library

**UI Utilities:**
- Lucide React (lucide-react) 0.562.0 - Icon library
- React Icons (react-icons) 5.5.0 - Alternative icon library
- Clsx (clsx) 2.1.1 - Conditional className utility
- Tailwind Merge (tailwind-merge) 3.4.0 - Merge Tailwind CSS classes
- Class Variance Authority (class-variance-authority) 0.7.1 - CSS variant pattern
- TW Animate CSS (tw-animate-css) 1.4.0 - Tailwind animation utility
- Vaul (vaul) 1.1.2 - Drawer/modal component

**Theme & Localization:**
- Next Themes (next-themes) 0.4.6 - Theme management (dark/light mode)
- Custom I18n provider at `C:\Users\enzo\ewzxyh\lib\i18n.tsx` - Client-side context-based localization

**Utility Libraries:**
- Date-fns (date-fns) 4.1.0 - Date utility library
- Cmdk (cmdk) 1.1.1 - Command menu component
- Sonner (sonner) 2.0.7 - Toast notification library
- Shadcn (shadcn) 3.7.0 - Component CLI tool

## Testing

**Testing Framework:**
- Not detected

**Test Files:**
- Not found in codebase

## Build & Development

**Build Tools:**
- Biome 2.2.0 (via @biomejs/biome) - All-in-one linter, formatter, and bundler
- Next.js built-in webpack configuration

**Dev Server:**
- Next.js dev server (`next dev`) - Runs on localhost:3000
- Fast Refresh enabled for React

## Configuration

**Environment:**
- No `.env` files detected (environment configuration handled externally)
- Configuration via `next.config.ts` at `C:\Users\enzo\ewzxyh\next.config.ts` (minimal, comments only)

**Build Configuration:**
- TypeScript config: `C:\Users\enzo\ewzxyh\tsconfig.json`
  - Target: ES2017
  - Module: esnext
  - Strict mode enabled
  - Path alias: `@/*` maps to root directory
- PostCSS config: `C:\Users\enzo\ewzxyh\postcss.config.mjs`
  - Uses @tailwindcss/postcss plugin
- Biome config: `C:\Users\enzo\ewzxyh\biome.json`
  - Formatter: 2-space indentation
  - Linter: recommended rules for Next.js and React
  - VCS: Git integration enabled

**Font Loading:**
- Google Fonts: JetBrains Mono (configured in `C:\Users\enzo\ewzxyh\app\layout.tsx`)

## Platform Requirements

**Development:**
- Bun runtime (platform-independent)
- Node.js 18+ compatible
- git (for version control)

**Production:**
- Deployment platform: Vercel (recommended per Next.js defaults)
- Node.js 18+ runtime
- Memory: Minimal (static site + client-side interactivity)
- Storage: CDN for assets

**Scripts:**
- `bun dev` - Development server
- `bun run build` - Production build
- `bun start` - Start production server
- `bun lint` - Run Biome linting
- `bun format` - Run Biome formatting

---

*Stack analysis: 2026-01-21*
