"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type { Project } from "@/lib/projects"

type AppCardProps = {
  project: Project
  index: number
}

export default function AppCard({ project, index }: AppCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group h-full"
    >
      <Link
        href={project.href}
        className="flex h-full flex-col items-center bg-muted/40 backdrop-blur-sm rounded-2xl p-5 md:p-6 text-center border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
      >
        <div
          className={`relative mx-auto mb-4 aspect-square w-full max-w-[160px] overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105 ${
            project.circular ? "rounded-full" : "rounded-[22%]"
          }`}
        >
          {/* Slight zoom crops white fringes baked into some icon files */}
          <img src={project.icon} alt="" className="h-full w-full scale-[1.04] object-cover" />
        </div>
        <h3 className="text-base md:text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
          {project.shortTitle ?? project.title}
        </h3>
      </Link>
    </motion.div>
  )
}
