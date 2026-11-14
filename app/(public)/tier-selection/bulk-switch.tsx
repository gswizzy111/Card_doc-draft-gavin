"use client";

import { useRef, useState } from "react";
import { BULK_PLANS, type BulkPlan } from "@/lib/bulk-pricing";

/**
 * Individual / 10+ / 20+ switch for the tier prices (and the Prep page's).
 * Each price block renders all three prices (marked data-plan); this sets
 * data-bulk on the wrapper and globals.css shows the matching one, so the
 * cards stay server-rendered. `note` replaces the Restorations page's note;
 * `stacked` keeps the note under the switch at every width (a narrow column).
 *
 * Drawn as an RPG menu tray: a night panel of three slots, the chosen one lit
 * butter with the ▶ cursor beside its label.
 */
export function BulkSwitch({ children, note, stacked = false }: { children: React.ReactNode; note?: React.ReactNode; stacked?: boolean }) {
  const [plan, setPlan] = useState<BulkPlan>("single");
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  // Radio-group keys: arrows move and select, Home/End jump to the ends
  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const last = BULK_PLANS.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setPlan(BULK_PLANS[next].id);
    buttons.current[next]?.focus();
  }

  return (
    <div data-bulk={plan}>
      <div className={stacked ? "mb-8 flex flex-col gap-5" : "mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-center md:justify-between md:gap-8"}>
        {/* A segmented control, so on phones it doesn't read as another row of tier chips */}
        <div role="radiogroup" aria-label="Number of cards" className={`grid w-full grid-cols-3 gap-[6px] bg-night p-[6px] px-frame-shadow${stacked ? "" : " md:inline-grid md:w-auto md:shrink-0"}`}>
          {BULK_PLANS.map((p, i) => {
            const active = p.id === plan;
            return (
              <button
                key={p.id}
                ref={(el) => { buttons.current[i] = el; }}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onClick={() => setPlan(p.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`press relative flex h-14 flex-col items-center justify-center gap-1 px-2 outline-offset-[-6px] focus-visible:outline-2 focus-visible:outline-dashed md:px-6 ${
                  active
                    ? "bg-butter text-ink shadow-[inset_0_-4px_0_#d4b552,inset_0_2px_0_#f8e9ad] focus-visible:outline-ink"
                    : "bg-night-raise text-stage-fg hover:bg-[#463f60] focus-visible:outline-butter"
                }`}
              >
                <span className="flex items-center gap-1.5 font-heading text-[1.05rem] uppercase leading-none tracking-[0.03em]">
                  <span aria-hidden className={`font-pixel text-[0.7rem] text-coral-deep ${active ? "" : "hidden"}`}>▶</span>
                  {p.label}
                </span>
                <span className={`font-pixel text-xs uppercase leading-none tracking-[0.04em] ${
                  p.percent > 0 ? (active ? "text-coral-deep" : "text-rx-bright") : active ? "text-ink-soft" : "text-stage-muted"
                }`}>
                  {p.percent > 0 ? `${p.percent}% off` : "Standard"}
                </span>
              </button>
            );
          })}
        </div>
        <p className={`bg-panel px-4 py-3 text-sm leading-relaxed text-ink-soft px-frame${stacked ? "" : " md:max-w-md"}`}>
          {note ?? <>Bulk pricing is applied automatically at checkout for every tier except Diamond. Discounts don&apos;t combine: you get the biggest one.</>}
        </p>
      </div>
      {children}
    </div>
  );
}
