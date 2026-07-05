"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const hoverSelector = [
  "a[href]",
  "button",
  "label[for]",
  "select",
  "summary",
  "[role='button']",
  "[role='link']",
  "[tabindex]:not([tabindex='-1'])",
  ".cursor-pointer",
  ".clickable",
  "[data-cursor-hover]",
  "[class*='hover:']",
].join(",")

function hasHoverTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(hoverSelector))
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const hoveringRef = useRef(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia("(any-hover: hover) and (any-pointer: fine)")
    if (!finePointer.matches) return

    const root = document.documentElement
    root.classList.add("has-custom-cursor")

    function setHovering(next: boolean) {
      if (hoveringRef.current === next) return
      hoveringRef.current = next
      setIsHovering(next)
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return
      const cursor = cursorRef.current
      if (!cursor) return

      cursor.style.opacity = "1"
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      setHovering(hasHoverTarget(event.target))
    }

    function hideCursor() {
      if (cursorRef.current) cursorRef.current.style.opacity = "0"
      setHovering(false)
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("blur", hideCursor)
    document.addEventListener("pointerleave", hideCursor)

    return () => {
      root.classList.remove("has-custom-cursor")
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("blur", hideCursor)
      document.removeEventListener("pointerleave", hideCursor)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="custom-cursor fixed left-0 top-0 z-[100] opacity-0 pointer-events-none text-foreground"
      aria-hidden="true"
    >
      <div
        className={cn(
          "relative size-8 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out motion-reduce:transition-none",
          isHovering && "rotate-90 scale-150"
        )}
      >
        <span className="absolute left-0 top-0 size-2.5 border-l border-t border-current" />
        <span className="absolute right-0 top-0 size-2.5 border-r border-t border-current" />
        <span className="absolute bottom-0 left-0 size-2.5 border-b border-l border-current" />
        <span className="absolute bottom-0 right-0 size-2.5 border-b border-r border-current" />
        <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
      </div>
    </div>
  )
}
