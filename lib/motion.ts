// Whether the site moves. The visitor's own choice (the pause button in the header, remembered in this browser) wins
// over the system setting (prefers-reduced-motion). Continuous animations (the hero background, the gallery's
// particle vortex, blinking cursors and status dots) and scroll-linked effects follow it, which is how the site meets
// WCAG 2.2.2 (Pause, Stop, Hide) for content that moves on its own for more than five seconds.
//
// <html data-motion="reduce|full"> mirrors the decision for CSS; app/root-document.tsx sets it before the first paint
// from the stored choice, and globals.css falls back to the media query while there is none.

const STORAGE_KEY = "motion"
const QUERY = "(prefers-reduced-motion: reduce)"

type Choice = "reduce" | "full"

const listeners = new Set<() => void>()
let choice: Choice | null | undefined

function storedChoice(): Choice | null {
  if (choice !== undefined) return choice
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    choice = value === "reduce" || value === "full" ? value : null
  } catch {
    choice = null
  }
  return choice
}

export function isMotionReduced(): boolean {
  const stored = storedChoice()
  if (stored) return stored === "reduce"
  return window.matchMedia(QUERY).matches
}

function applyAttribute() {
  document.documentElement.dataset.motion = isMotionReduced() ? "reduce" : "full"
}

export function setMotionReduced(reduce: boolean) {
  choice = reduce ? "reduce" : "full"
  try {
    window.localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    // Private mode or blocked storage: the choice still holds for this page.
  }
  applyAttribute()
  for (const listener of listeners) listener()
}

export function subscribeMotion(listener: () => void) {
  const query = window.matchMedia(QUERY)
  const onSystemChange = () => {
    applyAttribute()
    listener()
  }
  listeners.add(listener)
  query.addEventListener("change", onSystemChange)
  return () => {
    listeners.delete(listener)
    query.removeEventListener("change", onSystemChange)
  }
}

// Runs as an inline script before the page paints (no React yet): the stored choice only, the media query covers the rest.
export const motionBootScript = `try{var m=localStorage.getItem("${STORAGE_KEY}");if(m==="reduce"||m==="full")document.documentElement.dataset.motion=m}catch(e){}`
