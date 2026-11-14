"use client";

import { useState } from "react";
import Link from "next/link";
import { PixelIcon } from "@/components/pixel/sprites";
import { pixelButton } from "@/components/pixel/pixel-button";
import { CLOSED_ACTION, FACT_ROW, TOOLTIP } from "./fact-row";

const RATE = 0.07;
const MIN_VALUE = 5000;

export function DiamondCard({
  slotsLeft,
  isSoldOut,
  restorationsOpen,
}: {
  slotsLeft: number | null;
  isSoldOut: boolean;
  restorationsOpen: boolean;
}) {
  const [rawValue, setRawValue] = useState("");

  const numericValue = parseFloat(rawValue.replace(/[^0-9.]/g, "")) || 0;
  const priceDollars = numericValue >= MIN_VALUE ? (numericValue * RATE).toFixed(2) : null;
  const tooLow = rawValue !== "" && numericValue > 0 && numericValue < MIN_VALUE;

  // Same structure as the other tiers: the badge in the corner, slots in the facts
  const bannerLabel = isSoldOut ? "SOLD OUT" : "White Glove";
  const bannerCls = isSoldOut ? "bg-muted text-ink" : "bg-ink text-panel";
  const showSlots = !isSoldOut && slotsLeft !== null && restorationsOpen;
  const closed = isSoldOut || !restorationsOpen;

  return (
    <article className="comic-lift px-window flex h-full flex-col">
      {/* Ward plate: Diamond is the one tier printed on holo stock */}
      <div className={`holo-bands flex h-16 shrink-0 items-center justify-between gap-3 border-b-[3px] border-frame px-4 [box-shadow:inset_0_3px_0_color-mix(in_srgb,var(--panel)_55%,transparent)] ${closed ? "grayscale-[0.75]" : ""}`}>
        <span aria-hidden className="grid size-11 shrink-0 place-items-center bg-panel px-frame">
          <PixelIcon name="sparkle" size={32} />
        </span>
        <span className={`inline-flex h-7 items-center whitespace-nowrap px-2.5 font-pixel text-xs leading-none uppercase tracking-[0.04em] px-frame ${bannerCls}`}>
          {bannerLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-heading text-[1.85rem] uppercase leading-none tracking-[0.02em] text-ink">Diamond</h3>
        <p className="mt-1.5 mb-5 min-h-10 text-sm text-ink-soft">White-glove service for high-value cards</p>

        {/* Dynamic price display */}
        <div className="mb-6">
          <div className="font-heading text-[3.25rem] leading-none text-ink tabular-nums lining-nums">
            {priceDollars ? `$${priceDollars}` : "7%"}
          </div>
          <p className="rx-label mt-2">
            {priceDollars
              ? `of your $${numericValue.toLocaleString()} card value`
              : "of declared card value · cards $5,000+"}
          </p>
        </div>

        {/* Facts, then the value field as one more row of them */}
        <div className="@container">
          <dl className="divide-y-2 divide-dashed divide-ink/20 border-t-[3px] border-ink">
            <div className={FACT_ROW}>
              <dt className="rx-label @min-[16.5rem]:self-center">Turnaround</dt>
              <dd className="font-medium text-ink @min-[16.5rem]:text-right">5–10 business days <span className="text-xs text-muted-foreground">(est.)</span></dd>
            </div>
            <div className={`${FACT_ROW} @min-[16.5rem]:items-center`}>
              <dt className="rx-label">Card value</dt>
              <dd className="font-medium text-ink flex items-center gap-1">
                $5,000+
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
          </dl>

          {/* The value field: a small calculator slot on the chart */}
          <div className="border-t-2 border-dashed border-ink/20 py-3">
            <div className="flex flex-col gap-1.5 @min-[16.5rem]:flex-row @min-[16.5rem]:items-center @min-[16.5rem]:gap-3">
              <label htmlFor="diamond-card-value" className="rx-label @min-[16.5rem]:min-w-0 @min-[16.5rem]:flex-1">
                Estimated card value (USD)
              </label>
              <div className="relative shrink-0 @min-[16.5rem]:w-[8.5rem]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-soft">$</span>
                <input
                  id="diamond-card-value"
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 6000"
                  value={rawValue}
                  onChange={(e) => setRawValue(e.target.value)}
                  className="h-11 w-full border-2 border-ink bg-panel pl-7 pr-2.5 text-base tabular-nums shadow-[inset_0_3px_0_var(--muted)] outline-none [appearance:textfield] placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>
            {tooLow && (
              <p className="mt-2.5 bg-butter px-2.5 py-1.5 text-xs font-semibold text-ink px-frame">
                Diamond requires cards valued at $5,000+. Consider Fast Pass for cards under $5,000.
              </p>
            )}
            {priceDollars && (
              <p className="mt-2.5 flex flex-wrap items-baseline gap-x-1.5 bg-rx-soft px-2.5 py-1.5 text-xs font-semibold text-coral-deep px-frame">
                Your price: <span className="font-heading text-xl leading-none tabular-nums text-ink">${priceDollars}</span> per card
              </p>
            )}
          </div>
        </div>

        {/* The action sits on the card's floor, level with the other tiers */}
        <div className="mt-auto pt-6">
        {isSoldOut ? (
          <div className={CLOSED_ACTION}>
            Sold Out
          </div>
        ) : !restorationsOpen ? (
          <div className={CLOSED_ACTION}>
            Currently Closed
          </div>
        ) : (
          <Link
            href="/restoration?tier=elite"
            className={pixelButton({ size: "md", className: "w-full" })}
          >
            Select Diamond
          </Link>
        )}
        </div>
      </div>
    </article>
  );
}
