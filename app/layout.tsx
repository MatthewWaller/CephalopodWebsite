import type React from "react"
import type { Metadata } from "next"
import { Libre_Franklin, Proza_Libre } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CustomCursor from "@/components/custom-cursor"
import PageBackground from "@/components/page-background"

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
  title: "Cephalopod Studio",
  description: "A small studio of developers making software to empower and delight.",
  icons: {
    icon: "/assets/octopus.png",
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
        <PageBackground />
        <CustomCursor />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

