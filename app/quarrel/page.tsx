import Image from "next/image"
import Link from "next/link"
import { Dices, Eye, Armchair, Map as MapIcon, Sparkles, Glasses, ShieldCheck } from "lucide-react"
import MemphisShape from "@/components/memphis-shape"
import { CONTACT_EMAIL } from "@/lib/site"
import { Q_PAGES, Q_PITCH } from "@/lib/quarrel"

// Unreleased: no App Store link, price or date on purpose (it may go to Apple Arcade).
// Copy follows the game repo's docs/CHARACTERS.md, docs/STORY.md and docs/ART_DIRECTION.md.
// Combat is still being playtested: describe the dice, not real-time or turn-based play.

const steps = [
  {
    n: "1",
    title: "Lay a card",
    body: "Pick a fighter from your hand and lay their card on the table. The card becomes your fighter.",
  },
  {
    n: "2",
    title: "Throw the dice",
    body: "Pick up a die, flick your wrist and let it fly. Attack dice power your strikes and defense dice power your guard.",
  },
  {
    n: "3",
    title: "Roll high",
    body: "A big attack roll turns into a heavy attack or a special move. A big defense roll turns a hit aside.",
  },
]

type Fighter = { id: string; name: string; title: string; role: string; body: string }

const peoples: {
  name: string
  sub: string
  body: string
  arena: string
  img: string
  alt: string
  tint: string
  fighters: Fighter[]
}[] = [
  {
    name: "Humans",
    sub: "The Meridian Expedition",
    body: "A survey crew far from home, patching spacecraft gear with brass, canvas and fired clay. Practical, stubborn, and the ones who broke the seal.",
    arena: "The Dig Site",
    img: "/quarrel/arena-human.webp",
    alt: "The Dig Site at night: a fenced fighting floor among adobe buildings, with the ancient Gateway arch behind.",
    tint: "from-[#B5603A]/35 to-[#2E3A5C]/40",
    fighters: [
      {
        id: "kowalski",
        name: "Bram “Anvil” Kowalski",
        title: "Rig Breaker",
        role: "Tank",
        body: "Twenty years cracking rock, now fighting from a brass-and-iron mining rig armored in fired terracotta, with a hydraulic grapple and a tricone drill.",
      },
      {
        id: "vance",
        name: "Captain Rhea Vance",
        title: "Expedition Marshal",
        role: "Knight",
        body: "The officer who ordered the Gateway opened. A frontier marshal in an armored duster, with one oversized hand cannon and a satellite on call.",
      },
      {
        id: "okafor",
        name: "Dr. Imani Okafor",
        title: "Gate Theorist",
        role: "Mage",
        body: "The first to realize the Gateway is a lock. She fights with a brass Resonance Gauntlet built around a Gateway fragment, three survey drones at her side.",
      },
    ],
  },
  {
    name: "Gench",
    sub: "The Chorus of the Far Watch",
    body: "An insectoid people of jade chitin, amber resin and glowing cyan eye-spots, who keep their memory as song. They have guarded the Gateway for ten thousand years.",
    arena: "The Amber Hall",
    img: "/quarrel/arena-gench.webp",
    alt: "The Amber Hall: a vaulted chamber of amber and jade, with ancient soldiers frozen in the walls and two Gench fighters on the floor.",
    tint: "from-[#2F6B4F]/45 to-[#14403F]/50",
    fighters: [
      {
        id: "gorrhak",
        name: "Gorrhak",
        title: "Hive-Bulwark",
        role: "Tank",
        body: "A guardian on eight short legs behind a great shield-like head plate. He has stood at the Gateway's door for longer than humans have had writing.",
      },
      {
        id: "kesh",
        name: "Kesh Varrow",
        title: "Coil Blade",
        role: "Knight",
        body: "A blade-caste duelist who coils low on six legs and rears up to fight, a fan of curved blades along each side. The Gench least willing to trust humans.",
      },
      {
        id: "ixtavi",
        name: "Ix'Tavi",
        title: "Chorus-Singer",
        role: "Mage",
        body: "A low, six-legged singer who raises a fan of stained-glass membranes to sing, and the bridge between two peoples.",
      },
    ],
  },
  {
    name: "Arl",
    sub: "The Dominion Beneath",
    body: "Tall and mouthless, in white marble, pale gold and violet crystal, they speak with glowing eyes. They once ruled hundreds of worlds, and they want them back.",
    arena: "The Shard Cathedral",
    img: "/quarrel/arena-arl.webp",
    alt: "The Shard Cathedral: a ruined hall of white stone and violet crystal floating in a violet void, with two Arl fighters on the floor.",
    tint: "from-[#A35BFF]/30 to-[#2B2838]/50",
    fighters: [
      {
        id: "arch-rive",
        name: "Arch Rive",
        title: "Warlord of the Dominion",
        role: "Knight",
        body: "The first Arl through the Gateway. Honorable by his own rules, and certain of the Dominion's right to rule.",
      },
      {
        id: "arl-mech",
        name: "Arl Mech",
        title: "The Bound Engine",
        role: "Tank",
        body: "A towering war-suit of white marble plates and violet conduits, with a crystal pincher and an arm cannon. It is not entirely a machine.",
      },
      {
        id: "arl-priest",
        name: "Arl Priest",
        title: "Keeper of Shards",
        role: "Mage",
        body: "Crowned in fractured crystal, with eyes that glow pale gold, the Priest reads possible futures in the dimensional shards.",
      },
    ],
  },
]

const features = [
  { icon: Glasses, title: "Native visionOS", body: "Built for Apple Vision Pro from the first line, with your hands as the controller." },
  { icon: Eye, title: "Your room or the arena", body: "Fight on a table in your own room, or switch to full immersion and step into the arena." },
  { icon: Armchair, title: "Comfortable and accessible", body: "Fights play out in front of you while you sit. Roll buttons can stand in for throwing, and Reduce effects calms flashes and particles." },
  { icon: MapIcon, title: "Places to visit", body: "Each fighter in your hand opens their own space to walk around, and their people's arena." },
  { icon: Sparkles, title: "Earned decor", body: "Win fights to earn decor that fills your fighters' spaces and gives their cards an edge." },
  { icon: ShieldCheck, title: "Nothing to buy, nothing tracked", body: "No ads, no in-app purchases and no data collected. Your progress stays on your Vision Pro." },
]

export default function QuarrelHomePage() {
  return (
    <div className="pt-28 pb-20 relative overflow-hidden min-h-screen">
      <div className="fixed -z-10 top-40 left-10 w-32 h-32 opacity-20" aria-hidden="true">
        <MemphisShape type="circle" color="bg-primary" />
      </div>
      <div className="fixed -z-10 bottom-40 right-10 w-40 h-40 opacity-20" aria-hidden="true">
        <MemphisShape type="triangle" color="bg-secondary" />
      </div>

      <div className="container mx-auto px-4 space-y-24 md:space-y-32">
        <section className="grid md:grid-cols-2 gap-10 md:gap-8 items-center max-w-5xl mx-auto">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Quarrel<span className="text-accent">:</span> The Far Watch
            </h1>
            <p className="text-xl md:text-2xl text-foreground mb-4">{Q_PITCH}</p>
            <p className="text-lg text-muted-foreground">
              A card-and-dice fighting game for Apple Vision Pro. Nine fighters from three peoples, a war over an
              ancient Gateway, and every roll yours to throw.
            </p>
            <p className="mt-8 inline-block rounded-full border border-secondary/60 px-5 py-2 font-semibold text-foreground">
              Coming to Apple Vision Pro
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="/quarrel/icon.webp"
              alt="The Quarrel app icon: a die with a sun, a violet triangle and a cluster of cyan eye-spots on its faces."
              width={512}
              height={512}
              priority
              className="w-56 md:w-72 h-auto rounded-full shadow-xl"
            />
          </div>
        </section>

        <section aria-labelledby="how" className="max-w-5xl mx-auto">
          <h2 id="how" className="text-3xl md:text-4xl font-bold text-center mb-12">
            How it <span className="text-secondary">plays</span>
          </h2>
          <ol className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((s) => (
              <li key={s.n} className="content-overlay rounded-lg p-6 text-center">
                <span
                  className="flex h-9 w-9 mx-auto items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mb-3"
                  aria-hidden="true"
                >
                  {s.n}
                </span>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  <span className="sr-only">Step {s.n}: </span>
                  {s.title}
                </h3>
                <p className="text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="story" className="max-w-3xl mx-auto text-center">
          <h2 id="story" className="text-3xl md:text-4xl font-bold mb-6">
            The <span className="text-primary">story</span>
          </h2>
          <div className="content-overlay rounded-lg p-6 md:p-10 space-y-4 text-lg text-muted-foreground text-left md:text-center">
            <p>
              On Caul, a rogue moon drifting between stars, a human survey crew digs up a Gateway older than any
              civilization. An insectoid people, the Gench, attack without warning. The humans win, and in winning they
              break a seal the Gench had kept for ten thousand years. The Gateway was never a door. It was a lock, and
              behind it waited the Arl.
            </p>
            <p>
              You begin with Bram Kowalski and Gorrhak, the miner and the guardian who nearly killed each other on the
              first night. Rivals arrive in story order, and each one you win over joins your hand.
            </p>
          </div>
        </section>

        <section aria-labelledby="peoples" className="max-w-6xl mx-auto">
          <h2 id="peoples" className="text-3xl md:text-4xl font-bold text-center mb-4">
            Three peoples, <span className="text-accent">nine fighters</span>
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Every people has a tank, a knight and a mage, and a home arena.
          </p>
          <div className="space-y-12 md:space-y-16">
            {peoples.map((p) => (
              <article key={p.name} aria-labelledby={`people-${p.name}`} className="content-overlay rounded-lg overflow-hidden">
                <div className="grid md:grid-cols-5">
                  <Image
                    src={p.img}
                    alt={p.alt}
                    width={900}
                    height={506}
                    className="w-full h-full max-h-72 md:max-h-none object-cover md:col-span-3"
                  />
                  <div className="p-6 md:p-8 md:col-span-2 flex flex-col justify-center">
                    <h3 id={`people-${p.name}`} className="text-3xl font-bold text-foreground">
                      {p.name}
                    </h3>
                    <p className="text-secondary font-semibold mb-3">{p.sub}</p>
                    <p className="text-muted-foreground mb-3">{p.body}</p>
                    <p className="text-sm text-muted-foreground">
                      Home arena: <span className="font-semibold text-foreground">{p.arena}</span>
                    </p>
                  </div>
                </div>
                <ul className="grid sm:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
                  {p.fighters.map((f) => (
                    <li key={f.id} className="flex flex-col">
                      <div className={`rounded-lg bg-gradient-to-b ${p.tint}`}>
                        <Image
                          src={`/quarrel/fighter-${f.id}.webp`}
                          alt={`${f.name}, ${f.title}.`}
                          width={600}
                          height={400}
                          className="w-full h-auto"
                        />
                      </div>
                      <h4 className="mt-3 text-xl font-bold text-foreground">{f.name}</h4>
                      <p className="text-secondary font-semibold text-sm mb-1">
                        {f.title} · {f.role}
                      </p>
                      <p className="text-muted-foreground">{f.body}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="features" className="max-w-5xl mx-auto">
          <h2 id="features" className="text-3xl md:text-4xl font-bold text-center mb-12">
            Made for <span className="text-primary">Vision Pro</span>
          </h2>
          <ul className="grid sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <li key={f.title} className="content-overlay rounded-lg p-6 flex gap-4">
                <f.icon size={28} className="text-accent shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{f.title}</h3>
                  <p className="text-muted-foreground">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="closing" className="max-w-3xl mx-auto text-center">
          <h2 id="closing" className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Dices size={32} className="text-accent" aria-hidden="true" /> Questions?
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Quarrel is still in development. Write to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-secondary underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <nav aria-label="Quarrel pages" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {Q_PAGES.map((p) => (
              <Link key={p.href} href={p.href} className="text-secondary underline underline-offset-2">
                {p.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </div>
  )
}
