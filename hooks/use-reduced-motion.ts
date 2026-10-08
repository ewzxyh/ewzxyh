import { useSyncExternalStore } from "react"
import { isMotionReduced, subscribeMotion } from "@/lib/motion"

// True when the visitor asked for less motion: in the system settings or with the pause button in the header
// (see lib/motion.ts). The server render assumes full motion; the first client render corrects it.
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeMotion, isMotionReduced, () => false)
}
