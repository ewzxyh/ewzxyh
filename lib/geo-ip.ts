import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { type CountryResponse, Reader } from "mmdb-lib"

// Country of an IP from the local DB-IP Country Lite file (scripts/fetch-geoip.mjs downloads it at build). Off Vercel
// there is no x-vercel-ip-country header any more; the IP never leaves the server.
const GEOIP_DB_PATH = join(process.cwd(), ".geoip", "dbip-country-lite.mmdb")

let reader: Reader<CountryResponse> | null | undefined

function getReader() {
  if (reader !== undefined) return reader
  reader = null
  try {
    // Read at runtime from the deploy folder, outside output tracing.
    if (existsSync(/*turbopackIgnore: true*/ GEOIP_DB_PATH)) {
      reader = new Reader<CountryResponse>(readFileSync(/*turbopackIgnore: true*/ GEOIP_DB_PATH))
    }
  } catch {
    reader = null
  }
  return reader
}

export function countryOf(ip: string | null): string | null {
  if (!ip) return null
  try {
    // ai-design-check-ignore-next-line locale-aware-case -- ISO 3166 country codes are ASCII, no locale applies
    return getReader()?.get(ip)?.country?.iso_code?.toUpperCase() ?? null
  } catch {
    // Not a valid IP: same as an unknown one.
    return null
  }
}
