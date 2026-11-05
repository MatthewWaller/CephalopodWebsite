"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import StarGalleySignup from "@/components/stargalley-signup"
import { Section } from "@/components/stargalley-page"
import { SG_APP_STORE_URL, SG_NAME } from "@/lib/stargalley"

const LIVE = SG_APP_STORE_URL !== "" && SG_APP_STORE_URL !== "#"
// Same normalization as the app's InviteLink: uppercased, letters and digits only.
const CODE_RE = /^[A-Z0-9]{4,16}$/

const button =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"

export default function StarGalleyJoin() {
  const raw = (useSearchParams().get("code") ?? "").trim().toUpperCase()
  const code = CODE_RE.test(raw) ? raw : ""
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the code is on screen to type instead.
    }
  }

  return (
    <>
      <Section title="Your invite code">
        {code ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p
              className="font-mono text-4xl md:text-5xl font-bold tracking-[0.2em] text-foreground select-all"
              aria-label={`Invite code ${code.split("").join(" ")}`}
            >
              {code}
            </p>
            <button type="button" onClick={copy} className={`${button} border border-muted text-foreground hover:bg-muted/40`}>
              {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
              {copied ? "Copied" : "Copy code"}
            </button>
            {/* Universal links don't fire when a page is opened from the same site or typed in,
                so offer the app's own scheme as a fallback for people who already have it. */}
            <a href={`uneaten://invite?code=${code}`} className="text-secondary underline underline-offset-2">
              Already have {SG_NAME}? Open the invite in the app
            </a>
          </div>
        ) : (
          <p>
            This link is missing its invite code. Ask your friend to send the invite again, or get the code from them
            and enter it in the app.
          </p>
        )}
      </Section>

      <Section title="How to take your seat">
        <ol className="list-decimal pl-6 space-y-2">
          <li>Get {SG_NAME} on your iPhone.</li>
          <li>Open the Squad tab and sign in. Logging meals never needs an account, but expeditions do.</li>
          <li>Tap Join a Squad and enter the code{code ? ` ${code}` : ""}.</li>
        </ol>
        <p>Your crew only sees that you checked in. Your food and weight stay private on your iPhone.</p>
        <div className="flex justify-center pt-2">
          {LIVE ? (
            <a
              href={SG_APP_STORE_URL}
              aria-label={`Download ${SG_NAME} on the App Store`}
              className={`${button} bg-primary text-primary-foreground hover:bg-primary/90`}
            >
              Download on the App Store <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          ) : (
            <div className="w-full space-y-4">
              <p className="text-center">{SG_NAME} is coming soon to the App Store. Leave your email and we&rsquo;ll tell you when it&rsquo;s out.</p>
              <StarGalleySignup idPrefix="join" />
            </div>
          )}
        </div>
      </Section>
    </>
  )
}
