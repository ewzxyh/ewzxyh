"use client"

import { usePathname } from "next/navigation"
import { createContext, use, useEffect, useState, type ReactNode } from "react"
import { useMounted } from "@/hooks/use-mounted"
import { htmlLangs, isHomePath, pageTitle, pathInLocale } from "./site"
import { translations, type Locale, type TranslationKey } from "./translations"

export type { Locale, TranslationKey }

// Written only when the visitor presses the language button; proxy.ts reads it to decide where "/" should open.
const LOCALE_COOKIE = "locale-choice"
const DAY_MS = 24 * 60 * 60 * 1000

type CookieStoreLike = {
  set: (options: {
    name: string
    value: string
    expires: number
    path: string
    sameSite: "lax"
  }) => Promise<void>
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return undefined
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return
  const expiresAt = Date.now() + days * DAY_MS
  const cookieStore = (window as Window & { cookieStore?: CookieStoreLike }).cookieStore

  if (cookieStore) {
    void cookieStore.set({ name, value, expires: expiresAt, path: "/", sameSite: "lax" })
    return
  }

  const expires = new Date(expiresAt).toUTCString()
  // biome-ignore lint/suspicious/noDocumentCookie: fallback for browsers without Cookie Store API.
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

function storedLocale(): Locale | null {
  const value = getCookie(LOCALE_COOKIE)
  return value === "pt-BR" || value === "en-US" ? value : null
}

// Both language versions of a page render the same tree (the home pages, each project page), so switching language
// does not navigate: it swaps the text and rewrites the address bar, which keeps the page, the animations and the
// scroll position. A reload or a shared link then opens the language that was on screen (each language has its own
// server-rendered page). Pages without a counterpart (the 404) keep their address. Project pages update their own
// title (see components/portfolio/case-study).
function showLanguageInAddressBar(locale: Locale) {
  const { pathname, search, hash } = window.location
  const target = pathInLocale(pathname, locale)
  if (!target || pathname === target) return
  window.history.replaceState(null, "", `${target}${search}${hash}`)
  if (isHomePath(pathname)) document.title = pageTitle(locale)
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
  isTransitioning: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

// `pageLocale` is the language the server rendered the page in (each root layout knows its own). `restoreChoice` is for
// pages that have no language of their own, like the 404, which open in the language the visitor picked before.
export function I18nProvider({
  locale: pageLocale,
  restoreChoice,
  children,
}: {
  locale: Locale
  restoreChoice: boolean
  children: ReactNode
}) {
  const mounted = useMounted()
  const [choice, setChoice] = useState<Locale | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // What was pressed wins, then (only once mounted, so the server HTML matches the first client render, and only when
  // asked to) what the visitor picked on an earlier visit, then the language of the page.
  const locale: Locale = choice ?? (restoreChoice && mounted ? storedLocale() : null) ?? pageLocale

  useEffect(() => {
    document.documentElement.lang = htmlLangs[locale]
  }, [locale])

  // The rewrite replaces the current history entry only, so going back (or following a link inside the same
  // language tree) lands on an address of the page's own language: the address follows the language on screen again.
  const pathname = usePathname()
  useEffect(() => {
    if (choice && pathname) showLanguageInAddressBar(choice)
  }, [choice, pathname])

  function setLocale(newLocale: Locale) {
    if (newLocale === locale) return

    setIsTransitioning(true)
    setCookie(LOCALE_COOKIE, newLocale, 365)

    setTimeout(() => {
      setChoice(newLocale)
      showLanguageInAddressBar(newLocale)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 800)
    }, 400)
  }

  function t(key: TranslationKey): string {
    return translations[locale][key] || key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isTransitioning }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = use(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
