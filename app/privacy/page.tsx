"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import MemphisShape from "@/components/memphis-shape"
import { CONTACT_EMAIL } from "@/lib/site"

export default function PrivacyPage() {
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
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Privacy <span className="text-accent">Policy</span>
          </h1>
          <p className="text-lg text-muted-foreground">Last updated September 24, 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto content-overlay rounded-lg p-8 md:p-12 space-y-10 text-lg text-muted-foreground"
        >
          <section className="space-y-4">
            <p>
              Cephalopod Studio (“we”) makes software, including the apps listed on this site. This policy describes
              how we handle information on cephalopod.studio and in those apps. It covers{" "}
              <Link href="/projects/3d-scanner-sapling" className="text-secondary underline underline-offset-2">
                Sapling 3D Scanner
              </Link>{" "}
              along with the rest of our work. Some apps collect less than others; where an app page says something
              more specific, that description applies to that app.
            </p>
            <p>
              Questions:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-secondary underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">This website</h2>
            <p>
              cephalopod.studio does not require an account. We do not run analytics or advertising trackers on the
              site. If you email us, we use that message to reply. Our hosting provider may process ordinary server
              logs, such as IP address, browser type, and the pages requested, to operate the site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Sapling 3D Scanner</h2>
            <p>
              Photogrammetry and LiDAR scanning are processed on your device. Models and scans created that way stay
              on your device unless you choose a feature that sends data to someone else.
            </p>
            <h3 className="text-xl font-semibold text-foreground">Accounts</h3>
            <p>
              If you create an account, Sapling uses third-party services to create and sign in to that account. The
              information you submit for account creation — such as your email address and sign-in credentials — is
              shared with those third parties. They process it to provide the account, under their own privacy
              policies.
            </p>
            <h3 className="text-xl font-semibold text-foreground">AI features</h3>
            <p>
              AI features, including text-to-3D, are provided by third parties. When you use them, the content you
              submit — such as text prompts and other generation inputs — is sent to those providers. They use that
              data to produce the result, and they may retain or otherwise use it under their own terms and privacy
              policies, including to operate or improve their services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Other apps</h2>
            <p>
              Practices differ by app. Some apps keep data on your device and do not use third-party analytics. Others
              send prompts or other content to third-party AI providers, or use third-party analytics to understand
              how the app is used. Each project page states what that app does. RunPal is covered by its own policy at{" "}
              <a href="https://runpal.fit/privacy" className="text-secondary underline underline-offset-2">
                runpal.fit/privacy
              </a>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">What we do not do</h2>
            <p>We do not sell your personal information.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Changes</h2>
            <p>
              If this policy changes, we will update this page and the date at the top. Continued use of the site or
              an app after a change means the updated policy applies.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}
