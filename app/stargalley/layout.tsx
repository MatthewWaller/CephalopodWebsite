import type { Metadata } from "next"

const title = "Weight Loss Adventures: a calorie tracker and a sci-fi adventure"
const description =
  "Log meals privately, check in each day, and roll dice with your squad on a space expedition. What you eat never moves the dice. Showing up does."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/wla" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/wla",
    siteName: "Cephalopod Studio",
    images: [{ url: "/wla/og.jpg", width: 1200, height: 630, alt: "The Weight Loss Adventures expedition map, a glowing star at the center of charted space." }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/wla/og.jpg"],
  },
}

export default function WlaLayout({ children }: { children: React.ReactNode }) {
  return children
}
