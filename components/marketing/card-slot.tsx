import Link from "next/link";

/**
 * The check-in slot: a coral intake box with a dashed card-shaped opening.
 * Lifts a little on hover. Links to /start.
 */
export function CardSlot({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/start"
      aria-label="Place card here. The Doc will see you now. Start your order."
      className={`card-slot group relative block aspect-[5/7] text-ink shadow-[5px_5px_0_var(--px-shadow)] ${className}`}
    >
      <span aria-hidden className="absolute inset-0 bg-coral-fill px-frame" />
      <span aria-hidden className="absolute inset-2.5 border-2 border-dashed border-ink/45 bg-rx-soft/45 group-hover:bg-butter/60" />
      <span className="relative grid h-full grid-rows-[1fr_auto] justify-items-center px-4 pt-5 pb-4 text-center sm:px-6">
        <span className="self-center">
          <span className="block font-heading font-bold leading-[1.05] tracking-[-0.02em] text-[clamp(1.5rem,6vw,2rem)] lg:text-[2rem]">
            Place card here.
          </span>
          <span className="mt-3 block font-pixel text-[0.6875rem] uppercase leading-snug tracking-[0.04em] text-ink">
            The Doc will see you now.
          </span>
        </span>
        <span className="flex items-center gap-1.5 bg-panel px-2 py-1 text-xs font-semibold text-ink px-frame">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-3.5 w-3.5" shapeRendering="crispEdges">
            <rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="2" />
            <rect x="7" y="7" width="6" height="6" stroke="currentColor" strokeWidth="2" />
            <rect x="13.5" y="5" width="2" height="2" fill="currentColor" />
          </svg>
          the_card_doc
        </span>
      </span>
    </Link>
  );
}
