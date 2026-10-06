// Runs work when the main thread is free (Safari has no requestIdleCallback). Returns a cancel function.
export function onIdle(callback: () => void, timeout = 1000) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout })
    return () => window.cancelIdleCallback(id)
  }
  const id = window.setTimeout(callback, 120)
  return () => window.clearTimeout(id)
}
