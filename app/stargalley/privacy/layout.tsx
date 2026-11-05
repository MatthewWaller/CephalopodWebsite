import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Star Galley",
  description: "How Star Galley handles your information: what stays on your iPhone, what an optional account stores, and the services involved.",
}

export default function StarGalleyPrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
