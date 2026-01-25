import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const LOCALE_COOKIE = "preferred-locale"

export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  const existingLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (existingLocale) {
    return response
  }

  const country = request.headers.get("x-vercel-ip-country") || ""
  const locale = ["BR", "PT"].includes(country.toUpperCase()) ? "pt-BR" : "en-US"

  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|api|.*\\..*).*)",
  ],
}
