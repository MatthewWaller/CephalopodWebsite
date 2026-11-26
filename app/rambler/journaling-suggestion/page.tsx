import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const APP_STORE_URL = "https://apps.apple.com/app/id6748891162"

const button =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"

// The link iOS opens when someone taps a Journaling Suggestions notification and has chosen
// Rambler under Settings > Notifications > Journaling Suggestions > Open Notifications With:
// https://www.cephalopod.studio/rambler/journaling-suggestion/?suggestion-identifier=<id>.
// With Rambler installed, iOS opens the app directly (apple-app-site-association in
// public/.well-known) and this page is never shown. It is the fallback for a browser.
export default function RamblerJournalingSuggestionPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Open this in <span className="text-primary">Rambler</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            This link belongs to a journaling suggestion from your iPhone. It opens in Rambler, where you can talk it
            through on a walk and have it written down for you.
          </p>
          <p className="text-muted-foreground">
            If you landed here instead, Rambler may not be installed on this device. Get it from the App Store, then
            tap the suggestion again.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={APP_STORE_URL}
              aria-label="Download Rambler on the App Store"
              className={`${button} bg-primary text-primary-foreground hover:bg-primary/90`}
            >
              Download on the App Store <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <Link
              href="/projects/journal-diary-rambler"
              className={`${button} border border-muted text-foreground hover:bg-muted/40`}
            >
              About Rambler
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
