import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Camera,
  ClipboardCheck,
  Clock,
  Package,
  Plus,
  ScanSearch,
  ShieldAlert,
  Star,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { CountUp } from "@/components/motion/count-up";
import { BeforeAfter } from "@/components/motion/before-after";
import { TrustedBy } from "@/components/marketing/trusted-by";
import { ORG_ID, SITE, INSTAGRAM_URL, canonical } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { CaseCard, FeaturedReview, ReviewBubbles } from "@/components/marketing/comic-reviews";
import { receipt } from "@/components/marketing/receipts";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { TrustMarquee, CARDS_RESTORED_DISPLAY } from "@/components/marketing/trust-pills";
import { WatchTheWork } from "@/components/marketing/watch-the-work";
import { SERVICE_CARDS } from "@/lib/service-cards";
import { HERO, PROCESS, REASONS, RESULTS } from "@/lib/about";
import { AcrylicHolder, Marquee, Print, Seamless, SectionHead, StatBlock, cta } from "@/components/brand";
import { cn } from "@/lib/utils";
import mantleBefore from "@/public/specimen-mantle-before.jpg";
import mantleAfter from "@/public/specimen-mantle-after.jpg";
import mantleInHand from "@/public/about/mantle-in-hand.jpg";
import mantleDetail from "@/public/about/mantle-detail-before.jpg";
import mantlePair from "@/public/home/mantle-pair.jpg";
import charmanderPair from "@/public/home/charmander-pair.jpg";
import charmanderAfter from "@/public/home/charmander-after.jpg";
import garchomp from "@/public/home/garchomp.jpg";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: canonical("/"),
};

const TAGLINE = "Expert card restoration & PSA prep — every card treated like it's worth a fortune.";
const INSTAGRAM = INSTAGRAM_URL;

/** The card kinds the owner lists in the FAQ answer below, as labels,
 * grouped the way the answer groups them (its own words as group names). */
const CARD_KINDS: { group?: string; items: string[] }[] = [
  { group: "Trading cards", items: ["Pokémon", "Magic: The Gathering", "Yu-Gi-Oh!"] },
  { group: "Sports cards", items: ["Baseball", "Basketball", "Football", "Hockey"] },
  { items: ["Vintage", "Modern", "Raw", "Graded"] },
];

/** The receipts the home page shows as prints before the strip. */
const BENTO_RECEIPT = "t11";

const FIXES = ["Creases", "Dents", "Dimples", "Edge lifts", "Corner lifts", "Minor bends", "Holo polishing", "Surface cleaning"];

const FAQ = [
  {
    q: "What's the difference between Restoration and Prep?",
    a: "Restoration improves how your card looks — cleaning surfaces, softening corners, reducing scuffs and scratches. PSA Prep is specifically for submitting to graders: we clean, sleeve, and organize your submission for the best possible grade. Most collectors do prep before grading, restoration before or after.",
  },
  {
    q: "Will restoration affect my card's PSA grade?",
    a: "There is a risk — we're fully transparent about that. If you plan to grade your card, restoration may affect how it's received. We'll always be upfront with you about what's realistic for your card.",
  },
  {
    q: "How do I ship my cards to you?",
    a: "You can choose to have us generate a prepaid label (we email it to you — print and drop off), or ship on your own using any tracked, insured method. We recommend USPS Priority Mail.",
  },
  {
    q: "What types of cards do you work on?",
    a: "All trading cards — Pokémon, sports cards (baseball, basketball, football, hockey), Magic: The Gathering, Yu-Gi-Oh!, and more. Vintage or modern, raw or graded.",
  },
  {
    q: "How long does it take?",
    a: "Prep typically turns around in 10–15 business days. Restorations range from 2–3 months (Bronze) down to 5–10 business days (Diamond) depending on the tier you choose, or skip the queue with Fast Pass.",
  },
];

const TOS_HIGHLIGHTS: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Turnaround times are estimates",
    body: "All turnaround times shown are rough estimates and not guaranteed. Actual processing may be affected by order volume, card condition, shipping delays, or circumstances outside our control.",
    icon: Clock,
  },
  {
    title: "You assume shipping risk",
    body: "You are responsible for selecting your shipping method and carrier. The Card Doc assumes no responsibility for loss or damage in transit until items are physically received and confirmed.",
    icon: Package,
  },
  {
    title: "Alteration Risk",
    body: "Cards can be flagged as altered: professional graders can detect restoration and may give an 'Altered' designation. If your card is damaged during restoration, our liability is limited to the service fee paid — not the card's market value.",
    icon: ShieldAlert,
  },
  {
    title: "No refunds after work begins",
    body: "All sales are final once restoration work has commenced. If we believe a card won't respond well to treatment, we will contact you before proceeding.",
    icon: ClipboardCheck,
  },
];

/** The six steps of /how-it-works, titles and notes word for word. */
const STEPS: { title: string; note: string }[] = [
  { title: "Choose Your Service, Tier, and Add-Ons", note: "(Tiers, services, and add-ons lock at checkout and cannot be changed afterward)" },
  { title: "Book Your Order at theonethatsaveditall.com", note: "(Payment is collected in full at checkout)" },
  { title: "Pack and Ship Your Cards", note: "(US & Puerto Rico orders only)" },
  { title: "Arrival, Check-In, and Evaluation", note: "(Allow 1–3 business days after carrier delivery for check-in)" },
  { title: "Hands-On Work", note: "(Order status: In Progress to Completed)" },
  { title: "Return Shipping", note: "(Order status: Shipped Back to Delivered)" },
];

const SERVICES = SERVICE_CARDS;

// "30+ years of combined collecting", set as a big figure and its words.
const YEARS = (() => {
  const title = REASONS.items[1].title;
  const m = title.match(/^(\S+)\s(.*)$/);
  return m ? { figure: m[1], rest: m[2] } : { figure: title, rest: "" };
})();

const REASON_ICONS: LucideIcon[] = [UserRound, Star, ScanSearch, BadgeCheck];

function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Card Restoration",
        serviceType: "Trading card restoration",
        description: SERVICES[0].line,
        url: `${SITE}/tier-selection`,
        provider: { "@id": ORG_ID },
        areaServed: ["US", "PR"],
        offers: {
          "@type": "Offer",
          priceSpecification: { "@type": "UnitPriceSpecification", minPrice: 75, priceCurrency: "USD", unitText: "card" },
        },
      },
      {
        "@type": "Service",
        name: "PSA Prep",
        serviceType: "Trading card grading submission prep",
        description: SERVICES[1].line,
        url: `${SITE}/prep`,
        provider: { "@id": ORG_ID },
        areaServed: ["US", "PR"],
        offers: {
          "@type": "Offer",
          priceSpecification: { "@type": "UnitPriceSpecification", minPrice: 25, priceCurrency: "USD", unitText: "card" },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}/#faq`,
        mainEntity: FAQ.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };
}

/** A small card-shaped mark: the ticker separator and the category bullets. */
function CardMark({ className = "" }: { className?: string }) {
  return <span aria-hidden className={cn("inline-block h-[18px] w-[13px] shrink-0 rounded-[3px]", className)} />;
}

/** Instagram link label: the visible handle, with the new-tab note for screen readers. */
function InstagramNote() {
  return <span className="sr-only">on Instagram (opens in a new tab)</span>;
}

export default function HomePage() {
  // The owner's figure (display only; lib/site-stats.ts keeps the live count).
  const cardsRestored = CARDS_RESTORED_DISPLAY;
  const allCards = FAQ.find((f) => f.q === "What types of cards do you work on?")?.a;
  const mantle = RESULTS.find((r) => r.id === "mickey-mantle");
  const charmanderCase = RESULTS.find((r) => r.id === "charmander");
  const [restoration, prep, kits] = SERVICES;
  const bento = receipt(BENTO_RECEIPT);

  return (
    <div className="min-h-screen overflow-x-clip">
      <JsonLd data={structuredData()} />

      <TrustMarquee />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section aria-labelledby="hero-heading" className="surface-cobalt relative isolate overflow-hidden">
        <span aria-hidden className="halftone-dots -right-[10%] -top-[18%] h-[120%] w-[70%]" />
        <span aria-hidden className="halftone-dots -bottom-[30%] -left-[20%] h-[70%] w-[60%] opacity-70" />
        <div className="wrap grid gap-x-14 pt-7 pb-16 sm:pt-10 md:pt-14 md:pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:grid-rows-[auto_1fr] lg:pt-16 lg:pb-24 xl:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] xl:gap-x-20">
          <h1
            id="hero-heading"
            className="hero-in font-display text-[clamp(3.25rem,14.2vw,6rem)] font-black leading-[0.86] tracking-[-0.012em] lg:col-start-1 lg:row-start-1 lg:text-[clamp(4.25rem,6.6vw,6.5rem)]"
          >
            <span className="block text-white">{HERO.headline[0]}</span>
            <span className="block text-sun">{HERO.headline[1]}</span>
          </h1>

          {/* The Mantle, drag to compare, in its one-touch holder. */}
          <div className="relative mx-auto mt-7 w-full max-w-[25rem] sm:mt-10 sm:max-w-[28rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-2 lg:max-w-none lg:self-start">
            <div className="hero-in relative z-[1] lg:rotate-[1.5deg]" style={{ ["--d" as string]: 120 }}>
              <AcrylicHolder title={mantle?.card ?? "Mickey Mantle"} detail={mantle?.detail}>
                <BeforeAfter
                  before={mantleBefore}
                  after={mantleAfter}
                  beforeAlt="A Mickey Mantle card before restoration, cracked across the face and jersey"
                  afterAlt="The same Mickey Mantle card after restoration"
                  sizes="(min-width: 1280px) 500px, (min-width: 1024px) 432px, (min-width: 640px) 448px, 92vw"
                  priority
                />
              </AcrylicHolder>
            </div>
          </div>

          {/* Tagline, the two actions, and what we never do. */}
          <div className="hero-in mt-10 lg:col-start-1 lg:row-start-2 lg:mt-8 lg:max-w-[36rem]" style={{ ["--d" as string]: 220 }}>
            <p className="max-w-[34rem] text-[clamp(1.125rem,1.6vw,1.375rem)] font-medium leading-[1.5] text-[#e6ebff] [text-wrap:pretty]">
              {TAGLINE}
            </p>
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link href="/tier-selection" className={cta({ size: "lg" })}>
                Restoration Pricing
                <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
              </Link>
              <Link href="/prep" className={cta({ tone: "outline-light", size: "lg" })}>
                PSA Prep Pricing
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2.5">
              <p className="label-caps mr-1 text-[17px] text-sun">We never</p>
              <ul className="contents">
                {PROCESS.never.map((item) => (
                  <li
                    key={item}
                    className="inline-flex min-h-9 items-center gap-2 rounded-full bg-ink/35 px-3.5 text-sm font-bold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]"
                  >
                    <X aria-hidden className="size-3.5 text-sun" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Symptoms ticker: flat and quiet ───────────────────────────── */}
      <section aria-label="What we can fix" className="border-y border-line bg-white py-4 text-ink md:py-5">
        <Marquee
          label="What we can fix"
          items={FIXES.map((word) => (
            <span key={word} className="caps font-display text-[30px] font-extrabold leading-none tracking-[0.01em] md:text-[40px]">
              {word}
            </span>
          ))}
          speed={44}
          pauseOnHover={false}
          separator={<CardMark className="mx-6 rotate-[8deg] border-2 border-cobalt md:mx-9" />}
        />
      </section>

      {/* ── Trusted by: a second belt, sliding the other way ─────────── */}
      <TrustedBy />

      {/* ── We do all cards. ──────────────────────────────────────────── */}
      <section aria-labelledby="all-cards-heading" className="surface-chalk">
        <div className="wrap grid items-start gap-x-16 gap-y-8 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h2 id="all-cards-heading" data-reveal className="font-display text-[clamp(4rem,15vw,6.5rem)] font-black lg:text-[clamp(5.5rem,7vw,7rem)] leading-[0.84] tracking-[-0.015em] text-ink [text-wrap:balance]">
              We do all cards.
            </h2>
            {/* All cards, shown with real cards: a sports card and two TCG
                cards, each cropped close so none repeats a photo below. A row
                of three tilted prints on phones, a loose stack from lg. */}
            <div
              data-reveal="stagger"
              className="relative mt-10 flex items-start gap-3 sm:gap-5 lg:mt-12 lg:block lg:h-[24rem] lg:max-w-none"
            >
              <Print
                src={mantleInHand}
                alt="A restored Mickey Mantle baseball card held in a blue glove"
                aspect="4/5"
                position="62% 30%"
                zoom={1.15}
                tilt={-6}
                border="sm"
                sizes="(min-width: 1024px) 256px, 31vw"
                className="w-[31%] shrink-0 lg:absolute lg:top-6 lg:left-0 lg:w-[16rem]"
              />
              <Print
                src={charmanderAfter}
                alt="The flame corner of a Base Set Charmander card after restoration"
                aspect="4/5"
                position="92% 26%"
                zoom={1.5}
                tilt={3}
                border="sm"
                sizes="(min-width: 1024px) 256px, 31vw"
                className="z-[1] mt-4 w-[31%] shrink-0 lg:absolute lg:top-0 lg:left-[calc(50%-8rem)] lg:mt-0 lg:w-[16rem]"
              />
              <Print
                src={garchomp}
                alt="The holo corner of a Garchomp card"
                aspect="4/5"
                position="62% 40%"
                zoom={1.3}
                tilt={-2}
                border="sm"
                sizes="(min-width: 1024px) 256px, 31vw"
                className="w-[31%] shrink-0 lg:absolute lg:top-10 lg:right-0 lg:w-[16rem]"
              />
            </div>
          </div>
          <div className="lg:pt-3">
            {allCards && <p data-reveal className="lead text-ink-soft">{allCards}</p>}
            <div data-reveal="stagger" className="mt-8 grid gap-5">
              {CARD_KINDS.map(({ group, items }) => (
                <div key={group ?? items[0]} className={cn(!group && "border-t border-line pt-5")}>
                  {group && <p className="label-caps mb-2.5 text-[13px] text-cobalt">{group}</p>}
                  <ul aria-label={group ?? "Condition"} className="flex flex-wrap gap-2">
                    {items.map((label) => (
                      <li
                        key={label}
                        className={cn(
                          "inline-flex min-h-9 items-center rounded-full px-3.5 text-[15px] font-bold",
                          group
                            ? "bg-white text-ink shadow-[0_0_0_1px_var(--line)]"
                            : "bg-transparent text-ink shadow-[inset_0_0_0_1.5px_var(--ink)]"
                        )}
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link href="/tier-selection" className={cta({ tone: "ink", size: "lg", className: "mt-10" })}>
              Book a Restoration
              <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Proven Results ────────────────────────────────────────────── */}
      <section aria-labelledby="results-heading" className="surface-ink relative">
        <div className="wrap section-y">
          <div data-reveal>
            <SectionHead
              id="results-heading"
              tone="dark"
              eyebrow="Why Collectors Trust Us"
              title="Proven Results"
              lead="Hundreds of cards restored and prepped. We don't just claim results, we show them."
              actions={
                <Link href="/tier-selection" className={cta({ size: "lg" })}>
                  See Our Services
                  <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
                </Link>
              }
            />
          </div>

          <div className="mt-12 grid gap-6 md:mt-16 md:gap-7 lg:grid-cols-12">
            {/* The Mantle pair on a studio seamless. Both cases share two
                grid rows (photo, caption), so their captions line up. */}
            <figure data-reveal className="m-0 lg:col-span-7 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-y-0">
              <Seamless
                src={mantlePair}
                alt="A cracked Mickey Mantle card in a black glove next to the same card after restoration in a blue glove"
                aspect="1446/1000"
                inset="5% 4% 3%"
                sizes="(min-width: 1280px) 720px, (min-width: 1024px) 56vw, 92vw"
              >
                <span className="ba-label left-4 md:left-5">Before</span>
                <span className="ba-label right-4 md:right-5" style={{ background: "var(--sun)", color: "var(--ink)" }}>After</span>
              </Seamless>
              <figcaption className="mt-5 grid content-start gap-2 md:grid-cols-[auto_minmax(0,1fr)] md:gap-x-8">
                <span>
                  <span className="caps block font-display text-[28px] font-black leading-none md:text-[32px]">{mantle?.card}</span>
                  <span className="mt-1.5 block text-sm font-bold text-sun">{mantle?.detail}</span>
                </span>
                {mantle && <span className="max-w-[60ch] text-[15px] leading-relaxed text-on-dark-muted">{mantle.caption}</span>}
              </figcaption>
            </figure>

            {/* The Charmander composite as a print. */}
            <figure data-reveal style={{ transitionDelay: "90ms" }} className="m-0 lg:col-span-5 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-y-0">
              <div className="grid items-center">
                <Print
                  src={charmanderPair}
                  alt="A Charmander card before and after restoration, side by side"
                  aspect="576/513"
                  surface="dark"
                  border="lg"
                  tilt={1.5}
                  lift
                  sizes="(min-width: 1024px) 460px, 92vw"
                  caption={
                    <span className="flex items-baseline justify-between gap-3">
                      <span>{charmanderCase?.card}</span>
                      <span className="font-sans text-sm font-bold normal-case tracking-normal text-ink-soft">{charmanderCase?.detail}</span>
                    </span>
                  }
                  className="mx-auto w-full max-w-[30rem]"
                >
                  <span className="ba-label left-3">Before</span>
                  <span className="ba-label ba-label-after right-3">After</span>
                </Print>
              </div>
              {charmanderCase && <figcaption className="mt-5 text-[15px] leading-relaxed text-on-dark-muted">{charmanderCase.caption}</figcaption>}
            </figure>

            {/* Row two: the Charizard lot sheet, the two stats, a close-up of the cracking. */}
            <CaseCard className="lg:col-span-5" />
            <div data-reveal="stagger" className="grid gap-6 sm:grid-cols-2 md:gap-7 lg:col-span-3 lg:grid-cols-1">
              <StatBlock tone="sun" value={<CountUp value={cardsRestored} />} label="Cards Restored" className="min-h-[180px] [&_.stat-value]:text-[clamp(64px,6vw,88px)]" />
              <StatBlock tone="ink" value="Free" label="Photo Review" className="min-h-[180px] [&_.stat-value]:text-[clamp(64px,6vw,88px)]" />
            </div>
            {/* The Charizard lot sheet's own receipt: the customer's message. */}
            <div data-reveal className="grid place-items-center py-4 lg:col-span-4">
              <Print
                src={bento.src}
                alt={bento.alt}
                aspect={`${bento.src.width}/${bento.src.height}`}
                fit="contain"
                matte={bento.matte}
                surface="dark"
                border="md"
                tilt={-2.5}
                lift
                sizes="(min-width: 1024px) 340px, 86vw"
                className="w-full max-w-[22rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Watch the work ────────────────────────────────────────────── */}
      <section aria-labelledby="watch-heading" className="surface-chalk">
        <div className="wrap section-y">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <h2 id="watch-heading" data-reveal className="display-lg text-ink">
              Watch the work
            </h2>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={cta({ tone: "outline", size: "md" })}>
              <Camera aria-hidden className="size-5" strokeWidth={1.75} />
              @the_card_doc
              <InstagramNote />
            </a>
          </div>
          <div className="mt-10 md:mt-14">
            <WatchTheWork />
          </div>
          <div className="mt-6 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between md:mt-8">
            <p className="text-[15px] font-medium text-ink-soft">Restoration results vary by card condition.</p>
            <Link href="/tier-selection" className={cta({ size: "lg", className: "self-start sm:self-auto" })}>
              Book a Restoration
              <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── What our customers say ────────────────────────────────────── */}
      <section aria-labelledby="reviews-heading" className="surface-white relative">
        <div className="wrap section-y">
          <h2 id="reviews-heading" data-reveal className="display-lg max-w-4xl text-ink">
            What our customers say
          </h2>
          {/* One pull quote, then one receipts strip (text messages from md up). */}
          <FeaturedReview className="mt-10 max-w-5xl md:mt-14" />

          <div className="mt-12 md:mt-20">
            <ReviewBubbles exclude={[BENTO_RECEIPT]} textOnPhone={false} />
          </div>
          <div className="mt-10 flex md:mt-12 md:justify-center">
            <Link href="/tier-selection" className={cta({ tone: "ink", size: "lg" })}>
              Book a Restoration
              <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
            </Link>
          </div>

        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────────── */}
      <section aria-labelledby="services-heading" className="surface-chalk">
        <div className="wrap pt-16 pb-[var(--section-y)] md:pt-24">
          <h2 id="services-heading" data-reveal className="display-lg text-ink">
            Services
          </h2>

          <ul className="mt-10 grid gap-6 md:mt-14 md:gap-7 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
            {/* Restoration: the big cobalt tile. */}
            <li data-reveal className="lg:col-span-7 lg:row-span-2">
              <Link
                href={restoration.href}
                className="surface-cobalt group relative isolate flex h-full flex-col overflow-hidden rounded-[22px] p-7 md:p-10"
              >
                <span aria-hidden className="halftone-dots -right-[10%] -bottom-[20%] h-[90%] w-[70%]" />
                <span className="caps font-display text-[44px] font-black leading-[0.9] md:text-[64px]">{restoration.name}</span>
                <span className="mt-4 max-w-[30ch] text-[17px] leading-relaxed text-[#e6ebff] md:text-lg">{restoration.line}</span>
                <span className="relative my-8 grid min-h-[16rem] flex-1 place-items-center md:my-10">
                  <Print
                    src={charmanderAfter}
                    alt="A Base Set Charmander card after restoration"
                    aspect="364/503"
                    position="50% 50%"
                    surface="dark"
                    tilt={-5}
                    sizes="(min-width: 1024px) 300px, 60vw"
                    className="w-[58%] max-w-[17rem] transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-[-2deg] motion-reduce:transition-none"
                  />
                </span>
                <span className="mt-auto flex flex-wrap items-end justify-between gap-5">
                  <span className="font-display text-[40px] font-black leading-none text-sun md:text-[52px]">{restoration.price}</span>
                  <span className={cta({ size: "lg" })}>
                    {restoration.action}
                    <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
                  </span>
                </span>
              </Link>
            </li>

            {/* Prep: a white tile. */}
            <li data-reveal style={{ transitionDelay: "90ms" }} className="lg:col-span-5">
              <Link
                href={prep.href}
                className="group grid h-full gap-6 rounded-[22px] bg-white p-7 text-ink shadow-[0_0_0_1px_var(--line),var(--panel-shadow)] md:p-8"
              >
                <span className="flex flex-col">
                  <span className="caps font-display text-[40px] font-black leading-[0.9] md:text-[48px]">{prep.name}</span>
                  <span className="mt-3 text-[16px] leading-relaxed text-ink-soft">{prep.line}</span>
                  <span className="mt-auto pt-6 font-display text-[34px] font-black leading-none whitespace-nowrap text-cobalt md:text-[40px]">{prep.price}</span>
                </span>
                <span className={cta({ tone: "ink", className: "justify-self-start" })}>
                  {prep.action}
                  <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
                </span>
              </Link>
            </li>

            {/* DIY Kits: the sun tile. */}
            <li data-reveal style={{ transitionDelay: "160ms" }} className="lg:col-span-5">
              <Link
                href={kits.href}
                className="surface-sun group grid h-full gap-6 rounded-[22px] p-7 md:p-8"
              >
                <span className="flex flex-col">
                  <span className="caps font-display text-[40px] font-black leading-[0.9] md:text-[48px]">{kits.name}</span>
                  <span className="mt-3 text-[16px] leading-relaxed text-ink">{kits.line}</span>
                  <span className="mt-auto pt-6 text-[15px] font-extrabold leading-snug text-ink">{kits.price}</span>
                </span>
                <span className={cta({ tone: "ink", className: "justify-self-start" })}>
                  {kits.action}
                  <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ── The Step-by-Step Process ──────────────────────────────────── */}
      <section aria-labelledby="process-heading" className="surface-ink">
        <div className="wrap section-y">
          <div data-reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-7">
            <h2 id="process-heading" className="display-lg text-white">
              The <span className="whitespace-nowrap">Step-by-Step</span> Process
            </h2>
            <Link href="/how-it-works" className={cta({ size: "lg" })}>
              How It Works
              <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
            </Link>
          </div>
          <div className="mt-12 md:mt-16">
            <ProcessSteps
              steps={STEPS}
              photos={{
                list: [
                  { src: mantleDetail, alt: "Close-up of the cracking on a Mickey Mantle card before restoration", aspect: "1" },
                  { src: mantleInHand, alt: "The same Mickey Mantle card after restoration, held in a blue glove", aspect: "1", position: "50% 45%" },
                ],
                forStep: [0, 0, 0, 0, 1, 1],
              }}
              phonePhoto={{ src: mantleDetail, alt: "", aspect: "4/3", position: "50% 45%" }}
            />
          </div>
        </div>
      </section>

      {/* ── Why collectors choose us ──────────────────────────────────── */}
      <section aria-labelledby="reasons-heading" className="surface-white">
        <div className="wrap section-y grid items-center gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* The years figure as a cobalt slab (type, not another photo). */}
          <div data-reveal className="surface-cobalt relative isolate mx-auto hidden w-full max-w-[34rem] overflow-hidden rounded-[22px] p-8 md:block md:p-12">
            <span aria-hidden className="halftone-dots -right-[20%] -bottom-[25%] h-[90%] w-[80%]" />
            <p className="relative">
              <span className="block font-display text-[clamp(7rem,30vw,12rem)] font-black leading-[0.8] tracking-[-0.02em] text-sun">{YEARS.figure}</span>
              <span className="mt-4 block max-w-[14ch] font-display text-[clamp(2rem,7vw,3rem)] font-extrabold leading-[0.95] text-white">{YEARS.rest}</span>
            </p>
          </div>
          <div>
            <h2 id="reasons-heading" data-reveal className="display-lg text-ink">
              {REASONS.title}
            </h2>
            <p data-reveal className="lead mt-6 text-ink-soft">{REASONS.lead}</p>
            <ul data-reveal="stagger" className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {REASONS.items.map((item, i) => {
                const Icon = REASON_ICONS[i] ?? BadgeCheck;
                return (
                  <li key={item.title} className="border-t-2 border-ink pt-5">
                    <span aria-hidden className="grid size-11 place-items-center rounded-xl bg-cobalt-wash text-cobalt">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-4 font-display text-[26px] font-extrabold leading-[1] text-ink">{item.title}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section aria-labelledby="faq-heading" className="surface-chalk">
        <div className="wrap section-y grid gap-x-20 gap-y-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <div className="md:sticky md:top-[calc(var(--header-h)+2.5rem)] md:self-start">
            <p className="eyebrow mb-4 text-cobalt">Before You Order</p>
            <h2 id="faq-heading" className="display-md text-ink">
              Frequently asked questions
            </h2>
            <Link href="/faq" className={cta({ tone: "outline", className: "mt-8" })}>
              See all FAQs
              <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
            </Link>
          </div>
          <div data-reveal className="border-t-2 border-ink">
            {FAQ.map((item, i) => (
              <details key={item.q} open={i === 0} className="group border-b border-ink/20">
                <summary className="flex min-h-16 cursor-pointer list-none items-center gap-5 py-5 select-none [&::-webkit-details-marker]:hidden">
                  <span className="flex-1 text-lg font-extrabold leading-snug text-ink transition-colors duration-150 group-hover:text-cobalt md:text-xl">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink shadow-[0_0_0_1px_var(--line)] transition-[rotate,background-color] duration-300 ease-[var(--ease-out)] group-open:rotate-45 group-open:bg-sun motion-reduce:transition-none"
                  >
                    <Plus className="size-5" strokeWidth={2} />
                  </span>
                </summary>
                <div className="pb-7 pr-4 md:pr-16">
                  <p className="max-w-[62ch] text-base leading-relaxed text-ink-soft md:text-[17px]">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Terms of Service ──────────────────────────────────────────── */}
      <section aria-labelledby="terms-heading" className="surface-white">
        <div className="wrap section-y">
          <div className="grid gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
            <h2 id="terms-heading" className="display-md text-ink">
              Terms of Service
            </h2>
            <p className="max-w-[46ch] text-[17px] leading-relaxed text-ink-soft md:text-lg">
              By placing an order you agree to these terms. Key points are summarized below.{" "}
              <Link href="/terms" className="tlink text-cobalt">Read the full terms</Link>
            </p>
          </div>
          <div data-reveal="stagger" className="mt-12 grid grid-cols-1 gap-x-14 gap-y-10 md:mt-14 md:grid-cols-2">
            {TOS_HIGHLIGHTS.map(({ title, body, icon: Icon }) => (
              <div key={title} className="flex gap-5 border-t-2 border-ink pt-6">
                <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-xl bg-chalk text-ink">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <h3 className="mb-2 text-xl font-extrabold leading-snug text-ink">{title}</h3>
                  <p className="text-[15px] leading-relaxed text-ink-soft">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="surface-sun mt-14 rounded-[22px] p-7 md:mt-16 md:p-10">
            <p className="max-w-[80ch] text-[16px] leading-relaxed md:text-[17px]">
              <strong className="font-extrabold">Important:</strong> All sales are final once work begins. Turnaround times are estimates only and are not guaranteed.
              The Card Doc LLC is not responsible for loss or damage during transit. Restoration results vary by card condition.
              By submitting an order, you acknowledge and agree to the full{" "}
              <Link href="/terms" className="font-extrabold underline decoration-2 underline-offset-4 hover:decoration-cobalt">Terms and Conditions</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ── Closing ───────────────────────────────────────────────────── */}
      <section aria-labelledby="close-heading" className="surface-cobalt relative isolate overflow-hidden">
        <span aria-hidden className="halftone-dots -left-[10%] -top-[20%] h-[140%] w-[60%]" />
        <div className="wrap relative py-24 text-center md:py-36">
          <h2 id="close-heading" data-reveal className="mx-auto max-w-5xl font-display text-[clamp(3rem,7.4vw,6.75rem)] font-black leading-[0.88] tracking-[-0.01em] [text-wrap:balance]">
            <span className="block text-white">Your Collection Means Something.</span>
            <span className="mt-2 block text-sun">We Understand Why.</span>
          </h2>
          <p data-reveal className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-[#e6ebff] md:text-xl">
            From childhood favorites to prized collectibles, every card deserves thoughtful care.
          </p>
          <div data-reveal className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/tier-selection" className={cta({ size: "lg" })}>
              Explore Restoration Services
              <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
            </Link>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={cta({ tone: "outline-light", size: "lg" })}>
              Contact Us
              <ArrowUpRight aria-hidden className="size-5" strokeWidth={2} />
              <InstagramNote />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
