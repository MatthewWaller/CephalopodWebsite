"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Maximize2, Minimize2, X } from "lucide-react"
import type { Brain } from "@/lib/ceph-chat/use-brain"
import type { ChatMessage } from "@/lib/ceph-chat/engine"
import { CHAT_SYSTEM_PROMPT, GEN_PARAMS } from "@/lib/ceph-chat/prompts"
import { CONTACT_EMAIL } from "@/lib/site"
import { ssGet, ssSet } from "@/lib/ceph-chat/session-store"
import ChatMessages, { type ChatItem } from "./chat-messages"
import ChatInput from "./chat-input"
import IdeationFlow from "./ideation-flow"

type Mode = "home" | "chat" | "ideation"
type StoredMsg = { id: string; role: "user" | "assistant"; text: string }

let idSeq = 0
const nextId = () => `m-${Date.now()}-${idSeq++}`

function loadMessages(): StoredMsg[] {
  try {
    const raw = ssGet("ceph-chat:messages")
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return (parsed as { role?: unknown; text?: unknown }[])
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.text === "string")
      .slice(-40)
      .map((m) => ({ id: nextId(), role: m.role as "user" | "assistant", text: m.text as string }))
  } catch {
    return []
  }
}

function loadMode(): Mode {
  const stored = ssGet("ceph-chat:mode")
  return stored === "chat" || stored === "ideation" ? stored : "home"
}

const CHAT_ERROR_BUBBLE = "Ink cloud! 🦑 Something went wrong — try that again? Or email hello@cephalopod.studio."
const CHAT_GREETING = "Ask me anything — three hearts, no bones, all ears 🐙"

const FAQ_QUESTIONS = [
  "Why do octopuses have three hearts?",
  "Can cuttlefish really change color?",
  "How smart are octopuses?",
  "What does Cephalopod Studio make?",
]

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

function LoadingBar({ progress, fromCache, resuming }: { progress: number; fromCache: boolean; resuming: boolean }) {
  if (fromCache) {
    return <div className="px-4 pb-2 text-xs text-muted-foreground">Warming up neurons…</div>
  }
  const pct = Math.min(99, Math.round(progress * 100))
  const warming = progress >= 0.99
  const quart = warming ? 4 : Math.min(3, Math.floor(progress * 4))
  const label = [
    "Inflating brain…",
    "Untangling tentacles…",
    "Filling ink reserves…",
    "Teaching arm #8 to type…",
    "Warming up neurons…",
  ][quart]
  const line = quart === 4 ? label : `${label} ${pct}%`
  return (
    <div className="px-4 pb-2">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={warming ? undefined : pct}
        aria-label={line}
        className="h-3 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent ${warming ? "w-full animate-pulse" : ""}`}
          style={warming ? undefined : { width: `${pct}%` }}
        />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={quart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1 text-xs text-muted-foreground"
        >
          {line}
        </motion.p>
      </AnimatePresence>
      <p className="text-xs text-muted-foreground">
        {resuming
          ? "Picking up where we left off — saved chunks load fast."
          : "One-time download — cached for next visit."}
      </p>
    </div>
  )
}

export default function ChatPanel({
  brain,
  onClose,
  onCelebrate,
}: {
  brain: Brain
  onClose: () => void
  onCelebrate: () => void
}) {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches)
  const [expanded, setExpanded] = useState(() => ssGet("ceph-chat:expanded") === "1")
  const [mode, setMode] = useState<Mode>(loadMode)
  const [messages, setMessages] = useState<StoredMsg[]>(loadMessages)
  const [typing, setTyping] = useState(false)
  const [streamText, setStreamText] = useState<string | null>(null)
  const [pending, setPending] = useState<string | null>(null)
  const [consented, setConsented] = useState(() => ssGet("ceph-chat:consented") === "1")
  const streamIdRef = useRef("")
  const abortRef = useRef<AbortController | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const busy = typing || streamText !== null
  const saveDataGate = brain.saveData && !consented

  // Persist transcript + mode so closing the panel resumes where you left off
  useEffect(() => {
    ssSet("ceph-chat:messages", JSON.stringify(messages.slice(-40).map(({ role, text }) => ({ role, text }))))
  }, [messages])
  useEffect(() => {
    ssSet("ceph-chat:mode", mode)
  }, [mode])

  // Opening the panel starts the load on deferred devices (unless data-saver without consent)
  useEffect(() => {
    if (!saveDataGate) void brain.ensureLoaded()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Track the breakpoint live so backdrop/scroll-lock/focus-trap follow the md: styles
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Mobile: lock body scroll while the sheet is open
  useEffect(() => {
    if (!isMobile) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isMobile])

  // Initial focus: [data-autofocus] card/CTA, else the panel itself (chat input autofocuses)
  useEffect(() => {
    const t = window.setTimeout(() => {
      const root = panelRef.current
      if (!root) return
      const target = root.querySelector<HTMLElement>("[data-autofocus]")
      if (target) target.focus()
      else if (!root.querySelector("textarea")) root.focus()
    }, 60)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Abort any in-flight stream when the panel closes
  useEffect(() => () => abortRef.current?.abort(), [])

  const appendMessage = useCallback((role: "user" | "assistant", text: string, id?: string) => {
    setMessages((prev) => [...prev, { id: id ?? nextId(), role, text }].slice(-40))
  }, [])

  const runChat = useCallback(
    async (text: string, history: StoredMsg[]) => {
      setTyping(true)
      streamIdRef.current = nextId()
      const msgs: ChatMessage[] = [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        ...history.slice(-8).map((m): ChatMessage => ({ role: m.role, content: m.text })),
        { role: "user", content: text },
      ]
      const controller = new AbortController()
      abortRef.current = controller
      let acc = ""
      let reply: string
      try {
        const full = await brain.chat(
          msgs,
          GEN_PARAMS.chat,
          (delta) => {
            acc += delta
            setTyping(false)
            setStreamText(acc)
          },
          controller.signal,
        )
        reply = full.trim() ? full : acc
      } catch {
        reply = CHAT_ERROR_BUBBLE
      }
      setTyping(false)
      setStreamText(null)
      appendMessage("assistant", reply, streamIdRef.current)
    },
    [brain, appendMessage],
  )

  const handleSend = useCallback(
    (text: string) => {
      if (busy || pending !== null) return
      const history = messages
      appendMessage("user", text)
      if (brain.status === "ready") {
        void runChat(text, history)
      } else if (brain.status === "loading" || brain.status === "idle") {
        // Queue exactly one message; auto-sends on ready, dropped on error
        setPending(text)
        if (!saveDataGate) void brain.ensureLoaded()
      }
    },
    [busy, pending, messages, brain, saveDataGate, runChat, appendMessage],
  )

  useEffect(() => {
    if (pending === null) return
    if (brain.status === "ready") {
      const text = pending
      setPending(null)
      void runChat(text, messages.slice(0, -1))
    } else if (brain.status === "unsupported") {
      // Keep pending through "error" so a successful "Try again" auto-sends it
      setPending(null)
    }
  }, [brain.status, pending, messages, runChat])

  const items = useMemo<ChatItem[]>(() => {
    const list: ChatItem[] = messages.map((m) =>
      m.role === "user" ? { id: m.id, type: "user", text: m.text } : { id: m.id, type: "assistant", text: m.text },
    )
    if (typing) list.push({ id: "typing", type: "typing" })
    else if (streamText !== null)
      list.push({ id: streamIdRef.current, type: "assistant", text: streamText, streaming: true })
    return list
  }, [messages, typing, streamText])

  const enterChat = () => {
    if (messages.length === 0) appendMessage("assistant", CHAT_GREETING)
    setMode("chat")
  }
  const enterIdeation = () => {
    setMode("ideation")
  }
  const exitIdeation = () => {
    if (messages.length === 0) appendMessage("assistant", CHAT_GREETING)
    setMode("chat")
  }
  const toggleExpanded = () => {
    setExpanded((prev) => {
      ssSet("ceph-chat:expanded", prev ? "0" : "1")
      return !prev
    })
  }
  const consent = () => {
    setConsented(true)
    ssSet("ceph-chat:consented", "1")
    void brain.ensureLoaded()
  }

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== "Tab" || !isMobile) return
    const root = panelRef.current
    if (!root) return
    const focusables = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const pct = Math.round(brain.progress * 100)
  const statusLine =
    brain.status === "ready" ? "Ready to chat 🐙" : brain.status === "loading" ? `Brain loading… ${pct}%` : "Brain offline"
  const statusDot =
    brain.status === "ready"
      ? "bg-secondary"
      : brain.status === "loading"
        ? "bg-accent animate-pulse"
        : "bg-muted-foreground"

  let body: ReactNode
  if (brain.status === "unsupported") {
    body = (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-6 py-6 text-center">
        <img src="/assets/octopus.png" alt="" className="h-16 w-16 opacity-70 grayscale" />
        <p className="text-sm font-medium">My brain runs on WebGPU, and this browser doesn&apos;t speak it yet 🥲</p>
        <p className="text-sm text-muted-foreground">
          Try Chrome or Edge on a computer — or skip the robot entirely and talk to the humans who built me.
          They&apos;re nicer anyway.
        </p>
        <Link
          href="/contact"
          data-autofocus
          onClick={onClose}
          className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground"
        >
          Talk to the studio
        </Link>
        <a href={`mailto:${CONTACT_EMAIL}`} className="inline-block px-2 py-2 text-sm text-secondary underline">
          {CONTACT_EMAIL}
        </a>
      </div>
    )
  } else if (brain.status === "error") {
    body = (
      <>
        {messages.length > 0 ? <ChatMessages items={items} className="flex-1" /> : <div className="flex-1" />}
        <div className="space-y-3 px-4 pb-4 pt-2 text-center">
          <p className="text-sm">Ink cloud! 🦑 Something went wrong loading my brain.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              data-autofocus
              onClick={() => void brain.retryLoad()}
              className="rounded-full bg-secondary px-5 py-2.5 font-medium text-secondary-foreground"
            >
              Try again
            </button>
            <Link
              href="/contact"
              onClick={onClose}
              className="rounded-full border-2 border-primary px-5 py-2.5 font-medium text-primary"
            >
              Talk to the studio
            </Link>
          </div>
        </div>
      </>
    )
  } else if (brain.status !== "ready" && saveDataGate) {
    body = (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto px-6 py-6 text-center">
        <img src="/assets/octopus.png" alt="" className="h-14 w-14" />
        <p className="text-sm text-muted-foreground">
          My brain is a one-time ~1 GB download (then it&apos;s cached and free forever). You&apos;re on data-saver,
          so I&apos;ll wait for your go-ahead.
        </p>
        <button
          type="button"
          data-autofocus
          onClick={consent}
          className="rounded-full bg-secondary px-5 py-2.5 font-medium text-secondary-foreground"
        >
          Download Inky&apos;s brain 🧠
        </button>
      </div>
    )
  } else if (mode === "home") {
    body = (
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <div className="flex items-end gap-1.5">
          <img src="/assets/octopus.png" alt="" className="mb-0.5 h-5 w-5 shrink-0" />
          <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm leading-relaxed">
            Hey! I&apos;m Inky 🐙 — Cephalopod Studio&apos;s resident octopus. I know a suspicious amount about
            tentacles, and I moonlight as an app-idea machine. What sounds fun?
          </div>
        </div>
        <div className="space-y-2.5">
          <motion.button
            type="button"
            data-autofocus
            onClick={enterChat}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="block min-h-[64px] w-full rounded-2xl border-2 border-secondary/60 px-4 py-3 text-left hover:border-secondary"
          >
            <span className="block text-sm font-medium">🐙 Ask me anything cephalopod</span>
            <span className="block text-xs text-muted-foreground">Octopus facts, squid science, studio lore</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={enterIdeation}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.08 }}
            whileHover={{ scale: 1.02 }}
            className="block min-h-[64px] w-full rounded-2xl border-2 border-primary/60 px-4 py-3 text-left hover:border-primary"
          >
            <span className="block text-sm font-medium">✨ Dream up an app with me</span>
            <span className="block text-xs text-muted-foreground">3 quick questions, then I sketch the mockups</span>
          </motion.button>
        </div>
      </div>
    )
  } else if (mode === "chat") {
    body = (
      <>
        <ChatMessages items={items} className="flex-1" />
        {brain.status === "loading" && (
          <LoadingBar progress={brain.progress} fromCache={brain.fromCache} resuming={brain.resuming} />
        )}
        {messages.length <= 1 && !busy && pending === null && (
          <div className="flex flex-wrap justify-center gap-2 px-4 pb-1.5">
            {FAQ_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => handleSend(question)}
                className="rounded-full border-2 border-secondary/50 px-3.5 py-1.5 text-xs transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                {question}
              </button>
            ))}
          </div>
        )}
        <div className="flex justify-center px-4 pb-1">
          <button
            type="button"
            onClick={enterIdeation}
            className="min-h-[36px] rounded-full border-2 border-primary/50 px-3.5 py-1.5 text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            ✨ Dream up an app with me
          </button>
        </div>
        <ChatInput
          onSend={handleSend}
          disabled={busy || pending !== null}
          autoFocus
          placeholder={brain.status !== "ready" ? "Type now, I'll answer once my brain's in…" : undefined}
        />
      </>
    )
  } else {
    body = (
      <div className="flex min-h-0 flex-1 flex-col">
        <IdeationFlow brain={brain} onExit={exitIdeation} onCelebrate={onCelebrate} />
      </div>
    )
  }

  return (
    <>
      {isMobile && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[59] bg-background/60 backdrop-blur-sm md:hidden"
        />
      )}
      <motion.div
        ref={panelRef}
        id="inky-panel"
        role="dialog"
        aria-label="Chat with Inky"
        aria-modal={isMobile ? true : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        initial={isMobile ? { y: "100%", opacity: 0 } : { scale: 0.9, opacity: 0 }}
        animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
        exit={isMobile ? { y: "100%", opacity: 0 } : { scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ transformOrigin: "bottom right" }}
        className={`fixed inset-x-0 bottom-0 z-[60] flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl border-2 border-muted bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-2xl shadow-primary/25 outline-none backdrop-blur-md md:inset-x-auto md:bottom-24 md:right-6 md:z-40 md:rounded-3xl md:pb-0 md:transition-[width,height] md:duration-300 md:ease-out ${
          expanded
            ? "md:h-[calc(100dvh-12rem)] md:w-[min(880px,calc(100vw-3rem))]"
            : "md:h-[min(560px,calc(100dvh-12rem))] md:w-[380px]"
        }`}
      >
        <div aria-hidden="true" className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-muted md:hidden" />
        <div className="relative border-b-2 border-muted px-4 py-3">
          <div aria-hidden="true" className="memphis-dots pointer-events-none absolute inset-0 opacity-10" />
          <span
            aria-hidden="true"
            className="absolute right-3 top-0 h-0 w-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-accent opacity-40"
          />
          <div className="relative flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-primary bg-primary/15">
              <img src="/assets/octopus.png" alt="" className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-proza-libre text-lg font-bold leading-tight">Inky</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
                {statusLine}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleExpanded}
              aria-label={expanded ? "Shrink chat" : "Expand chat"}
              className="relative hidden h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-muted after:absolute after:-inset-1.5 after:content-[''] md:grid"
            >
              {expanded ? <Minimize2 size={16} aria-hidden="true" /> : <Maximize2 size={16} aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-muted after:absolute after:-inset-1.5 after:content-['']"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        {body}
        <div className="border-t border-muted px-4 py-0.5 text-center text-xs text-muted-foreground">
          Prefer a human?{" "}
          <Link
            href="/contact"
            onClick={onClose}
            className="inline-block px-2 py-2.5 text-secondary underline underline-offset-2"
          >
            Talk to the studio →
          </Link>
        </div>
      </motion.div>
    </>
  )
}
