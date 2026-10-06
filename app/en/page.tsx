import { Home } from "@/components/portfolio/home"
import { getPageMetadata } from "@/lib/seo"

export const metadata = getPageMetadata("en-US")

export default function Page() {
  return <Home locale="en-US" />
}
