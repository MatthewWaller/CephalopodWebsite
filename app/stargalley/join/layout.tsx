import type { Metadata } from "next"

const title = "Join my Star Galley crew"
const description = "You've been invited to a squad space expedition. Open Star Galley and enter the invite code to take a seat."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/stargalley/join" },
  // Invite pages carry personal codes in the query string; keep them out of search.
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/stargalley/join",
    siteName: "Cephalopod Studio",
    images: [{ url: "/stargalley/og.jpg", width: 1200, height: 630, alt: "The Star Galley expedition map, a glowing star at the center of charted space." }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/stargalley/og.jpg"] },
}

export default function StarGalleyJoinLayout({ children }: { children: React.ReactNode }) {
  return children
}
