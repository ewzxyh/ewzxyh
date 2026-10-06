// Builds the favicon and app-icon set from the official logo mark, set on the site's dark tile so the mark stays
// legible on light and dark tab strips, search results and home screens.
//
//   bun scripts/make-icons.ts
//
// Writes public/favicon/*.png, public/favicon/favicon.ico and app/favicon.ico. Re-run it when the logo changes.
// The spec of every file is documented in docs/metadata-images/03-favicon-app-icons.md.

import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import sharp from "sharp"

const ROOT = join(import.meta.dirname, "..")
const OUT = join(ROOT, "public", "favicon")
const MARK = join(ROOT, "public", "ewzxyh-icon-white.svg")
const BACKGROUND = "#0c0a09"

// tile: rounded square with transparent corners (favicons, "any" icons)
// full: opaque square edge to edge (iOS rounds the corners itself)
// maskable: opaque square with the mark inside the 40% safe circle (launchers crop it to any shape)
type Kind = "tile" | "full" | "maskable"

interface IconSpec {
  file: string
  size: number
  kind: Kind
  // Height of the mark as a fraction of the canvas: bigger when the icon is tiny, so it stays readable.
  markHeight: number
}

const specs: IconSpec[] = [
  { file: "favicon-16x16.png", size: 16, kind: "tile", markHeight: 0.76 },
  { file: "favicon-32x32.png", size: 32, kind: "tile", markHeight: 0.72 },
  { file: "favicon-48x48.png", size: 48, kind: "tile", markHeight: 0.7 },
  { file: "android-chrome-192x192.png", size: 192, kind: "tile", markHeight: 0.64 },
  { file: "android-chrome-512x512.png", size: 512, kind: "tile", markHeight: 0.64 },
  { file: "apple-touch-icon.png", size: 180, kind: "full", markHeight: 0.6 },
  { file: "maskable-512x512.png", size: 512, kind: "maskable", markHeight: 0.56 },
]

async function render({ size, kind, markHeight }: IconSpec) {
  const radius = kind === "tile" ? Math.round(size * 0.2237) : 0
  const tile = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${BACKGROUND}"/></svg>`,
  )
  // The SVG is 172x182, so it is rasterised at a high density first and only ever scaled down.
  const markHeightPx = Math.round(size * markHeight)
  const mark = await sharp(MARK, { density: 400 }).resize({ height: markHeightPx }).png().toBuffer()
  const { width: markWidthPx = markHeightPx } = await sharp(mark).metadata()
  return sharp(tile)
    .composite([{ input: mark, left: Math.round((size - markWidthPx) / 2), top: Math.round((size - markHeightPx) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

// ICO container with PNG-compressed frames (valid since Windows Vista and in every current browser).
function buildIco(frames: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(frames.length, 4)
  let offset = 6 + 16 * frames.length
  const entries = frames.map(({ size, data }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size, 0)
    entry.writeUInt8(size, 1)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })
  return Buffer.concat([header, ...entries, ...frames.map((frame) => frame.data)])
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const bySize = new Map<number, Buffer>()

  for (const spec of specs) {
    const data = await render(spec)
    await writeFile(join(OUT, spec.file), data)
    if (spec.kind === "tile") bySize.set(spec.size, data)
    console.log(`${spec.file.padEnd(30)} ${spec.size}x${spec.size}  ${data.length} bytes`)
  }

  const ico = buildIco([16, 32, 48].map((size) => ({ size, data: bySize.get(size) as Buffer })))
  await writeFile(join(OUT, "favicon.ico"), ico)
  await writeFile(join(ROOT, "app", "favicon.ico"), ico)
  console.log(`favicon.ico (16, 32, 48)        ${ico.length} bytes`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
