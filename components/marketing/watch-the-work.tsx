"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { ArrowUpRight, Camera, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { REELS, reelCode, type Reel } from "@/lib/reels";
import libMantle from "@/public/specimen-mantle-after.jpg";
import libCharmander from "@/public/specimen-charmander.png";
import libGarchomp from "@/public/before-after-garchomp.png";
import libBeforeAfter from "@/public/before-after-hero.png";
import charmanderPair from "@/public/home/charmander-pair.jpg";
import mantleHeld from "@/public/home/mantle-before-held.jpg";
import garchomp from "@/public/home/garchomp.jpg";

/** The sun play button with its white die-cut edge. */
function PlayBadge() {
  return (
    <span
      aria-hidden
      className="grid size-14 place-items-center rounded-full bg-sun text-ink shadow-[0_0_0_3px_var(--white),0_10px_22px_-8px_rgba(8,12,40,0.6)] transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none md:size-16"
    >
      <Play className="size-6 translate-x-0.5 fill-ink md:size-7" strokeWidth={1.75} />
    </span>
  );
}

/** Instagram, not a reel: a small camera chip, so the tile never promises playback. */
function InstagramChip() {
  return (
    <span
      aria-hidden
      className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3 text-[13px] font-extrabold text-ink shadow-[0_6px_14px_-6px_rgba(8,12,40,0.55)] transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5 motion-reduce:transition-none"
    >
      <Camera className="size-4" strokeWidth={1.75} />
      Instagram
      <ArrowUpRight className="size-4" strokeWidth={1.75} />
    </span>
  );
}

/** A link that plays as a reel. Anything else (the profile) opens Instagram. */
function isReelLink(href: string) {
  return href.includes("/reel/");
}

/** True when a photo is already portrait enough to fill a 9:16 tile. */
function isPortrait(cover: Reel["cover"]) {
  if (typeof cover === "string") return true;
  return cover.height / cover.width >= 1.5;
}

type Crop = { position: string; zoom: number; origin: string };

// Until the owner's 9:16 covers arrive, lib/reels.ts points at placeholder
// photos that repeat the rest of the home page. While a reel still has its
// placeholder, the tile shows a photo or crop the page uses nowhere else, at
// no more than its own resolution: the Mantle held in a black glove (used
// only here), the "after" half of the Charmander pair, the Garchomp corner.
// The "Before → After" placeholder is left out until it has a cover that
// really shows both halves. A real cover from the owner always wins.
const STAND_INS: { from: StaticImageData; src: StaticImageData | null; alt: string; crop: Crop }[] = [
  { from: libMantle, src: mantleHeld, alt: "A cracked Mickey Mantle card held in a black glove, before restoration", crop: { position: "46% 50%", zoom: 1, origin: "50% 50%" } },
  { from: libCharmander, src: charmanderPair, alt: "A Base Set Charmander card after restoration", crop: { position: "100% 50%", zoom: 1, origin: "50% 50%" } },
  { from: libGarchomp, src: garchomp, alt: "A Garchomp holo card corner", crop: { position: "22% 50%", zoom: 1, origin: "50% 50%" } },
  { from: libBeforeAfter, src: null, alt: "", crop: { position: "50% 50%", zoom: 1, origin: "50% 50%" } },
];

function coverFor(reel: Reel): { src: Reel["cover"] | null; alt: string; crop: Crop | null } {
  const swap = typeof reel.cover !== "string" ? STAND_INS.find((s) => s.from.src === (reel.cover as StaticImageData).src) : undefined;
  if (swap) return { src: swap.src, alt: swap.alt, crop: swap.crop };
  return { src: reel.cover, alt: reel.alt, crop: isPortrait(reel.cover) ? null : { position: "50% 50%", zoom: 1, origin: "50% 50%" } };
}
// Alternate slight tilts, like prints laid on the table.
const TILT = [-1.6, 1.2, -0.8, 1.8];

function Tile({ reel, index, onPlay }: { reel: Reel; index: number; onPlay: (reel: Reel, code: string) => void }) {
  const code = isReelLink(reel.href) ? reelCode(reel.href) : null;
  const { src, alt, crop } = coverFor(reel);
  if (!src) return null;
  const body = (
    <>
      <span className="relative block aspect-[9/16] overflow-hidden rounded-[3px] bg-white">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1280px) 290px, (min-width: 768px) 23vw, 62vw"
          style={
            crop
              ? { objectPosition: crop.position, transform: `scale(${crop.zoom})`, transformOrigin: crop.origin }
              : { objectPosition: "50% 50%" }
          }
          className="object-cover"
        />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/70 to-transparent" />
        {code ? (
          <span className="absolute inset-0 grid place-items-center">
            <PlayBadge />
          </span>
        ) : (
          <span className="absolute bottom-3 left-3">
            <InstagramChip />
          </span>
        )}
      </span>
      <span className="caps mt-3 block px-1 pb-0.5 font-display text-xl font-extrabold leading-none tracking-[0.02em] text-ink md:text-[22px]">
        {reel.title}
      </span>
    </>
  );
  const cls =
    "print print-lift group block w-full text-left p-2 md:p-2.5 focus-visible:outline-offset-4";
  const style = { ["--tilt" as string]: `${TILT[index % TILT.length]}deg` };

  if (code) {
    return (
      <button type="button" onClick={() => onPlay(reel, code)} className={cls} style={style} aria-label={`Play ${reel.title}`}>
        {body}
      </button>
    );
  }
  return (
    <a href={reel.href} target="_blank" rel="noopener noreferrer" className={cls} style={style} aria-label={`View on Instagram: ${reel.title} (opens in a new tab)`}>
      {body}
    </a>
  );
}

/**
 * "Watch the work": the four latest reels as portrait prints with a cover
 * photo and the title. A /reel/ link gets a sun play button and plays in a dialog
 * (Instagram's embed, loaded only on open); anything else shows an
 * Instagram chip and opens Instagram in a new tab. Phones get a sideways swipe row. Reels come from lib/reels.ts.
 */
export function WatchTheWork() {
  const [playing, setPlaying] = useState<{ reel: Reel; code: string } | null>(null);
  const reels = REELS.filter((r) => coverFor(r).src !== null);
  const cols = reels.length >= 4 ? "md:grid-cols-4" : reels.length === 3 ? "md:mx-auto md:max-w-[60rem] md:grid-cols-3" : "md:mx-auto md:max-w-[40rem] md:grid-cols-2";

  return (
    <>
      <ul
        data-reveal="stagger"
        aria-label="Reels"
        // Phones scroll this row sideways, so keyboards can reach it too.
        tabIndex={0}
        className={`no-scrollbar focus-visible:outline-offset-[-3px] -mx-[var(--gut)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gut)] pt-3 pb-8 md:mx-0 md:grid md:gap-7 md:overflow-visible md:px-0 lg:gap-9 ${cols}`}
      >
        {reels.map((reel, i) => (
          <li key={reel.id} className="w-[62%] max-w-[260px] shrink-0 snap-center md:w-auto md:max-w-none">
            <Tile reel={reel} index={i} onPlay={(r, code) => setPlaying({ reel: r, code })} />
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
              className="block aspect-[9/16] h-auto rounded-lg border-0 bg-ink"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
