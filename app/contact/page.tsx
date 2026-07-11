"use client"

import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import MemphisShape from "@/components/memphis-shape"

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
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Hello! We're a small studio of developers making software to empower and delight. Questions, feedback,
            or just want to say hi? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <a
            href="mailto:hello@cephalopod.studio"
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Mail size={22} /> hello@cephalopod.studio
          </a>
        </motion.div>
      </div>
    </div>
  )
}
