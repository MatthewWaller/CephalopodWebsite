"use client"

import type React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import MemphisShape from "@/components/memphis-shape"
import { WLA_NAME, WLA_PAGES } from "@/lib/wla"

// Shared shell for the Weight Loss Adventures pages: the same layout as
// /privacy (Memphis shapes, centered heading, content-overlay card), plus a
// row linking the sibling pages.
export default function WlaPage({
  title,
  accent,
  subtitle,
  children,
}: {
  title: string
  accent: string
  subtitle?: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="pt-32 pb-20 relative overflow-hidden min-h-screen">
      <div className="fixed -z-10 top-40 left-10 w-32 h-32 opacity-20">
        <MemphisShape type="circle" color="bg-primary" />
      </div>
      <div className="fixed -z-10 bottom-40 right-10 w-40 h-40 opacity-20">
        <MemphisShape type="triangle" color="bg-secondary" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <Link href="/wla" className="inline-block mb-4 text-secondary font-medium hover:text-secondary/80 transition-colors">
            {WLA_NAME}
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {title} <span className="text-accent">{accent}</span>
          </h1>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto content-overlay rounded-lg p-6 md:p-12 space-y-10 text-lg text-muted-foreground break-words"
        >
          {children}
        </motion.div>

        <nav className="max-w-3xl mx-auto mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {WLA_PAGES.filter((page) => !pathname?.startsWith(page.href)).map((page) => (
            <Link key={page.href} href={page.href} className="text-secondary underline underline-offset-2">
              {page.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {children}
    </section>
  )
}

export function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-semibold text-foreground">{children}</h3>
}

export function List({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6 space-y-2">{children}</ul>
}

// Draft placeholders for Matt (and a lawyer) to fill in. Write the literal
// "[[TODO: ...]]" text as the child so a grep for "[[TODO" finds every one.
export function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="bg-accent/20 text-accent rounded px-1">{children}</mark>
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http")
  return (
    <a
      href={href}
      className="text-secondary underline underline-offset-2"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  )
}
