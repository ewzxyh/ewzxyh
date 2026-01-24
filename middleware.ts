import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const LOCALE_COOKIE = "preferred-locale"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Check if user already has a locale preference
  const existingLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (existingLocale) {
    return response
  }

  // Get country from Vercel's geolocation header
  const country = request.headers.get("x-vercel-ip-country") || ""

  // Set locale based on country
  // BR = Brazil, PT = Portugal -> pt-BR
  // Everything else -> en-US
  const locale = ["BR", "PT"].includes(country.toUpperCase()) ? "pt-BR" : "en-US"

  // Set cookie for client-side hydration
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  })

  return response
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    "/((?!_next/static|_next/image|favicon|api|.*\\..*).*)",
  ],
}
