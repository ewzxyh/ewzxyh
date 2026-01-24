"use client"

import { Download, Check } from "lucide-react"
import { usePWAInstall } from "@/hooks/use-pwa-install"
import { useI18n } from "@/lib/i18n"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface PWAInstallButtonProps {
  variant?: "icon" | "button" | "menu"
  className?: string
}

export function PWAInstallButton({ variant = "icon", className = "" }: PWAInstallButtonProps) {
  const { t } = useI18n()
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall()

  // Don't show if already installed
  if (isInstalled) {
    if (variant === "icon") {
      return (
        <div className={`p-2 sm:p-2.5 border border-green-500/30 bg-green-500/10 text-green-500 ${className}`}>
          <Check className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
        </div>
      )
    }
    return null
  }

  // For iOS, show tooltip with instructions
  if (isIOS) {
    if (variant === "icon") {
      return (
        <Tooltip>
          <TooltipTrigger
            className={`group p-2 sm:p-2.5 border border-border bg-card/50 text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 ${className}`}
            aria-label={t("pwa.install" as never)}
          >
            <Download className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform duration-200" />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[200px] text-center">
            <p className="text-xs">{t("pwa.iosHint" as never)}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    if (variant === "menu") {
      return (
        <Tooltip>
          <TooltipTrigger
            className={`group relative w-full text-left py-3 sm:py-4 overflow-hidden transition-all duration-300 hover:pl-4 active:scale-[0.98] border-b border-border/30 ${className}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-muted-foreground">
                {t("pwa.install" as never)}
              </span>
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110" />
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full" />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[200px] text-center">
            <p className="text-xs">{t("pwa.iosHint" as never)}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return null
  }

  // For other browsers, show install button only if installable
  if (!isInstallable) return null

  if (variant === "icon") {
    return (
      <Tooltip>
        <TooltipTrigger
          onClick={install}
          className={`group p-2 sm:p-2.5 border border-border bg-card/50 text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 ${className}`}
          aria-label={t("pwa.install" as never)}
        >
          <Download className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform duration-200" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{t("pwa.install" as never)}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={install}
        className={`group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base tracking-wider border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all duration-300 ${className}`}
      >
        <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
        {t("pwa.install" as never)}
      </button>
    )
  }

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={install}
        className={`group relative w-full text-left py-3 sm:py-4 overflow-hidden transition-all duration-300 hover:pl-4 active:scale-[0.98] border-b border-border/30 ${className}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-muted-foreground">
            {t("pwa.install" as never)}
          </span>
          <Download className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:scale-110" />
        </div>
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full" />
      </button>
    )
  }

  return null
}
