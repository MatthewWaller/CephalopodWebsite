"use client"

import { useEffect, useRef } from "react"

type VideoPlayerProps = {
  src: string
  poster?: string | null
  className?: string
}

export default function VideoPlayer({ src, poster, className }: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const isHls = src.split(/[#?]/)[0].endsWith(".m3u8")
    if (!isHls) return // non-HLS sources are set via the src attribute in JSX

    // HLS streams (Apple App Store trailers): prefer hls.js wherever MSE is
    // available — canPlayType("application/vnd.apple.mpegurl") is unreliable
    // (Chrome answers "maybe" but then fails with MEDIA_ERR_SRC_NOT_SUPPORTED).
    // Fall back to native playback only where hls.js can't run (iOS Safari).
    let hls: { destroy: () => void } | undefined
    let cancelled = false
    import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return
      if (Hls.isSupported()) {
        const instance = new Hls()
        instance.loadSource(src)
        instance.attachMedia(video)
        hls = instance
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src
      }
    })

    return () => {
      cancelled = true
      hls?.destroy()
    }
  }, [src])

  const isHls = src.split(/[#?]/)[0].endsWith(".m3u8")

  return (
    <video
      ref={ref}
      controls
      playsInline
      preload="metadata"
      src={isHls ? undefined : src}
      poster={poster ?? undefined}
      className={className ?? "w-full max-h-[70vh] rounded-lg"}
    />
  )
}
