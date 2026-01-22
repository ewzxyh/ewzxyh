import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Providers } from "./providers"
import { FluidBackground } from "@/components/portfolio/fluid-background"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Enzo Yoshida | Senior Software Engineer",
  description:
    "Senior Software Engineer especializado em Next.js e React. 4+ anos de experiência construindo aplicações web de alta performance.",
  keywords: [
    "Software Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Full-Stack Developer",
  ],
  authors: [{ name: "Enzo Hideki Yoshida" }],
  openGraph: {
    title: "Enzo Yoshida | Senior Software Engineer",
    description:
      "Senior Software Engineer especializado em Next.js e React.",
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
      <body className="font-sans antialiased">
        <FluidBackground className="fixed inset-0 -z-10" />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
