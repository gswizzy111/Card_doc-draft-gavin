import { CountUp } from "@/components/motion/count-up";
import { CASE_STUDY, FEATURED_REVIEW, REVIEWS, type Review } from "@/lib/reviews";
import { StatusChip, Window } from "@/components/pixel";

const COMPACT_PICKS = ["Charmander", "Sold on TCGplayer", "7 cards to grading"];

/** The headline review: one large quote in a quiet window. */
export function FeaturedReview({ className = "" }: { className?: string }) {
  return (
    <figure data-reveal className={className}>
      <Window className="px-6 py-8 md:px-10 md:py-10">
        <blockquote className="text-ink">
          <p className="font-heading text-[1.75rem] font-semibold leading-[1.2] tracking-[-0.015em] sm:text-[2.125rem] lg:text-[2.5rem] [text-wrap:pretty]">
            <span className="text-ink-soft">“{FEATURED_REVIEW.lead}</span>
            <span>{FEATURED_REVIEW.emphasis}”</span>
          </p>
        </blockquote>
      </Window>
      <figcaption className="mt-5 flex items-center gap-2.5 font-pixel text-[0.6875rem] uppercase tracking-[0.04em] text-stage-muted">
        <span aria-hidden className="h-0.5 w-5 bg-butter" />
        {FEATURED_REVIEW.from}
      </figcaption>
    </figure>
  );
}

/** The Charizard case as a patient chart: admitted, discharged, and the numbers. */
export function CaseCard({ className = "" }: { className?: string }) {
  const rows = [
    { label: "Bought for", value: CASE_STUDY.paid },
    { label: "Came back", value: CASE_STUDY.grade },
    { label: "Worth over", value: CASE_STUDY.worth },
  ];
  return (
    <Window
      as="figure"
      data-reveal
      tone="ink"
      style={{ transitionDelay: "120ms" }}
      className={`p-0 text-ink md:p-0 ${className}`}
    >
      <div className="border-b-2 border-tile px-6 pt-6 pb-5">
        <div aria-hidden className="mb-4 flex flex-wrap items-center gap-2">
          <StatusChip status="treatment">ADMITTED</StatusChip>
          <span className="font-pixel text-xs text-coral-deep">▶</span>
          <StatusChip status="discharged" />
        </div>
        <h3 className="font-heading text-2xl font-bold leading-tight tracking-[-0.01em] md:text-[1.75rem]">
          The {CASE_STUDY.paid} {CASE_STUDY.card}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          Bought “damaged” with an edge lift. Sent it in. Got back a {CASE_STUDY.grade}.
        </p>
      </div>
      <dl className="px-6 py-2">
        {rows.map((row, i) => (
          <div key={row.label} className={`flex items-baseline justify-between gap-4 py-4 ${i > 0 ? "border-t-2 border-tile" : ""}`}>
            <dt className="font-pixel text-[0.6875rem] uppercase tracking-[0.04em] text-ink-soft">{row.label}</dt>
            <dd
              className={`font-heading text-[2.25rem] font-bold leading-none tracking-[-0.02em] tabular-nums md:text-[2.75rem] ${
                i === 0 ? "text-ink-soft line-through decoration-coral decoration-2" : i === 2 ? "text-coral-deep" : "text-ink"
              }`}
            >
              <CountUp value={row.value} />
            </dd>
          </div>
        ))}
      </dl>
    </Window>
  );
}

/** The rest of the messages: quiet quote cards, each signed. */
export function ReviewBubbles({ compact = false, phoneLimit = 6 }: { compact?: boolean; phoneLimit?: number }) {
  const list: Review[] = compact ? REVIEWS.filter((r) => r.card && COMPACT_PICKS.includes(r.card)) : REVIEWS;
  return (
    <ul className={compact ? "grid gap-6 md:grid-cols-3" : "columns-1 gap-6 sm:columns-2 lg:columns-3"}>
      {list.map((r, i) => (
        <li
          key={r.quote}
          data-reveal
          style={{ transitionDelay: `${(i % 3) * 80}ms` }}
          className={`mb-6 inline-block w-full break-inside-avoid px-[2px] pt-[2px] align-top ${!compact && i >= phoneLimit ? "max-sm:hidden" : ""}`}
        >
          <figure className="px-window-night h-full p-6">
            {r.card && (
              <p className="font-pixel text-[0.6875rem] uppercase leading-none tracking-[0.04em] text-butter">{r.card}</p>
            )}
            <blockquote className={`text-stage-fg ${r.card ? "mt-3" : ""}`}>
              <p className="text-base leading-relaxed md:text-[17px]">“{r.quote}”</p>
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-stage-muted">
              {r.from}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

/**
 * Reviews on the night ward: the headline quote beside the Charizard chart,
 * then every message as a quiet quote card signed by its visitor. Every
 * quote is the customer's own words (lib/reviews.ts).
 */
export function ReviewsBand({ title, compact = false, id = "reviews-heading" }: { title: string; compact?: boolean; id?: string }) {
  return (
    <section aria-labelledby={id} className="stage stage-light relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-10 md:py-32">
        <h2
          id={id}
          data-reveal
          className="max-w-4xl font-heading font-bold leading-[1.05] tracking-[-0.02em] text-stage-fg text-[clamp(2.125rem,6vw,3.25rem)]"
        >
          {title}
        </h2>
        <div className="mt-12 grid gap-12 md:mt-14 lg:grid-cols-12 lg:items-start lg:gap-10">
          <FeaturedReview className="lg:col-span-7" />
          <CaseCard className="lg:col-span-5" />
        </div>
        <div className="mt-16 md:mt-20">
          <ReviewBubbles compact={compact} />
        </div>
      </div>
    </section>
  );
}
