"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { REELS, reelCode, type Reel } from "@/lib/reels";

/** A small pixel play triangle in a square badge. */
function PlayBadge() {
  return (
    <span
      aria-hidden
      className="grid size-11 place-items-center bg-panel/95 px-frame transition-transform duration-150 ease-out group-hover:scale-105 group-focus-visible:scale-105 md:size-14"
    >
      <svg width="16" height="20" viewBox="0 0 8 10" shapeRendering="crispEdges" className="translate-x-0.5">
        <path fill="var(--coral-deep)" d="M0 0h1v10h-1zM1 1h1v8h-1zM2 1h1v8h-1zM3 2h1v6h-1zM4 3h1v4h-1zM5 3h1v4h-1zM6 4h1v2h-1zM7 4h1v2h-1z" />
      </svg>
    </span>
  );
}

/** True when a photo is already portrait enough to fill a 9:16 tile. */
function isPortrait(cover: Reel["cover"]) {
  if (typeof cover === "string") return true;
  return cover.height / cover.width >= 1.5;
}

function Tile({ reel, onPlay }: { reel: Reel; onPlay: (reel: Reel, code: string) => void }) {
  const code = reelCode(reel.href);
  const fill = isPortrait(reel.cover);
  const body = (
    <>
      <span className="relative block aspect-[9/16] overflow-hidden bg-night">
        {!fill && (
          <Image
            src={reel.cover}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 768px) 120px, 80px"
            className="scale-125 object-cover opacity-45 blur-xl"
          />
        )}
        <Image
          src={reel.cover}
          alt={reel.alt}
          fill
          sizes="(min-width: 1280px) 290px, (min-width: 768px) 23vw, 46vw"
          className={`transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${fill ? "object-cover" : "object-contain p-3 md:p-5"}`}
        />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/90 via-night/40 to-transparent" />
        <span className="absolute inset-0 grid place-items-center">
          <PlayBadge />
        </span>
        <span className="absolute inset-x-0 bottom-0 p-3 md:p-4">
          <span className="block font-heading text-base font-semibold leading-tight text-panel md:text-lg [text-wrap:balance]">
            {reel.title}
          </span>
        </span>
      </span>
    </>
  );
  const cls =
    "group block w-full bg-panel p-1.5 text-left px-frame-shadow transition-transform duration-150 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5 motion-reduce:hover:translate-y-0 md:p-2";

  if (code) {
    return (
      <button type="button" onClick={() => onPlay(reel, code)} className={cls} aria-label={`Play ${reel.title}`}>
        {body}
      </button>
    );
  }
  return (
    <a href={reel.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${reel.title} on Instagram (opens in a new tab)`}>
      {body}
    </a>
  );
}

/**
 * "Watch the work": the four latest reels as portrait tiles with a cover
 * photo, a pixel play badge and the title. A /reel/ link plays in a dialog
 * (Instagram's embed, loaded only on open); anything else opens Instagram in
 * a new tab. Reels come from lib/reels.ts.
 */
export function WatchTheWork() {
  const [playing, setPlaying] = useState<{ reel: Reel; code: string } | null>(null);

  return (
    <>
      <ul data-reveal="stagger" className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {REELS.map((reel) => (
          <li key={reel.id}>
            <Tile reel={reel} onPlay={(r, code) => setPlaying({ reel: r, code })} />
          </li>
        ))}
      </ul>

      <Dialog open={playing !== null} onOpenChange={(open) => { if (!open) setPlaying(null); }}>
        <DialogContent className="w-auto max-w-[calc(100%-2rem)] gap-3 p-3 pt-12 sm:max-w-none md:p-4 md:pt-12">
          <DialogTitle className="absolute top-3 left-4 max-w-[calc(100%-4rem)] truncate text-base">
            {playing?.reel.title}
          </DialogTitle>
          {playing && (
            <iframe
              src={`https://www.instagram.com/reel/${playing.code}/embed`}
              title={`${playing.reel.title} (Instagram reel)`}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              style={{ width: "min(calc(100vw - 3.5rem), calc(min(78dvh, 46rem) * 9 / 16))" }}
              className="block aspect-[9/16] h-auto border-0 bg-night"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
