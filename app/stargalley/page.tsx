import Link from "next/link"
import { ArrowDown, ArrowUp, ArrowUpRight, Dices, Gift, HeartPulse, Users } from "lucide-react"
import MemphisShape from "@/components/memphis-shape"
import WlaSignup from "@/components/wla-signup"
import { CONTACT_EMAIL } from "@/lib/site"
import { WLA_APP_STORE_URL, WLA_NAME, WLA_PAGES, WLA_PITCH, WLA_PRICE_MONTH, WLA_PRICE_YEAR, WLA_TRIAL } from "@/lib/wla"

const LIVE = WLA_APP_STORE_URL !== "" && WLA_APP_STORE_URL !== "#"

const beats = [
  {
    n: "1",
    title: "Log your meals",
    body: "Fast, private, no judgment. Tap a suggestion or search a food and you’re done. Everything stays on your iPhone.",
    img: "/wla/log.jpg",
    alt: "The Log screen showing 1,437 calories left today, two logged breakfast items, and a Done for Today button.",
  },
  {
    n: "2",
    title: "Check in each day",
    body: "Your daily check-in unlocks your dice. Show up, and the whole crew’s roll gets stronger.",
    img: "/wla/today.jpg",
    alt: "A Hull Mite encounter card, 15 to beat, with the robot Plic asking if you are ready to throw your dice.",
  },
  {
    n: "3",
    title: "Roll with your crew",
    body: "Take a squad space expedition together: catalogue creatures, chart regions and face the boss.",
    img: "/wla/reveal.jpg",
    alt: "The squad dice roll: four crewmates’ dice add up to 29, against 15 needed.",
  },
]

const promises = [
  { icon: Dices, title: "What you eat never moves the dice.", body: "Showing up does. Calories, macros and your weight never change a roll." },
  { icon: Gift, title: "Every campaign is free.", body: "Premium never touches the dice, and no region is locked behind it." },
  { icon: HeartPulse, title: "Health data stays on your device.", body: "Meals, weight and Apple Health values are never uploaded." },
  { icon: Users, title: "Squads up to 10.", body: "Androids fill the empty seats, so you can set out with a crew of one." },
]

const premium = ["No ads", "Snap a photo to log a meal", "Describe meals in plain words", "Macros", "Insights"]

export default function WlaHomePage() {
  return (
    <div className="pt-28 pb-20 relative overflow-hidden min-h-screen">
      <div className="fixed -z-10 top-40 left-10 w-32 h-32 opacity-20" aria-hidden="true">
        <MemphisShape type="circle" color="bg-primary" />
      </div>
      <div className="fixed -z-10 bottom-40 right-10 w-40 h-40 opacity-20" aria-hidden="true">
        <MemphisShape type="triangle" color="bg-secondary" />
      </div>
      <div className="fixed -z-10 top-1/2 right-1/4 w-24 h-24 opacity-20" aria-hidden="true">
        <MemphisShape type="zigzag" color="bg-accent" />
      </div>

      <div className="container mx-auto px-4 space-y-24 md:space-y-32">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-10 md:gap-8 items-center max-w-5xl mx-auto">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Weight Loss <span className="text-accent">Adventures</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground mb-4">{WLA_PITCH}</p>
            <p className="text-lg text-muted-foreground">
              Log meals privately on your iPhone, check in each day, and roll dice with your squad on a space expedition.
            </p>
            <div className="mt-8 flex flex-col items-center md:items-start gap-3">
              {LIVE ? (
                <a
                  href={WLA_APP_STORE_URL}
                  aria-label={`Download ${WLA_NAME} on the App Store`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Download on the App Store <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              ) : (
                <a
                  href="#notify"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Coming soon <ArrowDown size={18} aria-hidden="true" />
                </a>
              )}
              <p className="text-sm text-muted-foreground">{LIVE ? "Free for iPhone. Premium is optional." : "For iPhone. Premium will be optional."}</p>
            </div>
          </div>
          <div className="flex justify-center">
            <Phone src="/wla/exp.jpg" alt="The expedition map: the Pale Drift, a nebula ringed by unexplored systems around a glowing core, with an Explore button." priority className="w-60 md:w-72" />
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how" className="max-w-5xl mx-auto">
          <h2 id="how" className="text-3xl md:text-4xl font-bold text-center mb-12">
            How it <span className="text-secondary">works</span>
          </h2>
          <ol className="grid md:grid-cols-3 gap-6 md:gap-8">
            {beats.map((b) => (
              <li key={b.n} className="content-overlay rounded-lg p-6 flex flex-col items-center text-center">
                <Phone src={b.img} alt={b.alt} className="w-40 mb-6" />
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mb-3" aria-hidden="true">
                  {b.n}
                </span>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  <span className="sr-only">Step {b.n}: </span>
                  {b.title}
                </h3>
                <p className="text-muted-foreground">{b.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Promises */}
        <section aria-labelledby="promises" className="max-w-5xl mx-auto">
          <h2 id="promises" className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our <span className="text-primary">promises</span>
          </h2>
          <ul className="grid sm:grid-cols-2 gap-6">
            {promises.map((p) => (
              <li key={p.title} className="content-overlay rounded-lg p-6 flex gap-4">
                <p.icon size={28} className="text-accent shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{p.title}</h3>
                  <p className="text-muted-foreground">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Story */}
        <section aria-labelledby="story" className="max-w-3xl mx-auto text-center">
          <h2 id="story" className="text-3xl md:text-4xl font-bold mb-6">
            The <span className="text-accent">Ember Bloom</span>
          </h2>
          <div className="content-overlay rounded-lg p-8 md:p-10 space-y-4 text-lg text-muted-foreground">
            <p>
              A star erupts. A captain survives and nobody aboard can say how. Now Captain Hallow stands before her crew
              with a glittering flower hovering above her palm, its petals folding light.
            </p>
            <p>
              The Ember Bloom cannot be destroyed. So she means to hide it where it wants to go, system by system, and
              bury <em className="text-foreground not-italic font-semibold">a treasure belonging to none</em>.
            </p>
            <p>You are crew. The first sector is the Pale Drift.</p>
          </div>
        </section>

        {/* Premium */}
        <section aria-labelledby="premium" className="max-w-3xl mx-auto text-center">
          <h2 id="premium" className="text-3xl md:text-4xl font-bold mb-6">
            Go <span className="text-secondary">Premium</span>
          </h2>
          <div className="content-overlay rounded-lg p-8 md:p-10">
            <ul className="flex flex-wrap justify-center gap-3 mb-8">
              {premium.map((f) => (
                <li key={f} className="rounded-full border border-secondary/60 px-4 py-1.5 text-foreground">
                  {f}
                </li>
              ))}
            </ul>
            <p className="text-2xl font-bold text-foreground">
              {WLA_PRICE_MONTH}/month <span className="text-muted-foreground font-normal">or</span> {WLA_PRICE_YEAR}/year
            </p>
            <p className="mt-2 text-lg text-foreground">Start with a {WLA_TRIAL}.</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Prices may vary by region. Cancel anytime in your Apple ID settings. The free trial converts to a paid
              subscription unless you cancel at least 24 hours before it ends. See the{" "}
              <Link href="/wla/terms" className="text-secondary underline underline-offset-2">
                Terms of Use
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Signup */}
        {!LIVE && (
          <section id="notify" aria-labelledby="notify-h" className="max-w-3xl mx-auto text-center scroll-mt-28">
            <h2 id="notify-h" className="text-3xl md:text-4xl font-bold mb-3">
              Get notified at <span className="text-secondary">launch</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">Weight Loss Adventures is coming to the App Store. Leave your email and we&rsquo;ll tell you the day it lands.</p>
            <div className="content-overlay rounded-lg p-6 md:p-10">
              <WlaSignup idPrefix="signup" />
            </div>
          </section>
        )}

        {/* Closing */}
        <section aria-labelledby="closing" className="max-w-3xl mx-auto text-center">
          <h2 id="closing" className="text-3xl md:text-4xl font-bold mb-4">
            Your crew is <span className="text-accent">waiting.</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-6">One card a day, one roll together. Show up, and the ship moves.</p>
          {LIVE ? (
            <a href={WLA_APP_STORE_URL} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Download on the App Store <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          ) : (
            <a href="#notify" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold border border-secondary text-secondary hover:bg-secondary/10 transition-colors">
              Get notified at launch <ArrowUp size={18} aria-hidden="true" />
            </a>
          )}
        </section>

        {/* Footer links */}
        <footer className="max-w-3xl mx-auto text-center">
          <nav aria-label="Weight Loss Adventures" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {WLA_PAGES.map((page) => (
              <Link key={page.href} href={page.href} className="text-secondary underline underline-offset-2">
                {page.label}
              </Link>
            ))}
          </nav>
          <p className="mt-4 text-muted-foreground">
            Questions? <a href={`mailto:${CONTACT_EMAIL}`} className="text-secondary underline underline-offset-2">{CONTACT_EMAIL}</a>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Weight Loss Adventures is made by Cephalopod Studio LLC. Not medical advice.
          </p>
        </footer>
      </div>
    </div>
  )
}

function Phone({ src, alt, priority, className = "" }: { src: string; alt: string; priority?: boolean; className?: string }) {
  return (
    <div className={`rounded-[2rem] border-4 border-muted bg-muted overflow-hidden shadow-xl shadow-primary/20 ${className}`}>
      <img
        src={src}
        alt={alt}
        width={640}
        height={1391}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="block w-full h-auto"
      />
    </div>
  )
}
