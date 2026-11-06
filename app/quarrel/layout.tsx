import type { Metadata } from "next"

const title = "Quarrel: The Far Watch, a card-and-dice fighter for Apple Vision Pro"
const description =
  "Lay a fighter's card, throw the dice with your own hands, and power a fight in front of you. Nine fighters, three peoples, coming to Apple Vision Pro."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/quarrel" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/quarrel",
    siteName: "Cephalopod Studio",
    images: [{ url: "/quarrel/og.jpg", width: 1200, height: 630, alt: "Two Gench fighters face off in the Amber Hall." }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/quarrel/og.jpg"] },
}

export default function QuarrelLayout({ children }: { children: React.ReactNode }) {
  return children
}
