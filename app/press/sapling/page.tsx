"use client"

import { motion } from "framer-motion"
import MemphisShape from "@/components/memphis-shape"
import { CONTACT_EMAIL } from "@/lib/site"

const BASE = "/press/sapling"
const APP_STORE_URL = "https://apps.apple.com/de/app/3d-scanner-sapling/id6450019198"
const VIDEO_URL = `${BASE}/video/sapling-vorschau-iphone-de.mp4`

type Asset = { file: string; caption: string; size: string; preview?: string }
type Group = { title: string; note: string; assets: Asset[] }

const GROUPS: Group[] = [
  {
    title: "App-Icon",
    note: "PNG, 1024 × 1024",
    assets: [
      { file: "icon/sapling-icon-ios-1024.png", caption: "Volles Quadrat (iOS rundet die Ecken selbst ab)", size: "1024 × 1024", preview: "icon/sapling-icon-ios-1024.png" },
      { file: "icon/sapling-icon-mac-1024.png", caption: "Mac-Form, transparenter Hintergrund", size: "1024 × 1024", preview: "icon/sapling-icon-mac-1024.png" },
    ],
  },
  {
    title: "iPhone",
    note: "Deutsche Oberfläche, 1206 × 2622",
    assets: [
      { file: "iphone/sapling-iphone-1-scan-de.png", caption: "LiDAR-Scan: die Punktwolke wächst beim Umrunden", size: "1206 × 2622" },
      { file: "iphone/sapling-iphone-2-turntable-de.png", caption: "Drehteller-Modus: automatische Fotos, ganz ohne LiDAR", size: "1206 × 2622" },
      { file: "iphone/sapling-iphone-3-export-de.png", caption: "Modellhöhe festlegen und als STL, OBJ oder PLY exportieren", size: "1206 × 2622" },
    ],
  },
  {
    title: "iPad",
    note: "Deutsche Oberfläche, 2064 × 2752",
    assets: [
      { file: "ipad/sapling-ipad-1-scan-de.png", caption: "LiDAR-Scan", size: "2064 × 2752" },
      { file: "ipad/sapling-ipad-2-turntable-de.png", caption: "Drehteller-Modus", size: "2064 × 2752" },
      { file: "ipad/sapling-ipad-3-export-de.png", caption: "Modellhöhe und Export", size: "2064 × 2752" },
    ],
  },
  {
    title: "Modelle in AR",
    note: "Augmented Reality, sprachunabhängig",
    assets: [
      { file: "ar/sapling-ar-1-elephant.png", caption: "Zwei gescannte Holzelefanten in AR", size: "1668 × 2388" },
      { file: "ar/sapling-ar-2-ai-panda.png", caption: "Ein mit KI erstelltes Modell in AR", size: "1260 × 2736" },
    ],
  },
  {
    title: "App-Store-Screenshots (Deutsch)",
    note: "Mit Überschriften, wie im deutschen App Store",
    assets: [
      { file: "app-store-de/iphone/sapling-iphone-de-01-scan.png", caption: "iPhone: Scanne in 3D", size: "1284 × 2778" },
      { file: "app-store-de/iphone/sapling-iphone-de-02-results.png", caption: "iPhone: Beeindruckende Ergebnisse", size: "1284 × 2778" },
      { file: "app-store-de/iphone/sapling-iphone-de-03-turntable.png", caption: "iPhone: Drehteller für schnellere Scans", size: "1284 × 2778" },
      { file: "app-store-de/iphone/sapling-iphone-de-04-ai.png", caption: "iPhone: Objekte mit KI erstellen", size: "1284 × 2778" },
      { file: "app-store-de/iphone/sapling-iphone-de-05-export.png", caption: "iPhone: Exportiere für den 3D-Druck", size: "1284 × 2778" },
      { file: "app-store-de/ipad/sapling-ipad-de-01-scan.png", caption: "iPad: Scanne in 3D", size: "2064 × 2752" },
      { file: "app-store-de/ipad/sapling-ipad-de-02-results.png", caption: "iPad: Beeindruckende Ergebnisse", size: "2064 × 2752" },
      { file: "app-store-de/ipad/sapling-ipad-de-03-turntable.png", caption: "iPad: Drehteller für schnellere Scans", size: "2064 × 2752" },
      { file: "app-store-de/ipad/sapling-ipad-de-04-ai.png", caption: "iPad: Objekte mit KI erstellen", size: "2064 × 2752" },
      { file: "app-store-de/ipad/sapling-ipad-de-05-export.png", caption: "iPad: Exportiere für den 3D-Druck", size: "2064 × 2752" },
      { file: "app-store-de/mac/sapling-mac-de-01-create.png", caption: "Mac: Fotos in 3D-Modelle verwandeln", size: "2880 × 1800" },
      { file: "app-store-de/mac/sapling-mac-de-02-library.png", caption: "Mac: die Modellbibliothek", size: "2880 × 1800" },
      { file: "app-store-de/mac/sapling-mac-de-03-export.png", caption: "Mac: Export", size: "2880 × 1800" },
      { file: "app-store-de/mac/sapling-mac-de-04-ai.png", caption: "Mac: KI-Generierung", size: "2880 × 1800" },
    ],
  },
]

const previewOf = (a: Asset) =>
  `${BASE}/${a.preview ?? `previews/${a.file.split("/").pop()!.replace(/\.png$/, ".jpg")}`}`

export default function SaplingPressPage() {
  return (
    <div lang="de" className="pt-32 pb-20 relative overflow-hidden min-h-screen">
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
            Sapling <span className="text-accent">Pressekit</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            3D Scanner: Sapling verwandelt echte Objekte in detaillierte 3D-Modelle, direkt auf iPhone, iPad und Mac.
            Mit LiDAR geht man einmal um ein Objekt herum, ohne LiDAR hilft ein Drehteller. Die Modelle lassen sich in
            AR platzieren, auf ihre echte Größe bringen und als STL, OBJ, PLY oder USDZ exportieren. Version 2.2
            spricht Deutsch, Französisch, Spanisch, Japanisch, Chinesisch und Koreanisch.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`${BASE}/Sapling-Pressekit.zip`}
              className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Alles herunterladen (.zip, 39 MB)
            </a>
            <a href={APP_STORE_URL} className="rounded-full border-2 border-foreground px-8 py-3 font-medium">
              App Store
            </a>
            <a href={VIDEO_URL} className="rounded-full border-2 border-foreground px-8 py-3 font-medium">
              Vorschauvideo (Deutsch)
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
              Alle Bilder dürfen für die Berichterstattung über Sapling frei verwendet werden. Die Aufnahmen unter
              iPhone und iPad zeigen die App ohne Werbetext und ohne Geräterahmen. Kostenlos laden, der erste Scan ist
              gratis; die Vollversion kostet einmalig 22,99 €. KI-Generierung nutzt Tokens (Abo oder Token-Pakete).
            </p>
            <p>
              Pressekontakt: Matthew Waller,{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-secondary underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
              . Eine Dateiliste steht in{" "}
              <a href={`${BASE}/README.txt`} className="text-secondary underline underline-offset-2">
                README.txt
              </a>
              .
            </p>
            <p lang="en" className="text-base">
              English: press kit for Sapling, a 3D scanner for iPhone, iPad and Mac. The images show the German
              interface for the 2.2 localization release; all are free to use in coverage. Press contact as above.
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
                        alt={`Sapling: ${asset.caption}`}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-transform group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="text-sm text-foreground">{asset.caption}</p>
                    <p className="text-xs">PNG · {asset.size} · herunterladen</p>
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
