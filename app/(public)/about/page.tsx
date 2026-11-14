import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { canonical } from "@/lib/seo";
import { ArrowUpRight, X } from "lucide-react";
import { SplitReveal } from "@/components/motion/split-reveal";
import { ExpandingStage } from "@/components/motion/expanding-stage";
import { CountUp } from "@/components/motion/count-up";
import { CustomerReviews } from "@/components/marketing/customer-reviews";
import { PhotoFigure } from "@/components/about/photo-figure";
import { ResultsGallery } from "@/components/about/results-gallery";
import { getCardsFinishedStat } from "@/lib/site-stats";
import { FOUNDERS, FOUNDERS_MESSAGE, HERO, PROCESS, REASONS, RESULTS, STORY } from "@/lib/about";
import { siteUrl } from "@/lib/site-url";
import { CardSprite, DocPortrait, DocSprite, HealSparkles, HpBar, PixelIcon, StatusChip, WallBand, Window, pixelButton, type PixelIconName } from "@/components/pixel";

// The finished-cards figure is read from the database; refresh it hourly.
export const revalidate = 3600;

// The site's own address (set in Netlify), so the share image and structured
// data point at the domain the page is served from.
const SITE = siteUrl();
// The root layout has no metadataBase, so the share image needs a full URL.
const OG_IMAGE = { url: `${SITE}/og-image.png`, width: 1254, height: 1254 };
const INSTAGRAM = "https://www.instagram.com/the_card_doc";
const DESCRIPTION =
  "Built by collectors, trusted with collections. Meet Owen and Gavin, the collectors behind The Card Doc, with 30+ years of combined collecting experience.";

export const metadata: Metadata = {
  alternates: canonical("/about"),
  title: "About Us | The Card Doc",
  description: DESCRIPTION,
  openGraph: {
    title: "About The Card Doc",
    description: DESCRIPTION,
    url: `${SITE}/about`,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary",
    title: "About The Card Doc",
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

// Only what's true: the two founders by first name, the shop's town (as on
// How It Works), the US service area and the Instagram the site points to.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About The Card Doc",
  url: `${SITE}/about`,
  description: DESCRIPTION,
  mainEntity: {
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: "The Card Doc",
    url: SITE,
    description: "Trading card restoration and grading prep, done by hand.",
    founder: FOUNDERS.map((f) => ({ "@type": "Person", name: f.name })),
    address: { "@type": "PostalAddress", addressLocality: "Ridgewood", addressRegion: "NJ", addressCountry: "US" },
    areaServed: { "@type": "Country", name: "United States" },
    sameAs: [INSTAGRAM],
  },
};

// Section headings: uppercase Jersey with the wall-peach pixel shadow.
const sectionTitle = "font-heading uppercase text-[2.5rem] md:text-6xl tracking-[0.02em] leading-[0.95]";
const onFloor = "[text-shadow:3px_3px_0_var(--wall)]";

// Decorative pixel icons beside each reason on the clinic's Rx pad.
const REASON_ICONS: PixelIconName[] = ["heart-plus", "star", "magnifier", "shield"];
// Decorative pixel icons beside each treatment method.
const METHOD_ICONS: PixelIconName[] = ["sparkle", "bandage", "clock", "box", "brush"];

/** A small butter tab with the ▶ marker, like a sign on the clinic wall. */
function WallTab({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`inline-flex h-8 items-center gap-2 bg-butter px-3 font-pixel text-xs uppercase tracking-[0.04em] text-ink px-frame md:text-[13px] ${className}`}>
      <span aria-hidden className="text-coral-deep">▶</span>
      {children}
    </p>
  );
}

export default async function AboutPage() {
  const cardsFinished = await getCardsFinishedStat();

  return (
    <>
      {/* ── A. Hero: the front desk. Headline on the wall, the doc's line in a dialog, the discharged Mantle on the chart ── */}
      <section className="page-glow relative overflow-x-clip border-b-[3px] border-ink">
        <div className="max-w-7xl mx-auto px-4 md:px-10 pt-10 pb-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28 grid gap-12 lg:gap-x-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 min-w-0">
            <WallTab className="hero-in mb-6 md:mb-8">About Us</WallTab>
            <h1 className="font-heading uppercase text-ink tracking-[0.01em] leading-[0.92] text-[clamp(2.6rem,12vw,4.5rem)] md:text-[clamp(4.25rem,8.5vw,5.5rem)] lg:text-[clamp(3.75rem,5.6vw,5.25rem)] [text-shadow:3px_3px_0_var(--wall)]">
              <span className="block">
                <SplitReveal text={HERO.headline[0]} lines={["Built by", "Collectors."]} step={80} />
              </span>
              <span className="block mt-[0.14em] text-coral-deep sm:pl-[0.9em]">
                <SplitReveal text={HERO.headline[1]} lines={["Trusted with", "Collections."]} delay={240} step={80} />
              </span>
            </h1>
            <div className="hero-in px-window px-dialog mt-8 md:mt-10 flex max-w-xl items-start gap-4 p-4 pr-9 md:p-5 md:pr-10" style={{ ["--d" as string]: 520 }}>
              <DocPortrait size="sm" alt="" className="hidden sm:inline-flex" />
              <p className="text-lg md:text-xl font-medium text-ink leading-relaxed">{HERO.subheadline}</p>
              <span aria-hidden className="px-dialog-next">▼</span>
            </div>
            <div className="hero-in mt-9 flex flex-col sm:flex-row gap-4" style={{ ["--d" as string]: 620 }}>
              <Link href="/tier-selection" className={pixelButton({ size: "lg", className: "nudge-arrow" })}>
                Explore Restoration Services <span className="arrow" aria-hidden>→</span>
              </Link>
              <a href="#founders" className={pixelButton({ tone: "panel", size: "lg" })}>
                Meet the Founders
              </a>
            </div>
          </div>

          {/* The patient's chart: a real photo, framed in pixel UI */}
          <figure className="relative mx-auto w-full max-w-[20rem] sm:max-w-[23rem] lg:max-w-[25rem] lg:col-span-5 lg:col-start-8 lg:justify-self-end">
            <div className="specimen-land">
              <div className="px-window-ink p-3 md:p-4">
                <div aria-hidden className="mb-3 flex items-center justify-between gap-3">
                  <StatusChip status="discharged" />
                  <PixelIcon name="heart-plus" size={32} />
                </div>
                <div className="relative bg-ink p-[3px]">
                  <Image
                    src={HERO.photo.src}
                    alt={HERO.photo.alt}
                    preload
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 368px, 320px"
                    className="block w-full h-auto"
                  />
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2">
                    <HealSparkles count={4} />
                  </span>
                </div>
                <figcaption className="flex items-baseline justify-between gap-3 pt-3">
                  <span className="font-heading text-xl uppercase tracking-[0.02em] text-ink">Mickey Mantle</span>
                  <span className="rx-label text-mint-deep">After restoration</span>
                </figcaption>
                <HpBar level={1} animate className="mt-3" />
              </div>
            </div>
          </figure>
        </div>
      </section>

      {/* ── B. How it all started: the clinic's history, kept as a chart log ── */}
      <WallBand as="section" className="pt-16 md:pt-24" sprite={<CardSprite variant="healed" scale={3} />}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end pb-10 md:pb-14">
          <h2 className={`${sectionTitle} text-ink lg:col-span-6`}>{STORY.title}</h2>
          <p className="text-lg text-ink leading-relaxed max-w-md lg:col-span-5">{STORY.lead}</p>
        </div>
      </WallBand>
      <section className="pt-12 pb-20 md:pt-16 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 md:px-10 grid gap-12">
          <ol data-reveal="stagger" className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {STORY.chapters.map((c, i) => {
              const last = i === STORY.chapters.length - 1;
              return (
                <li key={c.title} className="px-window-ink flex gap-4 p-5 md:gap-5 md:p-6">
                  <span
                    aria-hidden
                    className={`grid h-9 min-w-11 shrink-0 place-items-center px-1 font-pixel text-xs text-ink tabular-nums px-frame ${last ? "bg-mint" : "bg-powder"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading uppercase text-2xl md:text-[1.75rem] leading-[1.05] tracking-[0.02em] text-ink">{c.title}</h3>
                    <p className="mt-2.5 text-base md:text-[17px] leading-relaxed text-ink-soft max-w-[56ch]">{c.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          {STORY.photos.some((s) => s.photo) && (
            <div data-reveal="stagger" className="grid gap-8 md:grid-cols-[3fr_2fr] md:items-end">
              {STORY.photos.map((s, i) => (
                <PhotoFigure key={i} photo={s.photo} aspect={i === 0 ? "aspect-[3/2]" : "aspect-[4/5]"} sizes="(min-width: 768px) 50vw, 92vw" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── C. Meet the founders: the staff room, two ID badges and the doc's word ── */}
      <section id="founders" className="wall-band scroll-mt-24 py-20 md:py-28 overflow-x-clip">
        <div className="max-w-6xl mx-auto px-4 md:px-10">
          <h2 data-reveal className={`${sectionTitle} text-ink`}>Meet the founders</h2>
          <div data-reveal="stagger" className="mt-10 md:mt-14 grid gap-8 sm:grid-cols-2 md:gap-10">
            {FOUNDERS.map((f) => (
              <article key={f.name} className="px-window-ink overflow-hidden p-0 md:p-0">
                <div aria-hidden className="flex h-10 items-center justify-between gap-3 border-b-[3px] border-ink bg-coral-fill px-4">
                  <span className="font-pixel text-xs uppercase tracking-[0.04em] text-ink">The Card Doc</span>
                  <span className="flex gap-1.5">
                    <span className="size-2 bg-ink" />
                    <span className="size-2 bg-ink/40" />
                  </span>
                </div>
                <div className="p-5 md:p-7">
                  <PhotoFigure photo={f.portrait} aspect="aspect-[4/5]" sizes="(min-width: 640px) 45vw, 92vw" className="mb-7" />
                  <div className="flex items-end justify-between gap-4">
                    <h3 className="font-heading uppercase text-[clamp(4rem,22vw,7.5rem)] sm:text-[clamp(4rem,11vw,7.5rem)] leading-[0.82] tracking-[0.01em] text-ink [text-shadow:4px_4px_0_var(--wall)]">
                      {f.name}
                    </h3>
                    {!f.portrait && (
                      <span aria-hidden className="mb-1 grid size-16 shrink-0 place-items-center bg-butter px-frame">
                        <PixelIcon name="heart-plus" size={32} />
                      </span>
                    )}
                  </div>
                  <p className="mt-6 inline-flex min-h-8 items-center bg-muted px-2.5 py-1 rx-label text-ink px-frame">{f.facts.join(" · ")}</p>
                </div>
              </article>
            ))}
          </div>
          <div data-reveal className="px-window px-dialog mt-12 md:mt-16 flex items-start gap-4 p-5 pr-10 md:gap-6 md:p-7 md:pr-12 lg:ml-[calc(100%/12*2)]">
            <DocPortrait size="md" alt="" className="hidden sm:inline-flex" />
            <p className="font-heading uppercase text-[clamp(1.6rem,6.4vw,2.75rem)] leading-[1.02] tracking-[0.02em] text-ink max-w-3xl [text-wrap:balance]">
              {FOUNDERS_MESSAGE}
            </p>
            <span aria-hidden className="px-dialog-next">▼</span>
          </div>
        </div>
      </section>

      {/* ── D. Why collectors choose us: written up on the clinic's Rx pad ── */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 md:px-10 grid gap-10 lg:grid-cols-12 lg:gap-14 lg:items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <h2 className={`${sectionTitle} ${onFloor} text-ink`}>{REASONS.title}</h2>
            <div className="px-window mt-6 p-4 md:p-5">
              <p className="text-lg text-ink leading-relaxed">{REASONS.lead}</p>
            </div>
          </div>
          <div data-reveal className="lg:col-span-7 px-window-ink p-0 md:p-0">
            <div aria-hidden className="h-2.5 bg-coral-fill border-b-[3px] border-ink" />
            <div className="mx-5 md:mx-8 flex items-center justify-between gap-4 pt-5 pb-3.5 md:pt-6 border-b-[3px] border-ink">
              <span className="flex items-center gap-2.5 font-heading text-2xl uppercase tracking-[0.02em] text-ink">
                <PixelIcon name="heart-plus" size={32} />
                The Card Doc
              </span>
              <span className="rx-label text-ink-soft text-right">{FOUNDERS.map((f) => f.name).join(" & ")}</span>
            </div>
            <dl className="mx-5 md:mx-8 divide-y-2 divide-dashed divide-ink/20">
              {REASONS.items.map((r, i) => (
                <div key={r.title} className="flex gap-4 py-6 md:gap-5 md:py-7">
                  <span aria-hidden className="grid size-12 shrink-0 place-items-center bg-butter px-frame">
                    <PixelIcon name={REASON_ICONS[i % REASON_ICONS.length]} size={32} />
                  </span>
                  <div className="min-w-0">
                    <dt className="font-heading uppercase text-2xl leading-[1.05] tracking-[0.02em] text-ink">{r.title}</dt>
                    <dd className="mt-2 text-[15px] md:text-base leading-relaxed text-ink-soft max-w-[52ch]">{r.body}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── E. Behind the restoration: the treatment room. Close-up on the light box, methods on the chart ── */}
      <section className="tile-floor-sm border-t-[3px] border-ink pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-6xl mx-auto px-4 md:px-10 grid gap-y-10 md:gap-y-12 lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
            <h2 className={`${sectionTitle} ${onFloor} text-ink`}>{PROCESS.title}</h2>
            <div className="px-window mt-6 p-4 md:p-5">
              <p className="text-lg text-ink leading-relaxed">{PROCESS.lead}</p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:row-span-2">
            <div className="lg:sticky lg:top-28">
              <div className="px-window-ink p-3 md:p-4">
                <div aria-hidden className="mb-3 flex items-center justify-between gap-3">
                  <StatusChip status="triage" />
                  <HpBar level={0.2} className="w-28 sm:w-40" />
                </div>
                <PhotoFigure photo={PROCESS.photo} bare sizes="(min-width: 1152px) 520px, (min-width: 1024px) 45vw, 92vw" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:row-start-2 min-w-0">
            <ul data-reveal="stagger" className="px-window-ink divide-y-2 divide-dashed divide-ink/20 p-0 md:p-0">
              {PROCESS.methods.map((m, i) => (
                <li key={m.id} className="flex gap-4 px-5 py-5 md:px-6">
                  <span aria-hidden className="grid size-12 shrink-0 place-items-center bg-mint px-frame">
                    <PixelIcon name={METHOD_ICONS[i % METHOD_ICONS.length]} size={32} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading uppercase text-xl md:text-2xl leading-[1.05] tracking-[0.02em] text-ink">{m.name}</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{m.body}</p>
                    <PhotoFigure photo={m.photo} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 480px, 92vw" className="mt-4 max-w-sm" />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-7">
              <Window tone="ink" title="We never" className="p-5 pt-7 md:p-5 md:pt-7">
                <ul className="space-y-2.5">
                  {PROCESS.never.map((n) => (
                    <li key={n} className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
                      <span aria-hidden className="grid size-6 shrink-0 place-items-center bg-rx-soft px-frame">
                        <X className="h-3.5 w-3.5 text-coral-deep" strokeWidth={2.5} />
                      </span>
                      {n}
                    </li>
                  ))}
                </ul>
              </Window>
              <Window variant="dialog" className="p-5 pr-9 md:p-5 md:pr-9">
                <p className="text-[15px] leading-relaxed text-ink">{PROCESS.honesty}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Before you order, see{" "}
                  <Link href="/what-we-can-fix" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">what we can fix</Link>, the{" "}
                  <Link href="/faq" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">FAQ</Link> and our{" "}
                  <Link href="/terms" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">Terms of Service</Link>.
                </p>
              </Window>
            </div>
          </div>
        </div>
      </section>

      {/* ── F to H on the night stage: the patient wall, what customers say, the close ── */}
      <section>
        <ExpandingStage className="stage stage-light overflow-hidden">
          {/* F. Real results: the framed patient wall */}
          <div className="max-w-6xl mx-auto px-4 md:px-10 pt-20 pb-20 md:pt-28 md:pb-28">
            <div data-reveal className="max-w-2xl">
              <p aria-hidden className="mb-5 inline-flex h-8 items-center gap-2 bg-mint px-3 font-pixel text-xs uppercase tracking-[0.04em] text-ink px-frame">
                <span className="size-2 bg-mint-deep" />
                DISCHARGED
              </p>
              <h2 className={`${sectionTitle} text-stage-fg`}>Real results</h2>
              <p className="mt-6 text-lg text-stage-muted leading-relaxed [text-wrap:pretty]">
                Genuine before and after photos of cards we restored. Nothing here is a mock-up.
              </p>
            </div>
            <div className="mt-12 md:mt-16">
              <ResultsGallery cases={RESULTS} />
            </div>
          </div>

          {/* G. Trust: the customers' own words and a figure counted live */}
          <div className="max-w-6xl mx-auto px-4 md:px-10">
            <div className="border-t-2 border-dashed border-stage-muted/30 pt-20 md:pt-28 grid gap-10 lg:grid-cols-12 lg:items-end">
              <h2 data-reveal className={`${sectionTitle} text-stage-fg lg:col-span-7`}>What our customers say</h2>
              {cardsFinished && (
                <div data-reveal className="px-window-night p-5 md:p-6 lg:col-span-5 lg:justify-self-end lg:text-right">
                  <p className="font-heading text-[clamp(3.5rem,9vw,5.5rem)] leading-[0.9] tracking-[0.01em] text-stage-fg [font-feature-settings:'lnum'_1,'tnum'_1]">
                    <CountUp value={cardsFinished} />
                  </p>
                  <p className="mt-3 rx-label text-butter">Cards restored and prepped</p>
                  <p className="mt-1 text-[13px] text-stage-muted">Counted live from finished website orders.</p>
                </div>
              )}
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 md:px-10 pt-12 md:pt-16 pb-24 md:pb-32">
            <CustomerReviews compact />
          </div>

          {/* H. The close: the doc at the door */}
          <div className="border-t-2 border-dashed border-stage-muted/30">
            <div className="max-w-5xl mx-auto px-4 md:px-10 py-24 md:py-32 text-center">
              <div aria-hidden className="relative mx-auto mb-8 flex h-28 w-48 items-end justify-center">
                <HealSparkles count={5} />
                <DocSprite scale={3} />
              </div>
              <h2 data-reveal className="font-heading uppercase text-[clamp(2.1rem,8.6vw,5.25rem)] leading-[0.94] tracking-[0.01em] text-stage-fg">
                <span className="block">Your Collection Means Something.</span>
                <span className="block text-rx-bright">We Understand Why.</span>
              </h2>
              <p data-reveal className="mt-7 md:mt-9 text-lg md:text-xl text-stage-muted max-w-xl mx-auto leading-relaxed">
                From childhood favorites to prized collectibles, every card deserves thoughtful care.
              </p>
              <div data-reveal className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tier-selection" className={pixelButton({ size: "lg", className: "nudge-arrow" })}>
                  Explore Restoration Services <span className="arrow" aria-hidden>→</span>
                </Link>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={pixelButton({ tone: "panel", size: "lg", className: "nudge-arrow" })}
                >
                  Contact Us
                  <ArrowUpRight className="arrow h-4 w-4" strokeWidth={2} aria-hidden />
                  <span className="sr-only">on Instagram (opens in a new tab)</span>
                </a>
              </div>
              <p className="mt-8 text-sm text-stage-muted">
                Questions first? Read the{" "}
                <Link href="/faq" className="font-semibold text-rx-bright underline underline-offset-2 hover:text-stage-fg">FAQ</Link>{" "}or DM{" "}
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="font-semibold text-rx-bright underline underline-offset-2 hover:text-stage-fg">@the_card_doc</a>.
              </p>
            </div>
          </div>
        </ExpandingStage>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }} />
    </>
  );
}
