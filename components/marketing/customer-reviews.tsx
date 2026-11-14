import { CountUp } from "@/components/motion/count-up";
import { ScrollLitText } from "@/components/motion/scroll-lit-text";
import { CASE_STUDY, FEATURED_REVIEW, REVIEWS } from "@/lib/reviews";
import { StatusChip } from "@/components/pixel";

// Phones show the first few quotes so the page stays short.
const PHONE_LIMIT = 6;
// The three quotes the compact version (service pages) shows, in one even row.
const COMPACT_PICKS = ["Charmander", "Sold on TCGplayer", "7 cards to grading"];

/**
 * Customer reviews on a night stage: the headline quote at headline size,
 * lighting up word by word as it scrolls in with its closing phrase in full
 * panel white, beside the Charizard case (a raised night window, figures
 * counting up), then the rest of the messages as night dialog windows whose
 * edge lights coral under the pointer. Every quote is the customer's own
 * words (lib/reviews.ts).
 */
export function CustomerReviews({ compact = false }: { compact?: boolean }) {
  const steps = [
    { label: "Bought for", value: CASE_STUDY.paid, muted: true },
    { label: "Came back", value: CASE_STUDY.grade, muted: false },
    { label: "Worth over", value: CASE_STUDY.worth, muted: false },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid gap-12 lg:gap-16 lg:grid-cols-12 lg:items-center">
        <figure className="lg:col-span-7">
          <blockquote className="font-heading font-semibold text-[1.75rem] sm:text-[2.125rem] lg:text-[2.5rem] leading-[1.2] tracking-[-0.015em] text-stage-fg [text-wrap:pretty]">
            <p className="-indent-[0.42em]">
              <ScrollLitText
                segments={[
                  { text: `“${FEATURED_REVIEW.lead}`, lit: 0.62 },
                  { text: `${FEATURED_REVIEW.emphasis}”`, lit: 1 },
                ]}
              />
            </p>
          </blockquote>
          <figcaption data-reveal className="mt-7 flex items-center gap-3">
            <span className="font-pixel text-xs uppercase text-stage-fg">{FEATURED_REVIEW.from}</span>
          </figcaption>
        </figure>

        <figure
          data-reveal
          style={{ transitionDelay: "120ms" }}
          className="px-window-night lg:col-span-5 p-6 md:p-8"
        >
          <div aria-hidden className="mb-4 flex flex-wrap items-center gap-2">
            <StatusChip status="treatment">ADMITTED</StatusChip>
            <span className="font-pixel text-xs text-rx-bright">▶</span>
            <StatusChip status="discharged" />
          </div>
          <h3 className="font-heading text-2xl font-bold leading-tight tracking-[-0.01em] text-stage-fg md:text-[1.75rem]">
            The {CASE_STUDY.paid} {CASE_STUDY.card}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-stage-muted">
            Bought “damaged” with an edge lift. Sent it in. Got back a {CASE_STUDY.grade}.
          </p>
          <dl className="mt-7 border-t border-stage-muted/25">
            {steps.map((s) => (
              <div key={s.label} className="flex items-baseline justify-between gap-4 border-b border-stage-muted/25 py-4">
                <dt className="rx-label text-stage-muted">{s.label}</dt>
                <dd
                  className={`font-heading font-bold text-[2.25rem] md:text-[2.75rem] leading-none tracking-[-0.02em] [font-feature-settings:'lnum'_1,'tnum'_1] ${s.muted ? "text-stage-muted line-through decoration-coral decoration-2" : "text-stage-fg"}`}
                >
                  <CountUp value={s.value} />
                </dd>
              </div>
            ))}
          </dl>
        </figure>
      </div>

      <ul
        className={compact
          ? "mt-14 md:mt-20 grid gap-6 md:gap-7 md:grid-cols-3"
          : "mt-16 md:mt-24 columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-7"}
      >
        {/* In the masonry each card is an inline-block: Chromium drops the
            lit edge's mask on block children of a multi-column list, which
            floods the whole card with the glow. */}
        {(compact ? REVIEWS.filter((r) => r.card && COMPACT_PICKS.includes(r.card)) : REVIEWS).map((r, i) => (
          <li
            key={r.quote}
            data-reveal
            style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            className={`px-window-night lit-border relative p-6 ${compact ? "" : "mb-6 md:mb-7 inline-block w-full align-top break-inside-avoid"} ${!compact && i >= PHONE_LIMIT ? "max-sm:hidden" : ""}`}
          >
            <figure className="flex h-full flex-col">
              {r.card && (
                <p className="font-pixel text-[0.6875rem] uppercase leading-none tracking-[0.04em] text-butter">{r.card}</p>
              )}
              <blockquote className="mt-3 text-base md:text-[17px] leading-relaxed text-stage-fg">
                <p>“{r.quote}”</p>
              </blockquote>
              <figcaption className="mt-auto pt-4 text-sm font-semibold text-stage-muted">
                {r.from}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
