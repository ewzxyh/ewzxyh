"use client"

import { createContext, use, useState, type ReactNode } from "react"

interface LoadingContextType {
  isLoadingComplete: boolean
  isAlmostComplete: boolean
  // True from the moment the loader starts wiping away, so page content can enter underneath it.
  isRevealing: boolean
  setLoadingComplete: () => void
  setAlmostComplete: () => void
  setRevealing: () => void
}

const LoadingContext = createContext<LoadingContextType | null>(null)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  const [isAlmostComplete, setIsAlmostComplete] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)

  function setLoadingComplete() {
    setIsLoadingComplete(true)
    setIsRevealing(true)
  }

  function setAlmostComplete() {
    setIsAlmostComplete(true)
  }

  function setRevealing() {
    setIsRevealing(true)
  }

  return (
    <LoadingContext.Provider
      value={{ isLoadingComplete, isAlmostComplete, isRevealing, setLoadingComplete, setAlmostComplete, setRevealing }}
    >
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
