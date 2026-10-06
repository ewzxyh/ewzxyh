// Server-only: picks the share (Open Graph / X card) image of each language at build time.
//
// Drop a light-theme PNG named like one of the candidates below into /public/og and the metadata, JSON-LD and
// sitemap switch to it by themselves, with the real pixel size read from the file. Until then the current WebP keeps
// working. See docs/metadata-images for the briefs that produce these files.
//
//   Portuguese page ("/")   ewzxyh-og-light.png      (+ optional ewzxyh-x-light.png, a native 2:1 card for X)
//   English page ("/en")    ewzxyh-og-light-en.png   (+ optional ewzxyh-x-light-en.png); falls back to the Portuguese file
//
// Social networks cache a card image per URL for days, so the URL carries a short hash of the file: replacing the
// image changes the URL by itself and the next share shows the new one.

import { createHash } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { personName, type SiteLocale, siteName, siteUrl } from "./site"

export interface ShareImage {
  url: string
  width: number
  height: number
  type: string
  alt: string
}

const publicDir = join(process.cwd(), "public")

const currentImage = "/og/enzo-yoshida-product-engineer.webp"

const ogCandidates: Record<SiteLocale, string[]> = {
  "pt-BR": ["/og/ewzxyh-og-light.png", "/og/ewzxyh-og-light.jpg"],
  "en-US": ["/og/ewzxyh-og-light-en.png", "/og/ewzxyh-og-light-en.jpg"],
}
// Optional 2:1 card for X. When it does not exist the Open Graph image of the same language is reused.
const xCandidates: Record<SiteLocale, string[]> = {
  "pt-BR": ["/og/ewzxyh-x-light.png", "/og/ewzxyh-x-light.jpg"],
  "en-US": ["/og/ewzxyh-x-light-en.png", "/og/ewzxyh-x-light-en.jpg"],
}

const FALLBACK_SIZE = { width: 1200, height: 630 }

function mimeOf(path: string) {
  if (path.endsWith(".png")) return "image/png"
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg"
  return "image/webp"
}

// PNG stores its size in the IHDR chunk, right after the 8-byte signature.
function pngSize(bytes: Buffer) {
  const header = bytes.subarray(0, 24)
  if (header.toString("ascii", 1, 4) !== "PNG") return null
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) }
}

function describe(path: string, alt: string): ShareImage {
  let bytes: Buffer | null = null
  try {
    bytes = readFileSync(join(publicDir, path))
  } catch {}
  const size = bytes && path.endsWith(".png") ? pngSize(bytes) : null
  const version = bytes ? `?v=${createHash("sha1").update(bytes).digest("hex").slice(0, 8)}` : ""
  return { url: `${siteUrl}${path}${version}`, type: mimeOf(path), alt, ...(size ?? FALLBACK_SIZE) }
}

function firstExisting(candidates: string[]) {
  return candidates.find((path) => existsSync(join(publicDir, path)))
}

// The English page prefers its own files and otherwise shows the Portuguese ones.
const languageChain: Record<SiteLocale, SiteLocale[]> = { "pt-BR": ["pt-BR"], "en-US": ["en-US", "pt-BR"] }

export function getShareImages(locale: SiteLocale): { og: ShareImage; x: ShareImage } {
  const alt = `${siteName} (${personName}) - Product Engineer, Ewzxyh Labs`
  const chain = languageChain[locale]
  const og = describe(firstExisting(chain.flatMap((language) => ogCandidates[language])) ?? currentImage, alt)
  // X takes the native 2:1 card of a language when there is one, then that language's Open Graph image.
  const xPath = firstExisting(chain.flatMap((language) => [...xCandidates[language], ...ogCandidates[language]]))
  return { og, x: xPath ? describe(xPath, alt) : og }
}
