import Link from "next/link";
import { PREVIEW_MESSAGE } from "@/lib/preview";
import { DocSprite } from "@/components/pixel/sprites";

export const metadata = { title: "Not available yet | The Card Doc" };

export default function NotAvailablePage() {
  return (
    <div className="page-glow">
      <div className="max-w-xl mx-auto px-4 md:px-10 py-20 md:py-28">
        <h1 className="font-heading text-5xl md:text-6xl font-bold uppercase leading-[0.95] tracking-[0.02em] text-ink [text-shadow:3px_3px_0_var(--wall)]">
          Not functional yet
        </h1>
        <div className="px-window px-dialog mt-8 flex items-start gap-4 p-5 pr-10">
          <DocSprite scale={2} className="shrink-0" />
          <p className="text-lg text-ink leading-relaxed">{PREVIEW_MESSAGE}</p>
          <span aria-hidden className="px-dialog-next">▼</span>
        </div>
        <Link href="/" className="px-btn mt-9 h-12 px-6 text-base">
          Back to home
        </Link>
      </div>
    </div>
  );
}
