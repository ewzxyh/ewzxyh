import type { NextRequest } from "next/server"
import { handleLocaleProxy } from "./proxy"

export function middleware(request: NextRequest) {
  return handleLocaleProxy(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|api|.*\\..*).*)",
  ],
}
