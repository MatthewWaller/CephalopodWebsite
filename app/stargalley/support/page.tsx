import type React from "react"
import StarGalleyPage, { A, Section } from "@/components/stargalley-page"
import { CONTACT_EMAIL } from "@/lib/site"

const mail = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Star Galley support")}`

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

export default function StarGalleySupportPage() {
  return (
    <StarGalleyPage title="Help &" accent="Support" subtitle="Questions, problems or feedback: we read every message.">
      <Section title="Contact us">
        <p>
          Email <A href={mail}>{CONTACT_EMAIL}</A>. The quickest way is from the app: Settings › About › Contact Us
          opens an email with your app version and device details already filled in, which helps us answer faster.
        </p>
        <p>
          To appeal a moderation decision, go to Settings › Account › My Reports, or email us with the report ID.
        </p>
      </Section>

      <Section title="Subscriptions">
        <Faq question="How do I restore my purchases?">
          <p>
            Open Settings › Premium › Restore Purchases, signed in with the same Apple ID you subscribed with. The
            paywall also has a Restore button. If you play with an account, signing in on a new device brings Premium
            with it.
          </p>
        </Faq>
        <Faq question="How do I cancel my subscription?">
          <p>
            Apple manages subscriptions. In the app, go to Settings › Premium › Manage Subscription, or on your iPhone
            open Settings › your name › Subscriptions › Star Galley and tap Cancel Subscription. Cancel at
            least 24 hours before the renewal date to avoid being charged for the next period. You keep Premium until
            the end of the period you paid for.
          </p>
          <p>
            Deleting the app or your account does not cancel a subscription. For refunds, go to{" "}
            <A href="https://reportaproblem.apple.com">reportaproblem.apple.com</A>.
          </p>
        </Faq>
      </Section>

      <Section title="Your account">
        <Faq question="Do I need an account?">
          <p>
            No. Logging meals, weighing in and tracking progress all work without one, and that data stays on your
            iPhone. You only need an account to join a squad and go on expeditions.
          </p>
        </Faq>
        <Faq question="How do I delete my account?">
          <p>
            In the app, go to Settings › Account › Delete Account and confirm. This deletes your profile and user data,
            releases your username, and removes you from your squads. Squads you created where you were the only human
            are deleted; if other members remain, the squad passes to one of them. If the app asks you to sign in again
            first, that’s a security check: sign in and try again.
          </p>
          <p>
            Your past chat messages stay in the squad but are anonymized: they show as “Deleted player”, with no link to
            your account. Moderation records are kept with your user ID replaced by “deleted-account”.
          </p>
          <p>
            Your meals and weigh-ins stay on your iPhone, because they were never uploaded. They remain there until you
            delete the app or use the reset option in Settings. Deleting your account doesn’t cancel a subscription (see
            above), and your RevenueCat subscriber record isn’t deleted automatically yet: email{" "}
            <A href={mail}>{CONTACT_EMAIL}</A> to have it removed.
          </p>
        </Faq>
      </Section>

      <Section title="Squads and the game">
        <Faq question="How do squads and invites work?">
          <p>
            A squad is a crew of up to 10 friends who go on expeditions together. Start one from the Squad tab, then tap
            Create Invite Code. Friends can scan the QR code, tap the link you share, or type the code in Join with
            Invite Code. Squads are invite-only, and you can be in more than one: a single daily check-in counts for all
            of them.
          </p>
          <p>
            Joining shares only whether you checked in each day. Your food and weight stay private unless you choose
            to share them, squad by squad, in that squad’s share settings.
          </p>
        </Faq>
        <Faq question="Who are the androids?">
          <p>
            The androids (IRIS, ECHO and ONYX) are robot crewmates who fill empty seats, so you can start an expedition
            on your own. They followed Ges out of the war and roll their share of dice every day. As friends join, they
            take the androids’ seats; if your crew drops below four, the androids step back in.
          </p>
        </Faq>
        <Faq question="Why don’t the dice depend on what I ate?">
          <p>
            On purpose. Your dice come from showing up: checking in each day, keeping a streak, weighing in, and
            levelling up on the expedition. Calories, macros and your weight never change a roll, and neither does
            money.
          </p>
          <p>
            A game that rewarded eating less would push people to under-report or under-eat. We want you to log
            honestly, including the hard days, and still help your crew. A big dinner never costs your squad a roll.
          </p>
        </Faq>
      </Section>

      <Section title="Apple Health">
        <Faq question="How do I turn Apple Health on or off?">
          <p>
            The app asks for permission the first time you open Progress. To change it later, open the Health app, tap
            your profile picture, then Apps › Star Galley. You can also go to Settings in the app › Health, which links
            straight there.
          </p>
          <p>
            The app reads weight, height, steps, energy and workouts, and writes the weigh-ins and meals you log. Your
            Health data stays on your iPhone: your weight and other Health values are never uploaded or shared with your
            squad. One exception: a weigh-in imported from Apple Health counts toward the squad weigh-in bonus, and only
            a yes-or-no “weighed in that day” leaves your device. Shared squad weight stats use only weigh-ins you entered
            in the app.
          </p>
        </Faq>
        <Faq question="My weigh-ins or meals aren’t showing up in Health.">
          <p>
            Check that writing is allowed for Weight and the nutrition types in the Health app (Apps › Star Galley). The
            app only writes entries you make after access is granted.
          </p>
        </Faq>
      </Section>

      <Section title="Safety">
        <Faq question="How do I report or block a player?">
          <p>
            In squad chat, touch and hold a message, then choose Report or Block User. You can also report or block a
            player from their entry in the squad’s member list, and report a whole squad from the squad’s page.
          </p>
          <p>
            A person reviews every report, and you can follow yours in Settings › Account › My Reports. Manage the
            people you’ve blocked in Settings › Account › Blocked Players. If someone is in danger, contact your local
            emergency services first.
          </p>
        </Faq>
      </Section>

      <section className="space-y-4">
        <p>
          Read the <A href="/stargalley/privacy">Privacy Policy</A> and the <A href="/stargalley/terms">Terms of Use</A>.
        </p>
      </section>
    </StarGalleyPage>
  )
}
