"use client"

import { motion } from "framer-motion"
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
      className="group"
    >
      <a
        href={project.href}
        className="block bg-muted/40 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
      >
        <div className="relative mx-auto mb-4 aspect-square w-full max-w-[160px] overflow-hidden transition-transform duration-300 group-hover:scale-105">
          <img
            src={project.icon}
            alt={project.title}
            className={`h-full w-full object-cover shadow-md ${project.circular ? "rounded-full" : "rounded-[22%]"}`}
          />
        </div>
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
      </a>
    </motion.div>
  )
}
