// Not legal advice: the owner should review this before publishing.
import QuarrelPage, { A, Section } from "@/components/quarrel-page"
import { CONTACT_EMAIL } from "@/lib/site"

export default function QuarrelTermsPage() {
  return (
    <QuarrelPage title="Terms of" accent="Use" subtitle="Effective November 6, 2026">
      <Section title="Agreement">
        <p>
          These terms cover your use of Quarrel: The Far Watch (&ldquo;Quarrel&rdquo;), made by Cephalopod Studio
          (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By downloading or using Quarrel you agree to them.
        </p>
      </Section>

      <Section title="Apple&rsquo;s terms">
        <p>
          Quarrel is distributed through Apple. Apple&rsquo;s{" "}
          <A href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">
            Licensed Application End User License Agreement
          </A>{" "}
          and Apple&rsquo;s own media services terms apply in addition to these terms. If they conflict, Apple&rsquo;s
          terms control for the matters they cover.
        </p>
      </Section>

      <Section title="License">
        <p>
          You may use Quarrel on Apple devices you own or control, for your own personal, non-commercial entertainment.
          You may not copy, modify, reverse engineer or redistribute the app or its art, models, music or code, except
          where the law allows it.
        </p>
      </Section>

      <Section title="Play safely">
        <p>
          Fights are meant to be played seated. Visiting a fighter&rsquo;s space or an arena lets you walk around a play
          area, so clear the space first and stay aware of furniture, pets and people. Take breaks, and stop if you feel
          unwell. Follow Apple&rsquo;s health and safety guidance for Apple Vision Pro.
        </p>
      </Section>

      <Section title="Your privacy">
        <p>
          Quarrel collects no data. See the <A href="/quarrel/privacy">Privacy Policy</A>.
        </p>
      </Section>

      <Section title="No warranty">
        <p>
          Quarrel is provided &ldquo;as is&rdquo;, without warranties of any kind, to the extent the law allows. We
          don&rsquo;t promise it will be free of errors, and we are not liable for indirect or consequential damages
          arising from your use of it. Nothing in these terms limits rights you have under the laws of your country that
          can&rsquo;t be limited by agreement.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          We may update Quarrel and these terms. The current version is always at this address, with its effective date
          at the top.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions: <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>.
        </p>
      </Section>
    </QuarrelPage>
  )
}
