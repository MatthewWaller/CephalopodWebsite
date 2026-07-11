"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import HeroSection from "@/components/hero-section"
import MemphisShape from "@/components/memphis-shape"
import AppCard from "@/components/app-card"
import BlogCard from "@/components/blog-card"
import type { Project } from "@/lib/projects"
import type { BlogPostMeta } from "@/lib/blog"
import { BOOKING_URL } from "@/lib/site"

type HomeClientProps = {
  projects: Project[]
  posts: (BlogPostMeta & { formattedDate: string })[]
}

export default function HomeClient({ projects, posts }: HomeClientProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0])

  return (
    <div className="relative overflow-hidden text-foreground">
      {/* Decorative Memphis shapes */}
      <div className="fixed -z-10 top-20 left-10 w-32 h-32 opacity-20">
        <MemphisShape type="circle" color="bg-primary" />
      </div>
      <div className="fixed -z-10 bottom-20 right-10 w-40 h-40 opacity-20">
        <MemphisShape type="triangle" color="bg-secondary" />
      </div>
      <div className="fixed -z-10 top-1/2 right-1/4 w-24 h-24 opacity-20">
        <MemphisShape type="zigzag" color="bg-accent" />
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Introduction */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30 pointer-events-none"></div>
        <div className="absolute inset-0 memphis-dots opacity-5 pointer-events-none"></div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative container mx-auto max-w-3xl text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Indie App Studio</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            We're a small studio of developers making software to empower and delight — from journaling and 3D
            scanning to immersive Apple Vision Pro experiences. We build bold, playful apps that stand out in
            today's crowded app stores.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-lg font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Learn more about our studio <ArrowRight size={20} />
          </Link>
        </motion.div>
        {/* Decorative shapes */}
        <div className="absolute -bottom-8 -left-8 w-24 h-24 opacity-20">
          <MemphisShape type="circle" color="bg-accent" />
        </div>
        <div className="absolute -top-8 -right-8 w-32 h-32 opacity-20">
          <MemphisShape type="triangle" color="bg-primary" />
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" ref={targetRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/50 pointer-events-none"></div>
        <div className="absolute inset-0 memphis-dots opacity-5 pointer-events-none"></div>
        <div className="container relative mx-auto px-4">
          <motion.div style={{ opacity, y }} className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Featured Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A selection of the apps we've crafted for iPhone, iPad, and Apple Vision Pro.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 items-stretch">
            {projects.slice(0, 6).map((project, index) => (
              <AppCard key={project.href} project={project} index={index} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              View all projects <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* From the Blog */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">From the Blog</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Notes from the workshop — app launches, dev diaries, and lessons learned along the way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3 rounded-full hover:bg-secondary/90 transition-colors"
          >
            Read all posts <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 memphis-stripes opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Let's Build Your App</h2>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground">
              We take on contract work: iPhone and iPad apps, Apple Vision Pro experiences, and AI-powered
              features. Everything you see here, we designed, built, and shipped — we can do the same for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={BOOKING_URL}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Book Time With Us <ArrowRight size={20} />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-lg font-medium text-secondary hover:text-secondary/80 transition-colors"
              >
                Or just say hi <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
