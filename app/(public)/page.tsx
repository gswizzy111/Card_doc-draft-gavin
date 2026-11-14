import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CountUp } from "@/components/motion/count-up";
import { VelocityMarquee } from "@/components/motion/velocity-marquee";
import { BeforeAfter } from "@/components/motion/before-after";
import { TrustedBy } from "@/components/marketing/trusted-by";
import { getCardsRestoredStat } from "@/lib/site-stats";
import { ORG_ID, SITE, INSTAGRAM_URL, canonical } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { ReviewsBand } from "@/components/marketing/comic-reviews";
import { TrustPills } from "@/components/marketing/trust-pills";
import { SERVICE_CARDS } from "@/lib/service-cards";
import { CardSlot } from "@/components/marketing/card-slot";
import { HERO, PROCESS, REASONS, RESULTS } from "@/lib/about";
import {
  DocSprite,
  HpBar,
  PixelIcon,
  StatusChip,
  Window,
  pixelButton,
  type PixelIconName,
} from "@/components/pixel";
import mantleBefore from "@/public/specimen-mantle-before.jpg";
import mantleAfter from "@/public/specimen-mantle-after.jpg";
import mantlePair from "@/public/before-after-mickey-mantle.png";
import charmander from "@/public/specimen-charmander.png";
import garchomp from "@/public/before-after-garchomp.png";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: canonical("/"),
};

const TAGLINE = "Expert card restoration & PSA prep — every card treated like it's worth a fortune.";
const INSTAGRAM = INSTAGRAM_URL;

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

const TOS_HIGHLIGHTS: { title: string; body: string; icon: PixelIconName }[] = [
  {
    title: "Turnaround times are estimates",
    body: "All turnaround times shown are rough estimates and not guaranteed. Actual processing may be affected by order volume, card condition, shipping delays, or circumstances outside our control.",
    icon: "clock",
  },
  {
    title: "You assume shipping risk",
    body: "You are responsible for selecting your shipping method and carrier. The Card Doc assumes no responsibility for loss or damage in transit until items are physically received and confirmed.",
    icon: "box",
  },
  {
    title: "Alteration Risk",
    body: "Cards can be flagged as altered: professional graders can detect restoration and may give an 'Altered' designation. If your card is damaged during restoration, our liability is limited to the service fee paid — not the card's market value.",
    icon: "shield",
  },
  {
    title: "No refunds after work begins",
    body: "All sales are final once restoration work has commenced. If we believe a card won't respond well to treatment, we will contact you before proceeding.",
    icon: "clipboard",
  },
];

const SERVICES = SERVICE_CARDS;

/** Pixel art for each service row, by link (the lib's lucide icons stay for other pages). */
const SERVICE_ICONS: Record<string, PixelIconName> = {
  "/tier-selection": "brush",
  "/prep": "magnifier",
  "/shop": "kit",
};
const SERVICE_TILE = ["bg-rx-soft", "bg-powder", "bg-mint"];

const REASON_ICONS: PixelIconName[] = ["user", "star", "magnifier", "shield"];
const REASON_TILE = ["bg-rx-soft", "bg-butter", "bg-powder", "bg-mint"];

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

/** A small pixel eyebrow: a square bullet and a pixel-font label. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 font-pixel text-[0.6875rem] uppercase leading-none tracking-[0.06em] text-coral-deep md:text-xs">
      <span aria-hidden className="size-1.5 bg-coral-deep" />
      {children}
    </p>
  );
}

/** Section headline: the heading sans, bold, sentence case. */
const H2 =
  "font-heading font-bold leading-[1.05] tracking-[-0.02em] text-ink text-[clamp(2.125rem,6vw,3.25rem)] [text-wrap:balance]";

/** A photo in a quiet window, with its name and detail underneath. */
function PhotoWindow({
  children,
  label,
  detail,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  detail?: string;
  className?: string;
}) {
  return (
    <Window as="figure" tone="ink" className={`p-0 md:p-0 ${className}`}>
      <div className="p-2.5 md:p-3">{children}</div>
      <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t-2 border-tile px-4 py-3">
        <span className="font-heading text-lg font-semibold leading-tight text-ink">{label}</span>
        {detail && <span className="text-sm text-ink-soft">{detail}</span>}
      </figcaption>
    </Window>
  );
}

/**
 * The patient chart: a trading-card-shaped frame around the Mickey Mantle
 * before/after slider. Drag the divider to compare damaged and restored.
 */
function PatientCard({ name }: { name: string }) {
  return (
    <figure className="relative mx-auto w-full max-w-[34rem] bg-butter p-2 px-frame-shadow md:p-2.5">
      <div className="flex items-center justify-between gap-2 bg-panel px-3 py-2 px-frame">
        <span className="font-heading text-lg font-semibold leading-none text-ink md:text-xl">{name}</span>
      </div>
      <div className="relative mt-2 px-frame">
        <BeforeAfter
          before={mantleBefore}
          after={mantleAfter}
          beforeAlt="A Mickey Mantle card before restoration, cracked across the face and jersey"
          afterAlt="The same Mickey Mantle card after restoration"
          sizes="(min-width: 1280px) 520px, (min-width: 768px) 70vw, 92vw"
          priority
        />
      </div>
      <figcaption className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 bg-panel px-3 py-3 px-frame">
        <div className="flex flex-col gap-2">
          <StatusChip status="discharged" className="self-start" />
          <HpBar level={1} animate />
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusChip status="treatment">ADMITTED</StatusChip>
          <HpBar level={0.18} label={null} className="w-full" />
        </div>
      </figcaption>
    </figure>
  );
}

export default async function HomePage() {
  const cardsRestored = await getCardsRestoredStat();
  const mantle = RESULTS.find((r) => r.id === "mickey-mantle");
  const charmanderCase = RESULTS.find((r) => r.id === "charmander");
  return (
    <div className="min-h-screen">
      <JsonLd data={structuredData()} />

      {/* ── Front desk ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <TrustPills cardsRestored={cardsRestored} className="hero-in relative z-20 mx-auto max-w-7xl px-4 pt-5 md:px-10 md:pt-7" />

        <div className="relative mx-auto grid max-w-7xl gap-x-16 px-4 pt-8 pb-16 md:px-10 md:pt-12 lg:pb-24 xl:grid-cols-[minmax(0,1fr)_auto] xl:grid-rows-[auto_auto] xl:gap-y-8">
          {/* The patient chart: drag to compare */}
          <div className="hero-in order-2 mt-12 xl:order-none xl:col-start-2 xl:row-start-1 xl:mt-0 xl:w-[30rem] xl:self-end" style={{ ["--d" as string]: 80 }}>
            <PatientCard name={mantle?.card ?? "Mickey Mantle"} />
          </div>

          {/* The headline */}
          <div className="relative z-10 order-1 lg:mx-auto lg:w-full lg:max-w-[736px] xl:order-none xl:mx-0 xl:max-w-none xl:col-start-1 xl:row-span-2 xl:row-start-1 xl:self-center">
            <div className="hero-in" style={{ ["--d" as string]: 180 }}>
              <h1 className="font-heading font-bold leading-[1.02] tracking-[-0.03em] text-[clamp(2.5rem,10vw,4rem)] xl:text-[clamp(3.25rem,4.6vw,4.5rem)] [text-wrap:balance]">
                <span className="block text-ink">{HERO.headline[0]}</span>
                <span className="block text-coral-deep">{HERO.headline[1]}</span>
              </h1>
              <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-ink-soft md:text-xl [text-wrap:pretty]">
                {TAGLINE}
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link href="/tier-selection" className={pixelButton({ size: "lg" })}>
                  Restoration Pricing
                </Link>
                <Link href="/prep" className={pixelButton({ tone: "panel", size: "lg" })}>
                  PSA Prep Pricing
                </Link>
              </div>
            </div>
          </div>

          <div className="order-3 lg:mx-auto lg:w-full lg:max-w-[736px] xl:order-none xl:col-start-2 xl:row-start-2 xl:mx-0 xl:max-w-none xl:self-start">
            <div className="hero-in mt-8 xl:mt-2" style={{ ["--d" as string]: 300 }}>
              <p className="font-pixel text-[0.6875rem] uppercase leading-none tracking-[0.06em] text-ink-soft">We never</p>
              <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-3">
                {PROCESS.never.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span aria-hidden className="font-pixel text-xs leading-none text-coral-deep">×</span>
                    <span className="text-sm font-semibold leading-tight text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Symptoms ticker ────────────────────────────────────────────── */}
      <section aria-label="What we can fix" className="overflow-hidden bg-night py-5 md:py-6">
        <VelocityMarquee>
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1 || undefined} className={`flex items-center ${copy === 1 ? "marquee-dupe" : ""}`}>
              {FIXES.map((word, i) => (
                <li key={word} className="flex items-center">
                  <span className={`whitespace-nowrap font-heading font-semibold leading-none tracking-[-0.02em] text-[clamp(1.875rem,5vw,3.5rem)] motion-reduce:text-[clamp(1.5rem,5vw,3.5rem)] ${i % 2 ? "text-mint" : "text-panel"}`}>
                    {word}
                  </span>
                  <span aria-hidden className="mx-6 shrink-0 opacity-80 motion-reduce:mx-3 md:mx-10 md:motion-reduce:mx-8">
                    <PixelIcon name="heart-plus" size={20} />
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </VelocityMarquee>
      </section>

      <TrustedBy />

      {/* ── Intake: the slot for your card ─────────────────────────────── */}
      <div className="wall-band">
        <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-10 px-4 py-14 md:px-10 md:py-20 lg:place-items-center">
          <div className="mx-auto grid w-full max-w-xl grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] items-center gap-6 sm:gap-10">
            <CardSlot className="w-full max-w-[16rem]" />

            <div className="grid size-32 place-items-center justify-self-center bg-panel px-frame-shadow sm:size-36">
              <span className="px-3 text-center font-heading text-xl font-bold leading-[1.1] text-ink sm:text-2xl">
                Free<br />Photo<br />Review
              </span>
            </div>
          </div>
        </div>
      </div>


      <ReviewsBand title="What our customers say" />

      {/* ── Results: admitted vs discharged ────────────────────────────── */}
      <section aria-labelledby="results-heading" className="relative">
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-10 md:py-32">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div data-reveal className="lg:col-span-7">
              <Eyebrow>Why Collectors Trust Us</Eyebrow>
              <h2 id="results-heading" className={`mt-4 ${H2}`}>
                Proven Results
              </h2>
            </div>
            <div data-reveal className="lg:col-span-5">
              <p className="text-lg leading-relaxed text-ink-soft">
                Hundreds of cards restored and prepped. We don&apos;t just claim results, we show them.
              </p>
              <Link href="/tier-selection" className={pixelButton({ tone: "panel", className: "mt-5" })}>See Our Services</Link>
            </div>
          </div>

          <div className="mt-14 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-10">
            <div data-reveal className="lg:col-span-7">
              <PhotoWindow label={mantle?.card ?? "Mickey Mantle"} detail={mantle?.detail}>
                <div className="relative">
                  <Image
                    src={mantlePair}
                    alt="A cracked Mickey Mantle card in a black glove next to the same card after restoration in a blue glove"
                    sizes="(min-width: 1280px) 700px, (min-width: 1024px) 56vw, 92vw"
                    className="h-auto w-full"
                  />
                  <StatusChip status="treatment" className="absolute bottom-2 left-2">ADMITTED</StatusChip>
                  <StatusChip status="discharged" className="absolute right-2 bottom-2" />
                </div>
              </PhotoWindow>
              {mantle && (
                <p className="mt-6 max-w-2xl border-l-2 border-mint-deep pl-4 text-[15px] leading-relaxed text-ink-soft">{mantle.caption}</p>
              )}
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              <div data-reveal style={{ transitionDelay: "100ms" }}>
                <PhotoWindow label={charmanderCase?.card ?? "Charmander"} detail={charmanderCase?.detail}>
                  <div className="bg-wall/60 px-6 py-5">
                    <Image src={charmander} alt="A Charmander card before and after restoration" sizes="(min-width: 1024px) 420px, 45vw" className="mx-auto h-auto w-full max-w-[22rem]" />
                  </div>
                </PhotoWindow>
              </div>
              <div data-reveal style={{ transitionDelay: "180ms" }}>
                <PhotoWindow label="Garchomp">
                  <div className="stage stage-light px-6 py-4">
                    <Image src={garchomp} alt="A Garchomp card corner before and after restoration" sizes="(min-width: 1024px) 420px, 45vw" className="relative mx-auto h-auto w-full max-w-[20rem]" />
                  </div>
                </PhotoWindow>
              </div>
            </div>
          </div>

          <dl className="mt-16 grid border-y-2 border-tile sm:grid-cols-2 md:mt-24">
            {[
              { stat: cardsRestored, label: "Cards Restored" },
              { stat: "Free", label: "Photo Review" },
            ].map((s, i) => (
              <div
                key={s.label}
                data-reveal
                style={{ transitionDelay: `${i * 90}ms` }}
                className={`flex flex-col-reverse gap-3 py-8 md:py-10 ${i > 0 ? "border-t-2 border-tile sm:border-t-0 sm:border-l-2 sm:pl-10" : ""}`}
              >
                <dt className="font-pixel text-xs uppercase tracking-[0.04em] text-ink-soft">{s.label}</dt>
                <dd className="font-heading text-[clamp(3rem,8vw,4.75rem)] font-bold leading-[0.9] tracking-[-0.03em] text-ink tabular-nums">
                  <CountUp value={s.stat} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Why collectors choose us ───────────────────────────────────── */}
      <section aria-labelledby="reasons-heading" className="wall-band">
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-20 md:px-10 md:pt-28 md:pb-28">
          <h2 id="reasons-heading" data-reveal className={`max-w-3xl ${H2}`}>
            {REASONS.title}
          </h2>
          <ul data-reveal="stagger" className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {REASONS.items.map((item, i) => (
              <li key={item.title} className="flex">
                <Window tone="ink" className="flex w-full flex-col">
                  <span aria-hidden className={`grid size-11 place-items-center ${REASON_TILE[i % REASON_TILE.length]}`}>
                    <PixelIcon name={REASON_ICONS[i] ?? "heart-plus"} size={24} />
                  </span>
                  <h3 className="mt-5 font-heading text-xl font-semibold leading-snug text-ink">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
                </Window>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────────────────── */}
      <section aria-labelledby="services-heading">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-10 md:py-32">
          <h2 id="services-heading" data-reveal className={H2}>
            Services
          </h2>

          <ul data-reveal className="mt-10 border-t-2 border-tile md:mt-12">
            {SERVICES.map(({ href, name, line, price, action }, i) => (
              <li key={href} className="border-b-2 border-tile">
                <Link
                  href={href}
                  className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-4 px-1 py-7 transition-colors duration-150 hover:bg-panel/70 focus-visible:bg-panel/70 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-8 md:px-4 md:py-8"
                >
                  <span aria-hidden className={`grid size-14 place-items-center md:size-16 ${SERVICE_TILE[i % SERVICE_TILE.length]}`}>
                    <PixelIcon name={SERVICE_ICONS[href] ?? "heart-plus"} size={32} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-heading text-2xl font-bold leading-tight tracking-[-0.01em] text-ink group-hover:text-coral-deep md:text-3xl">{name}</span>
                    <span className="mt-1.5 block text-[15px] leading-relaxed text-ink-soft">{line}</span>
                  </span>
                  <span className="col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center md:col-span-1 md:flex-col md:items-end">
                    <span className="font-pixel text-xs uppercase tracking-[0.04em] text-ink-soft tabular-nums">
                      {price}
                    </span>
                    <span className={pixelButton({ className: "w-full sm:w-auto md:min-w-40" })}>{action}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section aria-labelledby="faq-heading" className="relative bg-panel/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1fr_1.5fr] md:gap-16 md:px-10 md:py-32">
          <div className="md:sticky md:top-32 md:self-start">
            <Eyebrow>Before You Order</Eyebrow>
            <h2 id="faq-heading" className={`mt-4 mb-7 ${H2}`}>
              Frequently asked questions
            </h2>
            <Link href="/faq" className={pixelButton({ tone: "panel" })}>See all FAQs</Link>
          </div>
          <div data-reveal className="border-t-2 border-tile">
            {FAQ.map((item) => (
              <details key={item.q} className="group border-b-2 border-tile">
                <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 py-5 select-none [&::-webkit-details-marker]:hidden">
                  <span className="flex-1 font-heading text-lg font-semibold leading-snug text-ink group-hover:text-coral-deep md:text-xl">{item.q}</span>
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center bg-panel font-pixel text-sm leading-none text-ink px-frame group-open:bg-mint"
                  >
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                </summary>
                <div className="pb-6 pr-12">
                  <p className="max-w-[62ch] text-base leading-relaxed text-ink-soft">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Terms ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="terms-heading" className="py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <div className="mb-12 max-w-2xl md:mb-14">
            <h2 id="terms-heading" className={`mb-5 ${H2}`}>
              Terms of Service
            </h2>
            <p className="text-base leading-relaxed text-ink-soft md:text-lg">
              By placing an order you agree to these terms. Key points are summarized below.{" "}
              <Link href="/terms" className="font-semibold text-coral-deep underline decoration-2 underline-offset-2">Read the full terms</Link>
            </p>
          </div>
          <div data-reveal="stagger" className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
            {TOS_HIGHLIGHTS.map(({ title, body, icon }) => (
              <div key={title} className="flex gap-4 border-t-2 border-tile pt-6 md:gap-5">
                <span aria-hidden className="grid size-10 shrink-0 place-items-center bg-wall/70">
                  <PixelIcon name={icon} size={24} />
                </span>
                <div className="min-w-0">
                  <h3 className="mb-2 font-heading text-xl font-semibold leading-snug text-ink">{title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft md:text-[15px]">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 bg-butter/40 p-5 text-sm leading-relaxed text-ink px-frame md:p-6">
            <p>
              <strong>Important:</strong> All sales are final once work begins. Turnaround times are estimates only and are not guaranteed.
              The Card Doc LLC is not responsible for loss or damage during transit. Restoration results vary by card condition.
              By submitting an order, you acknowledge and agree to the full{" "}
              <Link href="/terms" className="font-semibold text-coral-deep underline decoration-2 underline-offset-2 hover:text-ink">Terms and Conditions</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ── Closing: night at the clinic ───────────────────────────────── */}
      <section aria-labelledby="close-heading" className="stage stage-light relative overflow-hidden">
        <div className="relative z-[1] mx-auto max-w-4xl px-4 pt-24 pb-24 text-center md:px-10 md:pt-32 md:pb-28">
          <DocSprite scale={2} animate={false} className="mx-auto mb-8 block" />
          <h2 id="close-heading" data-reveal className="font-heading font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(2.125rem,6vw,3.5rem)] [text-wrap:balance]">
            <span className="block text-stage-fg">Your Collection Means Something.</span>
            <span className="block text-butter">We Understand Why.</span>
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stage-muted md:text-xl">
            From childhood favorites to prized collectibles, every card deserves thoughtful care.
          </p>
          <div data-reveal className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/tier-selection" className={pixelButton({ size: "lg" })}>Explore Restoration Services</Link>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={pixelButton({ tone: "panel", size: "lg" })}>
              Contact Us
              <span className="sr-only">on Instagram (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
