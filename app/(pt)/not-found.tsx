import type { Metadata } from "next"
import { NotFoundView } from "@/components/portfolio/not-found-view"

// A project slug that does not exist (/projetos/whatever) lands here, inside the Portuguese layout. URLs no route
// matches at all are handled by app/global-not-found.tsx.
export const metadata: Metadata = {
  title: { absolute: "404 | Enzo Yoshida" },
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return <NotFoundView />
}
