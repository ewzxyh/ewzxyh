import type { NextConfig } from "next"
import { PHASE_DEVELOPMENT_SERVER } from "next/constants"

const isTurbopack = process.argv.includes("--turbopack") || process.env.TURBOPACK === "1"
const isWindows = process.platform === "win32"

// Files in /public are served with `max-age=0` by default, so every visit revalidated every image and
// animation JSON. They are not fingerprinted, hence a day of freshness plus a week of stale-while-revalidate.
const staticAssetCacheControl = [
  { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
]

const nextConfig: NextConfig = {
  agentRules: true,
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  reactCompiler: true,
  experimental: {
    // `next dev` and `next build` remind about new stable releases (the default only reminds about security fixes).
    agentUpgrade: "latest",
    // One root layout per language (app/(pt) and app/en) leaves no single layout to build the 404 from, so the 404 is
    // rendered by app/global-not-found.tsx, which has its own <html>.
    globalNotFound: true,
    // The dev cache is on by default since 16.1; the build cache (default since 16.3) stays off on Windows.
    turbopackFileSystemCacheForBuild: !isWindows,
    turbopackLocalPostcssConfig: true,
    turbopackMemoryEviction: "full",
    ...(isTurbopack ? { turbopackRustReactCompiler: true } : {}),
  },
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/devicons/**",
      },
    ],
  },
  // Public markdown twins of the page (/index.md, /en/index.md, ...) are served by app/md/[locale]/[doc].
  async rewrites() {
    return [
      { source: "/en/:doc.md", destination: "/md/en-US/:doc" },
      { source: "/:doc.md", destination: "/md/pt-BR/:doc" },
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // One language per URL (see lib/site.ts): Bing and other consumers read the language from this header.
      { source: "/", headers: [{ key: "Content-Language", value: "pt-BR" }] },
      { source: "/en", headers: [{ key: "Content-Language", value: "en" }] },
      ...["gallery", "hero", "empresas", "estudo", "certificados", "og", "favicon", "lottie"].map((directory) => ({
        source: `/${directory}/:path*`,
        headers: staticAssetCacheControl,
      })),
      { source: "/loader-ascii-column-4.txt", headers: staticAssetCacheControl },
      { source: "/:file([^/]+\\.(?:svg|png|webp|jpe?g|json|lottie))", headers: staticAssetCacheControl },
    ]
  },
}

// Development only: drop unreachable work from Turbopack's memory and disk cache during long `next dev` sessions, and
// compile client-side dynamic imports (toggles, bat overlay, Lottie, fluid engine, sounds) when first requested.
// Production builds keep the stable path. The phase is how Next.js tells them apart, also after a config restart.
export default function config(phase: string): NextConfig {
  if (phase !== PHASE_DEVELOPMENT_SERVER) return nextConfig
  return {
    ...nextConfig,
    experimental: { ...nextConfig.experimental, turbopackGc: true },
  }
}
