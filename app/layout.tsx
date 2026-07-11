import type React from "react"
import type { Metadata } from "next"
import { Libre_Franklin, Proza_Libre } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageBackground from "@/components/page-background"
import MotionProvider from "@/components/motion-provider"

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-libre-franklin",
})

const prozaLibre = Proza_Libre({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-proza-libre",
})

export const metadata: Metadata = {
  // SITE_URL is set by the PR-preview workflow so og:image and friends
  // resolve on the Vercel preview host instead of the production domain
  metadataBase: new URL(process.env.SITE_URL ?? "https://www.cephalopod.studio"),
  title: "Cephalopod Studio",
  description: "A small studio of developers making software to empower and delight.",
  icons: {
    icon: "/assets/octopus.png",
  },
  openGraph: {
    siteName: "Cephalopod Studio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Cephalopod Studio — Very. Good. Apps.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${libreFranklin.variable} ${prozaLibre.variable} font-sans text-foreground`}>
        <MotionProvider>
          <PageBackground />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  )
}

