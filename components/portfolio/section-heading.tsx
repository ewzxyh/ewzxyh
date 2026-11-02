import type { ReactNode } from "react"
import { Heading } from "@/components/ui/heading"

// Section opener shared by the home sections and the project pages: the orange marker square (the same as the footer
// and the share images) on the title's first line, then an optional lede. The title names the section on its own.
export function SectionHeading({
  title,
  description,
  as = "h2",
  className = "",
}: {
  title: ReactNode
  description?: ReactNode
  as?: "h1" | "h2" | "h3"
  className?: string
}) {
  return (
    <div className={`section-heading ${className}`}>
      <Heading as={as} size="xl" className="flex items-baseline gap-3">
        <span aria-hidden="true" className="size-2.5 shrink-0 -translate-y-1 bg-orange-500 sm:size-3 sm:-translate-y-1.5" />
        <span>{title}</span>
      </Heading>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
