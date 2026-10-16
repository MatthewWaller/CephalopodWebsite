"use client"

import { motion } from "framer-motion"
import MemphisShape from "@/components/memphis-shape"
import { CONTACT_EMAIL } from "@/lib/site"

// One press kit in two languages. The German page (/press/sapling) is for the German
// localization press push; the English page (/press/sapling/en) is linked from the
// Sapling project page. Keep the two in step by editing COPY, not the markup.

const BASE = "/press/sapling"

export type Lang = "de" | "en"

type Asset = { file: string; caption: string; size: string; preview?: string }
type Group = { title: string; note: string; assets: Asset[] }

const COPY = {
  de: {
    title: "Pressekit",
    otherLang: { label: "English version", href: `${BASE}/en/` },
    intro:
      "3D Scanner: Sapling verwandelt echte Objekte in detaillierte 3D-Modelle, direkt auf iPhone, iPad und Mac. Mit LiDAR geht man einmal um ein Objekt herum, ohne LiDAR hilft ein Drehteller. Die Modelle lassen sich in AR platzieren, auf ihre echte Größe bringen und als STL, OBJ, PLY oder USDZ exportieren.",
    release:
      "Version 2.2 ist ab sofort im App Store und spricht Deutsch, Französisch, Spanisch, Japanisch, Chinesisch und Koreanisch.",
    zip: "Alles herunterladen (.zip, 39 MB)",
    zipFile: "Sapling-Pressekit.zip",
    appStore: "https://apps.apple.com/de/app/3d-scanner-sapling/id6450019198",
    video: { label: "Vorschauvideo (Deutsch)", file: "video/sapling-vorschau-iphone-de.mp4" },
    usage:
      "Alle Bilder dürfen für die Berichterstattung über Sapling frei verwendet werden. Die Aufnahmen unter iPhone und iPad zeigen die App ohne Werbetext und ohne Geräterahmen. Kostenlos laden, der erste Scan ist gratis; die Vollversion kostet einmalig 22,99 €. KI-Generierung nutzt Tokens (Abo oder Token-Pakete).",
    contact: "Pressekontakt: Matthew Waller,",
    fileList: "Eine Dateiliste steht in",
    readme: "README.txt",
    download: "herunterladen",
    groups: () => groups("de"),
  },
  en: {
    title: "Press Kit",
    otherLang: { label: "Deutsche Version", href: `${BASE}/` },
    intro:
      "3D Scanner: Sapling turns real-world objects into detailed 3D models, right on iPhone, iPad and Mac. With LiDAR you walk once around an object; without it, a turntable does the job. Models can be placed in AR, set to their real-world size, and exported as STL, OBJ, PLY or USDZ.",
    release:
      "Version 2.2 is out now on the App Store, in German, French, Spanish, Japanese, Chinese and Korean.",
    zip: "Download everything (.zip, 39 MB)",
    zipFile: "Sapling-Press-Kit.zip",
    appStore: "https://apps.apple.com/us/app/3d-scanner-sapling/id6450019198",
    video: { label: "Preview video", file: "video/sapling-preview-iphone-en.mp4" },
    usage:
      "All images are free to use in coverage of Sapling. The iPhone and iPad captures show the app with no marketing text or device frames. Free to download, and the first scan is free; the full version is a one-time $19.99. AI generation uses tokens (subscription or token packs).",
    contact: "Press contact: Matthew Waller,",
    fileList: "A file list is in",
    readme: "README-EN.txt",
    download: "download",
    groups: () => groups("en"),
  },
}

function groups(lang: Lang): Group[] {
  const de = lang === "de"
  const ui = de ? "Deutsche Oberfläche" : "English interface"
  const store = `app-store-${lang}`
  const shots = de
    ? ["Scanne in 3D", "Beeindruckende Ergebnisse", "Drehteller für schnellere Scans", "Objekte mit KI erstellen", "Exportiere für den 3D-Druck"]
    : ["Scan in 3D", "Impressive results", "Turntable for faster scans", "Create objects with AI", "Export for 3D printing"]
  const macShots = de
    ? ["Fotos in 3D-Modelle verwandeln", "die Modellbibliothek", "Export", "KI-Generierung"]
    : ["Turn photos into 3D models", "the model library", "Export", "AI generation"]
  const names = ["01-scan", "02-results", "03-turntable", "04-ai", "05-export"]
  const macNames = ["01-create", "02-library", "03-export", "04-ai"]
  return [
    {
      title: de ? "App-Icon" : "App icon",
      note: "PNG, 1024 × 1024",
      assets: [
        { file: "icon/sapling-icon-ios-1024.png", caption: de ? "Volles Quadrat (iOS rundet die Ecken selbst ab)" : "Full square (iOS rounds the corners itself)", size: "1024 × 1024", preview: "icon/sapling-icon-ios-1024.png" },
        { file: "icon/sapling-icon-mac-1024.png", caption: de ? "Mac-Form, transparenter Hintergrund" : "Rounded Mac shape, transparent background", size: "1024 × 1024", preview: "icon/sapling-icon-mac-1024.png" },
      ],
    },
    {
      title: "iPhone",
      note: `${ui}, 1206 × 2622`,
      assets: [
        { file: `iphone/sapling-iphone-1-scan-${lang}.png`, caption: de ? "LiDAR-Scan: die Punktwolke wächst beim Umrunden" : "LiDAR scan: the point cloud grows as you walk around", size: "1206 × 2622" },
        { file: `iphone/sapling-iphone-2-turntable-${lang}.png`, caption: de ? "Drehteller-Modus: automatische Fotos, ganz ohne LiDAR" : "Turntable mode: automatic photos, no LiDAR needed", size: "1206 × 2622" },
        { file: `iphone/sapling-iphone-3-export-${lang}.png`, caption: de ? "Modellhöhe festlegen und als STL, OBJ oder PLY exportieren" : "Set the model's height and export as STL, OBJ or PLY", size: "1206 × 2622" },
      ],
    },
    {
      title: "iPad",
      note: `${ui}, 2064 × 2752`,
      assets: [
        { file: `ipad/sapling-ipad-1-scan-${lang}.png`, caption: de ? "LiDAR-Scan" : "LiDAR scan", size: "2064 × 2752" },
        { file: `ipad/sapling-ipad-2-turntable-${lang}.png`, caption: de ? "Drehteller-Modus" : "Turntable mode", size: "2064 × 2752" },
        { file: `ipad/sapling-ipad-3-export-${lang}.png`, caption: de ? "Modellhöhe und Export" : "Model height and export", size: "2064 × 2752" },
      ],
    },
    {
      title: de ? "Modelle in AR" : "Models in AR",
      note: de ? "Augmented Reality, sprachunabhängig" : "Augmented reality, no text",
      assets: [
        { file: "ar/sapling-ar-1-elephant.png", caption: de ? "Zwei gescannte Holzelefanten in AR" : "Two scanned wooden elephants in AR", size: "1668 × 2388" },
        { file: "ar/sapling-ar-2-ai-panda.png", caption: de ? "Ein mit KI erstelltes Modell in AR" : "An AI-generated model in AR", size: "1260 × 2736" },
      ],
    },
    {
      title: de ? "App-Store-Screenshots (Deutsch)" : "App Store screenshots (English)",
      note: de ? "Mit Überschriften, wie im deutschen App Store" : "With headlines, as on the App Store",
      assets: [
        ...names.map((n, i) => ({ file: `${store}/iphone/sapling-iphone-${lang}-${n}.png`, caption: `iPhone: ${shots[i]}`, size: "1284 × 2778" })),
        ...names.map((n, i) => ({ file: `${store}/ipad/sapling-ipad-${lang}-${n}.png`, caption: `iPad: ${shots[i]}`, size: "2064 × 2752" })),
        ...macNames.map((n, i) => ({ file: `${store}/mac/sapling-mac-${lang}-${n}.png`, caption: `Mac: ${macShots[i]}`, size: "2880 × 1800" })),
      ],
    },
  ]
}

const previewOf = (a: Asset) =>
  `${BASE}/${a.preview ?? `previews/${a.file.split("/").pop()!.replace(/\.png$/, ".jpg")}`}`

export default function SaplingPressKit({ lang }: { lang: Lang }) {
  const c = COPY[lang]
  const link = "text-secondary underline underline-offset-2"
  return (
    <div lang={lang} className="pt-32 pb-20 relative overflow-hidden min-h-screen">
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
          <p className="mb-4 text-sm">
            <a href={c.otherLang.href} className={link}>
              {c.otherLang.label}
            </a>
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Sapling <span className="text-accent">{c.title}</span>
          </h1>
          <p className="text-lg text-muted-foreground">{c.intro}</p>
          <p className="mt-4 text-lg font-medium text-foreground">{c.release}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`${BASE}/${c.zipFile}`}
              className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {c.zip}
            </a>
            <a href={c.appStore} className="rounded-full border-2 border-foreground px-8 py-3 font-medium">
              App Store
            </a>
            <a href={`${BASE}/${c.video.file}`} className="rounded-full border-2 border-foreground px-8 py-3 font-medium">
              {c.video.label}
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
            <p>{c.usage}</p>
            <p>
              {c.contact}{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={link}>
                {CONTACT_EMAIL}
              </a>
              . {c.fileList}{" "}
              <a href={`${BASE}/${c.readme}`} className={link}>
                {c.readme}
              </a>
              .
            </p>
          </section>

          {c.groups().map((group) => (
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
                        alt={`Sapling: ${asset.caption}`}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-transform group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="text-sm text-foreground">{asset.caption}</p>
                    <p className="text-xs">PNG · {asset.size} · {c.download}</p>
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
