"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { BOOKING_URL, CONTACT_EMAIL } from "@/lib/site"

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export default function Footer() {
  return (
    <footer className="bg-background/60 backdrop-blur-md text-foreground py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-proza-libre mb-4">
              <img src="/assets/octopus.png" alt="Cephalopod Studio logo" className="h-9 w-9" />
              <span>
                <span className="text-primary">Cephalopod</span>
                <span className="text-foreground"> Studio</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Cephalopod Studio.
              <br />
              All rights reserved.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Work With Us</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Available for contract work — apps, Apple Vision Pro, and AI features.
            </p>
            <motion.a
              href={BOOKING_URL}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-primary text-primary-foreground px-5 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors mb-4"
            >
              Book Time With Us
            </motion.a>
            <br />
            <motion.a
              href={`mailto:${CONTACT_EMAIL}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail size={20} />
              {CONTACT_EMAIL}
            </motion.a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
