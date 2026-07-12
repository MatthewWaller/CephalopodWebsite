"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ChatMessages, { type ChatItem } from "@/components/ceph-chat/chat-messages"
import ChatInput from "@/components/ceph-chat/chat-input"
import MockupPhone from "@/components/ceph-chat/mockup-phone"
import type { Brain } from "@/lib/ceph-chat/use-brain"
import {
  FALLBACK_MOCKUPS,
  MOCKUP_JSON_SCHEMA,
  parseMockup,
  type MockupDoc,
  type MockupScreen,
  type Vibe,
} from "@/lib/ceph-chat/mockup-schema"
import {
  GEN_PARAMS,
  IDEATION_SYSTEM_PROMPT,
  JSON_RETRY_INSTRUCTION,
  SURPRISE_IDEA_PROMPT,
  mockupPrompt,
} from "@/lib/ceph-chat/prompts"
import { BOOKING_URL } from "@/lib/site"
import { ssGet, ssSet } from "@/lib/ceph-chat/session-store"

type Step = "askIdea" | "askAudience" | "askVibe" | "generating" | "reveal" | "wrapup" | "smudged"

const STEP_ONE_TEXT = "Yesss 🎉 Tell me your app idea in one sentence. Big, tiny, silly, serious — all welcome."
const STEP_TWO_TEXT = "Love it. Who's it for?"
const STEP_THREE_TEXT = "Last one — pick a vibe:"
const GENERATING_TEXT = "Sketching with all eight arms…"
const SMUDGE_TEXT = "My ink smudged 🖋️ Want to try that again, or tell the humans directly?"
const SURPRISE_SEED = "an app that rates my houseplants' moods"

const EXAMPLE_IDEAS = [
  { emoji: "🪴", text: "An app that rates my houseplants' moods" },
  { emoji: "🍜", text: "A ramen diary with photo streaks" },
  { emoji: "🛌", text: "A nap scheduler that guards my calendar" },
]

const AUDIENCES = [
  { emoji: "🧒", label: "Kids" },
  { emoji: "🎨", label: "Creators" },
  { emoji: "💼", label: "Busy pros" },
  { emoji: "🏃", label: "Health heroes" },
  { emoji: "🐾", label: "Pet people" },
  { emoji: "🌍", label: "Everyone" },
]

const VIBES: { emoji: string; label: string; value: Vibe }[] = [
  { emoji: "🎈", label: "Playful", value: "playful" },
  { emoji: "🕶️", label: "Sleek", value: "sleek" },
  { emoji: "☕", label: "Cozy", value: "cozy" },
  { emoji: "⚡", label: "Bold", value: "bold" },
]

const wrapupText = (appName: string) =>
  `That's ${appName}! 🎬 Now imagine it real — polished, in the App Store, with your name on it. That is literally what we do all day at Cephalopod Studio.`

type SavedIdeation = {
  step: Step
  idea: string
  audience: string
  vibe: Vibe | null
  doc: MockupDoc | null
  screenIndex: number
}

function loadSavedIdeation(): SavedIdeation | null {
  try {
    const raw = ssGet("ceph-chat:ideation")
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<SavedIdeation>
    if (!parsed || typeof parsed !== "object" || typeof parsed.step !== "string") return null
    const doc = parsed.doc ? parseMockup(JSON.stringify(parsed.doc)) : null
    return {
      step: parsed.step as Step,
      idea: typeof parsed.idea === "string" ? parsed.idea : "",
      audience: typeof parsed.audience === "string" ? parsed.audience : "",
      vibe: VIBES.some((v) => v.value === parsed.vibe) ? (parsed.vibe as Vibe) : null,
      doc,
      screenIndex: typeof parsed.screenIndex === "number" ? parsed.screenIndex : 0,
    }
  } catch {
    return null
  }
}

function sanitizeIdea(text: string): string {
  return text.replace(/\s+/g, " ").replace(/"/g, "'").trim().slice(0, 200)
}

function cleanSurprise(raw: string): string {
  const stripped = raw
    .trim()
    .replace(/^["'“”‘’`]+|["'“”‘’`]+$/g, "")
    .trim()
  const letters = stripped.replace(/[^\p{L}\p{N}]/gu, "")
  return letters ? stripped : ""
}

function ProgressShapes({ completed }: { completed: number }) {
  const shapes = ["▲", "●", "▮"]
  return (
    <div aria-hidden="true" className="flex gap-1.5 text-sm leading-none">
      {shapes.map((shape, index) => (
        <span key={shape} className={index < completed ? "text-accent" : "text-muted-foreground/40"}>
          {shape}
        </span>
      ))}
    </div>
  )
}

function Chip({
  onClick,
  disabled,
  tone,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  tone: "secondary" | "accent"
  children: ReactNode
}) {
  const toneClass =
    tone === "accent"
      ? "border-accent/50 hover:bg-accent hover:text-accent-foreground"
      : "border-secondary/50 hover:bg-secondary hover:text-secondary-foreground"
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[40px] rounded-full border-2 px-4 py-2 text-sm transition-colors disabled:pointer-events-none disabled:opacity-50 ${toneClass}`}
    >
      {children}
    </button>
  )
}

function NameCard({ appName, tagline }: { appName: string; tagline: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className="rounded-2xl border-2 border-accent p-4 text-center"
    >
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Introducing</p>
      <p className="mt-1 font-proza-libre text-2xl font-bold text-accent">{appName}</p>
      <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
    </motion.div>
  )
}

function PhoneReveal({ screen, appName, vibe }: { screen: MockupScreen; appName: string; vibe: Vibe }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -3, y: 16 }}
      animate={{ opacity: 1, rotate: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="py-1"
    >
      <MockupPhone screen={screen} appName={appName} vibe={vibe} />
    </motion.div>
  )
}

const SKETCH_CAPTIONS = [
  "Mixing ink pigments…",
  "Sketching screens with all eight arms…",
  "Naming your app…",
  "Polishing the pixels…",
]

// Wireframe blocks "drawn in" one at a time, looping — the app taking shape
const SKETCH_BLOCKS = [
  { className: "h-9 w-3/4 rounded-xl bg-accent/40" },
  { className: "h-6 w-full rounded-full bg-muted" },
  { className: "h-16 w-full rounded-2xl border-2 border-secondary/50 bg-secondary/10" },
  { className: "h-9 w-full rounded-xl bg-muted" },
  { className: "h-9 w-5/6 rounded-xl bg-muted" },
  { className: "h-9 w-1/2 self-center rounded-full bg-primary/50" },
]
const SKETCH_CYCLE = 4.2

function GeneratingPhone() {
  const [caption, setCaption] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setCaption((i) => (i + 1) % SKETCH_CAPTIONS.length), 2100)
    return () => window.clearInterval(t)
  }, [])
  return (
    <div className="mx-auto w-[240px] max-w-full">
      <div aria-hidden="true" className="relative">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute -left-6 top-10 h-4 w-4 rounded-md border-2 border-secondary/80"
        />
        <motion.span
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute -right-5 top-24 h-0 w-0 border-l-8 border-r-8 border-b-[14px] border-l-transparent border-r-transparent border-b-accent/80"
        />
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute -left-4 bottom-16 text-lg text-primary"
        >
          ✦
        </motion.span>
        <div className="grid-paper-background relative flex aspect-[9/18.5] flex-col overflow-hidden rounded-[2.25rem] border-[3px] border-muted bg-background p-3">
          <div className="mx-auto mb-3 h-1.5 w-16 shrink-0 rounded-full bg-muted" />
          <div className="flex flex-col gap-2.5">
            {SKETCH_BLOCKS.map((block, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: [0, 1, 1, 0], scaleX: [0.5, 1, 1, 1] }}
                transition={{
                  duration: SKETCH_CYCLE,
                  times: [0, 0.12, 0.92, 1],
                  delay: index * 0.35,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: SKETCH_BLOCKS.length * 0.35 - SKETCH_CYCLE * 0.08,
                  ease: "easeOut",
                }}
                style={{ transformOrigin: "left center" }}
                className={block.className}
              />
            ))}
          </div>
          <motion.div
            animate={{ x: ["-150%", "450%"] }}
            transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", repeatDelay: 0.4 }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-foreground/[0.07] to-transparent"
          />
        </div>
      </div>
      <div className="mt-2 h-4 text-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={caption}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-xs text-muted-foreground"
          >
            {SKETCH_CAPTIONS[caption]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

function BrainLoadingBar({ progress, resuming }: { progress: number; resuming: boolean }) {
  const pct = Math.round(progress * 100)
  return (
    <div className="w-full space-y-1">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`Brain loading ${pct}%`}
        className="h-3 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
          style={{ width: `${Math.max(4, pct)}%` }}
        />
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {resuming
          ? "Picking up where we left off — saved chunks load fast."
          : "One-time download — cached for next visit."}
      </p>
    </div>
  )
}

export default function IdeationFlow({
  brain,
  onExit,
  onCelebrate,
}: {
  brain: Brain
  onExit: () => void
  onCelebrate?: () => void
}) {
  const [step, setStep] = useState<Step>("askIdea")
  const [transcript, setTranscript] = useState<ChatItem[]>([])
  const [busy, setBusy] = useState(false)
  const [surpriseFailed, setSurpriseFailed] = useState(false)
  const [idea, setIdea] = useState("")
  const [audience, setAudience] = useState("")
  const [vibe, setVibe] = useState<Vibe | null>(null)
  const [doc, setDoc] = useState<MockupDoc | null>(null)
  const [screenIndex, setScreenIndex] = useState(0)
  const [round, setRound] = useState(0)

  const brainRef = useRef(brain)
  brainRef.current = brain
  const alive = useRef(true)
  const started = useRef(false)
  const genRun = useRef(0)
  const idSeq = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  const nextId = () => `idea-${++idSeq.current}`
  const push = (...items: ChatItem[]) => setTranscript((current) => [...current, ...items])
  const assistantItem = (text: string): ChatItem => ({ id: nextId(), type: "assistant", text })
  const userItem = (text: string): ChatItem => ({ id: nextId(), type: "user", text })
  const customItem = (node: ReactNode, ariaLabel?: string): ChatItem => ({ id: nextId(), type: "custom", node, ariaLabel })

  const restore = (saved: SavedIdeation) => {
    const items: ChatItem[] = [assistantItem(STEP_ONE_TEXT)]
    if (saved.idea) items.push(userItem(saved.idea), assistantItem(STEP_TWO_TEXT))
    if (saved.audience) {
      const audienceChoice = AUDIENCES.find((choice) => choice.label === saved.audience)
      items.push(
        userItem(audienceChoice ? `${audienceChoice.emoji} ${audienceChoice.label}` : saved.audience),
        assistantItem(STEP_THREE_TEXT),
      )
    }
    const vibeChoice = VIBES.find((choice) => choice.value === saved.vibe)
    if (vibeChoice) items.push(userItem(`${vibeChoice.emoji} ${vibeChoice.label}`))

    let step: Step = saved.step
    if ((step === "reveal" || step === "wrapup") && saved.doc && saved.vibe) {
      const screenIndex = Math.min(saved.screenIndex, saved.doc.screens.length - 1)
      items.push(
        customItem(
          <NameCard appName={saved.doc.appName} tagline={saved.doc.tagline} />,
          `Introducing ${saved.doc.appName}: ${saved.doc.tagline}`,
        ),
      )
      for (let index = 0; index <= screenIndex; index++) {
        const screen = saved.doc.screens[index]
        items.push(
          assistantItem(screen.pitch ?? `Here's the ${screen.title} screen!`),
          customItem(
            <PhoneReveal screen={screen} appName={saved.doc.appName} vibe={saved.vibe} />,
            `Mockup of ${saved.doc.appName} ${screen.title} screen`,
          ),
        )
      }
      if (step === "wrapup") items.push(assistantItem(wrapupText(saved.doc.appName)))
      setDoc(saved.doc)
      setScreenIndex(screenIndex)
    } else if (step === "generating" || step === "smudged") {
      // Generation was interrupted by the close — offer a retry instead of dead air
      step = saved.vibe ? "smudged" : "askIdea"
      if (step === "smudged") items.push(assistantItem(SMUDGE_TEXT))
    }
    setIdea(saved.idea)
    setAudience(saved.audience)
    setVibe(saved.vibe)
    setStep(step)
    setTranscript(items)
  }

  useEffect(() => {
    alive.current = true
    if (!started.current) {
      started.current = true
      void brainRef.current.ensureLoaded()
      const saved = loadSavedIdeation()
      if (saved && saved.step !== "askIdea") restore(saved)
      else push(assistantItem(STEP_ONE_TEXT))
    }
    return () => {
      alive.current = false
      // Stop any in-flight generation so it doesn't hog the serial queue after close
      abortRef.current?.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist the flow so closing the panel (or navigating) resumes where you left off
  useEffect(() => {
    ssSet("ceph-chat:ideation", JSON.stringify({ step, idea, audience, vibe, doc, screenIndex }))
  }, [step, idea, audience, vibe, doc, screenIndex])

  const screenItems = (docValue: MockupDoc, index: number, vibeValue: Vibe): ChatItem[] => {
    const screen = docValue.screens[index]
    return [
      assistantItem(screen.pitch ?? `Here's the ${screen.title} screen!`),
      customItem(
        <PhoneReveal screen={screen} appName={docValue.appName} vibe={vibeValue} />,
        `Mockup of ${docValue.appName} ${screen.title} screen`,
      ),
    ]
  }

  const revealDoc = (docValue: MockupDoc, vibeValue: Vibe) => {
    setDoc(docValue)
    setScreenIndex(0)
    setStep("reveal")
    push(
      customItem(
        <NameCard appName={docValue.appName} tagline={docValue.tagline} />,
        `Introducing ${docValue.appName}: ${docValue.tagline}`,
      ),
      ...screenItems(docValue, 0, vibeValue),
    )
    onCelebrate?.()
  }

  const startGenerating = async (ideaValue: string, audienceValue: string, vibeValue: Vibe) => {
    const run = ++genRun.current
    setStep("generating")
    push(assistantItem(GENERATING_TEXT))
    try {
      if (brainRef.current.status === "error") {
        const ok = await brainRef.current.retryLoad()
        if (!ok) throw new Error("brain load failed")
      }
      const controller = new AbortController()
      abortRef.current = controller
      const result = await brainRef.current.generateJson<MockupDoc>({
        messages: [
          { role: "system", content: IDEATION_SYSTEM_PROMPT },
          { role: "user", content: mockupPrompt(ideaValue, audienceValue, vibeValue) },
        ],
        schema: JSON.stringify(MOCKUP_JSON_SCHEMA),
        params: GEN_PARAMS.json,
        retryParams: GEN_PARAMS.jsonRetry,
        retryInstruction: JSON_RETRY_INSTRUCTION,
        parse: parseMockup,
        signal: controller.signal,
      })
      if (!alive.current || genRun.current !== run) return
      revealDoc(result ?? FALLBACK_MOCKUPS[vibeValue], vibeValue)
    } catch {
      if (!alive.current || genRun.current !== run) return
      setStep("smudged")
      push(assistantItem(SMUDGE_TEXT))
    }
  }

  const advanceFromIdea = (ideaValue: string, echoText: string) => {
    setIdea(sanitizeIdea(ideaValue))
    setStep("askAudience")
    push(userItem(echoText), assistantItem(STEP_TWO_TEXT))
  }

  const handleIdeaText = (text: string) => {
    if (busy) return
    advanceFromIdea(text, text.trim())
  }

  const handleExample = (choice: { emoji: string; text: string }) => {
    if (busy) return
    advanceFromIdea(choice.text, `${choice.emoji} ${choice.text}`)
  }

  const handleSurprise = async () => {
    if (busy) return
    setBusy(true)
    try {
      const controller = new AbortController()
      abortRef.current = controller
      const raw = await brainRef.current.generateText(
        [
          { role: "system", content: IDEATION_SYSTEM_PROMPT },
          { role: "user", content: SURPRISE_IDEA_PROMPT },
        ],
        GEN_PARAMS.guide,
        controller.signal,
      )
      if (!alive.current) return
      const surprise = cleanSurprise(raw) || SURPRISE_SEED
      setSurpriseFailed(false)
      advanceFromIdea(surprise, `🎲 ${surprise}`)
    } catch {
      if (!alive.current) return
      setSurpriseFailed(true)
      push(assistantItem(SMUDGE_TEXT))
    } finally {
      if (alive.current) setBusy(false)
    }
  }

  const handleAudience = (choice: { emoji: string; label: string }) => {
    setAudience(choice.label)
    setStep("askVibe")
    push(userItem(`${choice.emoji} ${choice.label}`), assistantItem(STEP_THREE_TEXT))
  }

  const handleVibe = (choice: { emoji: string; label: string; value: Vibe }) => {
    setVibe(choice.value)
    push(userItem(`${choice.emoji} ${choice.label}`))
    void startGenerating(idea, audience, choice.value)
  }

  const handleNext = () => {
    if (!doc || !vibe) return
    const next = screenIndex + 1
    if (next < doc.screens.length) {
      setScreenIndex(next)
      push(...screenItems(doc, next, vibe))
    } else {
      setStep("wrapup")
      push(assistantItem(wrapupText(doc.appName)))
    }
  }

  const handleSmudgeRetry = () => {
    if (!vibe) return
    void startGenerating(idea, audience, vibe)
  }

  const handleRestart = () => {
    genRun.current++
    setDoc(null)
    setIdea("")
    setAudience("")
    setVibe(null)
    setScreenIndex(0)
    setSurpriseFailed(false)
    setBusy(false)
    setRound((current) => current + 1)
    setStep("askIdea")
    push(assistantItem(STEP_ONE_TEXT))
  }

  const buildControls = (): { node: ReactNode; label: string } | null => {
    switch (step) {
      case "askIdea":
        return {
          label: "App idea options",
          node: (
            <div className="w-full space-y-2.5">
              <ProgressShapes completed={0} />
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_IDEAS.map((choice) => (
                  <Chip key={choice.text} tone="secondary" onClick={() => handleExample(choice)} disabled={busy}>
                    {choice.emoji} {choice.text}
                  </Chip>
                ))}
                <Chip tone="accent" onClick={() => void handleSurprise()} disabled={busy}>
                  {surpriseFailed ? "🎲 Retry surprise" : "🎲 Surprise me"}
                </Chip>
              </div>
              {busy && brain.status === "loading" && (
                <BrainLoadingBar progress={brain.progress} resuming={brain.resuming} />
              )}
            </div>
          ),
        }
      case "askAudience":
        return {
          label: "Audience choices",
          node: (
            <div className="w-full space-y-2.5">
              <ProgressShapes completed={1} />
              <div className="flex flex-wrap gap-2">
                {AUDIENCES.map((choice) => (
                  <Chip key={choice.label} tone="secondary" onClick={() => handleAudience(choice)}>
                    {choice.emoji} {choice.label}
                  </Chip>
                ))}
              </div>
            </div>
          ),
        }
      case "askVibe":
        return {
          label: "Vibe choices",
          node: (
            <div className="w-full space-y-2.5">
              <ProgressShapes completed={2} />
              <div className="flex flex-wrap gap-2">
                {VIBES.map((choice) => (
                  <Chip key={choice.value} tone="accent" onClick={() => handleVibe(choice)}>
                    {choice.emoji} {choice.label}
                  </Chip>
                ))}
              </div>
            </div>
          ),
        }
      case "generating":
        return {
          label: "Sketching your mockups",
          node: (
            <div className="w-full space-y-3">
              <ProgressShapes completed={3} />
              <GeneratingPhone />
              {brain.status === "loading" && <BrainLoadingBar progress={brain.progress} resuming={brain.resuming} />}
            </div>
          ),
        }
      case "reveal":
        if (!doc) return null
        return {
          label: "Mockup screen navigation",
          node: (
            <div className="flex w-full flex-col items-center gap-2">
              <div className="flex gap-1.5">
                {doc.screens.map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 w-2 rounded-full ${index === screenIndex ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Screen {screenIndex + 1} of {doc.screens.length}
              </p>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full bg-secondary px-5 py-2 text-sm font-medium text-secondary-foreground"
              >
                {screenIndex === doc.screens.length - 1 ? "The finale →" : "Next screen →"}
              </button>
            </div>
          ),
        }
      case "wrapup":
        return {
          label: "Next steps",
          node: (
            <div className="flex w-full flex-col gap-2.5">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={BOOKING_URL}
                className="w-full rounded-full bg-primary py-3.5 text-center text-base font-medium text-primary-foreground shadow-lg shadow-primary/30"
              >
                Let&apos;s build it together 🚀
              </motion.a>
              <button
                type="button"
                onClick={handleRestart}
                className="w-full rounded-full border-2 border-secondary py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                🔄 Dream up another
              </button>
              <button
                type="button"
                onClick={onExit}
                className="mx-auto px-2 py-2.5 text-xs text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
              >
                or keep chatting about octopuses →
              </button>
            </div>
          ),
        }
      case "smudged":
        return {
          label: "Retry options",
          node: (
            <div className="flex flex-wrap gap-2">
              <Chip tone="secondary" onClick={handleSmudgeRetry}>
                Retry
              </Chip>
              <a
                href="/contact"
                className="min-h-[40px] rounded-full border-2 border-primary/50 px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Talk to the studio
              </a>
            </div>
          ),
        }
    }
  }

  const items: ChatItem[] = [...transcript]
  if (busy) items.push({ id: `typing-${round}`, type: "typing" })
  const controls = buildControls()
  if (controls) {
    items.push({
      id: `controls-${step}-${round}-${screenIndex}`,
      type: "custom",
      node: controls.node,
      ariaLabel: controls.label,
    })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatMessages items={items} className="min-h-0 flex-1" />
      {step === "askIdea" && (
        <ChatInput
          onSend={handleIdeaText}
          disabled={busy}
          placeholder="Your app idea, one sentence…"
          autoFocus
        />
      )}
    </div>
  )
}
