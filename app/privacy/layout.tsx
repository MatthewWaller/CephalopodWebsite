import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Cephalopod Studio",
  description: "How Cephalopod Studio handles information on this website and in our apps, including Sapling 3D Scanner.",
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
