"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { AnimatePresence, motion, useAnimationControls } from "framer-motion"
import { X } from "lucide-react"
import { useBrain } from "@/lib/ceph-chat/use-brain"

const ChatPanel = dynamic(() => import("./chat-panel"), { ssr: false })

const RING_CIRCUMFERENCE = 2 * Math.PI * 26

let nudgedMem = false
function wasNudged(): boolean {
  try {
    return window.sessionStorage.getItem("ceph-chat:nudged") === "1" || nudgedMem
  } catch {
    return nudgedMem
  }
}
function markNudged() {
  nudgedMem = true
  try {
    window.sessionStorage.setItem("ceph-chat:nudged", "1")
  } catch {
    // in-memory only
  }
}

export default function ChatWidget() {
  const brain = useBrain({ preload: true })
  const [open, setOpen] = useState(false)
  const [nudge, setNudge] = useState(false)
  const everOpenedRef = useRef(false)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const wiggle = useAnimationControls()

  useEffect(() => {
    if (open) everOpenedRef.current = true
  }, [open])

  const doWiggle = useCallback(() => {
    void wiggle.start({ rotate: [0, -8, 10, -6, 0], transition: { duration: 0.6 } })
  }, [wiggle])

  // Nudge once, right after the brain becomes ready, if the panel was never opened —
  // the "magic trick" promise is only made when it can be kept instantly. Auto-dismiss after 6s.
  useEffect(() => {
    if (brain.status !== "ready" || wasNudged()) return
    let hideTimer: number | undefined
    const showTimer = window.setTimeout(() => {
      if (everOpenedRef.current) return
      markNudged()
      setNudge(true)
      doWiggle()
      hideTimer = window.setTimeout(() => setNudge(false), 6000)
    }, 1500)
    return () => {
      window.clearTimeout(showTimer)
      if (hideTimer !== undefined) window.clearTimeout(hideTimer)
    }
  }, [brain.status, doWiggle])

  const handleClose = useCallback(() => {
    setOpen(false)
    launcherRef.current?.focus()
  }, [])

  return (
    <>
      <AnimatePresence>
        {open && <ChatPanel brain={brain} onClose={handleClose} onCelebrate={doWiggle} />}
      </AnimatePresence>

      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 md:bottom-6 md:right-6">
        <AnimatePresence>
          {nudge && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
              className="absolute bottom-3 right-full mr-3 whitespace-nowrap rounded-full rounded-br-sm bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-lg"
            >
              Psst — wanna see a magic trick? 🐙
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
          <motion.div animate={wiggle} className="relative">
            <span aria-hidden="true" className="absolute -bottom-1 -right-1 -z-10 h-14 w-14 rounded-full bg-accent" />
            <motion.button
              ref={launcherRef}
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                setNudge(false)
                setOpen((o) => !o)
              }}
              onPointerEnter={() => setNudge(false)}
              onFocus={() => setNudge(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setNudge(false)
              }}
              aria-label={open ? "Close chat" : "Chat with Inky, our octopus assistant"}
              aria-expanded={open}
              aria-controls="inky-panel"
              className="relative grid h-14 w-14 place-items-center rounded-full border-2 border-primary bg-background shadow-lg shadow-primary/30 transition-shadow hover:shadow-primary/50"
            >
              {brain.status === "loading" && (
                <svg viewBox="0 0 56 56" aria-hidden="true" className="pointer-events-none absolute inset-0 -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="26"
                    fill="none"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.max(brain.progress, 0.02) * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
                  />
                </svg>
              )}
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="grid place-items-center"
                  >
                    <X size={24} aria-hidden="true" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="octo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="grid place-items-center"
                  >
                    <img src="/assets/octopus.png" alt="" className="h-9 w-9" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
