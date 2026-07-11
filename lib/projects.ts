export type Project = {
  title: string
  icon: string
  href: string
  circular?: boolean
  color: string
}

const colors = ["bg-primary", "bg-secondary", "bg-accent"]

const apps: Omit<Project, "color">[] = [
  { title: "Journal Diary Rambler", icon: "/assets/rambler_icon.png", href: "/journal-diary-rambler.html" },
  { title: "3D Scanner: Sapling", icon: "/assets/sapling_icon.png", href: "/3d-scanner-sapling.html" },
  { title: "Pearl: Meaningful Reminders", icon: "/assets/pearl_icon.jpeg", href: "/pearl.html" },
  { title: "Cannot Ignore", icon: "/assets/cannotignore_icon.png", href: "/cannotignore.html" },
  { title: "Novel Writing: Candlelight", icon: "/assets/candlelight_icon.png", href: "/novel-writing-candlelight.html" },
  { title: "ToDon't", icon: "/assets/todont_icon.jpeg", href: "/todont.html" },
  { title: "Passage", icon: "/assets/passage_icon.png", href: "/passage.html", circular: true },
  { title: "Very Nice Clocks", icon: "/assets/veryniceclocks_icon.png", href: "/very-nice-clocks.html", circular: true },
  { title: "Director's Cut", icon: "/assets/directorscut_icon.png", href: "/directorscut.html" },
  { title: "RunPal", icon: "/assets/runpal_icon.png", href: "/runpal.html" },
  { title: "Fab3D", icon: "/assets/fab3d_icon.png", href: "/fab3d.html" },
]

export const projects: Project[] = apps.map((app, i) => ({
  ...app,
  color: colors[i % colors.length],
}))
