import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Providers } from "./providers"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Enzo Yoshida | Product Engineer",
  description:
    "Product Engineer especializado em Next.js e React. 4+ anos de experiência construindo produtos web rápidos e escaláveis.",
  keywords: [
    "Product Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Full-Stack Developer",
  ],
  authors: [{ name: "Enzo Hideki Yoshida" }],
  openGraph: {
    title: "Enzo Yoshida | Product Engineer",
    description:
      "Product Engineer especializado em Next.js e React.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={jetbrainsMono.variable} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
