import type { MetadataRoute } from "next"
import { siteLastModified, siteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: siteLastModified,
    },
  ]
}
