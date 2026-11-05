import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Weight Loss Adventures",
  description: "How Weight Loss Adventures handles your information: what stays on your iPhone, what an optional account stores, and the services involved.",
}

export default function WlaPrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
