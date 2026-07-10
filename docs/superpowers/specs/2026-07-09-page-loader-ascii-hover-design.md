# Page Loader ASCII Hover

## Goal

Add a pointer-following hover treatment to the ASCII panel in the page loader. The effect should feel irregular and metallic, use royal-blue dithering, and preserve the ASCII artwork's layout.

## Interaction

- The full ASCII panel is interactive, not only the visible characters.
- An asymmetric dithered blue shape follows the pointer continuously with light smoothing.
- The ASCII artwork shifts and expands horizontally by a very small amount near the pointer, then returns when the pointer leaves.
- The effect fades out on pointer leave.
- Reduced-motion users receive the color treatment without pointer-following motion.

## Visual Treatment

- Build the shape from overlapping CSS masks so its edge is irregular rather than circular.
- Render the dithering with a CSS dot pattern over a saturated royal-blue background.
- Use a brighter blue and light ASCII text in dark mode; use royal blue and dark ASCII text in light mode.
- Keep the existing ASCII sizing, alignment, and overflow clipping unchanged.

## Implementation

- Keep the change inside `components/portfolio/page-loader.tsx` and the existing global stylesheet if pseudo-element styles are required.
- Update CSS custom properties from pointer events; animate only `transform` and `opacity` during movement.
- Do not add dependencies, canvas rendering, SVG filters, or a permanent animation loop.

## Verification

- The effect follows the pointer across the whole ASCII panel.
- The dithered shape is visibly irregular and never escapes the panel.
- The ASCII remains legible and does not overflow in desktop or mobile layouts.
- Pointer leave restores the initial state.
- Light mode, dark mode, and reduced-motion behavior remain usable.
- `bun run lint`, `bun run typecheck`, and React Doctor pass.
