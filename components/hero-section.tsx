"use client"

import { motion } from "framer-motion"
import MemphisShape from "./memphis-shape"
import { BOOKING_URL } from "@/lib/site"

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Memphis patterns */}
      <div className="absolute inset-0 memphis-dots opacity-5"></div>

      {/* Animated Memphis shapes — hidden on small screens where they collide with the headline */}
      <div className="hidden md:block absolute top-[15%] -left-16 w-48 h-48 memphis-shape">
        <MemphisShape type="circle" color="bg-primary" />
      </div>
      <div className="absolute -bottom-24 -right-24 w-40 h-40 md:-bottom-20 md:-right-20 md:w-56 md:h-56 memphis-shape">
        <MemphisShape type="triangle" color="bg-secondary" />
      </div>
      <div className="hidden md:block absolute top-1/4 -right-12 w-36 h-36 memphis-shape">
        <MemphisShape type="zigzag" color="bg-accent" />
      </div>
      <div className="hidden md:block absolute -bottom-16 left-[15%] w-48 h-48 memphis-shape">
        <MemphisShape type="squiggle" color="bg-foreground" />
      </div>

      {/* Hero content */}
      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 font-proza-libre"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary">Bold.</span> <span className="text-secondary">Vibrant.</span>{" "}
            <span className="text-accent">Playful.</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We're a small studio of developers making software to empower and delight.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={BOOKING_URL}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-colors inline-block"
              >
                Work With Us
              </a>
              <a
                href="#projects"
                className="border-2 border-secondary text-secondary px-8 py-4 rounded-full text-lg font-medium hover:bg-secondary hover:text-secondary-foreground transition-colors inline-block"
              >
                Explore Our Work
              </a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Available for contract work — apps, Apple Vision Pro, and AI features.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Halftone overlay */}
      <div
        className="absolute inset-0 bg-foreground opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#fff 10%, transparent 11%), radial-gradient(#fff 10%, transparent 11%)",
          backgroundSize: "3px 3px",
          backgroundPosition: "0 0, 1.5px 1.5px",
        }}
      ></div>
    </section>
  )
}

