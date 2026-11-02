import { cva } from "class-variance-authority"

// The site's buttons and button-looking links: square, hairline, mono text, ink fill. They press in a touch (0.97)
// and swap fill and text on hover; hover only exists where a real pointer does (Tailwind 4's hover variant).
export const buttonVariants = cva(
  "inline-flex shrink-0 select-none items-center justify-center gap-2 border whitespace-nowrap transition-[background-color,color,border-color,scale] duration-200 ease-ui active:scale-97 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // The one primary action of a block.
        solid: "border-foreground bg-foreground text-background hover:bg-background hover:text-foreground",
        // A second action beside it, with the same outline.
        outline: "border-foreground bg-background text-foreground hover:bg-foreground hover:text-background",
        // Toolbar buttons in the header: a hairline until pointed at.
        quiet: "border-border bg-background text-foreground hover:border-foreground hover:bg-foreground hover:text-background",
      },
      size: {
        md: "h-12 px-5 text-sm",
        lg: "h-12 px-5 text-sm sm:h-14 sm:px-6",
        // 44px on touch screens, 40px from the small breakpoint up.
        icon: "size-11 sm:size-10",
        chip: "h-11 px-3 text-sm font-medium sm:h-10",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
)
