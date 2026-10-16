import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sapling Press Kit - Cephalopod Studio",
  description: "App icon, screenshots and preview video for 3D Scanner: Sapling, free to use in coverage. Version 2.2 is out now, in seven languages.",
}

export default function SaplingPressEnLayout({ children }: { children: React.ReactNode }) {
  return children
}
