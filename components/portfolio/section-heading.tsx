import type { ReactNode } from "react"

// Section opener shared by the home sections and the project pages: an orange marker (the same square as the footer
// and the share images), "NN // LABEL", the title and an optional lede.
export function SectionHeading({
  index,
  label,
  title,
  description,
  as: Heading = "h2",
  className = "",
}: {
  index?: string
  label: string
  title: ReactNode
  description?: ReactNode
  as?: "h1" | "h2" | "h3"
  className?: string
}) {
  return (
    <div className={`section-heading ${className}`}>
      <p className="mb-3 flex items-center gap-3 text-xs tracking-[0.25em] text-muted-foreground uppercase sm:text-sm sm:tracking-[0.3em]">
        <span aria-hidden="true" className="size-2 shrink-0 bg-orange-500" />
        <span>{index ? `${index} // ${label}` : label}</span>
      </p>
      <Heading className="text-2xl font-bold tracking-tight text-balance sm:text-3xl md:text-4xl">{title}</Heading>
      {description && (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">{description}</p>
      )}
    </div>
  )
}
