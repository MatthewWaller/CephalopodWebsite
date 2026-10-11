import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sapling Pressekit - Cephalopod Studio",
  description: "App-Icon, Screenshots mit deutscher Oberfläche und Vorschauvideo für 3D Scanner: Sapling, frei verwendbar für die Berichterstattung.",
}

export default function SaplingPressLayout({ children }: { children: React.ReactNode }) {
  return children
}
