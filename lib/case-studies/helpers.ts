import type { Text } from "../profile"
import type { CaseStudyMedia } from "./types"

// Portuguese first, English second: keeps the case-study files readable.
export const tx = (pt: string, en: string): Text => ({ "pt-BR": pt, "en-US": en })

// The captures in /public/projects/<slug>: desktop.webp (2880x1800), mobile.webp (780x1688), full.webp (1440 wide)
// and og.jpg (1200x630), all taken from the live product.
export function capturedMedia(slug: string, name: string, fullHeight?: number): CaseStudyMedia {
  return {
    desktop: {
      src: `/projects/${slug}/desktop.webp`,
      width: 2880,
      height: 1800,
      alt: tx(`Página inicial de ${name} no computador`, `${name} home page on a desktop screen`),
    },
    mobile: {
      src: `/projects/${slug}/mobile.webp`,
      width: 780,
      height: 1688,
      alt: tx(`${name} no celular`, `${name} on a phone`),
    },
    full: fullHeight
      ? {
          src: `/projects/${slug}/full.webp`,
          width: 1440,
          height: fullHeight,
          alt: tx(`Página completa de ${name}, do topo ao rodapé`, `The whole ${name} page, top to bottom`),
        }
      : undefined,
    og: `/projects/${slug}/og.jpg`,
  }
}
