import type React from "react"
import QuarrelPage, { A, List, Section } from "@/components/quarrel-page"
import { CONTACT_EMAIL } from "@/lib/site"

const mail = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Quarrel support")}`

function Faq({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-border pb-4">
      <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-foreground font-semibold">
        <span>{question}</span>
        <span aria-hidden className="text-primary transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="mt-3 space-y-3">{children}</div>
    </details>
  )
}

export default function QuarrelSupportPage() {
  return (
    <QuarrelPage title="Help &" accent="Support" subtitle="Questions, problems or feedback: we read every message.">
      <Section title="Contact us">
        <p>
          Email <A href={mail}>{CONTACT_EMAIL}</A>. The quickest way is from the app: Settings › Contact Support opens an
          email with your app and visionOS versions and a few game details already filled in, which helps us answer
          faster. You can edit any of it before you send.
        </p>
      </Section>

      <Section title="Requirements">
        <List>
          <li>Apple Vision Pro</li>
          <li>visionOS 27 or later</li>
        </List>
      </Section>

      <Section title="Playing">
        <Faq question="How do I throw the dice?">
          <p>
            Look at a die, pinch to pick it up, then flick your hand and let go. Attack dice power your fighter&rsquo;s
            strikes and defense dice power their guard. The higher the roll, the stronger the move: a big attack roll
            becomes a heavy attack or a special move.
          </p>
        </Faq>
        <Faq question="How do I get more fighters?">
          <p>
            You start with Bram Kowalski and Gorrhak. As you keep fighting, rivals arrive in story order to challenge
            you. Beat one and they join your hand, opening their own space and their people&rsquo;s arena to visit.
          </p>
        </Faq>
        <Faq question="What is the difference between full immersion and playing in my room?">
          <p>
            With Full immersion off, the table and the fight appear in your own room. With it on, your room is replaced
            by the arena. Switch with the Full immersion toggle on the main window, before you start a fight.
          </p>
        </Faq>
        <Faq question="How much space do I need?">
          <p>
            Fights are played seated, so you don&rsquo;t need to move. When you visit a fighter&rsquo;s space or an
            arena you can walk around a play area of a few metres, and a faint line appears on the floor as you near its
            edge. Clear the floor first, and stay aware of furniture, pets and people.
          </p>
        </Faq>
      </Section>

      <Section title="Accessibility">
        <Faq question="I can't pinch or throw. Is there another way to roll?">
          <p>
            Yes. The fight panel has Roll attack and Roll defense buttons that do exactly what throwing the die does.
            They are standard buttons, so you can select them however you normally select things in visionOS.
          </p>
        </Faq>
        <Faq question="The effects are too much. Can I tone them down?">
          <p>
            Turn on Settings › Accessibility › Reduce effects for calmer flashes, fewer particles, shorter fighter
            entrances and no slow motion. Quarrel also follows the system Reduce Motion setting.
          </p>
        </Faq>
      </Section>

      <Section title="Your progress">
        <Faq question="Where is my progress stored?">
          <p>
            Only on your Apple Vision Pro. Your fighters, decor and fight record are saved on the device; there is no
            account and no cloud copy. Deleting the app deletes your progress.
          </p>
        </Faq>
        <Faq question="How do I reset my progress?">
          <p>
            Leave any fight or world visit first, then open Settings from the main window and choose Reset Progress and
            confirm. Your fighters, decor and fight history are erased and you start again with Kowalski and Gorrhak.
            This can&rsquo;t be undone.
          </p>
        </Faq>
      </Section>

      <section className="space-y-4">
        <p>
          Read the <A href="/quarrel/privacy">Privacy Policy</A> and the <A href="/quarrel/terms">Terms of Use</A>.
        </p>
      </section>
    </QuarrelPage>
  )
}
