import { Suspense } from "react"
import StarGalleyPage from "@/components/stargalley-page"
import StarGalleyJoin from "@/components/stargalley-join"

// The invite link the app shares: https://www.cephalopod.studio/stargalley/join/?code=ABCD2345.
// With the app installed, iOS opens it straight into the join flow (apple-app-site-association
// in public/.well-known); everyone else lands here and sees the code plus the way to get the app.
export default function StarGalleyJoinPage() {
  return (
    <StarGalleyPage title="Join the" accent="Crew" subtitle="A friend saved you a seat on a squad space expedition.">
      <Suspense fallback={null}>
        <StarGalleyJoin />
      </Suspense>
    </StarGalleyPage>
  )
}
