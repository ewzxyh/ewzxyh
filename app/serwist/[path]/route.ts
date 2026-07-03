import { createSerwistRoute } from "@serwist/turbopack"

const revision =
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  process.env.SOURCE_VERSION ??
  "local"

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    additionalPrecacheEntries: [{ url: "/offline", revision }],
    globIgnores: ["**/gallery/**"],
    maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
    swSrc: "app/sw.ts",
    useNativeEsbuild: true,
  })
