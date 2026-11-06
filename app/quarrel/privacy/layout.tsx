import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Quarrel",
  description: "Quarrel collects no data: no account, no analytics, no tracking. Your progress stays on your Apple Vision Pro.",
}

export default function QuarrelPrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
