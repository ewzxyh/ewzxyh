"use client"

import { WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center bg-background">
      <div className="p-4 border border-border bg-card/50">
        <WifiOff className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Você está offline</h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md">
          Verifique sua conexão com a internet e tente novamente.
        </p>
      </div>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        className="gap-2 border-foreground"
      >
        <RefreshCw className="w-4 h-4" />
        Tentar novamente
      </Button>
    </div>
  )
}
