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
import { DocSprite, PixelIcon, WallBand, Window, pixelButton, type PixelIconName } from "@/components/pixel";

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

// Section headings: the heading sans, bold, sentence case.
const sectionTitle = "font-heading font-bold text-[2.125rem] md:text-5xl tracking-[-0.02em] leading-[1.05] [text-wrap:balance]";

// Small pixel icons beside each reason.
const REASON_ICONS: PixelIconName[] = ["heart-plus", "star", "magnifier", "shield"];
// Decorative pixel icons beside each treatment method.
const METHOD_ICONS: PixelIconName[] = ["sparkle", "bandage", "clock", "box", "brush"];

/** A small pixel eyebrow with a square bullet. */
function WallTab({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-2 font-pixel text-[0.6875rem] uppercase leading-none tracking-[0.06em] text-coral-deep md:text-xs ${className}`}>
      <span aria-hidden className="size-1.5 bg-coral-deep" />
      {children}
    </p>
  );
}

export default async function AboutPage() {
  const cardsFinished = await getCardsFinishedStat();

  return (
    <>
      {/* ── A. Hero: the front desk. Headline on the wall, the doc's line in a dialog, the discharged Mantle on the chart ── */}
      <section className="relative overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 md:px-10 pt-10 pb-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28 grid gap-12 lg:gap-x-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 min-w-0">
            <WallTab className="hero-in mb-6 md:mb-8">About Us</WallTab>
            <h1 className="font-heading font-bold text-ink tracking-[-0.03em] leading-[1.02] text-[clamp(2.5rem,10vw,4rem)] md:text-[clamp(3.5rem,7vw,4.5rem)] lg:text-[clamp(3.25rem,4.8vw,4.5rem)]">
              <span className="block">
                <SplitReveal text={HERO.headline[0]} lines={["Built by", "Collectors."]} step={80} />
              </span>
              <span className="block mt-[0.06em] text-coral-deep">
                <SplitReveal text={HERO.headline[1]} lines={["Trusted with", "Collections."]} delay={240} step={80} />
              </span>
            </h1>
            <p className="hero-in mt-7 md:mt-8 max-w-xl text-lg md:text-xl text-ink-soft leading-relaxed [text-wrap:pretty]" style={{ ["--d" as string]: 520 }}>
              {HERO.subheadline}
            </p>
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
                <div className="relative bg-ink p-[2px]">
                  <Image
                    src={HERO.photo.src}
                    alt={HERO.photo.alt}
                    preload
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 368px, 320px"
                    className="block w-full h-auto"
                  />
                </div>
                <figcaption className="flex items-baseline justify-between gap-3 pt-3">
                  <span className="font-heading text-lg font-semibold text-ink">Mickey Mantle</span>
                  <span className="rx-label text-mint-deep">After restoration</span>
                </figcaption>
              </div>
            </div>
          </figure>
        </div>
      </section>

      {/* ── B. How it all started: the clinic's history, kept as a chart log ── */}
      <WallBand as="section" className="pt-16 md:pt-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end pb-10 md:pb-14">
          <h2 className={`${sectionTitle} text-ink lg:col-span-6`}>{STORY.title}</h2>
          <p className="text-lg text-ink-soft leading-relaxed max-w-md lg:col-span-5 lg:col-start-8">{STORY.lead}</p>
        </div>
      </WallBand>
      <section className="pt-14 pb-20 md:pt-20 md:pb-32">
        <div className="max-w-6xl mx-auto px-4 md:px-10 grid gap-12">
          <ol data-reveal="stagger" className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {STORY.chapters.map((c, i) => {
              const last = i === STORY.chapters.length - 1;
              return (
                <li key={c.title} className="flex gap-4 border-t-2 border-tile pt-6 md:gap-6">
                  <span
                    aria-hidden
                    className={`shrink-0 pt-1.5 font-pixel text-xs tabular-nums ${last ? "text-mint-deep" : "text-coral-deep"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading font-semibold text-xl md:text-2xl leading-snug tracking-[-0.01em] text-ink">{c.title}</h3>
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
      <section id="founders" className="wall-band scroll-mt-24 py-20 md:py-32 overflow-x-clip">
        <div className="max-w-6xl mx-auto px-4 md:px-10">
          <h2 data-reveal className={`${sectionTitle} text-ink`}>Meet the founders</h2>
          <div data-reveal="stagger" className="mt-10 md:mt-14 grid gap-8 sm:grid-cols-2 md:gap-10">
            {FOUNDERS.map((f) => (
              <article key={f.name} className="px-window-ink overflow-hidden p-0 md:p-0">
                <div className="p-5 md:p-7">
                  <PhotoFigure photo={f.portrait} aspect="aspect-[4/5]" sizes="(min-width: 640px) 45vw, 92vw" className="mb-6" />
                  <h3 className="font-heading font-bold text-[2.5rem] md:text-5xl leading-none tracking-[-0.03em] text-ink">
                    {f.name}
                  </h3>
                  <p className="mt-4 rx-label text-ink-soft">{f.facts.join(" · ")}</p>
                </div>
              </article>
            ))}
          </div>
          <blockquote data-reveal className="mt-14 md:mt-20 border-l-2 border-coral-deep pl-5 md:pl-8 lg:ml-[calc(100%/12*2)]">
            <p className="font-heading font-semibold text-[clamp(1.5rem,4.5vw,2.25rem)] leading-[1.2] tracking-[-0.015em] text-ink max-w-3xl [text-wrap:balance]">
              {FOUNDERS_MESSAGE}
            </p>
          </blockquote>
        </div>
      </section>

      {/* ── D. Why collectors choose us: written up on the clinic's Rx pad ── */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 md:px-10 grid gap-10 lg:grid-cols-12 lg:gap-14 lg:items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <h2 className={`${sectionTitle} text-ink`}>{REASONS.title}</h2>
            <p className="mt-6 text-lg text-ink-soft leading-relaxed">{REASONS.lead}</p>
          </div>
          <div data-reveal className="lg:col-span-7">
            <dl className="border-t-2 border-tile divide-y-2 divide-tile">
              {REASONS.items.map((r, i) => (
                <div key={r.title} className="flex gap-4 py-6 md:gap-5 md:py-7">
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center bg-butter/70">
                    <PixelIcon name={REASON_ICONS[i % REASON_ICONS.length]} size={24} />
                  </span>
                  <div className="min-w-0">
                    <dt className="font-heading font-semibold text-xl leading-snug tracking-[-0.01em] text-ink">{r.title}</dt>
                    <dd className="mt-2 text-[15px] md:text-base leading-relaxed text-ink-soft max-w-[52ch]">{r.body}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── E. Behind the restoration: the treatment room. Close-up on the light box, methods on the chart ── */}
      <section className="bg-panel/60 pt-20 pb-24 md:pt-32 md:pb-32">
        <div className="max-w-6xl mx-auto px-4 md:px-10 grid gap-y-10 md:gap-y-12 lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
            <h2 className={`${sectionTitle} text-ink`}>{PROCESS.title}</h2>
            <p className="mt-6 text-lg text-ink-soft leading-relaxed">{PROCESS.lead}</p>
          </div>

          <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:row-span-2">
            <div className="lg:sticky lg:top-28">
              <PhotoFigure photo={PROCESS.photo} sizes="(min-width: 1152px) 520px, (min-width: 1024px) 45vw, 92vw" />
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:row-start-2 min-w-0">
            <ul data-reveal="stagger" className="border-t-2 border-tile divide-y-2 divide-tile">
              {PROCESS.methods.map((m, i) => (
                <li key={m.id} className="flex gap-4 py-5">
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center bg-mint/70">
                    <PixelIcon name={METHOD_ICONS[i % METHOD_ICONS.length]} size={24} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-lg md:text-xl leading-snug tracking-[-0.01em] text-ink">{m.name}</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{m.body}</p>
                    <PhotoFigure photo={m.photo} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 480px, 92vw" className="mt-4 max-w-sm" />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-7">
              <Window tone="ink" className="p-5 md:p-6">
                <p className="rx-label text-ink-soft">We never</p>
                <ul className="mt-4 space-y-2.5">
                  {PROCESS.never.map((n) => (
                    <li key={n} className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
                      <X aria-hidden className="h-4 w-4 shrink-0 text-coral-deep" strokeWidth={1.75} />
                      {n}
                    </li>
                  ))}
                </ul>
              </Window>
              <div className="sm:pt-1">
                <p className="text-[15px] leading-relaxed text-ink">{PROCESS.honesty}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Before you order, see{" "}
                  <Link href="/what-we-can-fix" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">what we can fix</Link>, the{" "}
                  <Link href="/faq" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">FAQ</Link> and our{" "}
                  <Link href="/terms" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">Terms of Service</Link>.
                </p>
              </div>
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
                  <p className="font-heading font-bold text-[clamp(3rem,8vw,4.5rem)] leading-[0.9] tracking-[-0.03em] text-stage-fg [font-feature-settings:'lnum'_1,'tnum'_1]">
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
              <DocSprite scale={2} animate={false} className="mx-auto mb-8 block" />
              <h2 data-reveal className="font-heading font-bold text-[clamp(2.125rem,6vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-stage-fg [text-wrap:balance]">
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
