import type { MetadataRoute } from "next"
import { siteDescription, siteName } from "@/lib/site"

// Colours match the site's own dark theme, which is what opens first (see viewport in layout.tsx).
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${siteName} | Product Engineer`,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "pt-BR",
    dir: "ltr",
    background_color: "#0c0a09",
    theme_color: "#0c0a09",
    categories: ["business", "productivity"],
    icons: [
      { src: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Full-bleed tile with the mark kept inside the 40% safe circle, for launchers that crop icons to a shape.
      { src: "/favicon/maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
