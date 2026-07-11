import details from "./project-details.json"

export type StoreLink = { label: string; url: string }

export type FeatureSection = { heading: string; items: string[] }

export type ExtraSection = {
  heading: string
  paragraphs?: string[]
  items?: string[]
}

export type ProjectDetail = {
  slug: string
  title: string
  icon: string
  circular?: boolean
  tagline?: string
  description?: string[]
  appStoreUrl?: string
  storeLinks?: StoreLink[]
  screenshots?: string[]
  videos?: { src: string; poster?: string | null }[]
  featuresHeading?: string
  features?: FeatureSection[]
  privacyHeading?: string
  privacy?: string[]
  extraSections?: ExtraSection[]
}

export const projectDetails = details as ProjectDetail[]

export function getProjectDetail(slug: string): ProjectDetail | undefined {
  return projectDetails.find((p) => p.slug === slug)
}
