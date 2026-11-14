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
  CardSprite,
  ClinicScene,
  DocPortrait,
  DocSprite,
  HealSparkles,
  HpBar,
  MenuCursor,
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

/** A room sign: the butter ▶ tab that names a section. */
function Eyebrow({ children, tone = "floor" }: { children: React.ReactNode; tone?: "floor" | "night" }) {
  return (
    <p
      className={`inline-flex h-8 items-center gap-2 px-3 font-pixel text-xs uppercase leading-none px-frame ${
        tone === "night" ? "bg-night-raise text-butter" : "bg-butter text-ink"
      }`}
    >
      <span aria-hidden className="text-coral-deep">▶</span>
      {children}
    </p>
  );
}

/** Section headline: chunky Jersey with a hard wall-peach pixel shadow. */
const H2 =
  "font-heading uppercase leading-[0.92] text-ink text-[clamp(2.5rem,9vw,4.75rem)] [text-shadow:4px_4px_0_var(--wall)]";

/** A photo in a pixel window, with its name on a butter tab. */
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
    <Window as="figure" tone="ink" title={label} className={`p-0 md:p-0 ${className}`}>
      <div className="p-2.5 pt-5 md:p-3 md:pt-5">{children}</div>
      {detail && (
        <figcaption className="flex items-center gap-2 border-t-[3px] border-dashed border-tile px-4 py-3">
          <span aria-hidden className="size-2 shrink-0 bg-mint-deep" />
          <span className="text-sm text-ink-soft">{detail}</span>
        </figcaption>
      )}
    </Window>
  );
}

/** Scene coordinates are in the art's own pixels; --s is the whole-number scale. */
const at = (x: number, y: number): React.CSSProperties => ({
  left: `calc(${x}px * var(--s))`,
  top: `calc(${y}px * var(--s))`,
});
const spriteSize = (w: number) => ({ width: `calc(${w}px * var(--s))`, height: "auto" }) as React.CSSProperties;

/**
 * The front desk: the clinic scene drawn at a whole-number scale (2x on
 * phones, 3x on tablets and wide desktops) and cropped to its column, so
 * every art pixel stays square. The Doc waits on the waiting-room floor and
 * a hurt card hops on the mat, about to check in.
 */
function FrontDesk() {
  return (
    <div className="relative h-[calc(140px*var(--s))] overflow-hidden [--s:2] md:[--s:3] lg:[--s:2] xl:[--s:3]">
      <div className="absolute top-0 left-1/2 w-[calc(240px*var(--s))] -translate-x-1/2">
        <ClinicScene priority label="The Card Doc clinic: a front desk with a healing station, a waiting room and a tiled floor" />
        <span aria-hidden className="absolute" style={at(140, 68)}>
          <DocSprite scale={1} className="specimen-land" style={spriteSize(24)} />
        </span>
        <span aria-hidden className="absolute font-pixel leading-none text-coral-deep px-blink" style={{ ...at(149, 58), fontSize: "calc(8px * var(--s))" }}>
          !
        </span>
        <span aria-hidden className="absolute px-bob" style={at(111, 82)}>
          <CardSprite variant="hurt" scale={1} style={spriteSize(18)} />
        </span>
      </div>
    </div>
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
      <section className="relative overflow-hidden border-b-[3px] border-ink">
        <TrustPills cardsRestored={cardsRestored} className="hero-in relative z-20 mx-auto max-w-7xl px-4 pt-4 md:px-10 md:pt-6" />

        <div className="relative mx-auto grid max-w-7xl gap-x-10 px-4 pt-4 pb-14 md:px-10 md:pt-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:pb-20">
          {/* The clinic screen */}
          <div className="hero-in -mx-4 md:mx-auto lg:order-2 lg:mx-0" style={{ ["--d" as string]: 80 }}>
            <Window tone="ink" title="Front desk" className="mx-0 p-0 max-md:shadow-none md:p-0">
              <div className="p-[6px] md:p-2">
                <FrontDesk />
              </div>
            </Window>
          </div>

          {/* The Doc greets the visitor */}
          <div className="relative z-10 -mt-8 md:mt-0 lg:order-1 lg:pr-4">
            <Window variant="dialog" className="hero-in px-5 pt-6 pb-9 md:px-8 md:pt-8 md:pb-10" style={{ ["--d" as string]: 180 }}>
              <div className="flex items-center gap-3">
                <DocPortrait size="sm" nameplate="The Doc" alt="" />
                <StatusChip status="check-in" />
              </div>
              <h1 className="mt-5 font-heading uppercase leading-[0.9] text-[clamp(2.6rem,12vw,4.6rem)] lg:text-[clamp(3.2rem,4.6vw,4.6rem)]">
                <span className="block text-ink">{HERO.headline[0]}</span>
                <span className="block text-coral-deep">{HERO.headline[1]}</span>
              </h1>
              <p className="mt-4 max-w-[34rem] text-lg font-medium leading-relaxed text-ink-soft md:text-xl [text-wrap:pretty]">
                {TAGLINE}
              </p>
              <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                <Link href="/tier-selection" className={pixelButton({ size: "lg", className: "nudge-arrow" })}>
                  Restoration Pricing
                </Link>
                <Link href="/prep" className={pixelButton({ tone: "panel", size: "lg" })}>
                  PSA Prep Pricing
                </Link>
              </div>
            </Window>

            <Window tone="ink" title="We never" className="hero-in mt-8 p-0 md:p-0" style={{ ["--d" as string]: 300 }}>
              <ul className="grid pt-3 sm:grid-cols-3 sm:pt-2">
                {PROCESS.never.map((item, i) => (
                  <li
                    key={item}
                    className={`flex items-center gap-2.5 px-4 py-3 ${i > 0 ? "border-t-2 border-dashed border-tile sm:border-t-0 sm:border-l-2" : ""}`}
                  >
                    <span aria-hidden className="grid size-6 shrink-0 place-items-center bg-rx-soft font-pixel text-xs leading-none text-coral-deep px-frame">
                      ×
                    </span>
                    <span className="text-sm font-semibold leading-tight text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </Window>
          </div>
        </div>
      </section>

      {/* ── Intake: a real patient, and the slot for yours ─────────────── */}
      <div className="wall-band">
        <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-10 px-4 pt-14 pb-12 md:px-10 md:pt-20 lg:grid-cols-12 lg:items-end">
          <div className="specimen-land relative lg:col-span-7">
            <Window as="figure" tone="ink" className="p-2 md:p-3">
              <div className="relative">
                <Image
                  src={mantlePair}
                  alt="A cracked Mickey Mantle card in a black glove next to the same card after restoration in a blue glove"
                  sizes="(min-width: 1024px) 680px, 92vw"
                  className="h-auto w-full"
                  priority
                />
                <StatusChip status="treatment" className="absolute bottom-2 left-2">ADMITTED</StatusChip>
                <StatusChip status="discharged" className="absolute right-2 bottom-2" />
              </div>
              <figcaption className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-1 pb-1">
                <HpBar level={0.18} />
                <span className="font-heading text-lg uppercase leading-none text-ink">{mantle?.card ?? "Mickey Mantle"}</span>
                <HpBar level={1} label={null} />
              </figcaption>
            </Window>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] items-end gap-5 sm:gap-8 lg:col-span-5 lg:grid-cols-[minmax(0,1fr)_auto]">
            <CardSlot className="w-full max-w-[16rem]" />

            <div className="flex flex-col items-center gap-4 pb-2">
              <div className="relative grid size-32 place-items-center bg-butter px-frame-shadow sm:size-36 lg:size-36">
                <HealSparkles count={3} />
                <span className="relative z-[1] px-3 text-center font-heading text-xl uppercase leading-[1.02] text-ink sm:text-2xl">
                  Free<br />Photo<br />Review
                </span>
              </div>
              <CardSprite variant="healed" scale={3} />
            </div>
          </div>
        </div>
      </div>

      <TrustedBy />

      <ReviewsBand title="What our customers say" />

      {/* ── Symptoms ticker ────────────────────────────────────────────── */}
      <section aria-label="What we can fix" className="overflow-hidden border-y-[3px] border-ink bg-night py-5 md:py-7">
        <VelocityMarquee>
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1 || undefined} className={`flex items-center ${copy === 1 ? "marquee-dupe" : ""}`}>
              {FIXES.map((word, i) => (
                <li key={word} className="flex items-center">
                  <span className={`whitespace-nowrap font-heading uppercase leading-none text-[clamp(2.5rem,7vw,5.5rem)] ${i % 2 ? "text-mint" : "text-panel"}`}>
                    {word}
                  </span>
                  <span aria-hidden className="mx-6 shrink-0 md:mx-10">
                    <PixelIcon name="heart-plus" size={32} />
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </VelocityMarquee>
      </section>

      {/* ── Results: admitted vs discharged ────────────────────────────── */}
      <section aria-labelledby="results-heading" className="relative">
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-10 md:py-28">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div data-reveal className="lg:col-span-7">
              <Eyebrow>Why Collectors Trust Us</Eyebrow>
              <h2 id="results-heading" className={`mt-5 ${H2}`}>
                Proven Results
              </h2>
            </div>
            <Window data-reveal variant="dialog" className="lg:col-span-5">
              <p className="text-lg font-medium leading-relaxed text-ink">
                Hundreds of cards restored and prepped. We don&apos;t just claim results, we show them.
              </p>
              <Link href="/tier-selection" className={pixelButton({ className: "mt-5" })}>See Our Services</Link>
            </Window>
          </div>

          <div className="mt-14 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-12">
            <div data-reveal className="lg:col-span-7">
              <PhotoWindow label={mantle?.card ?? "Mickey Mantle"} detail={mantle?.detail}>
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <StatusChip status="treatment" className="self-start">ADMITTED</StatusChip>
                    <HpBar level={0.18} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusChip status="discharged" />
                    <HpBar level={1} animate className="w-full" />
                  </div>
                </div>
                <BeforeAfter
                  before={mantleBefore}
                  after={mantleAfter}
                  beforeAlt="A Mickey Mantle card before restoration, cracked across the face and jersey"
                  afterAlt="The same Mickey Mantle card after restoration"
                  sizes="(min-width: 1280px) 700px, (min-width: 1024px) 56vw, 92vw"
                />
              </PhotoWindow>
              {mantle && (
                <Window variant="dialog" className="mt-8 max-w-2xl">
                  <p className="text-[15px] leading-relaxed text-ink-soft">{mantle.caption}</p>
                </Window>
              )}
            </div>

            <div className="grid gap-12 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              <div data-reveal style={{ transitionDelay: "100ms" }}>
                <PhotoWindow label={charmanderCase?.card ?? "Charmander"} detail={charmanderCase?.detail}>
                  <div className="bg-wall px-6 py-5">
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

          <dl className="mt-16 grid gap-8 sm:grid-cols-2 md:mt-20">
            {[
              { stat: cardsRestored, label: "Cards Restored", icon: "heart-plus" as PixelIconName, tone: "night" as const },
              { stat: "Free", label: "Photo Review", icon: "camera" as PixelIconName, tone: "frame" as const },
            ].map((s, i) => (
              <Window
                key={s.label}
                data-reveal
                tone={s.tone}
                style={{ transitionDelay: `${i * 90}ms` }}
                className={`flex items-center gap-5 px-6 py-6 md:px-8 md:py-8 ${s.tone === "night" ? "text-stage-fg" : "text-ink"}`}
              >
                <span aria-hidden className={`grid size-16 shrink-0 place-items-center px-frame md:size-20 ${s.tone === "night" ? "bg-night-raise" : "bg-butter"}`}>
                  <PixelIcon name={s.icon} size={48} />
                </span>
                <div className="flex min-w-0 flex-col-reverse gap-2">
                  <dt className={`font-pixel text-xs uppercase md:text-sm ${s.tone === "night" ? "text-stage-muted" : "text-ink-soft"}`}>{s.label}</dt>
                  <dd className="font-heading text-[clamp(3.25rem,9vw,6rem)] leading-[0.85] tabular-nums">
                    <CountUp value={s.stat} />
                  </dd>
                </div>
              </Window>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Why collectors choose us: the clinic's notice board ────────── */}
      <section aria-labelledby="reasons-heading" className="wall-band border-t-[3px] border-ink">
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-14 md:px-10 md:pt-24 md:pb-20">
          <div className="flex items-end justify-between gap-6">
            <h2 id="reasons-heading" data-reveal className="max-w-3xl font-heading uppercase leading-[0.92] text-ink text-[clamp(2.3rem,6vw,4rem)] [text-shadow:4px_4px_0_var(--panel)]">
              {REASONS.title}
            </h2>
            <DocSprite scale={3} className="hidden shrink-0 md:block" />
          </div>
          <ul data-reveal="stagger" className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {REASONS.items.map((item, i) => (
              <li key={item.title} className="flex">
                <Window tone="frame" className="flex w-full flex-col">
                  <span aria-hidden className={`grid size-14 place-items-center px-frame ${REASON_TILE[i % REASON_TILE.length]}`}>
                    <PixelIcon name={REASON_ICONS[i] ?? "heart-plus"} size={32} />
                  </span>
                  <h3 className="mt-5 font-heading text-2xl uppercase leading-[1.02] text-ink">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
                </Window>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Services: the treatment menu ───────────────────────────────── */}
      <section aria-labelledby="services-heading" className="border-t-[3px] border-ink">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-10 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="services-heading" data-reveal className={H2}>
              Services
            </h2>
            <div aria-hidden className="flex items-end gap-3 pb-2">
              <CardSprite variant="hurt" scale={3} animate={false} />
              <span className="font-pixel text-sm text-coral-deep px-nudge">▶</span>
              <CardSprite variant="healed" scale={3} />
            </div>
          </div>

          <Window data-reveal tone="frame" title="Treatment menu" className="mt-10 p-2 md:mt-12 md:p-3">
            <ul>
              {SERVICES.map(({ href, name, line, price, action }, i) => (
                <li key={href} className={i > 0 ? "border-t-[3px] border-dashed border-tile" : ""}>
                  <Link
                    href={href}
                    className="menu-cursor-item group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4 px-3 py-5 transition-colors duration-100 [transition-timing-function:steps(1,end)] hover:bg-butter/35 focus-visible:bg-butter/35 md:grid-cols-[1.25rem_auto_minmax(0,1fr)_auto] md:gap-x-6 md:px-5 md:py-6"
                  >
                    <MenuCursor className="hidden text-lg md:inline-block" />
                    <span aria-hidden className={`grid size-16 place-items-center px-frame md:size-20 ${SERVICE_TILE[i % SERVICE_TILE.length]}`}>
                      <PixelIcon name={SERVICE_ICONS[href] ?? "heart-plus"} size={48} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-heading text-[2rem] uppercase leading-none text-ink md:text-[2.5rem]">{name}</span>
                      <span className="mt-2 block text-[15px] leading-relaxed text-ink-soft">{line}</span>
                    </span>
                    <span className="col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center md:col-span-1 md:flex-col md:items-end">
                      <span className="inline-flex min-h-8 items-center self-start bg-panel px-2.5 py-1 font-pixel text-xs uppercase text-ink tabular-nums px-frame sm:self-auto">
                        {price}
                      </span>
                      <span className={pixelButton({ className: "w-full sm:w-auto md:min-w-40" })}>{action}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Window>
        </div>
      </section>

      {/* ── FAQ: the records window ────────────────────────────────────── */}
      <section aria-labelledby="faq-heading" className="relative border-t-[3px] border-ink bg-panel/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1fr_1.5fr] md:gap-14 md:px-10 md:py-28">
          <div className="md:sticky md:top-32 md:self-start">
            <Eyebrow>Before You Order</Eyebrow>
            <h2 id="faq-heading" className="mt-5 mb-7 font-heading uppercase leading-[0.92] text-ink text-[clamp(2.3rem,5vw,3.75rem)] [text-shadow:4px_4px_0_var(--wall)]">
              Frequently asked questions
            </h2>
            <div className="flex items-end gap-5">
              <Link href="/faq" className={pixelButton({ tone: "panel" })}>See all FAQs</Link>
              <span aria-hidden className="hidden md:block">
                <PixelIcon name="clipboard" size={48} />
              </span>
            </div>
          </div>
          <Window data-reveal tone="ink" className="p-0 md:p-0">
            {FAQ.map((item, i) => (
              <details key={item.q} className={`group ${i > 0 ? "border-t-[3px] border-dashed border-tile" : ""}`}>
                <summary className="menu-cursor-item flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-5 select-none hover:bg-butter/30 md:px-6 [&::-webkit-details-marker]:hidden">
                  <MenuCursor className="hidden shrink-0 md:inline-block" />
                  <span className="flex-1 font-heading text-xl leading-tight text-ink md:text-2xl">{item.q}</span>
                  <span
                    aria-hidden
                    className="grid size-9 shrink-0 place-items-center bg-panel font-pixel text-base leading-none text-ink px-frame group-open:bg-mint group-hover:bg-butter group-open:group-hover:bg-mint"
                  >
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                </summary>
                <div className="px-4 pb-6 md:px-6 md:pl-14">
                  <p className="max-w-[62ch] border-l-[3px] border-mint pl-4 text-base leading-relaxed text-ink-soft">{item.a}</p>
                </div>
              </details>
            ))}
          </Window>
        </div>
      </section>

      {/* ── Terms: the records office ──────────────────────────────────── */}
      <section aria-labelledby="terms-heading" className="border-t-[3px] border-ink py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <div className="mb-12 grid gap-6 md:mb-14 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-2xl">
              <h2 id="terms-heading" className="mb-5 font-heading uppercase leading-[0.92] text-ink text-[clamp(2.3rem,5vw,3.75rem)] [text-shadow:4px_4px_0_var(--wall)]">
                Terms of Service
              </h2>
              <Window variant="dialog" next={false} className="py-4 md:py-5">
                <p className="text-base leading-relaxed text-ink-soft">
                  By placing an order you agree to these terms. Key points are summarized below.{" "}
                  <Link href="/terms" className="font-semibold text-coral-deep underline decoration-2 underline-offset-2">Read the full terms</Link>
                </p>
              </Window>
            </div>
          </div>
          <div data-reveal="stagger" className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {TOS_HIGHLIGHTS.map(({ title, body, icon }) => (
              <Window key={title} tone="ink" className="flex gap-4 md:gap-5 md:p-7">
                <span aria-hidden className="grid size-12 shrink-0 place-items-center bg-wall px-frame">
                  <PixelIcon name={icon} size={32} />
                </span>
                <div className="min-w-0">
                  <h3 className="mb-2 font-heading text-2xl uppercase leading-none text-ink">{title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft md:text-[15px]">{body}</p>
                </div>
              </Window>
            ))}
          </div>
          <div className="mt-10 flex gap-4 bg-butter/45 p-5 text-sm leading-relaxed text-ink px-frame-shadow md:p-6">
            <span aria-hidden className="hidden shrink-0 sm:block">
              <PixelIcon name="clipboard" size={32} />
            </span>
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
      <section aria-labelledby="close-heading" className="stage stage-light relative overflow-hidden border-t-[3px] border-ink">
        <HealSparkles count={6} className="opacity-90" />
        <div className="relative z-[1] mx-auto max-w-5xl px-4 pt-20 pb-12 text-center md:px-10 md:pt-28">
          <h2 id="close-heading" data-reveal className="font-heading uppercase leading-[0.92] text-[clamp(2.3rem,7vw,4.75rem)] [text-shadow:4px_4px_0_var(--night-raise)]">
            <span className="block text-stage-fg">Your Collection Means Something.</span>
            <span className="block text-butter">We Understand Why.</span>
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-xl text-lg font-medium leading-relaxed text-stage-muted md:text-xl">
            From childhood favorites to prized collectibles, every card deserves thoughtful care.
          </p>
          <div data-reveal className="mt-10 flex flex-col justify-center gap-5 sm:flex-row">
            <Link href="/tier-selection" className={pixelButton({ size: "lg" })}>Explore Restoration Services</Link>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className={pixelButton({ tone: "panel", size: "lg" })}>
              Contact Us
              <span className="sr-only">on Instagram (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <div aria-hidden className="relative z-[1] flex items-end justify-center gap-6 md:gap-10">
          <DocSprite scale={3} />
          <CardSprite variant="healed" scale={3} />
        </div>
        <div aria-hidden className="tile-floor-sm relative z-[1] h-12 border-t-[3px] border-ink" />
      </section>
    </div>
  );
}
