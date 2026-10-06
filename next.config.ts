import type { NextConfig } from "next"

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
    // One root layout per language (app/(pt) and app/en) leaves no single layout to build the 404 from, so the 404 is
    // rendered by app/global-not-found.tsx, which has its own <html>.
    globalNotFound: true,
    turbopackFileSystemCacheForBuild: !isWindows,
    turbopackFileSystemCacheForDev: true,
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

export default nextConfig
