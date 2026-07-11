"use client"

import { motion } from "framer-motion"
import { Mail, CalendarClock, Sparkles, Smartphone } from "lucide-react"
import MemphisShape from "@/components/memphis-shape"
import { BOOKING_URL, CONTACT_EMAIL } from "@/lib/site"

const services = [
  { icon: Smartphone, color: "text-primary", label: "iPhone, iPad & Mac apps" },
  { icon: Sparkles, color: "text-accent", label: "Apple Vision Pro experiences" },
  { icon: CalendarClock, color: "text-secondary", label: "AI features & prototypes" },
]

export default function ContactPage() {
  return (
    <div className="pt-32 pb-20 relative overflow-hidden min-h-screen">
      {/* Decorative Memphis shapes */}
      <div className="fixed -z-10 top-40 left-10 w-32 h-32 opacity-20">
        <MemphisShape type="circle" color="bg-primary" />
      </div>
      <div className="fixed -z-10 bottom-40 right-10 w-40 h-40 opacity-20">
        <MemphisShape type="triangle" color="bg-secondary" />
      </div>
      <div className="fixed -z-10 top-1/2 right-1/4 w-24 h-24 opacity-20">
        <MemphisShape type="zigzag" color="bg-accent" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Work <span className="text-primary">With Us</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            We're a small studio that ships — eleven apps and counting. We take on contract work and would love
            to build yours.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12 text-foreground"
        >
          {services.map((service) => (
            <li key={service.label} className="flex items-center gap-2">
              <service.icon size={20} className={service.color} />
              {service.label}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <a
            href={BOOKING_URL}
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Mail size={22} /> Book Time With Us
          </a>
          <p className="mt-6 text-muted-foreground">
            Not a project inquiry? Say hello any time:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-secondary underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
