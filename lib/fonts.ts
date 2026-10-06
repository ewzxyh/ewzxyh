import localFont from "next/font/local"

// Display face used by the loader, the hero name and the footer wordmark (declared once, shared everywhere).
export const atAmiga = localFont({
  src: "../app/fonts/AtAmiga-Regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
})
