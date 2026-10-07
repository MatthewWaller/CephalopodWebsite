import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pearl Press Kit - Cephalopod Studio",
  description: "App icon, screenshots and iPhone Duo images for Daily Affirmations: Pearl, free to use in coverage.",
}

export default function PearlPressLayout({ children }: { children: React.ReactNode }) {
  return children
}
