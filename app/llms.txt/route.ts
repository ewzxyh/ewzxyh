import { textResponse } from "@/lib/machine-readable"
import { renderLlmsTxt } from "@/lib/markdown"

// https://llmstxt.org: a short Markdown index for language models and agents.
export function GET() {
  return textResponse(renderLlmsTxt(), "text/plain")
}
