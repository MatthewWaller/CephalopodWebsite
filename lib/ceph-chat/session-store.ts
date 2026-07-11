// sessionStorage with in-memory fallback (Safari private mode etc.)
const mem = new Map<string, string>()

export function ssGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key) ?? mem.get(key) ?? null
  } catch {
    return mem.get(key) ?? null
  }
}

export function ssSet(key: string, value: string) {
  mem.set(key, value)
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // in-memory only
  }
}
