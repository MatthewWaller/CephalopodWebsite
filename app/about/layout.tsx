import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About - Cephalopod Studio",
  description: "About Cephalopod Studio, a small indie studio making software to empower and delight.",
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
