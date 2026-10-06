import { Home } from "@/components/portfolio/home"
import { getPageMetadata } from "@/lib/seo"

export const metadata = getPageMetadata("pt-BR")

export default function Page() {
  return <Home locale="pt-BR" />
}
