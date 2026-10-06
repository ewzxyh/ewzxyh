import { createFluidEngine, type FluidEngine, type FluidEngineOptions } from "./fluid-engine"

// Runs the background shader off the main thread: context creation, shader work and draw calls never
// block hydration, GSAP or scrolling. The page only forwards pointer, size and theme updates.

type Message =
  | { type: "init"; canvas: OffscreenCanvas; options: FluidEngineOptions; timeOrigin: number }
  | { type: "resize"; width: number; height: number; deviceRatio: number }
  | { type: "pointer"; x: number; y: number; time: number }
  | { type: "dark"; value: boolean }
  | { type: "paused"; value: boolean }
  | { type: "hidden"; value: boolean }

const scope = self as unknown as DedicatedWorkerGlobalScope
let engine: FluidEngine | null = null
// Event timestamps come from the page's clock; this converts them to the worker's.
let clockOffset = 0

scope.onmessage = (event: MessageEvent<Message>) => {
  const message = event.data
  switch (message.type) {
    case "init":
      clockOffset = message.timeOrigin - performance.timeOrigin
      engine = createFluidEngine(message.canvas, message.options, {
        onReveal: () => scope.postMessage({ type: "revealed" }),
        onFail: () => scope.postMessage({ type: "failed" }),
      })
      // "ready" = the GL context exists, i.e. the GPU is awake (the page waits for this before creating its own).
      scope.postMessage({ type: engine ? "ready" : "failed" })
      break
    case "resize":
      engine?.resize(message.width, message.height, message.deviceRatio)
      break
    case "pointer":
      engine?.pointer(message.x, message.y, message.time + clockOffset)
      break
    case "dark":
      engine?.setDark(message.value)
      break
    case "paused":
      engine?.setPaused(message.value)
      break
    case "hidden":
      engine?.setHidden(message.value)
      break
  }
}
