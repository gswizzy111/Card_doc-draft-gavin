import Link from "next/link";
import { NotFoundPanel } from "@/components/marketing/not-found-panel";
import { DocPortrait } from "@/components/pixel/doc-portrait";

export const metadata = { title: "404 | The Card Doc" };

// Unmatched URLs render here, outside the marketing layout, so the page
// carries its own brand mark.
export default function NotFound() {
  return (
    <div className="page-glow flex flex-1 flex-col min-h-screen">
      <div className="max-w-7xl w-full mx-auto px-4 md:px-10 py-5">
        <Link href="/" className="inline-flex items-center gap-3">
          <DocPortrait size="xs" alt="" />
          <span className="font-heading text-xl font-bold tracking-[0.02em] text-ink">The Card Doc</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center">
        <NotFoundPanel />
      </div>
    </div>
  );
}
