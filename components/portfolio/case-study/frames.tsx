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

// A phone outline for the mobile capture.
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[1.75rem] border-[5px] border-neutral-900 bg-neutral-900 shadow-2xl shadow-black/30 dark:border-neutral-700 ${className}`}>
      <div className="overflow-hidden rounded-[1.35rem]">{children}</div>
    </div>
  )
}
