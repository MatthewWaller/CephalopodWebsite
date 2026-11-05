"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { WLA_NAME } from "@/lib/wla"

// Interest signup. The site is a static export with no backend, so the form
// posts to FormSubmit's AJAX endpoint, which emails each submission to
// hello@cephalopod.studio. (The first submission ever sends an activation
// email to that address; it must be confirmed once.)
const ENDPOINT = "https://formsubmit.co/ajax/hello@cephalopod.studio"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Status = "idle" | "sending" | "success" | "error"

export default function WlaSignup({ idPrefix = "signup" }: { idPrefix?: string }) {
  const uid = useId()
  const emailId = `${idPrefix}-${uid}-email`
  const nameId = `${idPrefix}-${uid}-name`
  const msgId = `${idPrefix}-${uid}-msg`
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "sending") return
    const form = new FormData(e.currentTarget)
    // Honeypot: a filled hidden field means a bot. Pretend it worked.
    if (form.get("_honey")) {
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
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: trimmed,
          name: name.trim(),
          _subject: `${WLA_NAME}: launch interest`,
          _template: "table",
          _honey: "",
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || String(data?.success) === "false") throw new Error("failed")
      setStatus("success")
      setMessage("You're on the list. We'll email you once when it launches.")
      setEmail("")
      setName("")
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
          <label htmlFor={nameId} className="block text-sm text-muted-foreground mb-1 ml-2">
            First name (optional)
          </label>
          <input id={nameId} name="name" type="text" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </div>
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
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" />
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
        <Link href="/wla/privacy" className="text-secondary underline underline-offset-2">
          Privacy
        </Link>
      </p>
    </div>
  )
}
