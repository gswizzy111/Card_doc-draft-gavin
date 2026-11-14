import { CountUp } from "@/components/motion/count-up";
import { CASE_STUDY, FEATURED_REVIEW, REVIEWS, type Review } from "@/lib/reviews";
import { CardSprite, HealSparkles, HpBar, PixelIcon, StatusChip, Window } from "@/components/pixel";

const COMPACT_PICKS = ["Charmander", "Sold on TCGplayer", "7 cards to grading"];
// Speaker tiles cycle through the clinic pastels so the wall of dialogs reads
// as many different visitors.
const SPEAKER_TILES = ["bg-powder", "bg-mint", "bg-butter", "bg-rx-soft"];

/** The visitor's portrait: a pixel person in a framed tile, like an NPC. */
function Speaker({ tile = "bg-powder", size = "sm" }: { tile?: string; size?: "sm" | "lg" }) {
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center px-frame ${tile} ${size === "lg" ? "size-16 md:size-20" : "size-10"}`}>
      <PixelIcon name="user" size={size === "lg" ? 48 : 32} />
    </span>
  );
}

/** The headline review: a large NPC dialog box on the night ward. */
export function FeaturedReview({ className = "" }: { className?: string }) {
  return (
    <figure data-reveal className={className}>
      <Window variant="dialog" className="px-6 pt-7 pb-10 md:px-10 md:pt-10 md:pb-12">
        <blockquote className="text-ink">
          <p className="font-heading text-[2rem] leading-[1.05] sm:text-[2.5rem] lg:text-[3rem] [text-wrap:pretty]">
            <span className="text-ink-soft">“{FEATURED_REVIEW.lead}</span>
            <span>{FEATURED_REVIEW.emphasis}”</span>
          </p>
        </blockquote>
      </Window>
      <figcaption className="mt-6 flex items-center gap-3">
        <Speaker tile="bg-butter" size="lg" />
        <span className="inline-flex h-8 items-center bg-night-raise px-3 font-pixel text-xs uppercase leading-none text-stage-fg px-frame">
          {FEATURED_REVIEW.from}
        </span>
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
      <div className="relative overflow-hidden border-b-[3px] border-ink bg-wall px-6 pt-6 pb-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-heading text-[2rem] uppercase leading-none md:text-[2.4rem]">
            The {CASE_STUDY.paid} {CASE_STUDY.card}
          </h3>
          <span aria-hidden className="flex shrink-0 items-end gap-1">
            <CardSprite variant="hurt" scale={2} animate={false} />
            <CardSprite variant="healed" scale={2} />
          </span>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-ink">
          Bought “damaged” with an edge lift. Sent it in. Got back a {CASE_STUDY.grade}.
        </p>
        <div aria-hidden className="mt-4 flex flex-wrap items-center gap-2">
          <StatusChip status="treatment">ADMITTED</StatusChip>
          <span className="font-pixel text-xs text-coral-deep">▶</span>
          <StatusChip status="discharged" />
        </div>
      </div>
      <dl className="px-6 py-2">
        {rows.map((row, i) => (
          <div key={row.label} className={`py-4 ${i > 0 ? "border-t-[3px] border-dashed border-tile" : ""}`}>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-pixel text-xs uppercase text-ink-soft">{row.label}</dt>
              <dd
                className={`font-heading text-[2.75rem] leading-none tabular-nums md:text-[3.25rem] ${
                  i === 0 ? "text-ink-soft line-through decoration-coral decoration-[3px]" : i === 2 ? "text-coral-deep" : "text-ink"
                }`}
              >
                <CountUp value={row.value} />
              </dd>
            </div>
            {i === 0 ? <HpBar level={0.2} label={null} className="mt-3" /> : i === 1 ? <HpBar level={1} label={null} className="mt-3" /> : null}
          </div>
        ))}
      </dl>
    </Window>
  );
}

/** The rest of the messages: a wall of NPC dialog boxes, each signed. */
export function ReviewBubbles({ compact = false, phoneLimit = 6 }: { compact?: boolean; phoneLimit?: number }) {
  const list: Review[] = compact ? REVIEWS.filter((r) => r.card && COMPACT_PICKS.includes(r.card)) : REVIEWS;
  return (
    <ul className={compact ? "grid gap-x-8 md:grid-cols-3" : "columns-1 gap-8 sm:columns-2 lg:columns-3"}>
      {list.map((r, i) => (
        <li
          key={r.quote}
          data-reveal
          style={{ transitionDelay: `${(i % 3) * 80}ms` }}
          className={`mb-10 inline-block w-full break-inside-avoid px-[3px] pt-4 align-top ${!compact && i >= phoneLimit ? "max-sm:hidden" : ""}`}
        >
          <figure>
            <Window as="div" variant="dialog" title={r.card} className="mt-0 pb-8">
              <blockquote className="text-ink">
                <p className={`text-base leading-relaxed md:text-[17px] ${r.card ? "pt-1" : ""}`}>“{r.quote}”</p>
              </blockquote>
            </Window>
            <figcaption className="mt-4 flex items-center gap-2.5 font-pixel text-xs uppercase text-stage-fg">
              <Speaker tile={SPEAKER_TILES[i % SPEAKER_TILES.length]} />
              {r.from}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

/**
 * Reviews on the night ward: the headline quote as a big dialog box beside
 * the Charizard chart, then every message as an NPC dialog signed by its
 * visitor. Every quote is the customer's own words (lib/reviews.ts).
 */
export function ReviewsBand({ title, compact = false, id = "reviews-heading" }: { title: string; compact?: boolean; id?: string }) {
  return (
    <section aria-labelledby={id} className="stage stage-light relative overflow-hidden border-y-[3px] border-ink">
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-10 md:py-28">
        <div className="relative flex items-end justify-between gap-6">
          <h2
            id={id}
            data-reveal
            className="max-w-4xl font-heading uppercase leading-[0.92] text-stage-fg text-[clamp(2.5rem,9vw,4.75rem)] [text-shadow:4px_4px_0_var(--night-raise)]"
          >
            {title}
          </h2>
          <div aria-hidden className="relative hidden size-24 shrink-0 md:block">
            <HealSparkles count={3} />
          </div>
        </div>
        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:items-start lg:gap-12">
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
