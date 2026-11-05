import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Use - Star Galley",
  description: "The terms of use for Star Galley, including subscriptions and squad chat.",
}

export default function StarGalleyTermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
