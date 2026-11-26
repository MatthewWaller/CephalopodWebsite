import type { Metadata } from "next"

const title = "Open your suggestion in Rambler"
const description = "This link opens a journaling suggestion in Rambler, the hands-free voice journal for iPhone."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/rambler/journaling-suggestion" },
  // These links carry a per-suggestion identifier in the query string; keep them out of search.
  robots: { index: false, follow: true },
}

export default function RamblerJournalingSuggestionLayout({ children }: { children: React.ReactNode }) {
  return children
}
