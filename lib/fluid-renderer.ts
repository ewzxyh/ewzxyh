import type { FluidEngineOptions } from "./fluid-engine"

export interface FluidController {
  setPaused: (paused: boolean) => void
  dispose: () => void
}

interface FluidOptions {
  reducedMotion: boolean
  paused: boolean
  // Called once the first GL context has been created (or definitively failed): the GPU is awake by then.
  onContextReady?: () => void
}

// Whatever runs the engine (a worker or the main thread) is driven through the same small surface.
interface Target {
  resize: (width: number, height: number, deviceRatio: number) => void
  pointer: (x: number, y: number, time: number) => void
  dark: (value: boolean) => void
  paused: (value: boolean) => void
  hidden: (value: boolean) => void
  dispose: () => void
}

function createCanvas() {
  const canvas = document.createElement("canvas")
  canvas.setAttribute("aria-hidden", "true")
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    opacity: "0",
    transition: "opacity 600ms ease-out",
  })
  return canvas
}

// Renders the animated background into `container`. The shader runs in a worker (OffscreenCanvas) when the
// browser supports it, and falls back to running on the main thread otherwise.
export function createFluid(container: HTMLElement, options: FluidOptions): FluidController {
  const root = document.documentElement
  const finePointer = window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches
  const coarse = window.matchMedia("(pointer: coarse)").matches

  let disposed = false
  let paused = options.paused
  let target: Target | null = null
  let worker: Worker | null = null
  let canvas = createCanvas()
  container.appendChild(canvas)

  const engineOptions = (): FluidEngineOptions => ({
    reducedMotion: options.reducedMotion,
    coarse,
    finePointer,
    deviceRatio: window.devicePixelRatio || 1,
    width: container.clientWidth,
    height: container.clientHeight,
    dark: root.classList.contains("dark"),
    paused,
  })

  function reveal() {
    canvas.style.opacity = "1"
  }

  function startOnMainThread() {
    void import("./fluid-engine").then(({ createFluidEngine }) => {
      if (disposed) return
      const engine = createFluidEngine(canvas, engineOptions(), { onReveal: reveal, onFail: () => {} })
      options.onContextReady?.()
      if (!engine) return
      target = {
        resize: engine.resize,
        pointer: engine.pointer,
        dark: engine.setDark,
        paused: engine.setPaused,
        hidden: engine.setHidden,
        dispose: engine.dispose,
      }
    })
  }

  // A canvas handed to a worker cannot be drawn on again, so a fallback needs a fresh one.
  function resetCanvas() {
    const fresh = createCanvas()
    canvas.replaceWith(fresh)
    canvas = fresh
  }

  function fallBackToMainThread() {
    if (disposed || !worker) return
    worker.terminate()
    worker = null
    target = null
    resetCanvas()
    startOnMainThread()
  }

  function startWorker() {
    if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined") return false
    if (!("transferControlToOffscreen" in canvas)) return false

    try {
      const instance = new Worker(new URL("./fluid-worker.ts", import.meta.url), { type: "module" })
      const offscreen = canvas.transferControlToOffscreen()
      instance.onmessage = (event: MessageEvent<{ type: string }>) => {
        if (event.data.type === "revealed") reveal()
        else if (event.data.type === "ready") options.onContextReady?.()
        else if (event.data.type === "failed") fallBackToMainThread()
      }
      instance.onerror = fallBackToMainThread
      instance.postMessage({ type: "init", canvas: offscreen, options: engineOptions(), timeOrigin: performance.timeOrigin }, [
        offscreen,
      ])

      worker = instance
      target = {
        resize: (width, height, deviceRatio) => instance.postMessage({ type: "resize", width, height, deviceRatio }),
        pointer: (x, y, time) => instance.postMessage({ type: "pointer", x, y, time }),
        dark: (value) => instance.postMessage({ type: "dark", value }),
        paused: (value) => instance.postMessage({ type: "paused", value }),
        hidden: (value) => instance.postMessage({ type: "hidden", value }),
        dispose: () => instance.terminate(),
      }
      return true
    } catch {
      resetCanvas()
      return false
    }
  }

  if (!startWorker()) startOnMainThread()

  // The pointer is expressed relative to the container (the hero), not the window. Its box is read again only after
  // a scroll or resize, so a burst of pointer events costs a single layout read.
  let box: DOMRect | null = null
  const invalidateBox = () => {
    box = null
  }

  const resizeObserver = new ResizeObserver(() => {
    invalidateBox()
    target?.resize(container.clientWidth, container.clientHeight, window.devicePixelRatio || 1)
  })
  resizeObserver.observe(container)

  const themeObserver = new MutationObserver(() => target?.dark(root.classList.contains("dark")))
  themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] })

  const handleVisibility = () => target?.hidden(document.hidden)
  document.addEventListener("visibilitychange", handleVisibility)

  const handlePointerMove = (event: PointerEvent) => {
    box ??= container.getBoundingClientRect()
    if (box.width === 0 || box.height === 0) return
    target?.pointer((event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height, event.timeStamp)
  }

  // Pointer tracking only runs while the background is drawn: a paused background ignores the mouse entirely.
  const tracksPointer = finePointer && !options.reducedMotion
  let listening = false
  function setListening(next: boolean) {
    if (!tracksPointer || next === listening) return
    listening = next
    invalidateBox()
    if (next) {
      document.addEventListener("pointermove", handlePointerMove, { passive: true })
      window.addEventListener("scroll", invalidateBox, { passive: true })
      window.addEventListener("resize", invalidateBox)
    } else {
      document.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("scroll", invalidateBox)
      window.removeEventListener("resize", invalidateBox)
    }
  }
  setListening(!paused)

  return {
    setPaused(next) {
      paused = next
      target?.paused(next)
      setListening(!next)
    },
    dispose() {
      disposed = true
      setListening(false)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      document.removeEventListener("visibilitychange", handleVisibility)
      target?.dispose()
      worker?.terminate()
      canvas.remove()
    },
  }
}
