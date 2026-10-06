"use client"

import { createContext, use, useState, type ReactNode } from "react"
import { useMounted } from "@/hooks/use-mounted"
import { translations, type Locale, type TranslationKey } from "./translations"

export type { Locale, TranslationKey }

const LOCALE_COOKIE = "preferred-locale"
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

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
  isTransitioning: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

function getInitialLocale(): Locale {
  if (typeof document === "undefined") return "pt-BR"
  const cookieLocale = getCookie(LOCALE_COOKIE)
  if (cookieLocale === "pt-BR" || cookieLocale === "en-US") {
    return cookieLocale
  }
  return "pt-BR"
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const mounted = useMounted()
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const activeLocale = mounted ? locale : "pt-BR"

  function setLocale(newLocale: Locale) {
    if (newLocale === locale) return

    setIsTransitioning(true)
    setCookie(LOCALE_COOKIE, newLocale, 365)

    setTimeout(() => {
      setLocaleState(newLocale)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 800)
    }, 400)
  }

  function t(key: TranslationKey): string {
    return translations[activeLocale][key] || key
  }

  return (
    <I18nContext.Provider value={{ locale: activeLocale, setLocale, t, isTransitioning }}>
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
