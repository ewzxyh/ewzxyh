import type { ReactNode } from "react"

// A minimal browser window around a screenshot: three dots and the address, in the site's hairline style.
export function BrowserFrame({ address, children, className = "" }: { address?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden border border-border bg-card ${className}`}>
      <div aria-hidden="true" className="flex items-center gap-3 border-b border-border px-3 py-2 sm:px-4 sm:py-2.5">
        <span className="flex shrink-0 gap-1.5">
          <span className="size-2 rounded-full bg-foreground/20 sm:size-2.5" />
          <span className="size-2 rounded-full bg-foreground/20 sm:size-2.5" />
          <span className="size-2 rounded-full bg-foreground/20 sm:size-2.5" />
        </span>
        {address && (
          <span className="min-w-0 flex-1 truncate bg-background/70 px-2 py-0.5 text-center font-mono text-[10px] text-muted-foreground sm:text-xs">
            {address}
          </span>
        )}
        <span className="hidden w-[3.25rem] shrink-0 sm:block" />
      </div>
      {children}
    </div>
  )
}

// The side buttons of an iPhone (action button and volume on the left, side button and camera control on the right),
// as fractions of the body height, drawn as outlined tabs like the body.
const PHONE_BUTTONS = [
  { side: "left", top: "13%", height: "6%" },
  { side: "left", top: "23%", height: "8%" },
  { side: "left", top: "36%", height: "8%" },
  { side: "right", top: "27%", height: "6%" },
  { side: "right", top: "35%", height: "7%" },
] as const

// A line drawing of a current iPhone around the mobile capture: a thin frame, the black screen border, the Dynamic
// Island and the side buttons. Lines follow the text color, so it works on both themes; radii are percentages so the
// shape holds at any width.
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {PHONE_BUTTONS.map((button) => (
        <span
          key={`${button.side}-${button.top}`}
          aria-hidden="true"
          style={{ top: button.top, height: button.height }}
          className={`absolute w-[3px] border border-foreground/55 bg-background ${
            button.side === "left" ? "-left-[2px] rounded-l-[2px] border-r-0" : "-right-[2px] rounded-r-[2px] border-l-0"
          }`}
        />
      ))}
      <div className="relative rounded-[13%/6.2%] border border-foreground/55 bg-background p-[1.6%] shadow-xl shadow-black/15">
        <div className="relative overflow-hidden rounded-[11.5%/5.4%] border-[3px] border-neutral-950 bg-neutral-950">
          {/* The status bar above the page (the captures are the page alone), with the Dynamic Island in it. Padding
              percentages follow the width, like the 54 of 390 points on the device. */}
          <div aria-hidden="true" className="relative pt-[13.8%]">
            <span className="absolute top-[20%] left-1/2 h-[68%] w-[32%] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
