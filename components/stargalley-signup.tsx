"use client"

import { useId, useState } from "react"
import Link from "next/link"

// Interest signup. The site is a static export with no backend, so the form
// submits straight into a Google Form ("Star Galley Launch!"); responses land
// in the form's sheet and Google emails a notice for each one. Google doesn't
// allow cross-origin reads of the response (no-cors), so a sent request is
// treated as success.
const FORM_ID = "1FAIpQLScF93l6LbqAzXbmq9dv-KDamStzZC1dXyz8AsYIafXM9GaJKQ"
const ENDPOINT = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`
const EMAIL_ENTRY = "entry.107305515"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Status = "idle" | "sending" | "success" | "error"

export default function StarGalleySignup({ idPrefix = "signup" }: { idPrefix?: string }) {
  const uid = useId()
  const emailId = `${idPrefix}-${uid}-email`
  const msgId = `${idPrefix}-${uid}-msg`
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "sending") return
    const form = new FormData(e.currentTarget)
    // Honeypot: a filled hidden field means a bot. Pretend it worked.
    if (form.get("website")) {
      setStatus("success")
      setMessage("You're on the list.")
      return
    }
    const trimmed = email.trim()
    if (!EMAIL_RE.test(trimmed)) {
      setStatus("error")
      setMessage("Please enter a valid email address.")
      return
    }
    setStatus("sending")
    setMessage("")
    try {
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams({ [EMAIL_ENTRY]: trimmed }),
      })
      setStatus("success")
      setMessage("You're on the list. We'll email you once when it launches.")
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Please try again, or email hello@cephalopod.studio.")
    }
  }

  const inputCls =
    "w-full rounded-full bg-background/60 border border-muted px-5 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"

  return (
    <div className="w-full max-w-md mx-auto text-left">
      <form onSubmit={onSubmit} noValidate className="space-y-3" aria-describedby={msgId}>
        <div>
          <label htmlFor={emailId} className="block text-sm text-muted-foreground mb-1 ml-2">
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={status === "error"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputCls}
          />
        </div>
        {/* Honeypot, hidden from people and assistive tech. */}
        <div className="hidden" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full inline-flex items-center justify-center rounded-full font-semibold px-7 py-3.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {status === "sending" ? "Sending..." : "Notify me"}
        </button>
        <p
          id={msgId}
          role={status === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`min-h-6 text-sm ${status === "error" ? "text-accent" : "text-secondary"}`}
        >
          {message}
        </p>
      </form>
      <p className="text-sm text-muted-foreground">
        We&rsquo;ll email you once when it launches. No spam, unsubscribe anytime.{" "}
        <Link href="/stargalley/privacy" className="text-secondary underline underline-offset-2">
          Privacy
        </Link>
      </p>
    </div>
  )
}
