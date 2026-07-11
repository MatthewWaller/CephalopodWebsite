import type { Metadata } from "next"
import AppCard from "@/components/app-card"
import { projects } from "@/lib/projects"

export const metadata: Metadata = {
  title: "Projects - Cephalopod Studio",
  description: "Apps by Cephalopod Studio for iPhone, iPad, and Apple Vision Pro.",
}

export default function ProjectsPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our <span className="text-primary">Projects</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Software to empower and delight — built for iPhone, iPad, Mac, and Apple Vision Pro.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 items-stretch">
          {projects.map((project, index) => (
            <AppCard key={project.href} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
