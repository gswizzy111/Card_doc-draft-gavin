import { SplitReveal } from "@/components/motion/split-reveal";
import { DocPortrait } from "@/components/pixel/doc-portrait";

/**
 * Page header in the clinic style: a wall sign (eyebrow tab and pixel
 * headline) over the doc's dialog box, which carries the lead. `sprite` is a
 * slot for a pixel sprite that stands beside the headline (on phones, at half
 * size beside the eyebrow, so use even scales); `portrait={false}`
 * drops the doc from the dialog.
 */
export function PageHero({
  eyebrow,
  title,
  lines,
  lead,
  className = "",
  sprite,
  portrait = true,
}: {
  eyebrow?: string;
  title: string;
  lines?: string[];
  lead?: React.ReactNode;
  className?: string;
  sprite?: React.ReactNode;
  portrait?: boolean;
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <div className="mb-5 flex items-end justify-between gap-4">
          <p className="hero-in inline-flex h-8 items-center gap-2 bg-butter px-3 font-pixel text-xs uppercase tracking-[0.04em] text-ink px-frame md:text-[13px]">
            <span aria-hidden className="text-coral-deep">▶</span>
            {eyebrow}
          </p>
          {/* Phones: the sprite sits beside the eyebrow at half size (zoom
              keeps whole pixels for 2x/4x art and shrinks its layout box). */}
          {sprite && <div aria-hidden className="shrink-0 [zoom:0.5] md:hidden">{sprite}</div>}
        </div>
      )}
      <div className="flex items-end justify-between gap-6">
        <h1 className="max-w-5xl font-heading font-bold uppercase leading-[0.95] tracking-[0.01em] text-ink text-[clamp(2.25rem,9.5vw,3.5rem)] md:text-6xl lg:text-[4.75rem] [text-shadow:3px_3px_0_var(--wall)]">
          <SplitReveal text={title} lines={lines} step={70} />
        </h1>
        {sprite && <div aria-hidden className="hidden shrink-0 md:block">{sprite}</div>}
      </div>
      {lead && (
        <div
          className="hero-in px-window px-dialog mt-7 flex max-w-2xl items-start gap-4 p-4 pr-9 md:mt-8 md:p-5 md:pr-10"
          style={{ ["--d" as string]: 280 }}
        >
          {portrait && <DocPortrait size="sm" alt="" className="hidden sm:inline-flex" />}
          <p className="text-lg font-medium leading-relaxed text-ink md:text-xl">{lead}</p>
          <span aria-hidden className="px-dialog-next">▼</span>
        </div>
      )}
    </div>
  );
}
