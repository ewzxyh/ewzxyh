// Shared response helpers for the text and markdown endpoints (llms.txt, llms-full.txt, /*.md).

import { htmlLangs, pageUrl, type SiteLocale } from "./site"

const cacheControl = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800"

// `twinOf` marks a markdown copy of an HTML page: it is sent in that page's language and points at it as its canonical
// URL, so search engines fold the copy into the page instead of listing both. llms.txt is a document of its own and
// leaves it out.
export function textResponse(body: string, contentType: "text/plain" | "text/markdown", twinOf?: SiteLocale) {
  const headers: Record<string, string> = {
    "Content-Type": `${contentType}; charset=utf-8`,
    "Content-Disposition": "inline",
    "Cache-Control": cacheControl,
    "X-Content-Type-Options": "nosniff",
  }
  if (twinOf) {
    headers["Content-Language"] = htmlLangs[twinOf]
    headers.Link = `<${pageUrl(twinOf)}>; rel="canonical"`
  }
  return new Response(body, { headers })
}

export function notFoundText() {
  return new Response("Not found\n", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
