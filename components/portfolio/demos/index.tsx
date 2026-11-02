"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

// Animated product demos for the featured project cards, drawn with the Stageshow kit (components/stageshow/kit).
// Each one is its own chunk, rendered on the client only (the stage measures its container); until it arrives the slot
// keeps the stage's proportions so the card does not jump.
function Placeholder() {
  return <div aria-hidden="true" className="mx-auto aspect-[358/460] w-full max-w-[640px] sm:aspect-[640/580]" />
}

const load = (importer: () => Promise<{ default: ComponentType }>) => dynamic(importer, { ssr: false, loading: Placeholder })

const demos: Record<string, ComponentType> = {
  grapnel: load(() => import("./grapnel-demo")),
  "grapnel-agentes": load(() => import("./agents-demo")),
  lotohub: load(() => import("./lotohub-demo")),
  "marketplace-api": load(() => import("./agencies-demo")),
}

export function hasProjectDemo(id: string) {
  return id in demos
}

export function ProjectDemo({ id }: { id: string }) {
  const Demo = demos[id]
  return Demo ? <Demo /> : null
}
