"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

type Project = {
  id: number
  title: string
  category: string
  image: string
  color: string
}

type ProjectCardProps = {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Halftone effect overlay */}
        <div
          className="absolute inset-0 bg-foreground opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{
            backgroundImage: "radial-gradient(#fff 10%, transparent 11%), radial-gradient(#fff 10%, transparent 11%)",
            backgroundSize: "4px 4px",
            backgroundPosition: "0 0, 2px 2px",
          }}
        ></div>
      </div>

      {/* Project info */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div
          className={`${project.color} p-6 rounded-lg transform transition-all duration-300 ${
            isHovered ? "translate-y-0 opacity-95" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-sm font-medium text-primary-foreground/80 mb-2 block">{project.category}</span>
              <h3 className="text-2xl font-bold text-primary-foreground mb-2">{project.title}</h3>
            </div>
            <Link href={`/projects/${project.id}`}>
              <div className="bg-primary-foreground rounded-full p-2 text-primary hover:bg-primary-foreground/90 transition-colors">
                <ArrowUpRight size={20} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

