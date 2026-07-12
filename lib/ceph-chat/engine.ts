import type {
  ChatCompletionMessageParam,
  InitProgressReport,
  MLCEngineInterface,
} from "@mlc-ai/web-llm"

export type BrainStatus = "idle" | "unsupported" | "loading" | "ready" | "error"

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string }

export type GenParams = { temperature: number; top_p: number; max_tokens: number }

export type EngineState = {
  status: BrainStatus
  progress: number
  statusText: string
  fromCache: boolean
  resuming: boolean
  modelId: string
}

export type GenerateJsonArgs<T> = {
  messages: ChatMessage[]
  schema: string
  params: GenParams
  retryParams: GenParams
  retryInstruction: string
  parse: (raw: string) => T | null
  signal?: AbortSignal
}

export const PRIMARY_MODEL_ID = "Qwen3-1.7B-q4f16_1-MLC"
export const FALLBACK_MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC"
// q4f16 model libs ship f16 WGSL kernels; adapters without shader-f16 need an f32 build.
const FALLBACK_MODEL_ID_F32 = "Qwen2.5-0.5B-Instruct-q4f32_1-MLC"

type GPUAdapterLike = { features: { has(name: string): boolean } }
type NavigatorConnection = { saveData?: boolean; effectiveType?: string }

let state: EngineState = {
  status: "idle",
  progress: 0,
  statusText: "",
  fromCache: false,
  resuming: false,
  modelId: PRIMARY_MODEL_ID,
}

const listeners = new Set<(s: EngineState) => void>()

function setState(patch: Partial<EngineState>) {
  state = { ...state, ...patch }
  for (const listener of listeners) listener(state)
}

export function getEngineState(): EngineState {
  return state
}

export function subscribeEngine(listener: (s: EngineState) => void): () => void {
  listeners.add(listener)
  listener(state)
  return () => {
    listeners.delete(listener)
  }
}

let adapterPromise: Promise<GPUAdapterLike | null> | null = null

function getAdapter(): Promise<GPUAdapterLike | null> {
  if (typeof window === "undefined") return Promise.resolve(null)
  if (!adapterPromise) {
    const gpu = (navigator as Navigator & {
      gpu?: { requestAdapter(): Promise<GPUAdapterLike | null> }
    }).gpu
    adapterPromise = gpu
      ? gpu.requestAdapter().then(
          (adapter) => adapter,
          () => null,
        )
      : Promise.resolve(null)
  }
  return adapterPromise
}

export async function isWebGPUSupported(): Promise<boolean> {
  const adapter = await getAdapter()
  const supported = adapter !== null
  if (!supported && state.status === "idle") {
    setState({ status: "unsupported" })
  }
  return supported
}

export function isSaveData(): boolean {
  if (typeof navigator === "undefined") return false
  const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection
  return connection?.saveData === true
}

async function pickInitialModelId(): Promise<string> {
  const adapter = await getAdapter()
  return adapter?.features.has("shader-f16") ? PRIMARY_MODEL_ID : FALLBACK_MODEL_ID_F32
}

// Probe web-llm's Cache Storage directly so the multi-MB library chunk is never
// downloaded just to decide against preloading.
async function cachedShardCount(modelId: string): Promise<number> {
  try {
    if (!("caches" in window)) return 0
    if (!(await window.caches.has("webllm/model"))) return 0
    const cache = await window.caches.open("webllm/model")
    const keys = await cache.keys()
    return keys.filter((req) => req.url.includes(modelId)).length
  } catch {
    return 0
  }
}

async function hasCachedModel(modelId: string): Promise<boolean> {
  return (await cachedShardCount(modelId)) > 0
}

export async function shouldAutoPreload(): Promise<boolean> {
  if (typeof window === "undefined") return false
  if (!(await isWebGPUSupported())) return false
  const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection
  const cheapGatesPass =
    !isSaveData() &&
    !/2g|3g/.test(connection?.effectiveType ?? "") &&
    window.matchMedia("(min-width: 768px)").matches &&
    window.matchMedia("(pointer: fine)").matches
  if (cheapGatesPass) return true
  // A cached model is a free preload even on mobile/data-saver
  return hasCachedModel(await pickInitialModelId())
}

let preloadScheduled = false

export function preloadWhenIdle(): void {
  if (typeof window === "undefined" || preloadScheduled) return
  preloadScheduled = true
  window.setTimeout(() => {
    const run = () => {
      void shouldAutoPreload().then((ok) => {
        if (ok) void ensureLoaded()
      })
    }
    const idle = (window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number
    }).requestIdleCallback
    if (typeof idle === "function") idle(run, { timeout: 2000 })
    else window.setTimeout(run, 2000)
  }, 3000)
}

let engine: MLCEngineInterface | null = null
let worker: Worker | null = null
let loadPromise: Promise<boolean> | null = null

function teardownEngine() {
  worker?.terminate()
  worker = null
  engine = null
}

async function createEngineFor(modelId: string): Promise<MLCEngineInterface> {
  const { CreateWebWorkerMLCEngine } = await import("@mlc-ai/web-llm")
  worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
  return CreateWebWorkerMLCEngine(worker, modelId, {
    initProgressCallback: (report: InitProgressReport) => {
      setState({
        progress: report.progress,
        statusText: report.text,
        fromCache: state.fromCache || report.text.startsWith("Loading model from cache"),
      })
    },
  })
}

async function load(): Promise<boolean> {
  if (!(await isWebGPUSupported())) {
    setState({ status: "unsupported", progress: 0, statusText: "" })
    return false
  }
  // Persistent storage keeps Chrome from evicting the ~1GB model cache under disk pressure
  try {
    void navigator.storage?.persist?.()
  } catch {
    // best-effort
  }
  const initial = await pickInitialModelId()
  const candidates =
    initial === PRIMARY_MODEL_ID ? [PRIMARY_MODEL_ID, FALLBACK_MODEL_ID] : [initial]
  let lastError = ""
  for (const modelId of candidates) {
    const shards = await cachedShardCount(modelId)
    console.info(`[Inky] ${modelId}: ${shards} cached shard(s) found${shards ? " — resuming/loading from cache" : " — fresh download"}`)
    setState({ status: "loading", modelId, progress: 0, statusText: "", fromCache: false, resuming: shards > 0 })
    try {
      engine = await createEngineFor(modelId)
      setState({ status: "ready", progress: 1 })
      return true
    } catch (err) {
      teardownEngine()
      lastError = err instanceof Error ? err.message : String(err)
    }
  }
  setState({
    status: "error",
    progress: 0,
    statusText: lastError || "Something went wrong loading the model.",
  })
  return false
}

export function ensureLoaded(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false)
  if (!loadPromise) loadPromise = load()
  return loadPromise
}

export function retryLoad(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false)
  if (state.status === "error") {
    loadPromise = null
    setState({ status: "idle", progress: 0, statusText: "", fromCache: false, resuming: false })
  }
  return ensureLoaded()
}

let queue: Promise<unknown> = Promise.resolve()

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(task, task)
  queue = result.catch(() => undefined)
  return result
}

async function requireEngine(): Promise<MLCEngineInterface> {
  const ok = await ensureLoaded()
  if (!ok || !engine) throw new Error(state.statusText || "The model is unavailable.")
  return engine
}

function toApiMessages(messages: ChatMessage[]): ChatCompletionMessageParam[] {
  return messages.map((m) => ({ role: m.role, content: m.content }) as ChatCompletionMessageParam)
}

// Qwen3 emits an empty "<think>\n\n</think>" block even with enable_thinking:false —
// strip it (and any unclosed think block) so tag junk never reaches the UI.
function stripThink(text: string): string {
  return text
    .replace(/^\s*<think>[\s\S]*?<\/think>\s*/i, "")
    .replace(/^\s*<think>[\s\S]*$/i, "")
    .trimStart()
}

// Streaming variant: hold tokens until we know the reply doesn't start with (or has
// exited) a think block, then pass deltas through untouched.
function createThinkFilter(onToken: (delta: string) => void): (delta: string) => void {
  let buf = ""
  let passthrough = false
  return (delta: string) => {
    if (passthrough) {
      onToken(delta)
      return
    }
    buf += delta
    const lead = buf.trimStart()
    if (!lead) return
    if (lead.length < 7 && "<think>".startsWith(lead)) return // could still become a think tag
    if (!lead.startsWith("<think>")) {
      passthrough = true
      onToken(lead)
      return
    }
    const close = lead.indexOf("</think>")
    if (close === -1) return // still inside the think block
    const after = lead.slice(close + "</think>".length).trimStart()
    passthrough = true
    if (after) onToken(after)
  }
}

export function streamChat(
  messages: ChatMessage[],
  params: GenParams,
  onToken: (delta: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  return enqueue(async () => {
    const eng = await requireEngine()
    if (signal?.aborted) return ""
    await eng.resetChat()
    let aborted = false
    const onAbort = () => {
      aborted = true
      eng.interruptGenerate()
    }
    signal?.addEventListener("abort", onAbort, { once: true })
    let text = ""
    const emit = createThinkFilter(onToken)
    try {
      const chunks = await eng.chat.completions.create({
        messages: toApiMessages(messages),
        stream: true,
        temperature: params.temperature,
        top_p: params.top_p,
        max_tokens: params.max_tokens,
        extra_body: { enable_thinking: false },
      })
      for await (const chunk of chunks) {
        const delta = chunk.choices[0]?.delta.content ?? ""
        if (delta) {
          text += delta
          emit(delta)
        }
      }
      return stripThink(text)
    } catch (err) {
      if (aborted) return stripThink(text)
      throw err
    } finally {
      signal?.removeEventListener("abort", onAbort)
    }
  })
}

export function generateText(
  messages: ChatMessage[],
  params: GenParams,
  signal?: AbortSignal,
): Promise<string> {
  return enqueue(async () => {
    const eng = await requireEngine()
    if (signal?.aborted) return ""
    await eng.resetChat()
    const onAbort = () => eng.interruptGenerate()
    signal?.addEventListener("abort", onAbort, { once: true })
    try {
      const reply = await eng.chat.completions.create({
        messages: toApiMessages(messages),
        stream: false,
        temperature: params.temperature,
        top_p: params.top_p,
        max_tokens: params.max_tokens,
        extra_body: { enable_thinking: false },
      })
      return stripThink(reply.choices[0]?.message.content ?? "")
    } finally {
      signal?.removeEventListener("abort", onAbort)
    }
  })
}

async function completeJson(
  eng: MLCEngineInterface,
  messages: ChatMessage[],
  schema: string,
  params: GenParams,
  signal?: AbortSignal,
): Promise<string> {
  await eng.resetChat()
  const onAbort = () => eng.interruptGenerate()
  signal?.addEventListener("abort", onAbort, { once: true })
  try {
    const reply = await eng.chat.completions.create({
      messages: toApiMessages(messages),
      stream: false,
      temperature: params.temperature,
      top_p: params.top_p,
      max_tokens: params.max_tokens,
      response_format: { type: "json_object", schema },
      extra_body: { enable_thinking: false },
    })
    return stripThink(reply.choices[0]?.message.content ?? "")
  } finally {
    signal?.removeEventListener("abort", onAbort)
  }
}

export function generateJson<T>(args: GenerateJsonArgs<T>): Promise<T | null> {
  return enqueue(async () => {
    const eng = await requireEngine()
    if (args.signal?.aborted) return null
    const first = await completeJson(eng, args.messages, args.schema, args.params, args.signal)
    if (args.signal?.aborted) return null
    const parsedFirst = args.parse(first)
    if (parsedFirst !== null) return parsedFirst
    const retryMessages: ChatMessage[] = [
      ...args.messages,
      { role: "assistant", content: first },
      { role: "user", content: args.retryInstruction },
    ]
    const second = await completeJson(eng, retryMessages, args.schema, args.retryParams, args.signal)
    if (args.signal?.aborted) return null
    return args.parse(second)
  })
}
