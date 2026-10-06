import { notFoundText, textResponse } from "@/lib/machine-readable"
import { type DocId, docIds, docLocales, renderDoc } from "@/lib/markdown"
import type { Locale } from "@/lib/translations"

// Markdown twins of the page: /index.md, /about.md, ... (pt-BR) and /en/index.md, /en/about.md, ... (en-US).
// next.config.ts rewrites those public paths here.

export function generateStaticParams() {
  return docLocales.flatMap((locale) => docIds.map((doc) => ({ locale, doc })))
}

const isLocale = (value: string): value is Locale => (docLocales as readonly string[]).includes(value)
const isDoc = (value: string): value is DocId => (docIds as readonly string[]).includes(value)

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; doc: string }> }) {
  const { locale, doc } = await params
  if (!isLocale(locale) || !isDoc(doc)) return notFoundText()
  return textResponse(renderDoc(doc, locale), "text/markdown", locale)
}
