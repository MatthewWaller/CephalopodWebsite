"use client"

import { useEffect, useRef } from "react"
import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { marked } from "marked"

export type ChatItem =
  | { id: string; type: "user"; text: string }
  | { id: string; type: "assistant"; text: string; streaming?: boolean }
  | { id: string; type: "typing" }
  | { id: string; type: "custom"; node: ReactNode; ariaLabel?: string }

const ALLOWED_TAGS = new Set(["p", "strong", "em", "ul", "ol", "li", "a", "code"])

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

// Escape raw HTML first (XSS guard), then keep only the tags marked itself produced.
function renderMarkdown(text: string): string {
  const html = marked.parse(escapeHtml(text), { async: false }) as string
  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*?)\/?>/g, (full, rawTag: string, attrs: string) => {
    const tag = rawTag.toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) return ""
    if (full.startsWith("</")) return `</${tag}>`
    if (tag === "a") {
      const match = /href="([^"]*)"/i.exec(attrs)
      const href = match?.[1] ?? ""
      const safeHref = /^(https?:|mailto:|\/)/i.test(href) ? href : "#"
      return `<a href="${safeHref}" class="text-primary underline" target="_blank" rel="noopener">`
    }
    return `<${tag}>`
  })
}

function AvatarSlot({ show }: { show: boolean }) {
  return show ? (
    <img src="/assets/octopus.png" alt="" className="mb-0.5 h-5 w-5 shrink-0" />
  ) : (
    <span aria-hidden="true" className="w-5 shrink-0" />
  )
}

function TypingDots() {
  const reduced = useReducedMotion()
  const colors = ["bg-primary", "bg-secondary", "bg-accent"]
  return (
    <div className="flex items-center gap-1.5 self-start rounded-2xl rounded-bl-md bg-muted px-4 py-3">
      {colors.map((color, i) => (
        <motion.span
          key={color}
          animate={reduced ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
          className={`h-2 w-2 rounded-full ${color} ${reduced ? "opacity-60" : ""}`}
        />
      ))}
    </div>
  )
}

const entrance = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2 },
}

export default function ChatMessages({ items, className }: { items: ChatItem[]; className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const stickRef = useRef(true)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }

  // Follow the bottom on new items and streaming tokens unless the user scrolled up
  useEffect(() => {
    const el = scrollRef.current
    if (el && stickRef.current) el.scrollTop = el.scrollHeight
  })

  const isAssistantLike = (item: ChatItem | undefined) =>
    item !== undefined && (item.type === "assistant" || item.type === "typing")

  const busy = items.some((item) => item.type === "typing" || (item.type === "assistant" && item.streaming))

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
      aria-atomic="false"
      className={`flex flex-col gap-3 overflow-y-auto px-4 py-4 ${className ?? ""}`}
    >
      {busy && (
        <div role="status" className="sr-only">
          Inky is typing
        </div>
      )}
      {items.map((item, i) => {
        if (item.type === "user") {
          return (
            <motion.div key={item.id} {...entrance} className="flex justify-end">
              <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
                {item.text}
              </div>
            </motion.div>
          )
        }
        if (item.type === "custom") {
          return (
            <motion.div
              key={item.id}
              {...entrance}
              className="w-full"
              role={item.ariaLabel ? "group" : undefined}
              aria-label={item.ariaLabel}
            >
              {item.node}
            </motion.div>
          )
        }
        const startOfRun = !isAssistantLike(items[i - 1])
        if (item.type === "typing") {
          return (
            <motion.div key={item.id} {...entrance} aria-hidden="true" className="flex items-end gap-1.5">
              <AvatarSlot show={startOfRun} />
              <TypingDots />
            </motion.div>
          )
        }
        return (
          <motion.div
            key={item.id}
            {...entrance}
            aria-hidden={item.streaming ? true : undefined}
            className="flex items-end gap-1.5"
          >
            <AvatarSlot show={startOfRun} />
            <div
              className="max-w-[85%] break-words rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm leading-relaxed [&_a]:break-all [&_code]:rounded [&_code]:bg-background/60 [&_code]:px-1 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_p+p]:mt-2 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-4"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(item.text) }}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
