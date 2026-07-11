"use client"

import { useRef, useState } from "react"
import { ArrowUp } from "lucide-react"

export default function ChatInput({
  onSend,
  disabled,
  placeholder = "Ask about octopuses, or your app idea…",
  autoFocus,
}: {
  onSend: (text: string) => void
  disabled?: boolean
  placeholder?: string
  autoFocus?: boolean
}) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Autogrow from 1 row up to ~4 rows
  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 104)}px`
  }

  const send = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue("")
    const el = textareaRef.current
    if (el) el.style.height = "auto"
  }

  return (
    <div className="flex items-center gap-2 border-t-2 border-muted px-3 py-3">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label="Message Inky"
        onChange={(e) => {
          setValue(e.target.value)
          resize()
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            send()
          }
        }}
        className="flex-1 resize-none rounded-2xl bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <button
        type="button"
        onClick={send}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
      >
        <ArrowUp size={20} aria-hidden="true" />
      </button>
    </div>
  )
}
