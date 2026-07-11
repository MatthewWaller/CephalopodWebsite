"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import type { MockupComponent, MockupScreen, Vibe } from "@/lib/ceph-chat/mockup-schema"

type VibeStyle = {
  color: string
  fillBg: string
  fillText: string
  buttonClass: string
  spacing: string
  imageGradient: string
  imageSurface: string
  inputClass: string
  dot: string
  tabIndicator: string
}

const VIBE_STYLES: Record<Vibe, VibeStyle> = {
  playful: {
    color: "text-primary",
    fillBg: "bg-primary",
    fillText: "text-primary-foreground",
    buttonClass: "rounded-full border-2 border-primary bg-primary",
    spacing: "space-y-2",
    imageGradient: "from-primary/40 to-primary/5",
    imageSurface: "bg-primary/10",
    inputClass: "rounded-lg border-2 border-muted bg-background/60",
    dot: "bg-primary",
    tabIndicator: "bg-primary",
  },
  sleek: {
    color: "text-secondary",
    fillBg: "bg-secondary",
    fillText: "text-secondary-foreground",
    buttonClass: "rounded-lg border border-muted bg-secondary",
    spacing: "space-y-1.5",
    imageGradient: "from-secondary/40 to-secondary/5",
    imageSurface: "bg-secondary/5",
    inputClass: "rounded-lg border border-muted bg-background/60",
    dot: "bg-secondary",
    tabIndicator: "bg-secondary",
  },
  cozy: {
    color: "text-accent",
    fillBg: "bg-accent",
    fillText: "text-accent-foreground",
    buttonClass: "rounded-2xl bg-accent",
    spacing: "space-y-2",
    imageGradient: "from-accent/40 to-accent/5",
    imageSurface: "bg-accent/10",
    inputClass: "rounded-lg border border-transparent bg-muted",
    dot: "bg-accent",
    tabIndicator: "bg-accent",
  },
  bold: {
    color: "text-primary",
    fillBg: "bg-primary",
    fillText: "text-primary-foreground",
    buttonClass: "rounded-xl border-2 border-foreground bg-primary shadow-[4px_4px_0_hsl(var(--accent))]",
    spacing: "space-y-2",
    imageGradient: "from-primary/40 to-primary/5",
    imageSurface: "bg-accent/10",
    inputClass: "rounded-lg border border-muted bg-background/60",
    dot: "bg-accent",
    tabIndicator: "bg-accent",
  },
}

function renderComponent(component: MockupComponent, style: VibeStyle) {
  switch (component.type) {
    case "header":
      return (
        <div className={`flex h-9 items-center border-b border-muted px-0.5 font-proza-libre text-[13px] font-bold ${style.color}`}>
          <span className="truncate">{component.text}</span>
        </div>
      )
    case "text":
      return <p className="px-0.5 text-[10px] leading-snug text-muted-foreground">{component.text}</p>
    case "button":
      return (
        <div className={`flex h-9 w-full items-center justify-center ${style.buttonClass}`}>
          <span className={`truncate px-2 text-[10px] font-bold ${style.fillText}`}>{component.text}</span>
        </div>
      )
    case "input":
      return (
        <div className={`flex h-8 items-center px-2.5 ${style.inputClass}`}>
          <span className="truncate text-[10px] italic text-muted-foreground">{component.text}</span>
        </div>
      )
    case "image":
      return (
        <div className={`relative grid h-20 place-items-center overflow-hidden rounded-xl bg-gradient-to-br ${style.imageGradient} ${style.imageSurface}`}>
          <span className="text-[28px] leading-none">✨</span>
          <span className="absolute bottom-1.5 left-1.5 max-w-[85%] truncate rounded-full bg-background/70 px-1.5 py-0.5 text-[8px] text-foreground">
            {component.text}
          </span>
        </div>
      )
    case "list":
      return (
        <div>
          {component.items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 border-b border-muted/50 py-1.5">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
              <span className="min-w-0 flex-1 truncate text-[10px] text-foreground">{item}</span>
              <ChevronRight size={10} className="shrink-0 text-muted-foreground" />
            </div>
          ))}
        </div>
      )
  }
}

function Tab({ emoji, label, labelColor, indicator }: { emoji: string; label: string; labelColor?: string; indicator?: string }) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5">
      {indicator && <span className={`absolute inset-x-4 top-0 h-0.5 ${indicator}`} />}
      <span className="text-[10px] leading-none">{emoji}</span>
      <span className={`max-w-full truncate px-1 text-[7px] leading-none ${labelColor ?? "text-muted-foreground"}`}>{label}</span>
    </div>
  )
}

export default function MockupPhone({ screen, appName, vibe }: { screen: MockupScreen; appName: string; vibe: Vibe }) {
  const style = VIBE_STYLES[vibe]
  const hasHeaderFirst = screen.components[0]?.type === "header"
  return (
    <div
      role="img"
      aria-label={`Mockup of ${appName} ${screen.title} screen${screen.pitch ? `: ${screen.pitch}` : ""}`}
      className="grid-paper-background relative mx-auto flex aspect-[9/18.5] w-[240px] max-w-full flex-col overflow-hidden rounded-[2.25rem] border-[3px] border-foreground/70 bg-background shadow-xl shadow-black/40"
    >
      <div aria-hidden="true" className="flex min-h-0 flex-1 flex-col">
        <div className="absolute left-1/2 top-0 z-10 h-5 w-20 -translate-x-1/2 rounded-b-xl bg-foreground/70" />
        <div className="flex items-center justify-between px-4 pb-1 pt-1.5 text-[9px] text-muted-foreground">
          <span>9:41</span>
          <span>📶 🔋</span>
        </div>
        <div className={`min-h-0 flex-1 overflow-hidden px-3 pb-2 ${style.spacing}`}>
          {!hasHeaderFirst && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="pt-1 text-center font-proza-libre text-[11px] font-bold text-foreground"
            >
              <span className="mx-auto block max-w-full truncate">{screen.title}</span>
            </motion.div>
          )}
          {screen.components.map((component, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: (index + (hasHeaderFirst ? 0 : 1)) * 0.05 }}
            >
              {renderComponent(component, style)}
            </motion.div>
          ))}
        </div>
        <div className="mt-auto flex h-10 shrink-0 border-t border-muted">
          <Tab emoji="🏠" label="Home" />
          <Tab emoji="✨" label={screen.title} labelColor={style.color} indicator={style.tabIndicator} />
          <Tab emoji="👤" label="Profile" />
        </div>
      </div>
    </div>
  )
}
