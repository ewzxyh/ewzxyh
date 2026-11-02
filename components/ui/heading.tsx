import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

// The site's heading scale: section titles, card and door titles, sub-sections, and the quiet group labels.
// ai-design-check-ignore-next-line no-tight-small-text -- only the xl titles (24px and up) are tracked tight
export const headingVariants = cva("text-balance", {
  variants: {
    size: {
      xl: "text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl",
      lg: "text-xl font-semibold sm:text-2xl",
      md: "text-lg font-semibold sm:text-xl",
      sm: "text-sm font-medium text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

type HeadingProps = ComponentPropsWithoutRef<"h2"> &
  VariantProps<typeof headingVariants> & {
    as?: "h1" | "h2" | "h3" | "h4"
  }

export function Heading({ as: Tag = "h3", size, className, ...props }: HeadingProps) {
  return <Tag className={cn(headingVariants({ size }), className)} {...props} />
}
