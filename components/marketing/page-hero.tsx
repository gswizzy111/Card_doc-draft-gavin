import { SplitReveal } from "@/components/motion/split-reveal";
import { DocPortrait } from "@/components/pixel/doc-portrait";

/**
 * Page header: a small pixel eyebrow tag, a sentence-case headline in the
 * heading sans, and the lead as a plain paragraph. Revision 2 keeps it calm:
 * - `portrait` (opt-in) puts the lead in a dialog window beside the doc's
 *   portrait, for the one page where the doc "speaks".
 * - `sprite` (opt-in) is a slot for one small pixel sprite beside the
 *   headline (hidden on phones). Leave it empty on most pages.
 */
export function PageHero({
  eyebrow,
  title,
  lines,
  lead,
  className = "",
  sprite,
  portrait = false,
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
        <p className="hero-in mb-5 inline-flex items-center gap-2 font-pixel text-[0.6875rem] uppercase leading-none tracking-[0.06em] text-coral-deep md:text-xs">
          <span aria-hidden className="size-1.5 bg-coral-deep" />
          {eyebrow}
        </p>
      )}
      <div className="flex items-end justify-between gap-6">
        <h1 className="max-w-4xl font-heading font-bold leading-[1.04] tracking-[-0.02em] text-ink text-[clamp(2.25rem,8vw,3rem)] md:text-[3.5rem] lg:text-[4rem]">
          <SplitReveal text={title} lines={lines} step={50} />
        </h1>
        {sprite && <div aria-hidden className="hidden shrink-0 md:block">{sprite}</div>}
      </div>
      {lead &&
        (portrait ? (
          <div
            className="hero-in px-window mt-7 flex max-w-2xl items-start gap-4 p-4 md:mt-8 md:p-5"
            style={{ ["--d" as string]: 200 }}
          >
            <DocPortrait size="sm" alt="" className="hidden sm:inline-flex" />
            <p className="text-lg leading-relaxed text-ink md:text-xl">{lead}</p>
          </div>
        ) : (
          <p
            className="hero-in mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:mt-7 md:text-xl [text-wrap:pretty]"
            style={{ ["--d" as string]: 200 }}
          >
            {lead}
          </p>
        ))}
    </div>
  );
}
