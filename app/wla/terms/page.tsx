import WlaPage, { A, List, Section, Sub } from "@/components/wla-page"
import { CONTACT_EMAIL } from "@/lib/site"

const mail = `mailto:${CONTACT_EMAIL}`

export default function WlaTermsPage() {
  return (
    <WlaPage
      title="Terms of"
      accent="Use"
      subtitle={
        <>
          Effective November 5, 2026
        </>
      }
    >
      <section className="space-y-4">
        <p>
          These terms are an agreement between you and Cephalopod Studio LLC (“Cephalopod Studio”, “we”, “us”)
          for the iOS app Weight Loss Adventures (the “App”). By downloading or using the App you agree to them. If you
          do not agree, do not use the App.
        </p>
        <p>
          These terms apply in addition to Apple’s{" "}
          <A href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">
            Licensed Application End User License Agreement
          </A>{" "}
          (the “Apple EULA”). Where the two conflict, these terms apply, to the extent the Apple EULA allows. Our{" "}
          <A href="/wla/privacy">Privacy Policy</A> explains how we handle your information.
        </p>
      </section>

      <Section title="Not medical advice">
        <p>
          The App is a food diary and a game. It is not a medical device and does not give medical, nutritional or
          dietary advice. The calorie target is an estimate from a standard formula (Mifflin–St Jeor) and the details
          you enter. Calorie and nutrition values, including AI estimates from text or photos, are approximate and can be
          wrong.
        </p>
        <p>
          Talk to a doctor or a registered dietitian before you start a diet or weight-loss plan, especially if you are
          pregnant or breastfeeding, have a medical condition, take medication, or have a history of disordered eating.
          Do not ignore professional advice, or delay getting it, because of something in the App. If you think you have
          a medical emergency, call your local emergency number.
        </p>
      </Section>

      <Section title="Who can use the App">
        <p>
          You must be at least 13 years old to create an account. If you are under the age of majority where you live, your parent or guardian must agree to these terms for
          you. You may not use the App if you have been banned from it, or if the law prohibits you from using it.
        </p>
      </Section>

      <Section title="Your license">
        <p>
          We grant you a personal, non-exclusive, non-transferable, revocable license to use the App on Apple devices
          that you own or control, as the App Store usage rules allow. You may not copy, modify, reverse-engineer,
          resell or redistribute the App, interfere with its servers, use bots or scripts to play, or try to get around
          its security or moderation. We and our licensors own the App, its story, characters, art and other content,
          and all rights not granted here are reserved.
        </p>
      </Section>

      <Section title="Your account">
        <p>
          The food tracker works without an account. Squads and expeditions need one. Keep your password secret and
          tell us at <A href={mail}>{CONTACT_EMAIL}</A> if you think someone else has used your account. You are
          responsible for what happens under it. Usernames must follow the conduct rules below, and we may reclaim or
          change a username that breaks them or impersonates someone.
        </p>
        <p>
          You can delete your account at any time in Settings › Account › Delete Account.
        </p>
      </Section>

      <Section title="Premium subscriptions">
        <p>
          Some features, such as AI meal logging and an ad-free experience, need a Premium subscription, purchased
          through Apple’s App Store.
        </p>
        <List>
          <li>
            <strong className="text-foreground">Price:</strong> the price and billing period are shown in the App before
            you buy, in your local currency. Payment is charged to your Apple ID when you confirm the purchase.
          </li>
          <li>
            <strong className="text-foreground">Auto-renewal:</strong> the subscription renews automatically at the same
            price for the same period (monthly or yearly) unless you turn off auto-renew at least 24 hours before the
            end of the current period. Your Apple ID is charged for the renewal within the 24 hours before the period
            ends.
          </li>
          <li>
            <strong className="text-foreground">Managing and cancelling:</strong> you can manage or cancel your
            subscription in your Apple ID settings (iOS Settings › your name › Subscriptions), or from Settings › Premium
            › Manage Subscription in the App. Cancelling stops the next renewal; you keep Premium until the end of the
            period you have paid for. Deleting the App or your account does not cancel a subscription.
          </li>
          <li>
            <strong className="text-foreground">Free trials and offers:</strong>{" "}
            Premium is $2.99 per month or $29.99 per year (prices may vary by region). New subscribers may be offered a
            3-day free trial. The trial converts to a paid subscription at the end unless you cancel at least 24 hours
            before the trial ends, and you are then charged the subscription price through your Apple ID. Any unused
            part of a free trial ends when you buy a subscription. Eligibility is decided by Apple.
          </li>
          <li>
            <strong className="text-foreground">Refunds:</strong> Apple handles all payments and refunds. You can request
            a refund at <A href="https://reportaproblem.apple.com">reportaproblem.apple.com</A>.
          </li>
          <li>
            <strong className="text-foreground">Price changes:</strong> if the price changes, Apple will tell you in
            advance and, where required, ask you to agree before renewing at the new price.
          </li>
        </List>
        <p>
          Money never affects the game. Premium does not buy dice, rolls, progress or any advantage in an expedition.
        </p>
      </Section>

      <Section title="The game">
        <p>
          Expeditions, dice, streaks, experience, bestiary cards and relics are for fun. They have no monetary or
          real-world value, cannot be bought, sold, traded or exchanged for money or anything else, and are not a
          prize. Dice come from checking in, streaks, weighing in and expedition levels, never from what you ate or how
          much you weigh. We may change, rebalance, reset or retire game content and regions.
        </p>
      </Section>

      <Section title="Squads, chat and your content">
        <p>
          You are responsible for what you post: usernames, bios, squad names and chat messages (your “Content”). You
          keep ownership of your Content. You give us a worldwide, royalty-free license to store, display and transmit
          it to the members of your squads, and to review and moderate it, for as long as we need to run the App.
        </p>
        <Sub>Zero tolerance for objectionable content</Sub>
        <p>
          We do not tolerate objectionable content or abusive users. Do not post or send anything that:
        </p>
        <List>
          <li>harasses, bullies, threatens or intimidates anyone, including comments about someone’s body or weight;</li>
          <li>is hateful or discriminatory, sexually explicit, or sexualizes minors;</li>
          <li>encourages self-harm, eating disorders or dangerous dieting;</li>
          <li>is violent, illegal, or promotes illegal activity;</li>
          <li>is spam, a scam, or an advertisement;</li>
          <li>impersonates someone else or shares someone’s private information without permission;</li>
          <li>infringes someone else’s intellectual property or other rights.</li>
        </List>
        <Sub>Reporting, blocking and enforcement</Sub>
        <p>
          You can report a message, a player or a squad, and block a player, from anywhere they appear in the App.
          Once you block a player, you no longer see their messages. Usernames, bios, squad names and chat messages are
          also checked automatically, and a person reviews reports. We aim to act on reports within 24 hours.
        </p>
        <p>
          We may remove any Content, and warn, mute, suspend or permanently ban any account, with or without notice, if
          we believe it breaks these terms or puts other players at risk. Repeated violations escalate. If you think we
          got it wrong, email <A href={mail}>{CONTACT_EMAIL}</A> with your report ID, which you can find in Settings ›
          My Reports.
        </p>
        <p>
          Other players’ Content is theirs, not ours, and we do not endorse it. Only invite people you know, and never
          share passwords, payment details or anything else you would not want a stranger to see.
        </p>
      </Section>

      <Section title="Ending these terms">
        <p>
          You can stop using the App and delete your account at any time. We may suspend or end your access if you break
          these terms, or if we stop offering the App or a feature. The sections on your Content license, the game,
          disclaimers, limitation of liability and governing law survive the end of these terms.
        </p>
      </Section>

      <Section title="Changes to the App and these terms">
        <p>
          We may change the App and these terms. If a change to the terms is significant, we will tell you in the App
          before it takes effect. If you keep using the App after a change takes effect, the new terms apply.
        </p>
      </Section>

      <Section title="Disclaimers">
        <p className="uppercase text-base">
          The App is provided “as is” and “as available”. To the fullest extent the law allows, we disclaim all
          warranties, express or implied, including merchantability, fitness for a particular purpose, accuracy and
          non-infringement. We do not promise that the App will be uninterrupted or error-free, that calorie, nutrition
          or AI estimates will be accurate, or that you will lose weight.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p className="uppercase text-base">
          To the fullest extent the law allows, Cephalopod Studio will not be liable for any indirect, incidental,
          special, consequential or punitive damages, or for any loss of data, health, profits or goodwill, arising from
          your use of the App or from other players’ Content. Our total liability for any claim about the App is limited
          to the greater of the amount you paid us for the App in the 12 months before the claim, or USD 50.
        </p>
        <p>
          Some places do not allow these exclusions or limits, so some of them may not apply to you. Nothing in these
          terms limits rights you have as a consumer that cannot be waived by contract.
        </p>
      </Section>

      <Section title="Indemnity">
        <p>
          You agree to compensate us for claims, losses and costs (including reasonable legal fees) that come from your
          Content or from your breach of these terms, to the extent the law allows.
        </p>
      </Section>

      <Section title="Governing law">
        <p>
          These terms are governed by the laws of the State of Texas, United States, without regard to its
          conflict-of-laws rules. Disputes will be resolved in the state or federal courts located in Travis County,
          Texas, unless the law where you live gives you the right to bring a
          claim in your local courts.
        </p>
      </Section>

      <Section title="Apple">
        <p>
          These terms are between you and Cephalopod Studio, not Apple. Apple is not responsible for the App or its
          content, has no obligation to provide maintenance or support for it, and is not responsible for any claims
          about it, including product liability, legal or regulatory claims, or intellectual property claims. If the App
          fails to meet an applicable warranty, you may notify Apple, and Apple will refund the purchase price, if any;
          Apple has no other warranty obligation. You confirm that you are not in a country subject to a US Government
          embargo and are not on a US Government list of prohibited or restricted parties. Apple and its subsidiaries
          are third-party beneficiaries of these terms and may enforce them against you.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Cephalopod Studio LLC · <A href={mail}>{CONTACT_EMAIL}</A> · 5900 Balcones Dr Ste 100, Austin, Texas
          78731-4298, United States
        </p>
      </Section>
    </WlaPage>
  )
}
