import { textResponse } from "@/lib/machine-readable"
import { renderLlmsFullTxt } from "@/lib/markdown"

// Everything in /llms.txt, in both languages, as one file an agent can load in a single request.
export function GET() {
  return textResponse(renderLlmsFullTxt(), "text/plain")
}
