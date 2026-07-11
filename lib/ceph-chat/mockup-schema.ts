export type Vibe = "playful" | "sleek" | "cozy" | "bold"

export type MockupComponent =
  | { type: "header" | "text" | "button" | "input" | "image"; text: string }
  | { type: "list"; items: string[] }

export type MockupScreen = { title: string; pitch?: string; components: MockupComponent[] }

export type MockupDoc = { appName: string; tagline: string; screens: MockupScreen[] }

export const MOCKUP_JSON_SCHEMA: Record<string, unknown> = {
  type: "object",
  properties: {
    appName: { type: "string", maxLength: 20 },
    tagline: { type: "string", maxLength: 60 },
    screens: {
      type: "array",
      minItems: 2,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          title: { type: "string", maxLength: 14 },
          pitch: { type: "string", maxLength: 90 },
          components: {
            type: "array",
            minItems: 2,
            maxItems: 4,
            items: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["header", "text", "button", "input", "image", "list"] },
                text: { type: "string", maxLength: 32 },
                items: { type: "array", items: { type: "string", maxLength: 24 }, minItems: 2, maxItems: 4 },
              },
              required: ["type"],
            },
          },
        },
        required: ["title", "pitch", "components"],
      },
    },
  },
  required: ["appName", "tagline", "screens"],
}

export function cleanJson(raw: string): string {
  let text = raw.replace(/```(?:json)?/gi, "")
  const first = text.indexOf("{")
  const last = text.lastIndexOf("}")
  if (first !== -1 && last > first) text = text.slice(first, last + 1)
  return text.replace(/,\s*([}\]])/g, "$1").trim()
}

function clip(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.length <= max ? trimmed : `${trimmed.slice(0, max - 1)}…`
}

function validateComponent(value: unknown): MockupComponent | null {
  if (typeof value !== "object" || value === null) return null
  const record = value as Record<string, unknown>
  const type = record.type
  if (type === "list") {
    if (!Array.isArray(record.items)) return null
    const items = record.items
      .map((item) => clip(item, 24))
      .filter((item): item is string => item !== null)
      .slice(0, 4)
    if (items.length < 2) return null
    return { type: "list", items }
  }
  if (type === "header" || type === "text" || type === "button" || type === "input" || type === "image") {
    const text = clip(record.text, 32)
    if (!text) return null
    return { type, text }
  }
  return null
}

export function validateMockup(value: unknown): MockupDoc | null {
  if (typeof value !== "object" || value === null) return null
  const record = value as Record<string, unknown>
  const appName = clip(record.appName, 20)
  const tagline = clip(record.tagline, 60)
  if (!appName || !tagline || !Array.isArray(record.screens)) return null
  const screens: MockupScreen[] = []
  for (const rawScreen of record.screens.slice(0, 3)) {
    if (typeof rawScreen !== "object" || rawScreen === null) continue
    const screenRecord = rawScreen as Record<string, unknown>
    const title = clip(screenRecord.title, 14)
    if (!title || !Array.isArray(screenRecord.components)) continue
    const components = screenRecord.components
      .map(validateComponent)
      .filter((component): component is MockupComponent => component !== null)
      .slice(0, 4)
    if (components.length < 1) continue
    const pitch = clip(screenRecord.pitch, 90)
    screens.push(pitch ? { title, pitch, components } : { title, components })
  }
  if (screens.length < 2) return null
  return { appName, tagline, screens }
}

export function parseMockup(raw: string): MockupDoc | null {
  try {
    return validateMockup(JSON.parse(cleanJson(raw)))
  } catch {
    return null
  }
}

export function normalizeVibe(input: string): Vibe {
  const needle = input.trim().toLowerCase()
  const vibes: Vibe[] = ["playful", "sleek", "cozy", "bold"]
  return vibes.find((vibe) => needle === vibe || needle.includes(vibe)) ?? "playful"
}

export const FALLBACK_MOCKUPS: Record<Vibe, MockupDoc> = {
  playful: {
    appName: "QuestBuddy",
    tagline: "Turn your to-dos into quests",
    screens: [
      {
        title: "Today",
        pitch: "Your day, but it gives you XP.",
        components: [
          { type: "header", text: "Today's Quests" },
          { type: "list", items: ["Slay the laundry pile", "Email the dragon (boss)", "Water the potion garden"] },
          { type: "button", text: "Complete a quest" },
        ],
      },
      {
        title: "New Quest",
        pitch: "Every chore becomes a mission.",
        components: [
          { type: "header", text: "New Quest" },
          { type: "input", text: "Quest name" },
          { type: "input", text: "Reward (XP)" },
          { type: "button", text: "Add to quest log" },
        ],
      },
      {
        title: "Level Up",
        pitch: "Progress you can actually feel.",
        components: [
          { type: "header", text: "Level Up!" },
          { type: "image", text: "You reached Level 7" },
          { type: "text", text: "3 quests until Level 8" },
          { type: "button", text: "Keep questing" },
        ],
      },
    ],
  },
  sleek: {
    appName: "Cliently",
    tagline: "Client work, beautifully organized",
    screens: [
      {
        title: "Dashboard",
        pitch: "Every client, deadline, and dollar in one clean view.",
        components: [
          { type: "header", text: "Dashboard" },
          { type: "list", items: ["Acme Co - due Friday", "Bluebird - invoiced", "Nova Labs - paid"] },
          { type: "button", text: "New invoice" },
        ],
      },
      {
        title: "New Invoice",
        pitch: "Invoices in under a minute.",
        components: [
          { type: "header", text: "New Invoice" },
          { type: "input", text: "Client name" },
          { type: "input", text: "Amount" },
          { type: "button", text: "Send invoice" },
        ],
      },
      {
        title: "Paid",
        pitch: "The best notification in business.",
        components: [
          { type: "header", text: "You got paid!" },
          { type: "image", text: "$1,200 from Acme Co" },
          { type: "text", text: "Deposited to your account." },
          { type: "button", text: "View receipt" },
        ],
      },
    ],
  },
  cozy: {
    appName: "Stillwater",
    tagline: "A quiet moment, every day",
    screens: [
      {
        title: "Home",
        pitch: "One gentle minute, whenever you need it.",
        components: [
          { type: "header", text: "Stillwater" },
          { type: "text", text: "Take a minute for yourself." },
          { type: "button", text: "Begin a session" },
        ],
      },
      {
        title: "Session",
        pitch: "Breathe in, breathe out, that's the whole app.",
        components: [
          { type: "header", text: "Breathe" },
          { type: "image", text: "A calm ripple" },
          { type: "text", text: "In... and out..." },
          { type: "button", text: "End early" },
        ],
      },
      {
        title: "Streak",
        pitch: "Soft streaks — no guilt, just glow.",
        components: [
          { type: "header", text: "Your Streak" },
          { type: "text", text: "6 gentle days in a row." },
          { type: "list", items: ["Mon - 1 min", "Tue - 2 min", "Wed - 1 min"] },
          { type: "button", text: "Keep it going" },
        ],
      },
    ],
  },
  bold: {
    appName: "Momentum",
    tagline: "Crush your biggest goals",
    screens: [
      {
        title: "Goals",
        pitch: "Your week's three big rocks, front and center.",
        components: [
          { type: "header", text: "This Week" },
          { type: "list", items: ["Ship the landing page", "Run 3 times", "Read 50 pages"] },
          { type: "button", text: "Add a big rock" },
        ],
      },
      {
        title: "Progress",
        pitch: "Watch the bar fill and feel unstoppable.",
        components: [
          { type: "header", text: "Progress" },
          { type: "image", text: "68% of the week crushed" },
          { type: "text", text: "2 of 3 goals on track." },
          { type: "button", text: "Log progress" },
        ],
      },
      {
        title: "Win",
        pitch: "Celebrate loudly, then go again.",
        components: [
          { type: "header", text: "You did it!" },
          { type: "image", text: "Goal crushed" },
          { type: "text", text: "Landing page: shipped." },
          { type: "button", text: "Set next goal" },
        ],
      },
    ],
  },
}
