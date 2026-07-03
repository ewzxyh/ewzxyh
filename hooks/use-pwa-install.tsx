"use client"

import { createContext, use, useState, useEffect, type ReactNode } from "react"
import { useMounted } from "@/hooks/use-mounted"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface PWAInstallContextType {
  isInstallable: boolean
  isInstalled: boolean
  isIOS: boolean
  install: () => Promise<void>
}

const PWAInstallContext = createContext<PWAInstallContextType | null>(null)

export function PWAInstallProvider({ children }: { children: ReactNode }) {
  const mounted = useMounted()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(display-mode: standalone)").matches
      : false
  )
  const [isIOS] = useState(() =>
    typeof navigator !== "undefined"
      ? /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window)
      : false
  )

  useEffect(() => {
    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  async function install() {
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setIsInstalled(true)
    }
    setDeferredPrompt(null)
  }

  return (
    <PWAInstallContext.Provider
      value={{
        isInstallable: !!deferredPrompt,
        isInstalled: mounted && isInstalled,
        isIOS: mounted && isIOS,
        install,
      }}
    >
      {children}
    </PWAInstallContext.Provider>
  )
}

export function usePWAInstall() {
  const context = use(PWAInstallContext)
  if (!context) {
    throw new Error("usePWAInstall must be used within PWAInstallProvider")
  }
  return context
}
