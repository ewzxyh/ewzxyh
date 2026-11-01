// Before `next build`: downloads DB-IP Country Lite (CC BY 4.0) for lib/geo-ip.ts, the same source OpenAnalytics and
// lotohub use. Never fails the build: without the file nobody is treated as foreign and "/" stays Portuguese.
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { gunzipSync } from "node:zlib"

const OUT = join(process.cwd(), ".geoip", "dbip-country-lite.mmdb")
const MAX_AGE_MS = 20 * 24 * 60 * 60 * 1000

function month(offset) {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1)).toISOString().slice(0, 7)
}

async function main() {
  if (existsSync(OUT) && Date.now() - statSync(OUT).mtimeMs < MAX_AGE_MS) return
  // The month's file comes out a day or two after the 1st; until then, the previous one.
  for (const candidate of [month(0), month(-1)]) {
    const url = `https://download.db-ip.com/free/dbip-country-lite-${candidate}.mmdb.gz`
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(120_000) })
      if (!response.ok) continue
      mkdirSync(join(process.cwd(), ".geoip"), { recursive: true })
      writeFileSync(OUT, gunzipSync(new Uint8Array(await response.arrayBuffer())))
      console.log(`fetch-geoip: DB-IP Country Lite ${candidate} saved`)
      return
    } catch (error) {
      console.warn(`fetch-geoip: ${candidate} failed: ${String(error)}`)
    }
  }
  console.warn("fetch-geoip: no database downloaded; nobody is redirected to /en by country")
}

await main()
