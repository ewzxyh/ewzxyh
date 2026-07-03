import type { NextConfig } from "next"
import { withSerwist } from "@serwist/turbopack"

const isTurbopack = process.argv.includes("--turbopack") || process.env.TURBOPACK === "1"
const isWindows = process.platform === "win32"

const nextConfig: NextConfig = {
  agentRules: true,
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  reactCompiler: true,
  experimental: {
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
    ]
  },
}

export default withSerwist(nextConfig)
