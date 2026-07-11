export type Project = {
  title: string
  icon: string
  href: string
  circular?: boolean
  color: string
}

const colors = ["bg-primary", "bg-secondary", "bg-accent"]

const apps: Omit<Project, "color">[] = [
  { title: "Journal Diary Rambler", icon: "/assets/rambler_icon.png", href: "/projects/journal-diary-rambler" },
  { title: "3D Scanner: Sapling", icon: "/assets/sapling_icon.png", href: "/projects/3d-scanner-sapling" },
  { title: "Pearl: Meaningful Reminders", icon: "/assets/pearl_icon.jpeg", href: "/projects/pearl" },
  { title: "Cannot Ignore", icon: "/assets/cannotignore_icon.png", href: "/projects/cannotignore" },
  { title: "Novel Writing: Candlelight", icon: "/assets/candlelight_icon.png", href: "/projects/novel-writing-candlelight" },
  { title: "ToDon't", icon: "/assets/todont_icon.jpeg", href: "/projects/todont" },
  { title: "Passage", icon: "/assets/passage_icon.png", href: "/projects/passage", circular: true },
  { title: "Very Nice Clocks", icon: "/assets/veryniceclocks_icon.png", href: "/projects/very-nice-clocks", circular: true },
  { title: "Director's Cut", icon: "/assets/directorscut_icon.png", href: "/projects/directorscut" },
  { title: "RunPal", icon: "/assets/runpal_icon.png", href: "/projects/runpal" },
  { title: "Fab3D", icon: "/assets/fab3d_icon.png", href: "/projects/fab3d" },
]

export const projects: Project[] = apps.map((app, i) => ({
  ...app,
  color: colors[i % colors.length],
}))
