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
    if (!isHls || video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src
      return
    }

    // HLS streams (Apple App Store trailers) need hls.js outside Safari
    let hls: { destroy: () => void } | undefined
    let cancelled = false
    import("hls.js").then(({ default: Hls }) => {
      if (cancelled || !Hls.isSupported()) return
      const instance = new Hls()
      instance.loadSource(src)
      instance.attachMedia(video)
      hls = instance
    })

    return () => {
      cancelled = true
      hls?.destroy()
    }
  }, [src])

  return (
    <video
      ref={ref}
      controls
      playsInline
      preload="metadata"
      poster={poster ?? undefined}
      className={className ?? "w-full max-h-[70vh] rounded-lg"}
    />
  )
}
