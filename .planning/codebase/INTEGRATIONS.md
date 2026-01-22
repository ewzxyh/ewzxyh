# External Integrations

**Analysis Date:** 2026-01-21

## APIs & External Services

**Social Media Links:**
- GitHub - Social link integration in hero component
  - SDK/Client: None (standard links)
  - Implementation: Direct link to https://github.com/ewzxyh

- LinkedIn - Social link integration with locale support
  - SDK/Client: None (standard links)
  - Implementation: Locale-aware links (`C:\Users\enzo\ewzxyh\components\portfolio\hero.tsx` lines 31-32)

- Instagram - Social link integration
  - SDK/Client: None (standard links)
  - Implementation: Direct link to https://instagram.com/yoshidakazoh

- Email - Contact link
  - SDK/Client: None (mailto links)
  - Implementation: Direct mailto:yoshidaenzo@hotmail.com

**Project Links:**
- GitHub repositories (external links to projects)
  - Pattern: https://github.com/ewzxyh/[project-name]
  - Used in `C:\Users\enzo\ewzxyh\components\portfolio\projects.tsx` lines 29, 35, 41, etc.

- Vercel deployments (demo links)
  - Pattern: https://[project-name].vercel.app
  - Used in `C:\Users\enzo\ewzxyh\components\portfolio\projects.tsx` lines 30, 36, 42, etc.

## Data Storage

**Databases:**
- Not detected - This is a static/client-side rendered portfolio with no backend database

**File Storage:**
- Local filesystem only - Static assets served from `C:\Users\enzo\ewzxyh\public/`
  - JSON files: `Bat.json`, `Batmans.json`, `Button.json` (Lottie animation files)
  - SVG files: `ewzxyh-logo-black.svg`, `ewzxyh-logo-white.svg`
  - Gallery directory: `C:\Users\enzo\ewzxyh\public\gallery/` (image assets)

**Caching:**
- Next.js built-in caching and static optimization
- Client-side browser cache management

## Authentication & Identity

**Auth Provider:**
- None - No authentication system
- Portfolio is fully public with no protected routes

## Monitoring & Observability

**Error Tracking:**
- Not detected

**Logs:**
- Browser console only (development via React console, no centralized logging)
- Biome linter output during development

**Performance Monitoring:**
- No external service detected
- Client-side performance tracking possible via React Profiler

## CI/CD & Deployment

**Hosting:**
- Vercel (inferred from documentation and Next.js project defaults)
- Can run on any Node.js-compatible platform

**CI Pipeline:**
- Not configured in repository
- Next.js/Vercel integration ready (automatic deployment possible)

**Deployment Commands:**
- `bun run build` - Production build
- `bun start` - Start production server
- Vercel CLI compatible

## Environment Configuration

**Required env vars:**
- None detected - Application is fully static

**Secrets location:**
- No secrets management detected
- Application contains no API keys or sensitive credentials

## Webhooks & Callbacks

**Incoming:**
- None - Portfolio is read-only, no server-side form handling

**Outgoing:**
- None detected

## Content & Assets

**Static Content:**
- Hosted locally in `C:\Users\enzo\ewzxyh\public/`
- Lottie animations served as JSON files
- SVG logos and graphics
- Gallery images in `C:\Users\enzo\ewzxyh\public\gallery/`

**Dynamic Content:**
- i18n translations managed locally at `C:\Users\enzo\ewzxyh\lib\i18n.tsx` (pt-BR and en-US)
- Project data hardcoded in `C:\Users\enzo\ewzxyh\components\portfolio\projects.tsx`

## Font Loading

**External Font Service:**
- Google Fonts - JetBrains Mono
  - Configuration: `C:\Users\enzo\ewzxyh\app\layout.tsx` line 6
  - Subsets: "latin"
  - Variable name: --font-sans
  - Auto-optimized by Next.js

## Third-Party Tracking

**Analytics:**
- Not detected

**Marketing/Conversion Tracking:**
- Not detected

## Browser APIs Used

**Local Storage:**
- Theme persistence (via next-themes)
  - Managed client-side only

**Canvas/WebGL:**
- Three.js canvas rendering for 3D effects in `C:\Users\enzo\ewzxyh\components\portfolio\lava-lamp.tsx`
- Fragment and vertex shaders for custom visual effects

**Scroll Events:**
- GSAP ScrollTrigger plugin for scroll-linked animations
- Native scroll event listeners in `C:\Users\enzo\ewzxyh\components\portfolio\shader-image.tsx`

## CDN & Content Delivery

**Asset Delivery:**
- Next.js Image optimization (next/image component capability)
- Static file serving via public/ directory
- No external CDN configured

---

*Integration audit: 2026-01-21*
