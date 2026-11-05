import StarGalleyPage, { A, List, Section, Sub } from "@/components/stargalley-page"
import { CONTACT_EMAIL } from "@/lib/site"

const mail = `mailto:${CONTACT_EMAIL}`

export default function StarGalleyPrivacyPage() {
  return (
    <StarGalleyPage
      title="Privacy"
      accent="Policy"
      subtitle={
        <>
          Effective November 5, 2026
        </>
      }
    >
      <section className="space-y-4">
        <p>
          This policy explains how the iOS app Star Galley (listed on the App Store as “Star Galley: Calorie Quest”)
          handles your information. The app is made by Cephalopod Studio LLC (“Cephalopod Studio”), which is the
          controller of the personal information described here. “We” and “us” mean Cephalopod Studio.
        </p>
        <p>
          Questions or requests: <A href={mail}>{CONTACT_EMAIL}</A>. Postal address:{" "}
          Cephalopod Studio LLC, 5900 Balcones Dr Ste 100, Austin, Texas 78731-4298, United States.
        </p>
      </section>

      <Section title="The short version">
        <List>
          <li>Diet tracking works without an account. Your meals, weight and targets stay on your iPhone.</li>
          <li>Apple Health data is read and written on your iPhone. We never upload your Health data and never use it for ads. A weigh-in imported from Health can count toward a squad bonus, and only a yes-or-no “weighed in” leaves your device.</li>
          <li>
            An account is optional and only needed to play with a squad. It stores an email address, a username and
            what you do in your squads. Squad chat is checked automatically for abuse.
          </li>
          <li>You choose, squad by squad, whether to share any diet numbers. Every share setting starts off.</li>
          <li>
            AI meal logging (premium) sends the text or photo you submit to Google’s Gemini to estimate nutrition,
            unless Apple’s on-device model can handle it.
          </li>
          <li>
            The free version shows Google AdMob ads. They are personalized only if you allow tracking. Advertisers never
            receive your health data.
          </li>
          <li>We do not sell your personal information.</li>
        </List>
      </Section>

      <Section title="What stays on your iPhone">
        <p>
          When you set up the app you enter your age, sex, height, starting and goal weight, activity level and weekly
          goal. The app uses them to estimate a daily calorie target. Those details, every meal you log (names, calories
          and macros), and every weigh-in are stored on your device with Apple’s SwiftData. The app does not upload them
          to our servers, and you can use the tracker without signing in.
        </p>
        <p>
          Deleting the app removes this data, and Settings in the app can reset it.{" "}
          We never sync this data to iCloud or to our servers. Like any app’s data, it is included in your
          device’s own iCloud or computer backup if you have one turned on.
        </p>
      </Section>

      <Section title="Apple Health">
        <p>If you allow it, the app reads and writes Apple Health data on your device.</p>
        <List>
          <li>It reads weight, height, steps, active and resting energy, workouts, and the nutrition you have logged.</li>
          <li>It writes the weigh-ins and meals (calories, protein, carbohydrates and fat) that you log in the app.</li>
        </List>
        <p>
          Health data is used only to keep your Progress screen and targets up to date, and to work out whether you
          weighed in on a given day. We never upload your weight or any other Health value to our servers, never use
          Health data for advertising or marketing, and never sell it or give it to advertisers or data brokers. One
          thing derived from Health does leave your device: a weigh-in imported from Apple Health counts toward the
          squad weigh-in bonus, so if you have an account, the app records a yes-or-no “weighed in that day” flag on our
          servers. The weight itself, and every other Health value, stays on your device. The weight-change stat you
          can share with a squad uses only weigh-ins you entered in the app, never ones imported from Apple Health.
        </p>
        <p>
          You can change or withdraw Health access at any time in the Health app (Sharing › Apps) or in iOS Settings.
        </p>
      </Section>

      <Section title="If you create an account">
        <p>
          Squads and expeditions need an account. Signing in is optional, and the tracker works the same without it.
          With an account, we store the following with Google Firebase:
        </p>
        <List>
          <li>
            <strong className="text-foreground">Sign-in:</strong> your email address and password, handled by Firebase
            Authentication. We never see your password.
          </li>
          <li>
            <strong className="text-foreground">Public profile:</strong> your username, the character art you pick, and an
            optional bio. Your real name, email, weight, goals and food log are never part of your profile.
          </li>
          <li>
            <strong className="text-foreground">Squad play:</strong> the squads you belong to and their names, your seat,
            your time zone, the days you checked in, whether you weighed in that day (yes or no), your streak, your dice
            throws, expedition progress, and the invites you create.
          </li>
          <li>
            <strong className="text-foreground">Chat:</strong> the messages you send in squad chat and the reactions you
            add.
          </li>
          <li>
            <strong className="text-foreground">Safety:</strong> the reports you file, the players you block, and any
            moderation records about your account (see below).
          </li>
          <li>
            <strong className="text-foreground">Notifications:</strong> a push token for each device, so we can deliver
            chat and game notifications through Firebase Cloud Messaging. The daily reminder before your squad’s roll is
            scheduled on your device and stores nothing on our servers.
          </li>
        </List>
        <Sub>What your squadmates see</Sub>
        <p>
          Members of a squad see each other’s username, character art and bio, who has checked in today, chat
          messages, and whatever you have chosen to share with that squad.
        </p>
        <Sub>Shared stats (off unless you turn them on)</Sub>
        <p>
          For each squad, you can choose to share any of these. All of them start off, and the setting is separate for
          every squad:
        </p>
        <List>
          <li>your adherence over the last 7 days (the percent of logged days at or under your target);</li>
          <li>today’s calories and your calorie target;</li>
          <li>today’s protein, carbohydrates and fat;</li>
          <li>
            your weight progress, shared only as the change since you started and never as your weight. It uses only
            weigh-ins you entered in the app, never ones from Apple Health;
          </li>
          <li>today’s food log (up to 30 food names with their calories).</li>
        </List>
        <p>When you turn a setting off, the app stops sending that information to the squad.</p>
      </Section>

      <Section title="Moderation">
        <p>
          To keep squads safe, usernames, bios, squad names and chat messages are checked automatically by Google’s
          Gemini model, running on Google Cloud Vertex AI for us. Usernames are checked before they are saved; chat
          messages are checked just after they are posted. If the check flags something, we keep the first 120
          characters, the reason and the sender’s account ID in a review queue. Content that breaks the rules can be
          removed, and repeated violations add strikes to an account, leading to a mute, suspension or ban.
        </p>
        <p>
          When you report a message, a player or a squad, we receive the report, the reason you gave, and a reference to
          what you reported, and a person at Cephalopod Studio reviews it. You can follow your reports in Settings › My
          Reports.
        </p>
      </Section>

      <Section title="AI meal logging (premium)">
        <p>
          With premium, you can describe a meal in your own words or photograph it, and the app estimates its calories
          and macros. When Apple Intelligence is available on your device, typed descriptions are handled by Apple’s
          on-device Foundation Models and never leave your iPhone. Otherwise, and for every photo, the text or photo is
          sent to Google’s Gemini model through Firebase AI Logic to produce the estimate. This also applies to meals
          you log with Siri.
        </p>
        <p>
          We do not store those descriptions or photos on our servers. Google processes them through the paid Gemini
          API to return the result. Under Google’s{" "}
          <A href="https://ai.google.dev/gemini-api/terms">Gemini API terms</A> for paid services, Google does not use
          them to improve its products, and it logs them only for a limited time, solely to detect and prevent abuse
          and for any legally required disclosures.
        </p>
      </Section>

      <Section title="Ads in the free version">
        <p>
          The free version shows ads from Google AdMob. Premium removes them. Where the law requires it (for example in
          the EEA, the UK and some US states), the app first asks for your consent with Google’s User Messaging Platform.
          After your first check-in, iOS asks whether the app may track you. If you allow it, ads can be personalized.
          If you don’t, the app asks Google for non-personalized ads only.
        </p>
        <p>
          AdMob collects information such as your device’s advertising identifier (only if you allow tracking), your
          approximate location from your IP address, ad views and taps, and diagnostic data. Google uses it under its
          own{" "}
          <A href="https://policies.google.com/technologies/partner-sites">policies</A>. Our ad requests contain no
          health data: no meals, calories, weight, keywords or targeting of any kind.
        </p>
        <p>
          You can change the tracking setting at any time in iOS Settings › Privacy &amp; Security › Tracking.{" "}
          Where the consent form applies (for example in the EEA and the UK), you can reopen it any time from
          Settings › About › Privacy Choices in the app.
        </p>
      </Section>

      <Section title="Analytics and crash reports">
        <p>
          We use Firebase Analytics to count a few milestones, such as finishing onboarding, logging a first meal, the
          first check-in, creating a squad and sending an invite. These events carry no health values. We also use
          Firebase Crashlytics to receive crash reports. A report includes the device model, iOS version, app version
          and what the app was doing when it crashed. We use them to fix bugs and improve the app.
        </p>
      </Section>

      <Section title="Subscriptions">
        <p>
          Apple processes all payments. We never see your payment details. We use RevenueCat to check your subscription
          status. RevenueCat receives your purchase history from Apple and an ID for you. If you are signed in, that ID
          is your account ID, so premium follows you to a new device.
        </p>
      </Section>

      <Section title="Who we share information with">
        <p>
          We share information only with the service providers that run parts of the app for us, and only as this
          policy describes:
        </p>
        <List>
          <li>
            <strong className="text-foreground">Google</strong> (Firebase Authentication, Cloud Firestore, Cloud
            Functions, Cloud Messaging, Analytics, Crashlytics, AI Logic, Vertex AI and AdMob):{" "}
            <A href="https://policies.google.com/privacy">Google Privacy Policy</A>,{" "}
            <A href="https://firebase.google.com/support/privacy">Firebase privacy</A>.
          </li>
          <li>
            <strong className="text-foreground">RevenueCat</strong> (subscription status):{" "}
            <A href="https://www.revenuecat.com/privacy">RevenueCat Privacy Policy</A>.
          </li>
          <li>
            <strong className="text-foreground">Apple</strong> (App Store purchases, Apple Health, Siri and on-device
            Foundation Models): <A href="https://www.apple.com/legal/privacy/">Apple Privacy Policy</A>.
          </li>
        </List>
        <p>
          We may also disclose information if the law requires it, to protect someone’s safety, or as part of a sale or
          merger of the business, in which case this policy continues to apply to it.
        </p>
        <p>
          We do not sell your personal information. We only “share” it for cross-context behavioral advertising, in the
          sense of the California privacy laws, if you allow tracking. You can opt out by declining or turning off
          tracking.
        </p>
      </Section>

      <Section title="Where your information is stored">
        <p>
          Account and squad data is stored on Google Cloud in the United States. If you live elsewhere, your
          information is transferred to the United States and processed there, with the safeguards our providers offer,
          such as the EU Standard Contractual Clauses.
        </p>
      </Section>

      <Section title="Why we use it (legal bases)">
        <p>Where the GDPR or similar laws apply, we rely on:</p>
        <List>
          <li>
            <strong className="text-foreground">Providing the app you asked for</strong>: your account, squads, chat,
            subscriptions and AI meal logging;
          </li>
          <li>
            <strong className="text-foreground">Your consent</strong>: Apple Health access, shared stats, push
            notifications, personalized ads and tracking. You can withdraw consent at any time;
          </li>
          <li>
            <strong className="text-foreground">Our legitimate interests</strong>: keeping squads safe through
            moderation, fixing crashes, and understanding which parts of the app are used;
          </li>
          <li>
            <strong className="text-foreground">Legal obligations</strong>, where they apply.
          </li>
        </List>
        <p>
          Your diet and Health data are sensitive. We process them on your device, and anything you share with a squad
          leaves the device only because you turned that setting on.
        </p>
      </Section>

      <Section title="How long we keep it">
        <List>
          <li>On-device data stays until you reset it in Settings or delete the app.</li>
          <li>Account and squad data stays until you delete your account.</li>
          <li>
            Our database backups expire automatically after 14 days, so deleted data can remain in a backup for up to
            that long.
          </li>
          <li>
            Reports, moderation review records and moderation action logs are deleted automatically 60 days after they
            are created. A report still awaiting review is kept until it is reviewed, and never longer than 90 days.
            The one exception is the record of an active restriction on an account (a mute, suspension or ban), which
            we keep until the restriction ends or the account is deleted.
          </li>
          <li>Analytics data is kept for 2 months.</li>
          <li>
            If you sign up on our website to hear when the app launches, your email address is stored in a Google
            Form that only we can see. We use it only to tell you about the launch and delete it when you ask.
          </li>
        </List>
      </Section>

      <Section title="Deleting your account">
        <p>
          You can delete your account in the app: Settings › Account › Delete Account. This deletes your profile and
          all of your user data: your username (which is released), today’s dice, invites, strikes, shared stats,
          reactions, readiness, and your sign-in account. It also deletes squads you created where you were the only
          human. A squad you created that still has other members passes to another member.
        </p>
        <p>Some things are anonymized rather than deleted, so squads and safety records stay intact:</p>
        <List>
          <li>
            Chat messages you wrote stay in the squad, shown as “Deleted player”, with no link to your account. System
            lines that named you say “Deleted player” too.
          </li>
          <li>
            Moderation records (reports, queue items and actions) are kept with your user ID replaced by
            “deleted-account”.
          </li>
          <li>Past game results stay under a seat identifier that no longer links to anyone.</li>
        </List>
        <p>
          Your RevenueCat subscriber record is not deleted automatically yet. To have it deleted, email{" "}
          <A href={mail}>{CONTACT_EMAIL}</A>. Deleting your account does not cancel a subscription: cancel it in your
          Apple ID settings. Meals and weigh-ins on your iPhone are not affected, because they were never uploaded;
          they stay on your device until you delete the app.
        </p>
        <p>
          You can also email <A href={mail}>{CONTACT_EMAIL}</A> from the address on your account and we will delete it
          for you.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          Depending on where you live (including under the GDPR, the UK GDPR and California and other US state laws), you
          may have the right to access, correct, delete or receive a copy of your personal information, to object to or
          restrict how we use it, and to withdraw consent. To make a request, email{" "}
          <A href={mail}>{CONTACT_EMAIL}</A>. We may need to confirm that the account is yours, and we will respond
          within the time the law requires. We will not treat you differently for using these rights. You may also
          complain to your local data protection authority.
        </p>
        <p>
          Most of what the app knows about your diet is only on your iPhone, so we cannot access it or send you a copy.
          You can see and delete it in the app at any time.
        </p>
      </Section>

      <Section title="Children">
        <p>
          The app is not directed to children under 13, and you must be at least 13 to create an account. If you are
          under the age of majority where you live, a parent or guardian must agree to our <A href="/stargalley/terms">Terms of Use</A> for you. If we learn that we
          have collected personal information from a child under 13, we will delete it. If you think that has happened,
          email <A href={mail}>{CONTACT_EMAIL}</A>.
        </p>
      </Section>

      <Section title="Security">
        <p>
          Information is encrypted in transit, and our database is protected by access rules that let only you and your
          squads read your data. No system is perfectly secure, but we take reasonable steps to protect what we hold.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          If this policy changes, we will update this page and the date at the top. If the change is significant, we
          will tell you in the app before it takes effect.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Cephalopod Studio LLC · <A href={mail}>{CONTACT_EMAIL}</A>
        </p>
      </Section>
    </StarGalleyPage>
  )
}
