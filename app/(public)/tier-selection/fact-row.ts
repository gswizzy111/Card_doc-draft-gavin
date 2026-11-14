// One tier fact: label and value side by side, stacked when the card is too
// narrow for both (the facts list is the container, and cards in a row share
// a width, so a whole row switches together).
export const FACT_ROW =
  "flex flex-col gap-0.5 py-2.5 text-sm @min-[16.5rem]:flex-row @min-[16.5rem]:justify-between @min-[16.5rem]:gap-3";

// The action plate a sold-out or closed ward shows instead of its button.
export const CLOSED_ACTION =
  "flex h-12 w-full cursor-not-allowed items-center justify-center bg-muted font-heading text-base text-ink-soft px-frame [background-image:repeating-linear-gradient(135deg,transparent_0_6px,color-mix(in_srgb,var(--ink)_7%,transparent)_6px_9px)]";

// The "*" hover note on a tier's card value: a tiny ink window.
export const TOOLTIP =
  "pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-max max-w-[180px] bg-ink px-2.5 py-1.5 text-xs leading-snug text-panel opacity-0 px-frame group-hover:opacity-100";
