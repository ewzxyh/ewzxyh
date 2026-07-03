"use client"

import { createContext, use, useState, type ReactNode } from "react"

interface LoadingContextType {
  isLoadingComplete: boolean
  isAlmostComplete: boolean
  setLoadingComplete: () => void
  setAlmostComplete: () => void
}

const LoadingContext = createContext<LoadingContextType | null>(null)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  const [isAlmostComplete, setIsAlmostComplete] = useState(false)

  function setLoadingComplete() {
    setIsLoadingComplete(true)
  }

  function setAlmostComplete() {
    setIsAlmostComplete(true)
  }

  return (
    <LoadingContext.Provider value={{ isLoadingComplete, isAlmostComplete, setLoadingComplete, setAlmostComplete }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = use(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
