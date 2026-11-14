import type { DocBlock } from "@/lib/legal/legal-doc";
import { LinkedText } from "./linked-text";

/**
 * Renders a legal text (lib/legal/legal-doc.ts) without changing a word.
 * "page" is the full /terms layout; "compact" fits a scroll box or an
 * agreement card at checkout.
 */
export function LegalDocument({
  blocks,
  variant = "page",
  linkClassName = "font-semibold text-coral-deep underline underline-offset-2 hover:text-ink",
}: {
  blocks: DocBlock[];
  variant?: "page" | "compact";
  linkClassName?: string;
}) {
  const page = variant === "page";
  return (
    <div className={page ? "flex flex-col gap-4 font-sans text-[15px] md:text-base leading-relaxed text-ink-soft" : "flex flex-col gap-2.5 text-[13px] leading-relaxed text-muted-foreground"}>
      {blocks.map((b, i) => {
        if (b.kind === "title") {
          return (
            <p key={i} className={page ? "font-heading text-2xl md:text-3xl font-bold leading-tight tracking-[-0.02em] text-ink" : "font-bold text-foreground"}>
              {b.text}
            </p>
          );
        }
        if (b.kind === "heading") {
          return page ? (
            <h2 key={i} id={b.id} className="scroll-mt-28 mt-8 border-t-2 border-tile pt-6 font-heading text-xl md:text-2xl font-semibold leading-snug tracking-[-0.01em] text-ink">
              {b.text}
            </h2>
          ) : (
            <p key={i} className="mt-2 font-bold text-foreground">{b.text}</p>
          );
        }
        if (b.kind === "list") {
          return (
            <ul key={i} className={page ? "flex flex-col gap-2.5" : "flex flex-col gap-1.5"}>
              {b.items.map((item, j) => (
                <li key={j} className="flex items-start gap-3">
                  <span className="mt-[0.6em] size-1.5 shrink-0 bg-coral-deep" aria-hidden />
                  <span><LinkedText text={item} linkClassName={linkClassName} /></span>
                </li>
              ))}
            </ul>
          );
        }
        const clause = b.clause ? `${b.clause}.` : null;
        return (
          <p key={i}>
            {clause ? (
              <>
                <span className="font-semibold text-ink">{clause}</span>
                <LinkedText text={b.text.slice(clause.length)} linkClassName={linkClassName} />
              </>
            ) : (
              <LinkedText text={b.text} linkClassName={linkClassName} />
            )}
          </p>
        );
      })}
    </div>
  );
}
