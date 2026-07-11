"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import MemphisShape from "@/components/memphis-shape"

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 relative overflow-hidden min-h-screen">
      {/* Decorative Memphis shapes */}
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About <span className="text-accent">Our Studio</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            We're a small studio of developers making software to empower and delight.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto content-overlay rounded-lg p-8 md:p-12 space-y-6 text-lg text-muted-foreground"
        >
          <p>
            We build apps across Apple platforms — journaling on iPhone, 3D scanning on iPad, novel-writing tools,
            playful clocks, and immersive experiences for Apple Vision Pro. Like our namesake, we like to stay
            curious, adaptable, and a little bit colorful.
          </p>
          <p>
            We also write about the journey — the launches, the experiments, and the occasional lesson learned the
            hard way — over on the blog.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors font-medium"
            >
              See our apps <ArrowRight size={18} />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-full hover:bg-secondary/90 transition-colors font-medium"
            >
              Read the blog <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
