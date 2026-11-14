import Link from "next/link";
import { DocPortrait } from "@/components/pixel/doc-portrait";

/**
 * The 404 message: Next's default words in a clinic dialog box. `sprite` is
 * a slot for a pixel sprite (a lost card, say) beside the number.
 */
export function NotFoundPanel({ sprite }: { sprite?: React.ReactNode } = {}) {
  return (
    <div className="max-w-xl w-full mx-auto px-4 md:px-10 py-20 md:py-28">
      <div className="flex items-end gap-6">
        <p className="font-heading font-bold text-[7rem] md:text-[9rem] leading-[0.85] tracking-[0.02em] text-ink [text-shadow:5px_5px_0_var(--wall)]">404</p>
        {sprite && <div aria-hidden className="mb-2">{sprite}</div>}
      </div>
      <div className="px-window px-dialog mt-8 flex items-center gap-4 p-5 pr-10">
        <DocPortrait size="sm" alt="" />
        <h1 className="font-sans text-lg font-semibold tracking-normal text-ink">This page could not be found.</h1>
        <span aria-hidden className="px-dialog-next">▼</span>
      </div>
      <Link href="/" className="px-btn mt-9 h-12 px-6 text-base">
        Back to home
      </Link>
    </div>
  );
}
