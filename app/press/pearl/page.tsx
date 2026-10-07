"use client"

import { motion } from "framer-motion"
import MemphisShape from "@/components/memphis-shape"
import { CONTACT_EMAIL } from "@/lib/site"

const BASE = "/press/pearl"
const APP_STORE_URL = "https://apps.apple.com/us/app/daily-affirmations-pearl/id1567837432"
const DUO_DEMO_URL = "https://youtu.be/ahjJST-dkPA"

type Asset = { file: string; caption: string; size: string; preview?: string }
type Group = { title: string; note: string; assets: Asset[] }

const GROUPS: Group[] = [
  {
    title: "App icon",
    note: "1024 × 1024 PNG",
    assets: [
      { file: "icon/pearl-icon-ios-1024.png", caption: "Full square (iOS rounds the corners itself)", size: "1024 × 1024", preview: "icon/pearl-icon-ios-1024.png" },
      { file: "icon/pearl-icon-mac-1024.png", caption: "Rounded Mac shape, transparent background", size: "1024 × 1024", preview: "icon/pearl-icon-mac-1024.png" },
    ],
  },
  {
    title: "iPhone",
    note: "iPhone 17 Pro Max, 1320 × 2868",
    assets: [
      { file: "iphone/pearl-iphone-1-notification.png", caption: "A Pearl arriving on the Lock Screen", size: "1320 × 2868" },
      { file: "iphone/pearl-iphone-2-my-pearls.png", caption: "My Pearls, with Strands as tabs", size: "1320 × 2868" },
      { file: "iphone/pearl-iphone-3-automatic-strand.png", caption: "An automatic Strand, generated on device", size: "1320 × 2868" },
      { file: "iphone/pearl-iphone-4-library.png", caption: "Pearl's Library of ready-made Strands", size: "1320 × 2868" },
      { file: "iphone/pearl-iphone-5-a-pearl.png", caption: "A single Pearl", size: "1320 × 2868" },
      { file: "iphone/pearl-iphone-6-strand-schedule.png", caption: "A Strand's schedule", size: "1320 × 2868" },
    ],
  },
  {
    title: "iPhone Duo",
    note: "From the iPhone Duo simulator, pre-release",
    assets: [
      { file: "iphone-duo/pearl-iphone-duo-1-folded.png", caption: "My Pearls, folded", size: "1508 × 1016" },
      { file: "iphone-duo/pearl-iphone-duo-2-open.png", caption: "My Pearls, open", size: "1508 × 1016" },
      { file: "iphone-duo/pearl-iphone-duo-3-open-a-pearl.png", caption: "A single Pearl, open", size: "1264 × 880" },
    ],
  },
  {
    title: "iPad",
    note: "iPad Pro 13\", 2752 × 2064",
    assets: [
      { file: "ipad/pearl-ipad-1-notification.png", caption: "A Pearl arriving as a banner", size: "2752 × 2064" },
      { file: "ipad/pearl-ipad-2-my-pearls.png", caption: "My Pearls", size: "2752 × 2064" },
      { file: "ipad/pearl-ipad-3-automatic-strand.png", caption: "An automatic Strand", size: "2752 × 2064" },
      { file: "ipad/pearl-ipad-4-library.png", caption: "Pearl's Library", size: "2752 × 2064" },
      { file: "ipad/pearl-ipad-5-a-pearl.png", caption: "A single Pearl", size: "2752 × 2064" },
      { file: "ipad/pearl-ipad-6-strand-schedule.png", caption: "A Strand's schedule", size: "2752 × 2064" },
    ],
  },
  {
    title: "Mac",
    note: "Window captures, 1800 × 1304",
    assets: [
      { file: "mac/pearl-mac-1-my-pearls.png", caption: "My Pearls", size: "1800 × 1304" },
      { file: "mac/pearl-mac-2-automatic-strand.png", caption: "An automatic Strand", size: "1800 × 1304" },
      { file: "mac/pearl-mac-3-library.png", caption: "Pearl's Library", size: "1800 × 1304" },
      { file: "mac/pearl-mac-4-a-pearl.png", caption: "A single Pearl", size: "1800 × 1304" },
      { file: "mac/pearl-mac-5-strand-schedule.png", caption: "A Strand's schedule", size: "1800 × 1304" },
    ],
  },
  {
    title: "Apple Watch",
    note: "Apple Watch Series 10, 416 × 496",
    assets: [
      { file: "apple-watch/pearl-watch-1.png", caption: "A Pearl on the wrist", size: "416 × 496" },
      { file: "apple-watch/pearl-watch-2.png", caption: "Another Pearl on the wrist", size: "416 × 496" },
      { file: "apple-watch/pearl-watch-3.png", caption: "A third Pearl on the wrist", size: "416 × 496" },
    ],
  },
]

const previewOf = (a: Asset) =>
  `${BASE}/${a.preview ?? `previews/${a.file.split("/").pop()!.replace(/\.png$/, ".jpg")}`}`

export default function PearlPressPage() {
  return (
    <div className="pt-32 pb-20 relative overflow-hidden min-h-screen">
      <div className="fixed -z-10 top-40 left-10 w-32 h-32 opacity-20">
        <MemphisShape type="circle" color="bg-primary" />
      </div>
      <div className="fixed -z-10 bottom-40 right-10 w-40 h-40 opacity-20">
        <MemphisShape type="triangle" color="bg-secondary" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Pearl <span className="text-accent">Press Kit</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Daily Affirmations: Pearl sends you a few words of encouragement at random moments in your day. Version
            3.0 adds Strands: groups of Pearls, each with its own schedule, which can write new Pearls on the device
            with Apple&apos;s Foundation Models. iPhone, iPad, Mac and Apple Watch, and optimized for iPhone Duo from
            October 23, 2026.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`${BASE}/Pearl-Press-Kit.zip`}
              className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Download everything (.zip, 18 MB)
            </a>
            <a href={APP_STORE_URL} className="rounded-full border-2 border-foreground px-8 py-3 font-medium">
              App Store
            </a>
            <a href={DUO_DEMO_URL} className="rounded-full border-2 border-foreground px-8 py-3 font-medium">
              iPhone Duo demo video
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto content-overlay rounded-lg p-8 md:p-12 space-y-12 text-muted-foreground"
        >
          <section className="space-y-2 text-lg">
            <p>
              All images are plain captures of the app, with no marketing text or device frames, and are free to use
              in coverage of Pearl. Quotes and photos shown are sample content. Free to download; $2.99/month,
              $14.99/year or $19.99 lifetime.
            </p>
            <p>
              Press contact: Matthew Waller,{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-secondary underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
              . A file list is in{" "}
              <a href={`${BASE}/README.txt`} className="text-secondary underline underline-offset-2">
                README.txt
              </a>
              .
            </p>
          </section>

          {GROUPS.map((group) => (
            <section key={group.title} className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl font-bold text-foreground">{group.title}</h2>
                <span className="text-sm">{group.note}</span>
              </div>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {group.assets.map((asset) => (
                  <a key={asset.file} href={`${BASE}/${asset.file}`} download className="group block space-y-2">
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted/40 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewOf(asset)}
                        alt={`Pearl: ${asset.caption}`}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-transform group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="text-sm text-foreground">{asset.caption}</p>
                    <p className="text-xs">PNG · {asset.size} · download</p>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
