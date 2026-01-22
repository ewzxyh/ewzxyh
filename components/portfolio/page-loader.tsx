"use client"

import { useState, useEffect } from "react"
import { ShapeOverlays } from "./shape-overlays"
import { useLoading } from "./loading-context"

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const { setLoadingComplete, setAlmostComplete } = useLoading()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ShapeOverlays
      isActive={isLoading}
      onComplete={setLoadingComplete}
      onAlmostComplete={setAlmostComplete}
    />
  )
}
