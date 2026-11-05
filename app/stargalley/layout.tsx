import type { Metadata } from "next"

const title = "Star Galley: a calorie tracker and a sci-fi adventure"
const description =
  "Log meals privately, check in each day, and roll dice with your squad on a space expedition. What you eat never moves the dice. Showing up does."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/stargalley" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/stargalley",
    siteName: "Cephalopod Studio",
    images: [{ url: "/stargalley/og.jpg", width: 1200, height: 630, alt: "The Star Galley expedition map, a glowing star at the center of charted space." }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/stargalley/og.jpg"],
  },
}

export default function StarGalleyLayout({ children }: { children: React.ReactNode }) {
  return children
}
