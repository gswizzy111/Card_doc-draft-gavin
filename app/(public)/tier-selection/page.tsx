import Link from "next/link";
import type { Metadata } from "next";
import { getCardsRestoredStat } from "@/lib/site-stats";
import { TrustPills } from "@/components/marketing/trust-pills";
import { ReviewsBand } from "@/components/marketing/comic-reviews";
import { JsonLd } from "@/components/seo/json-ld";
import { ORG_ID, SITE, breadcrumbs, canonical } from "@/lib/seo";
import { getAllTiers, applyDbOverride, type RestorationTier } from "@/lib/restoration-tiers";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRestorationsOpen, getSlotsOpenedAt } from "@/lib/store-config";
import { TIER_MAX_SLOTS } from "@/lib/site-config";
import { tierSlotUsage } from "@/lib/tier-slots";
import { Check, ChevronDown, Zap } from "lucide-react";
import { WaitlistModal } from "./waitlist-modal";
import { DiamondCard } from "./diamond-card";
import { CLOSED_ACTION, FACT_ROW, TOOLTIP } from "./fact-row";
import { BulkSwitch } from "./bulk-switch";
import { BULK_PLANS, bulkPriceCents, isBulkEligible } from "@/lib/bulk-pricing";
import { SnapDeck } from "@/components/motion/snap-deck";
import { PixelViewContent } from "@/components/pixel-view-content";
import { PageHero } from "@/components/marketing/page-hero";
import { PixelIcon, Window, pixelButton, type PixelIconName } from "@/components/pixel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Restoration Pricing | The Card Doc",
  description: "Surfaces, corners & edges — cleaned and restored to their best. From $75 / card.",
  alternates: canonical("/tier-selection"),
};

// Each ward level's chart symbol (a pixel icon on its metal plate)
const ICON_MAP: Record<string, PixelIconName> = {
  regular:       "bandage",
  expedited:     "clock",
  premium:       "star",
  ultra_premium: "shield",
  elite:         "sparkle", // replaced by DiamondCard client component
  fast_pass:     "calendar",
};

// Tier identity lives in the ward plate's polished-metal band, not in recoloring the card.
const SWATCH: Record<string, string> = {
  regular:       "metal-bronze",
  expedited:     "metal-silver",
  premium:       "metal-gold",
  ultra_premium: "metal-platinum",
  fast_pass:     "metal-rx",
};

function formatTurnaround(tier: RestorationTier): string {
  if (tier.turnaround_label) return tier.turnaround_label;
  return `${tier.turnaround_min_days}–${tier.turnaround_max_days} days`;
}

function TierCard({
  tier,
  settingsMap,
  slotCounts,
  restorationsOpen,
  label,
}: {
  tier: RestorationTier;
  settingsMap: Record<string, { is_open?: boolean; max_slots?: number | null; display_slots_remaining?: number | null }>;
  /** null: the count couldn't be read, so slots left are unknown */
  slotCounts: Record<string, number> | null;
  restorationsOpen: boolean;
  label?: React.ReactNode;
}) {
  const swatch = SWATCH[tier.id] ?? SWATCH.regular;
  const icon = ICON_MAP[tier.id] ?? ICON_MAP.regular;

  const s = settingsMap[tier.id];
  // DB max_slots takes priority; fall back to site-config TIER_MAX_SLOTS constant
  const maxSlots = (s?.max_slots ?? null) ?? TIER_MAX_SLOTS[tier.id] ?? null;
  const slotsLeft = maxSlots !== null && slotCounts ? Math.max(0, maxSlots - (slotCounts[tier.id] ?? 0)) : null;
  const isSoldOut = s?.is_open === false || (slotsLeft !== null && slotsLeft === 0);

  // Corner chip: sold out, else the owner's badge (or the card's own label).
  // Slots left sit in the facts beside the action, the same row on every card.
  const bannerLabel: React.ReactNode = isSoldOut ? "SOLD OUT" : (label ?? tier.badge ?? null);
  const bannerCls: string = isSoldOut ? "bg-muted text-ink" : "bg-rx text-panel";
  const showSlots = !isSoldOut && slotsLeft !== null && restorationsOpen;
  const closed = isSoldOut || !restorationsOpen;

  const price = tier.pricing_type === "percentage"
    ? `${((tier.pricing_rate ?? 0) * 100).toFixed(0)}%`
    : `$${(tier.price_cents / 100).toFixed(2)}`;

  const priceNote = tier.pricing_type === "percentage"
    ? `of declared card value · cards $${((tier.min_card_value_cents ?? 0) / 100).toFixed(0)}+`
    : tier.id === "fast_pass"
    ? "per card · cards under $5,000"
    : "per card";

  const action = isSoldOut ? (
    <div className={CLOSED_ACTION}>
      Sold Out
    </div>
  ) : !restorationsOpen ? (
    <div className={CLOSED_ACTION}>
      Currently Closed
    </div>
  ) : (
    <Link
      href={`/restoration?tier=${tier.id}`}
      className={pixelButton({ size: "md", className: "w-full" })}
    >
      Select {tier.name}
    </Link>
  );

  const facts = (
    <dl className="@container divide-y-2 divide-dashed divide-ink/20 border-t-2 border-ink">
      <div className={FACT_ROW}>
        <dt className="rx-label @min-[16.5rem]:self-center">Turnaround</dt>
        <dd className="font-medium text-ink @min-[16.5rem]:text-right">
          {formatTurnaround(tier)}{" "}
          <span className="text-xs text-muted-foreground">(est.)</span>
        </dd>
      </div>
      <div className={`${FACT_ROW} @min-[16.5rem]:items-center`}>
        <dt className="rx-label">Card value</dt>
        <dd className="font-medium text-ink flex items-center gap-1">
          {tier.id === "fast_pass"
            ? "Under $5,000"
            : tier.max_card_value_cents === null
            ? "Unlimited"
            : `Up to $${(tier.max_card_value_cents / 100).toLocaleString()}`}
          <span className="relative group">
            <span className="text-xs text-muted-foreground cursor-help">*</span>
            <span className={TOOLTIP}>
              Current value, raw or graded
            </span>
          </span>
        </dd>
      </div>
      {showSlots && (
        <div className={FACT_ROW}>
          <dt className="rx-label @min-[16.5rem]:self-center">Slots</dt>
          <dd className={`tabular-nums @min-[16.5rem]:text-right ${slotsLeft! <= 3 ? "font-semibold text-red-700" : "font-medium text-ink"}`}>
            {slotsLeft} left
          </dd>
        </div>
      )}
      {tier.id === "fast_pass" && (
        <div className="flex items-center gap-2 py-2.5 text-sm">
          <Check className="h-4 w-4 text-mint-deep" strokeWidth={2.5} />
          <span className="text-ink-soft">Skips the restoration queue</span>
        </div>
      )}
    </dl>
  );

  return (
    <article className="comic-lift px-window-ink flex h-full flex-col">
      {/* Ward plate: the tier's metal band, its chart icon and the corner chip.
          Fixed height, so a card with a chip lines up with one without. */}
      <div className={`metal ${swatch} flex h-16 shrink-0 items-center justify-between gap-3 border-b-2 border-ink px-4 ${closed ? "grayscale-[0.75]" : ""}`}>
        <span aria-hidden className="grid size-11 shrink-0 place-items-center bg-panel px-frame">
          <PixelIcon name={icon} size={32} />
        </span>
        {bannerLabel && (
          <span className={`inline-flex h-7 items-center gap-1 whitespace-nowrap px-2.5 font-pixel text-xs leading-none uppercase tracking-[0.04em] px-frame ${bannerCls}`}>
            {bannerLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-heading text-[1.85rem] leading-none text-ink">{tier.name}</h3>
        {/* Two lines reserved, so prices line up across a row */}
        <p className="mt-1.5 mb-5 min-h-10 text-sm text-ink-soft">{tier.description}</p>

        <div className="mb-6">
          {tier.pricing_type !== "percentage" && isBulkEligible(tier.id) ? (
            // One price per plan; the BulkSwitch above the grid shows the chosen one
            BULK_PLANS.map((p) => (
              <div key={p.id} data-plan={p.id} className="flex flex-wrap items-baseline gap-x-2.5">
                <span className="font-heading text-[3.25rem] leading-none text-ink tabular-nums lining-nums">
                  ${(bulkPriceCents(tier.price_cents, p.percent) / 100).toFixed(2)}
                </span>
                {p.percent > 0 && (
                  <span className="text-sm text-muted-foreground line-through tabular-nums" aria-label={`was ${price}`}>{price}</span>
                )}
              </div>
            ))
          ) : (
            <div className="font-heading text-[3.25rem] leading-none text-ink tabular-nums lining-nums">{price}</div>
          )}
          <p className="rx-label mt-2">{priceNote}</p>
        </div>

        {facts}

        {/* The action sits on the card's floor, level across a row */}
        <div className="mt-auto pt-6">{action}</div>
      </div>
    </article>
  );
}

export default async function TierSelectionPage() {
  const [restorationsOpen, slotsOpenedAt, cardsRestored] = await Promise.all([
    getRestorationsOpen(),
    getSlotsOpenedAt(),
    getCardsRestoredStat(),
  ]);
  const defaultTiers = getAllTiers();
  const admin = createAdminClient();

  const { data: extSettings, error: extErr } = await admin
    .from("restoration_settings")
    .select("tier, is_open, max_slots, display_slots_remaining, display_name, price_cents, pricing_rate, min_card_value_cents, turnaround_min_days, turnaround_max_days, description, includes_notes, includes_video, badge");

  const settingsRaw = extErr
    ? ((await admin.from("restoration_settings").select("tier, is_open, max_slots")).data ?? [])
    : (extSettings ?? []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settingsMap = Object.fromEntries((settingsRaw as any[]).map((s) => [s.tier, s]));

  // Slots taken, one per order: paid orders plus checkouts in progress (under
  // 30 minutes old), counted the way checkout enforces them (lib/tier-slots.ts).
  // null: the count failed, so no tier shows a number of slots left.
  let slotCounts: Record<string, number> | null = {};
  if (restorationsOpen) {
    try {
      slotCounts = await tierSlotUsage(admin, slotsOpenedAt);
    } catch (err) {
      console.error("Tier slot count failed:", err);
      slotCounts = null;
    }
  }

  const tiers = defaultTiers.map((t) =>
    !extErr ? applyDbOverride(t, settingsMap[t.id] ?? null) : t
  );

  const topTiers  = tiers.filter((t) => ["regular", "expedited", "premium"].includes(t.id));
  const midTiers  = tiers.filter((t) => t.id === "ultra_premium");
  const fastPass  = tiers.find((t) => t.id === "fast_pass");
  const eliteTier = tiers.find((t) => t.id === "elite");

  const sharedProps = { settingsMap, slotCounts, restorationsOpen };

  // Diamond slot info for client component
  const eliteMaxSlots = (settingsMap["elite"]?.max_slots ?? null) ?? TIER_MAX_SLOTS["elite"] ?? null;
  const eliteSlotsLeft = eliteMaxSlots !== null && slotCounts ? Math.max(0, eliteMaxSlots - (slotCounts["elite"] ?? 0)) : null;
  const eliteIsSoldOut = settingsMap["elite"]?.is_open === false || (eliteSlotsLeft !== null && eliteSlotsLeft === 0);

  const offerTiers = [...topTiers, ...midTiers, ...(fastPass ? [fastPass] : [])].filter((t) => t.pricing_type !== "percentage");
  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Card Restoration",
      serviceType: "Trading card restoration",
      description: "Surfaces, corners & edges — cleaned and restored to their best.",
      url: `${SITE}/tier-selection`,
      provider: { "@id": ORG_ID },
      areaServed: ["US", "PR"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Restoration tiers",
        itemListElement: offerTiers.map((t) => ({
          "@type": "Offer",
          name: t.name,
          description: t.description,
          price: (t.price_cents / 100).toFixed(2),
          priceCurrency: "USD",
          url: `${SITE}/tier-selection`,
        })),
      },
    },
    breadcrumbs([{ name: "Restoration Pricing", path: "/tier-selection" }]),
  ];

  // Phones: the deck's track scrolls sideways, so each card keeps room for its
  // outline and hard shadow inside it.
  const slot = "rx-reveal h-full max-md:pt-[3px] max-md:pr-3 max-md:pb-3 max-md:pl-[3px]";

  return (
    <div className="min-h-screen page-glow">
      <JsonLd data={structured} />
      <PixelViewContent contentName="Restoration Tiers" contentCategory="Restoration" />
      {/* Closed: the front desk's notice, under the night sign */}
      {!restorationsOpen && (
        <div className="stage stage-light border-b-2 border-ink">
          <div className="mx-auto flex max-w-5xl items-end gap-4 px-4 pt-5 pb-7 md:gap-6 md:px-6">
            <Window className="flex-1">
              <p className="font-heading text-2xl leading-tight text-ink md:text-[1.75rem]">Restorations are currently closed.</p>
              <p className="mt-1.5 text-[15px] font-semibold leading-relaxed text-ink-soft">
                We&apos;re not accepting new restoration orders right now — but you can still browse our pricing below.
              </p>
            </Window>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-12 md:py-20">
        <PageHero
          className="mb-8"
          title="Choose Your Restoration Level"
          lines={["Choose Your", "Restoration Level"]}
          lead={restorationsOpen
            ? "Select the tier that best fits your cards' needs."
            : "We're temporarily closed. Browse our pricing below and join the waitlist to be notified when we reopen."}
        />

        <TrustPills cardsRestored={cardsRestored} align="start" className="hero-in mb-12 md:mb-14" />

        {/* All six tiers on one track, equal heights per row: 3 x 2 from 1072px (where
            a card's facts fit side by side, see fact-row.ts), 2 x 3 below that */}
        <BulkSwitch>
        <SnapDeck
          labels={[...topTiers, ...midTiers, ...(eliteTier ? [eliteTier] : []), ...(fastPass ? [fastPass] : [])].map((t) => t.name)}
          gridClassName="md:grid md:grid-cols-2 min-[67rem]:grid-cols-3 md:gap-7 min-[67rem]:gap-8"
        >
          {[...topTiers, ...midTiers].map((tier, i) => (
            <div key={tier.id} className={slot} style={{ ["--i" as string]: i }}>
              <TierCard tier={tier} {...sharedProps} />
            </div>
          ))}
          {eliteTier && (
            <div className={slot} style={{ ["--i" as string]: topTiers.length + midTiers.length }}>
              <DiamondCard
                slotsLeft={eliteSlotsLeft}
                isSoldOut={eliteIsSoldOut}
                restorationsOpen={restorationsOpen}
              />
            </div>
          )}
          {fastPass && (
            <div className={slot} style={{ ["--i" as string]: topTiers.length + midTiers.length + 1 }}>
              <TierCard
                tier={fastPass}
                {...sharedProps}
                label={<><Zap className="h-3 w-3" strokeWidth={2.25} aria-hidden />Express Option</>}
              />
            </div>
          )}
        </SnapDeck>
        </BulkSwitch>

        {/* Turnaround disclaimer: the chart's fine print, folded */}
        <details className="group mt-10 px-window-ink md:mt-12">
          <summary className="flex min-h-14 cursor-pointer list-none select-none items-center justify-between gap-3 bg-panel px-4 py-3 md:px-5 [&::-webkit-details-marker]:hidden">
            <span className="font-heading text-lg leading-tight text-ink md:text-xl">About our turnaround time estimates</span>
            <ChevronDown className="h-5 w-5 shrink-0 text-ink group-open:rotate-180" strokeWidth={2} />
          </summary>
          <div className="space-y-2 border-t-2 border-ink px-4 pt-4 pb-5 text-sm leading-relaxed text-ink md:px-5">
            <p>
              All turnaround times shown are <strong>rough estimates only</strong> and are not a guarantee or promise of completion within any specific timeframe.
            </p>
            <p>
              Actual processing times may be affected by order volume, card condition, shipping delays, holidays, or other circumstances outside our control. We will always do our best to meet or beat the estimated range, but <strong>The Card Doc cannot be held liable</strong> for delays.
            </p>
            <p className="text-xs text-ink-soft">
              By placing an order you acknowledge that turnaround times are estimates and agree that delays do not entitle you to a refund or cancellation. See our{" "}
              <Link href="/terms" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">Terms of Service</Link> for full details.
            </p>
          </div>
        </details>

        {/* Waitlist modal — auto-opens when closed */}
        {!restorationsOpen && <WaitlistModal />}

        {/* Footer info: the doc's pointer to the symptoms chart */}
        <div className="mt-10 border-t-2 border-ink/15 pt-8 md:mt-12">
            <p className="text-ink">
              Not sure which tier fits?{" "}
              <Link href="/how-it-works" className="font-semibold text-coral-deep underline decoration-2 underline-offset-4 hover:text-ink">
                Learn what we can restore
              </Link>
              .
            </p>
        </div>

      </div>
      <ReviewsBand title="What Our Customers Say" compact id="tier-reviews-heading" />
    </div>
  );
}
