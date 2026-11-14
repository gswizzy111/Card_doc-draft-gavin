import Link from "next/link";
import { PREVIEW_MESSAGE } from "@/lib/preview";
import { DocSprite } from "@/components/pixel/sprites";
import { pixelButton } from "@/components/pixel/pixel-button";

export const metadata = { title: "Not available yet | The Card Doc" };

export default function NotAvailablePage() {
  return (
    <div>
      <div className="max-w-xl mx-auto px-4 md:px-10 py-20 md:py-28">
        <DocSprite scale={3} animate={false} className="block" />
        <h1 className="mt-8 font-heading text-[2.125rem] md:text-5xl font-bold leading-[1.05] tracking-[-0.02em] text-ink">
          Not functional yet
        </h1>
        <p className="mt-5 text-lg text-ink-soft leading-relaxed">{PREVIEW_MESSAGE}</p>
        <Link href="/" className={pixelButton({ className: "mt-9" })}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
