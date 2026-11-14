import Link from "next/link";
import type { Metadata } from "next";
import { canonical } from "@/lib/seo";
import { ArrowDown, Check, X } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CardSprite, DocSprite, pixelButton } from "@/components/pixel";

export const metadata: Metadata = {
  alternates: canonical("/what-we-can-fix"),
  title: "What We Can Fix | The Card Doc",
  description:
    "What The Card Doc can and can't fix on sports cards and TCG cards like Pokémon, One Piece, Magic and Yu-Gi-Oh!.",
};

type Item = { text: string; strong?: boolean };

// The owner's lists, word for word.
const CATEGORIES: {
  id: string;
  title: string;
  subtitle?: string;
  can: Item[];
  cannot: Item[];
}[] = [
  {
    id: "sports",
    title: "Sports cards",
    can: [
      { text: "Edge lifts and corner lifts (not wear)" },
      { text: "Dents/dimples" },
      { text: "Creases" },
      { text: "Surface dirt, fingerprints, film/residue — cleaned off/improved" },
      { text: "Minor stains — only if the stain is on the surface" },
      { text: "Minor bends — reduced with humidity work" },
      { text: "Water damage/warping" },
    ],
    cannot: [
      { text: "Whitening / silvering, including edge and corner whitening" },
      { text: "Centering / off-centering" },
      { text: "Corner dings and corner wear" },
      { text: "Edge wear and edge chipping" },
      { text: "Chrome-surface damage: roller lines, deep scratches, and indentations" },
      { text: "Most Factory Defects" },
      { text: "Deep scratches" },
    ],
  },
  {
    id: "tcg",
    title: "TCG",
    subtitle: "(Pokémon, One Piece, Magic, Yu-Gi-Oh!, etc.)",
    can: [
      { text: "Edge lifts and corner lifts" },
      { text: "Dents, dimples, dings" },
      { text: "Surface cleaning — dirt, dust, grime, fingerprints, residue" },
      { text: "Creases — light/moderate reduced or eliminated; deep only reduced" },
      { text: "Holo lifting/blistering" },
      { text: "Holo polishing" },
      { text: "Water damage/warping" },
    ],
    cannot: [
      { text: "Whitening", strong: true },
      { text: "Deep Scratching" },
      { text: "Centering" },
      { text: "Deep creases; creases that fully extend through the card" },
      { text: "Chipping where material is gone" },
      { text: "Print lines / factory defects, tears, delamination, fading" },
    ],
  },
];

// "Main point — detail": the detail after the dash reads one step quieter.
function ItemText({ item }: { item: Item }) {
  const [main, ...rest] = item.text.split(" — ");
  return (
    <span className={item.strong ? "font-semibold" : undefined}>
      {main}
      {rest.length > 0 && <span className="text-ink-soft"> — {rest.join(" — ")}</span>}
    </span>
  );
}

// One side of the symptoms chart: treatable (mint, the healed card) or not (coral, the hurt card).
function FixList({ kind, items }: { kind: "can" | "cannot"; items: Item[] }) {
  const can = kind === "can";
  const Icon = can ? Check : X;
  return (
    <div className="px-window-ink">
      <div
        className={`flex items-center justify-between gap-4 border-b-[3px] border-ink px-5 py-4 md:px-6 ${
          can ? "bg-mint" : "bg-rx-soft"
        }`}
      >
        <div>
          <h3 className="font-heading text-2xl uppercase leading-none tracking-[0.02em] text-ink md:text-[1.75rem]">
            {can ? "Things We CAN Work on" : "Things we CANNOT fix"}
          </h3>
        </div>
        <span aria-hidden className="grid size-16 shrink-0 place-items-center bg-panel px-frame">
          <CardSprite variant={can ? "healed" : "hurt"} scale={2} />
        </span>
      </div>
      <ul className="divide-y-2 divide-dashed divide-ink/15">
        {items.map((item) => (
          <li key={item.text} className="flex items-start gap-3 px-5 py-3.5 text-[15px] leading-relaxed text-ink md:px-6">
            <span
              aria-hidden
              className={`mt-[0.2rem] grid size-5 shrink-0 place-items-center px-frame ${can ? "bg-mint text-ink" : "bg-rx-soft text-coral-deep"}`}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <ItemText item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function WhatWeCanFixPage() {
  return (
    <div className="min-h-screen page-glow">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 md:px-10 pt-12 pb-10 md:pt-20 md:pb-16">
        <PageHero
          eyebrow="What We Can Fix"
          title="What we can (and can't) fix"
          lines={["What we can", "(and can't) fix"]}
          sprite={
            <div className="flex items-end gap-3 pb-1">
              <CardSprite variant="hurt" scale={4} />
              <span className="mb-11 font-pixel text-sm text-coral-deep px-nudge">▶</span>
              <CardSprite variant="healed" scale={4} />
            </div>
          }
          lead={<>Restoration has real limits. Here&apos;s an honest breakdown.</>}
        />
        <nav aria-label="Card types" className="hero-in mt-9 flex flex-wrap gap-4" style={{ ["--d" as string]: 380 }}>
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className={pixelButton({ tone: "panel", size: "md", className: "group normal-case" })}
            >
              {c.title}
              <ArrowDown className="h-4 w-4 text-coral-deep" strokeWidth={2.5} />
            </a>
          ))}
        </nav>
      </div>

      {/* One section per card type: a chart on the wall */}
      <div className="max-w-6xl mx-auto px-4 md:px-10 pb-20 md:pb-28 flex flex-col gap-16 md:gap-24">
        {CATEGORIES.map((c, i) => (
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-title`} className="scroll-mt-28">
            <div data-reveal className="mb-8 flex items-start gap-4 md:mb-10 md:gap-5">
              <span aria-hidden className="grid h-14 min-w-14 shrink-0 place-items-center bg-butter px-2 font-pixel text-base text-ink tabular-nums px-frame-shadow">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2
                id={`${c.id}-title`}
                className="min-w-0 pt-1 font-heading text-5xl uppercase leading-[0.95] tracking-[0.02em] text-ink [text-shadow:3px_3px_0_var(--wall)] md:text-6xl"
              >
                {c.title}
                {c.subtitle && (
                  <span className="mt-3 block w-fit bg-panel px-3 py-1.5 font-sans text-base font-medium normal-case tracking-normal leading-snug text-ink-soft [text-shadow:none] px-frame md:text-lg">
                    {c.subtitle}
                  </span>
                )}
              </h2>
            </div>
            <div data-reveal="stagger" className="grid gap-7 md:grid-cols-2 md:items-start md:gap-8">
              <FixList kind="can" items={c.can} />
              <FixList kind="cannot" items={c.cannot} />
            </div>
          </section>
        ))}

        {/* Closing call to action: the night desk */}
        <section
          data-reveal
          className="stage stage-light px-frame-shadow p-7 md:p-12 md:flex md:items-center md:justify-between md:gap-10"
        >
          <div className="mb-8 flex items-end gap-5 md:mb-0">
            <DocSprite scale={3} className="hidden shrink-0 sm:block" />
            <div>
              <h2 className="mb-3 font-heading text-4xl uppercase leading-[0.95] tracking-[0.02em] text-stage-fg md:text-5xl">
                Not sure if your card qualifies?
              </h2>
              <p className="text-stage-muted max-w-xl">
                DM us a photo on Instagram at{" "}
                <a href="https://www.instagram.com/the_card_doc" target="_blank" rel="noopener noreferrer" className="font-semibold text-stage-fg underline decoration-2 underline-offset-4 hover:text-rx-bright">
                  @the_card_doc
                </a>{" "}
                before placing an order.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-4 sm:flex-row">
            <Link
              href="/tier-selection"
              className={pixelButton({ size: "md" })}
            >
              Book Restoration
            </Link>
            <a
              href="https://www.instagram.com/the_card_doc"
              target="_blank"
              rel="noopener noreferrer"
              className={pixelButton({ tone: "panel", size: "md" })}
            >
              DM us on Instagram
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
