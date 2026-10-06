import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/site"

// A portfolio wants to be found and quoted, so every crawler that identifies itself is welcome. The vendors are
// listed by purpose so the file documents what each token does; changing the policy for one group is a one-line edit.
//
// - search: build the index that search engines and AI answer engines cite
// - assistants: fetch a page on demand because a person asked an assistant about it
// - training: collect content to train or ground models (several of these are control tokens, not crawlers)
const search = ["Googlebot", "Bingbot", "OAI-SearchBot", "Claude-SearchBot", "PerplexityBot", "DuckAssistBot", "Applebot"]
const assistants = ["ChatGPT-User", "Claude-User", "Perplexity-User", "MistralAI-User", "meta-externalfetcher"]
const training = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "meta-externalagent", "CCBot", "Amazonbot"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // `/md/` is the internal home of the markdown twins; the public paths are /index.md, /en/about.md and so on.
      { userAgent: "*", allow: "/", disallow: "/md/" },
      { userAgent: [...search, ...assistants, ...training], allow: "/", disallow: "/md/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
