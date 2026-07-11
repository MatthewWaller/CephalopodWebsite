"use client"

import { useEffect, useMemo, useState } from "react"
import type { BrainStatus, ChatMessage, GenParams, GenerateJsonArgs } from "./engine"
import {
  ensureLoaded,
  generateJson,
  generateText,
  isSaveData,
  isWebGPUSupported,
  preloadWhenIdle,
  retryLoad,
  streamChat,
  subscribeEngine,
} from "./engine"

export type Brain = {
  status: BrainStatus
  progress: number
  statusText: string
  fromCache: boolean
  resuming: boolean
  saveData: boolean
  ensureLoaded: () => Promise<boolean>
  retryLoad: () => Promise<boolean>
  chat: (
    messages: ChatMessage[],
    params: GenParams,
    onToken: (d: string) => void,
    signal?: AbortSignal,
  ) => Promise<string>
  generateText: (messages: ChatMessage[], params: GenParams, signal?: AbortSignal) => Promise<string>
  generateJson: <T>(args: GenerateJsonArgs<T>) => Promise<T | null>
}

export function useBrain(opts?: { preload?: boolean }): Brain {
  const preload = opts?.preload === true
  const [state, setState] = useState<{
    status: BrainStatus
    progress: number
    statusText: string
    fromCache: boolean
    resuming: boolean
  }>({ status: "idle", progress: 0, statusText: "", fromCache: false, resuming: false })
  const [saveData, setSaveData] = useState(false)

  useEffect(() => {
    setSaveData(isSaveData())
    // flips shared engine state to "unsupported" if the capability check fails
    void isWebGPUSupported()
    const unsubscribe = subscribeEngine((s) => {
      setState({
        status: s.status,
        progress: s.progress,
        statusText: s.statusText,
        fromCache: s.fromCache,
        resuming: s.resuming,
      })
    })
    if (preload) preloadWhenIdle()
    return unsubscribe
  }, [preload])

  return useMemo<Brain>(
    () => ({
      status: state.status,
      progress: state.progress,
      statusText: state.statusText,
      fromCache: state.fromCache,
      resuming: state.resuming,
      saveData,
      ensureLoaded,
      retryLoad,
      chat: streamChat,
      generateText,
      generateJson,
    }),
    [state, saveData],
  )
}
