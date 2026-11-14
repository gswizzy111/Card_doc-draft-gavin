import Link from "next/link";
import { X } from "lucide-react";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { PixelViewContent } from "@/components/pixel-view-content";
import { PageHero } from "@/components/marketing/page-hero";
import { CardSprite, PixelIcon, Window, pixelButton } from "@/components/pixel";
import { ReviewsBand } from "@/components/marketing/comic-reviews";
import { TrustPills } from "@/components/marketing/trust-pills";
import { JsonLd } from "@/components/seo/json-ld";
import { ORG_ID, SITE, breadcrumbs, canonical } from "@/lib/seo";
import { getCardsRestoredStat } from "@/lib/site-stats";
import { BulkSwitch } from "@/app/(public)/tier-selection/bulk-switch";
import { BULK_PLANS, bulkPriceCents } from "@/lib/bulk-pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PSA Prep Pricing | The Card Doc",
  description: "Professional card submission prep. $25/card for cards under $1,500. 2% of declared value for high-value cards.",
  alternates: canonical("/prep"),
};

async function getPrepPrices() {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("store_config")
      .select("key, value")
      .in("key", ["prep_standard_price_cents", "prep_pre_grade_price_cents", "prep_slab_crack_price_cents", "prep_open"]);
    const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
    return {
      standardPriceCents: parseInt(map.prep_standard_price_cents ?? "2500", 10),
      preGradePriceCents: parseInt(map.prep_pre_grade_price_cents ?? "500", 10),
      slabCrackPriceCents: parseInt(map.prep_slab_crack_price_cents ?? "700", 10),
      isOpen: (map.prep_open ?? "true") !== "false",
    };
  } catch {
    return { standardPriceCents: 2500, preGradePriceCents: 500, slabCrackPriceCents: 700, isOpen: true };
  }
}

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

// Cards $1,500 and over are priced at 2% of declared value; bulk pricing takes
// its percent off that too (10% off 2% = 1.8%, 15% off = 1.7%)
const HIGH_VALUE_EXAMPLES_CENTS = [Math.round(200000 * 0.02), Math.round(500000 * 0.02)] as const;

function valueRate(percent: number) {
  return `${Number((2 * (100 - percent) / 100).toFixed(2))}%`;
}

export default async function PrepPage() {
  const [prices, cardsRestored] = await Promise.all([getPrepPrices(), getCardsRestoredStat()]);
  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "PSA Prep",
      serviceType: "Trading card grading submission prep",
      description: "Grade-ready submission prep for PSA, BGS & CGC.",
      url: `${SITE}/prep`,
      provider: { "@id": ORG_ID },
      areaServed: ["US", "PR"],
      offers: {
        "@type": "Offer",
        name: "Cards under $1,500",
        price: (prices.standardPriceCents / 100).toFixed(2),
        priceCurrency: "USD",
        url: `${SITE}/prep`,
      },
    },
    breadcrumbs([{ name: "PSA Prep Pricing", path: "/prep" }]),
  ];

  return (
    <div className="min-h-screen page-glow">
      <JsonLd data={structured} />
      <PixelViewContent contentName="PSA Prep" contentCategory="Prep" />
      <div className="max-w-5xl mx-auto px-4 md:px-10 py-12 md:py-20">

        <PageHero
          className="mb-8"
          eyebrow="Prep Service"
          title="Get Your Cards Grade-Ready"
          lines={["Get Your Cards", "Grade-Ready"]}
          lead={<>We surface-clean and prep your cards so they&apos;re submission-ready. Graders make their own call, so no grade is ever guaranteed.</>}
        />

        <TrustPills cardsRestored={cardsRestored} align="start" className="hero-in mb-12 md:mb-14" />

        {!prices.isOpen && (
          <div className="mb-10">
            <Window className="flex items-center gap-3 bg-butter py-4 font-semibold text-ink md:py-5">
              <PixelIcon name="clock" size={32} className="shrink-0" />
              Prep is temporarily paused — check back soon.
            </Window>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start hero-in" style={{ ["--d" as string]: 120 }}>
          <div className="flex flex-col gap-10">
            {/* Pricing, per number of cards (bulk pricing, lib/bulk-pricing.ts), as on the Restorations page */}
            <BulkSwitch stacked note="Bulk pricing is applied automatically at checkout to every card. Add-ons and shipping aren't discounted.">
            <div className="px-window-ink flex flex-col">
              {/* The pre-exam room's price board */}
              <div className="relative flex items-center justify-between gap-4 border-b-2 border-ink/80 bg-[color-mix(in_srgb,var(--mint)_55%,var(--panel))] px-5 py-5 md:px-7">
                <div className="relative">
                  <h2 className="font-heading text-[2rem] leading-none text-ink md:text-[2.5rem]">Prep Pricing</h2>
                  <p className="mt-1.5 text-sm font-semibold text-ink">Per card — price based on declared value</p>
                </div>
                <span aria-hidden className="relative shrink-0">
                  <CardSprite variant="sleeve" scale={2} animate={false} />
                </span>
              </div>
              <div className="divide-y-2 divide-dashed divide-ink/20">
                <div className="flex flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-7">
                  <div>
                    <p className="flex items-center gap-2 font-heading text-xl leading-tight text-ink">
                      <span aria-hidden className="size-3 shrink-0 bg-mint px-frame" />
                      Cards under $1,500
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">Surface clean, penny sleeve + semi-rigid holder</p>
                  </div>
                  <div className="shrink-0 sm:text-right">
                    {/* One price per plan; the switch above shows the chosen one */}
                    {BULK_PLANS.map((p) => (
                      <div key={p.id} data-plan={p.id} className="flex flex-wrap items-baseline gap-x-2 sm:justify-end">
                        {p.percent > 0 && (
                          <span className="text-sm text-muted-foreground line-through tabular-nums" aria-label={`was ${fmt(prices.standardPriceCents)}`}>{fmt(prices.standardPriceCents)}</span>
                        )}
                        <span className="font-heading text-[2.75rem] leading-none text-ink tabular-nums lining-nums md:text-5xl">{fmt(bulkPriceCents(prices.standardPriceCents, p.percent))}</span>
                      </div>
                    ))}
                    <p className="rx-label mt-1.5">per card</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-7">
                  <div>
                    <p className="flex items-center gap-2 font-heading text-xl leading-tight text-ink">
                      <span aria-hidden className="size-3 shrink-0 bg-butter px-frame" />
                      Cards $1,500 and over
                    </p>
                    {/* The examples per plan; the switch above shows the chosen one */}
                    {BULK_PLANS.map((p) => (
                      <p key={p.id} data-plan={p.id} className="text-sm text-ink-soft mt-1">
                        {/* One inline box (the shown plan's <p> is display: flex): a wrap
                            falls after the dot, never before it; from md up each example stays on one line */}
                        <span>
                          e.g. <span className="md:whitespace-nowrap">$2,000 card = {fmt(bulkPriceCents(HIGH_VALUE_EXAMPLES_CENTS[0], p.percent))}&nbsp;&nbsp;·</span>{" "}
                          <span className="md:whitespace-nowrap">$5,000 card = {fmt(bulkPriceCents(HIGH_VALUE_EXAMPLES_CENTS[1], p.percent))}</span>
                        </span>
                      </p>
                    ))}
                  </div>
                  <div className="shrink-0 sm:text-right">
                    {/* One rate per plan (2% of value, less the bulk percent) */}
                    {BULK_PLANS.map((p) => (
                      <div key={p.id} data-plan={p.id} className="flex flex-wrap items-baseline gap-x-2 sm:justify-end">
                        {p.percent > 0 && (
                          <span className="text-sm text-muted-foreground line-through tabular-nums" aria-label="was 2%">2%</span>
                        )}
                        <span className="font-heading text-[2.75rem] leading-none text-ink tabular-nums lining-nums md:text-5xl">{valueRate(p.percent)}</span>
                      </div>
                    ))}
                    <p className="rx-label mt-1.5">of declared value</p>
                  </div>
                </div>
              </div>
              <div className="border-t-2 border-ink/15 px-5 py-5 md:px-7">
                {prices.isOpen ? (
                  <Link
                    href="/prep/order"
                    className={pixelButton({ size: "lg", className: "w-full" })}
                  >
                    Order Prep
                  </Link>
                ) : (
                  <div className="flex h-14 w-full cursor-not-allowed items-center justify-center bg-panel font-heading text-lg text-ink-soft px-frame">
                    Currently Paused
                  </div>
                )}
              </div>
            </div>
            </BulkSwitch>

            {/* Add-ons: the extra tests on the chart */}
            <div>
              <h2 className="mb-5 font-heading text-[2rem] leading-none text-ink">Available Add-Ons</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="px-window-ink flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <PixelIcon name="clipboard" size={32} className="shrink-0" />
                    <span className="font-pixel text-sm text-coral-deep tabular-nums">+{fmt(prices.preGradePriceCents)}/card</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl leading-tight text-ink">Pre-Grade Assessment</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      We assess each card and give you an estimated grade before you submit — so you know what to expect.
                    </p>
                  </div>
                </div>
                <div className="px-window-ink flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span aria-hidden className="shrink-0"><CardSprite variant="slab" scale={2} animate={false} /></span>
                    <span className="font-pixel text-sm text-coral-deep tabular-nums">+{fmt(prices.slabCrackPriceCents)}/card</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl leading-tight text-ink">Slab Crack</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      Already graded? We carefully crack the slab and include the raw card in your prep order.
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-ink-soft">Add-ons are selected during the order process.</p>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {/* Not included: the room's do-not list */}
            <div className="px-window-ink">
              <div className="border-b-2 border-ink/15 px-5 pt-5 pb-3">
                <p className="font-pixel text-xs uppercase tracking-[0.04em] text-coral-deep">Prep does not include:</p>
              </div>
              <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 px-5 pt-4 min-[400px]:grid-cols-2">
                {["Crease work", "Edge & corner work", "Dent removal", "Any restorative work"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-ink">
                    <span aria-hidden className="grid size-5 shrink-0 place-items-center bg-rx-soft text-coral-deep px-frame">
                      <X className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="px-5 pt-5 pb-5 text-sm text-ink">
                Need restoration?{" "}
                <Link href="/tier-selection" className="font-semibold text-coral-deep underline decoration-2 underline-offset-4 hover:text-ink">
                  See our Restoration tiers
                </Link>
              </p>
            </div>

            <p className="px-1 text-sm text-ink">
              Questions?{" "}
              <a href="https://www.instagram.com/the_card_doc" target="_blank" rel="noopener noreferrer" className="font-semibold text-coral-deep underline decoration-2 underline-offset-4 hover:text-ink">
                DM us @the_card_doc
              </a>
            </p>
          </div>
        </div>

      </div>

      <ReviewsBand title="What Our Customers Say" compact id="prep-reviews-heading" />
    </div>
  );
}
