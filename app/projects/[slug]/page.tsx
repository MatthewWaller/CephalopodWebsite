import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ProjectDetail from "@/components/project-detail"
import { projectDetails, getProjectDetail } from "@/lib/project-details"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return projectDetails.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectDetail(slug)
  if (!project) return {}
  return {
    title: `${project.title} - Cephalopod Studio`,
    description: project.tagline ?? project.description?.[0],
  }
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const project = getProjectDetail(slug)
  if (!project) notFound()

  return <ProjectDetail project={project} />
}
