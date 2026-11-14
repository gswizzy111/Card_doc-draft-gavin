import Link from "next/link";
import { CardSprite } from "@/components/pixel/sprites";
import { pixelButton } from "@/components/pixel/pixel-button";

/**
 * The 404 message: Next's default words under a big pixel 404. `sprite` is
 * the page's one small illustration beside the number; it defaults to a
 * hurt card. `sprite={null}` leaves it empty.
 */
export function NotFoundPanel({ sprite = <CardSprite variant="hurt" scale={3} /> }: { sprite?: React.ReactNode } = {}) {
  return (
    <div className="max-w-xl w-full mx-auto px-4 md:px-10 py-20 md:py-28">
      <div className="flex items-end gap-5">
        <p className="font-pixel text-[5.5rem] md:text-[7rem] leading-[0.85] text-ink" style={{ letterSpacing: "-0.05em" }}>404</p>
        {sprite && <div aria-hidden className="mb-1">{sprite}</div>}
      </div>
      <h1 className="mt-8 font-heading text-2xl font-semibold text-ink md:text-[1.75rem]">This page could not be found.</h1>
      <Link href="/" className={pixelButton({ className: "mt-8" })}>
        Back to home
      </Link>
    </div>
  );
}
