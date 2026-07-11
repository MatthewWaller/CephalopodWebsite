"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Shield } from "lucide-react"
import MemphisShape from "@/components/memphis-shape"
import VideoPlayer from "@/components/video-player"
import type { ProjectDetail as ProjectDetailData, ExtraSection } from "@/lib/project-details"

const accentText = ["text-primary", "text-secondary", "text-accent"]
const accentBg = ["bg-primary", "bg-secondary", "bg-accent"]

function isTerminalSection(section: ExtraSection): boolean {
  return (section.items ?? []).some((item) => item.startsWith("$ "))
}

// Render bare URLs in copy as real links
function linkify(text: string) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g)
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-secondary underline underline-offset-2">
        {part}
      </a>
    ) : (
      part
    )
  )
}

function StoreButtons({ project }: { project: ProjectDetailData }) {
  const links = project.storeLinks ?? (project.appStoreUrl ? [{ label: "Download on the App Store", url: project.appStoreUrl }] : [])
  if (links.length === 0) return null

  return (
    <div className="flex flex-wrap gap-4">
      {links.map((link, i) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
            i === 0
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
          }`}
        >
          {link.label} <ArrowUpRight size={18} />
        </a>
      ))}
    </div>
  )
}

export default function ProjectDetail({ project }: { project: ProjectDetailData }) {
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

      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors font-medium"
          >
            <ArrowLeft size={18} /> All projects
          </Link>
        </motion.div>

        {/* Hero */}
        <div className="mt-10 mb-16 grid md:grid-cols-[auto_1fr] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-40 h-40 md:w-52 md:h-52 mx-auto md:mx-0"
          >
            <img
              src={project.icon}
              alt={`${project.title} icon`}
              className={`w-full h-full object-cover shadow-xl ${project.circular ? "rounded-full" : "rounded-[22%]"}`}
            />
            {/* Decorative offset shapes, echoing the template's About page */}
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary rounded-lg -z-10"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-lg -z-10"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-primary">{project.title}</span>
            </h1>
            {project.tagline && <p className="text-lg md:text-xl text-muted-foreground mb-6">{project.tagline}</p>}
            <div className="flex justify-center md:justify-start">
              <StoreButtons project={project} />
            </div>
          </motion.div>
        </div>

        {/* Description */}
        {project.description && project.description.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="content-overlay rounded-lg p-8 md:p-10 mb-16 space-y-5 text-lg text-muted-foreground"
          >
            {project.description.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </motion.section>
        )}

        {/* Videos */}
        {project.videos && project.videos.length > 0 && (
          <section className="mb-16 grid gap-8">
            {project.videos.map((video, i) => (
              <motion.div
                key={video.src}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-lg bg-background">
                  <VideoPlayer src={video.src} poster={video.poster} />
                </div>
                <div
                  className={`absolute -bottom-4 ${i % 2 === 0 ? "-left-4" : "-right-4"} w-20 h-20 ${accentBg[i % 3]} rounded-lg -z-10`}
                ></div>
              </motion.div>
            ))}
          </section>
        )}

        {/* Screenshots */}
        {project.screenshots && project.screenshots.length > 0 && (
          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
            >
              <span className="text-secondary">Screenshots</span>
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {project.screenshots.map((shot, i) => (
                <motion.div
                  key={shot}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                  className="group relative overflow-hidden rounded-xl border-2 border-transparent hover:border-primary transition-colors"
                >
                  <img
                    src={shot}
                    alt={`${project.title} screenshot ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <section className="mb-16">
            {project.featuresHeading && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-8 text-center"
              >
                <span className="text-accent">{project.featuresHeading}</span>
              </motion.h2>
            )}
            <div
              className={`grid gap-6 md:grid-cols-2 ${project.features.length >= 3 ? "lg:grid-cols-3" : ""}`}
            >
              {project.features.map((feature, i) => (
                <motion.div
                  key={feature.heading}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  className="bg-muted rounded-lg overflow-hidden"
                >
                  <div className={`h-2 ${accentBg[i % 3]}`}></div>
                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-4 ${accentText[i % 3]}`}>{feature.heading}</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      {feature.items.map((item, j) => (
                        <li key={j} className="flex gap-3">
                          <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${accentBg[(i + j) % 3]}`}></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Extra sections (how-it-works, CLI usage, pricing, requirements, ...) */}
        {project.extraSections?.map((section, i) => (
          <motion.section
            key={section.heading}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className={accentText[i % 3]}>{section.heading}</span>
            </h2>
            {section.paragraphs && (
              <div className="space-y-4 text-lg text-muted-foreground mb-6">
                {section.paragraphs.map((paragraph, j) => (
                  <p key={j}>{linkify(paragraph)}</p>
                ))}
              </div>
            )}
            {section.items &&
              (isTerminalSection(section) ? (
                <div className="rounded-lg overflow-hidden bg-background border border-muted">
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted">
                    <span className="h-3 w-3 rounded-full bg-primary"></span>
                    <span className="h-3 w-3 rounded-full bg-accent"></span>
                    <span className="h-3 w-3 rounded-full bg-secondary"></span>
                  </div>
                  <pre className="p-6 overflow-x-auto text-sm leading-7 font-mono text-foreground">
                    {section.items.join("\n")}
                  </pre>
                </div>
              ) : (
                <ul className="space-y-3 text-lg text-muted-foreground">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex gap-3">
                      <span className={`mt-2.5 h-2 w-2 shrink-0 rounded-full ${accentBg[j % 3]}`}></span>
                      {item}
                    </li>
                  ))}
                </ul>
              ))}
            {section.cta && (
              <Link
                href={section.cta.href}
                className="mt-6 inline-flex items-center gap-2 text-lg font-medium text-secondary hover:text-secondary/80 transition-colors"
              >
                {section.cta.label} <ArrowUpRight size={18} />
              </Link>
            )}
          </motion.section>
        ))}

        {/* Privacy */}
        {project.privacy && project.privacy.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="content-overlay rounded-lg p-8 md:p-10 mb-16"
          >
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
              <Shield className="text-secondary" size={24} /> {project.privacyHeading ?? "Privacy"}
            </h2>
            <div className="space-y-4 text-muted-foreground">
              {project.privacy.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </motion.section>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-muted rounded-lg p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 memphis-stripes opacity-10"></div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Try <span className="text-primary">{project.title}</span>
            </h2>
            <div className="flex justify-center">
              <StoreButtons project={project} />
            </div>
            <p className="mt-6 text-muted-foreground">
              Questions?{" "}
              <Link href="/contact" className="text-secondary hover:underline">
                Get in touch
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
