// Not legal advice: the owner should review this before publishing.
// Facts checked against the app (Quarrel repo): no network calls, analytics or tracking; progress in
// UserDefaults and local files; ARKit WorldTrackingProvider only in world visits, for the play-area
// edge hint (Immersive/WorldTour.swift); no ARKit hand tracking (dice use standard gestures); the
// support email fields come from Views/SupportInfo.swift.
import QuarrelPage, { A, List, Section } from "@/components/quarrel-page"
import { CONTACT_EMAIL } from "@/lib/site"

export default function QuarrelPrivacyPage() {
  return (
    <QuarrelPage title="Privacy" accent="Policy" subtitle="Effective November 6, 2026">
      <Section title="The short version">
        <p>
          Quarrel: The Far Watch collects no data. There is no account, no analytics, no advertising and no tracking.
          The app makes no network connections of its own, and everything it saves stays on your Apple Vision Pro.
        </p>
      </Section>

      <Section title="What stays on your device">
        <p>
          Your progress (the fighters in your hand, your decor, your fight record) and your settings are saved in the
          app&rsquo;s own storage on your Apple Vision Pro. We can&rsquo;t see it and it isn&rsquo;t uploaded anywhere
          by Quarrel. Settings › Reset Progress erases it, and deleting the app deletes it.
        </p>
        <p>
          If you back up your Vision Pro to iCloud, Apple may include this data in your device backup. That is handled
          by Apple under Apple&rsquo;s privacy policy, not by us.
        </p>
      </Section>

      <Section title="Your hands and your room">
        <p>
          You throw dice with the standard visionOS gestures, the same look, pinch and drag input every app receives.
          Quarrel doesn&rsquo;t use hand tracking and never receives camera images.
        </p>
        <p>
          When you visit a fighter&rsquo;s space or an arena, Quarrel uses ARKit world tracking to know where your head
          is in the room, only so it can fade in an outline on the floor as you near the edge of the play area. This is
          processed on your device while you play. It is not recorded, stored or sent anywhere.
        </p>
      </Section>

      <Section title="What we don&rsquo;t do">
        <List>
          <li>We don&rsquo;t collect personal information, or any other information.</li>
          <li>We don&rsquo;t use analytics, advertising or crash-reporting services.</li>
          <li>We don&rsquo;t share or sell data, because we don&rsquo;t have any.</li>
          <li>We don&rsquo;t track you across other apps or websites.</li>
        </List>
      </Section>

      <Section title="Crash reports from Apple">
        <p>
          If you choose to share analytics with app developers in your device&rsquo;s settings, or send feedback while
          testing through TestFlight, Apple may pass crash reports and your feedback on to us. Apple controls this and
          you can turn it off at any time. We use these reports only to fix problems in Quarrel.
        </p>
      </Section>

      <Section title="Contacting support">
        <p>
          If you email us, or use Settings › Contact Support in the app, we receive only what you send. The in-app email
          is pre-filled with your app version, visionOS version, device model, language and region, immersion setting,
          how many fighters and decor items you have, and the result of your last fight. You can edit or delete any of
          it before sending. We use your message only to reply to you.
        </p>
      </Section>

      <Section title="Children">
        <p>Quarrel collects no personal information from anyone, including children.</p>
      </Section>

      <Section title="Changes">
        <p>
          If this policy changes, we will post the new version here and update the effective date. If Quarrel ever adds a
          feature that collects data, this page will say so before that feature ships.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Cephalopod Studio is the developer of Quarrel. Questions about this policy:{" "}
          <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>.
        </p>
      </Section>
    </QuarrelPage>
  )
}
