import type { Text } from "../profile"

// One screenshot of the product. Paths are in /public; sizes are the real pixel sizes of the files.
export interface Shot {
  src: string
  width: number
  height: number
  alt: Text
  caption?: Text
}

export interface CaseStudyMedia {
  // Desktop viewport (1440x900 at 2x).
  desktop?: Shot
  // Phone viewport (390x844 at 2x).
  mobile?: Shot
  // The whole page at 1440 px wide, shown scrolling inside a browser frame.
  full?: Shot
  // Social card (1200x630), cropped from the desktop capture.
  og?: string
  // Other screens worth showing (a second product surface, docs).
  extra?: Shot[]
}

// A project page. Every statement comes from the live product, its public documentation or what Enzo confirmed;
// numbers are the ones printed on the product (prices, limits, counts), never invented outcomes.
export interface CaseStudy {
  slug: string
  // The sentence under the title.
  summary: Text
  // Meta description (up to ~160 characters).
  seoDescription: Text
  role: Text
  client: Text
  period?: Text
  status: Text
  platform: Text
  links: { label: Text; url: string }[]
  stack: string[]
  // Paragraphs.
  challenge: Text[]
  solution: Text[]
  // "What I did", one line each.
  contributions: Text[]
  features: { title: Text; description: Text }[]
  engineering: { title: Text; description: Text }[]
  highlights?: { value: Text; label: Text }[]
  media: CaseStudyMedia
}
