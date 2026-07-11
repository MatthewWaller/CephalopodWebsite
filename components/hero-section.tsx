"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import MemphisShape from "./memphis-shape"

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const { clientX, clientY } = e
      const { left, top, width, height } = containerRef.current.getBoundingClientRect()

      const x = (clientX - left) / width
      const y = (clientY - top) / height

      const shapes = containerRef.current.querySelectorAll(".memphis-shape")
      shapes.forEach((shape, index) => {
        const speed = index % 2 === 0 ? 20 : -20
        const translateX = (x - 0.5) * speed
        const translateY = (y - 0.5) * speed
        ;(shape as HTMLElement).style.transform = `translate(${translateX}px, ${translateY}px)`
      })
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background Memphis patterns */}
      <div className="absolute inset-0 memphis-dots opacity-5"></div>

      {/* Animated Memphis shapes */}
      <div className="absolute top-1/6 -left-16 w-48 h-48 memphis-shape">
        <MemphisShape type="circle" color="bg-primary" />
      </div>
      <div className="absolute -bottom-20 -right-20 w-56 h-56 memphis-shape">
        <MemphisShape type="triangle" color="bg-secondary" />
      </div>
      <div className="absolute top-1/4 -right-12 w-36 h-36 memphis-shape">
        <MemphisShape type="zigzag" color="bg-accent" />
      </div>
      <div className="absolute -bottom-16 left-1/6 w-48 h-48 memphis-shape">
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
            <a
              href="#projects"
              className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-colors inline-block"
            >
              Explore Our Work
            </a>
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

