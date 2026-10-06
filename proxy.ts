import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Where "/" opens. Portuguese lives at "/" and English at "/en"; both are plain, server-rendered pages that every
// crawler can fetch. Only people are ever sent from one to the other, never crawlers, link-preview fetchers or tools:
// they always get the page they asked for, so what search engines index and what social cards show is predictable.
// (Locale redirects in a proxy are the pattern of https://nextjs.org/docs/app/guides/internationalization.)

const LOCALE_COOKIE = "locale-choice"
const PORTUGUESE_SPEAKING_COUNTRIES = ["BR", "PT"]

// User agents that are not a person looking at a screen.
const AUTOMATED =
  /bot|crawl|spider|slurp|yeti|seznam|archiver|facebookexternalhit|meta-external|whatsapp|telegram|slack|discord|linkedin|twitter|embedly|pinterest|preview|lighthouse|headless|curl|wget|python|axios|undici|node-fetch|okhttp|go-http|chatgpt|oai-|claude|perplexity|anthropic|mistral|cohere|google|yandex|baidu/i

// Visitors from outside Brazil and Portugal get English. The country comes from the host (x-vercel-ip-country); a
// request without it (local development, other hosts) is never treated as foreign.
function isForeign(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase()
  return Boolean(country) && !PORTUGUESE_SPEAKING_COUNTRIES.includes(country as string)
}

export function proxy(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? ""
  if (!userAgent || AUTOMATED.test(userAgent)) return NextResponse.next()

  // A language picked with the button always wins; without one, foreign visitors go to English.
  const choice = request.cookies.get(LOCALE_COOKIE)?.value
  const wantsEnglish = choice ? choice === "en-US" : isForeign(request)
  if (!wantsEnglish) return NextResponse.next()

  const target = request.nextUrl.clone()
  target.pathname = "/en"
  const response = NextResponse.redirect(target, 307)
  response.headers.set("Cache-Control", "private, no-store")
  response.headers.set("Vary", "Cookie")
  return response
}

export const config = {
  matcher: ["/"],
}
