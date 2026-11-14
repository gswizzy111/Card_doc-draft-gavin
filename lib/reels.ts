import type { StaticImageData } from "next/image";
import mantleAfter from "@/public/specimen-mantle-after.jpg";
import charmander from "@/public/specimen-charmander.png";
import garchomp from "@/public/before-after-garchomp.png";
import beforeAfterHero from "@/public/before-after-hero.png";

/**
 * "Watch the work" on the home page: the four most recent @the_card_doc
 * Instagram reels, newest first.
 *
 * TODO(owner): paste your 4 most recent reels here.
 *   - href: the reel's link, like https://www.instagram.com/reel/ABC123xyz/
 *     (a /reel/ link plays inside the page; any other link opens Instagram
 *     in a new tab).
 *   - cover: the reel's front photo. Save it in /public (for example
 *     /public/reels/reel-1.jpg, portrait 9:16 looks best) and import it
 *     above, like the placeholders.
 *   - title: the reel's short title. alt: what the cover photo shows.
 *
 * Until then each tile uses an existing card photo and links to the profile.
 */
export type Reel = {
  id: string;
  title: string;
  href: string;
  cover: StaticImageData | string;
  alt: string;
};

const PROFILE = "https://www.instagram.com/the_card_doc/";

export const REELS: Reel[] = [
  {
    id: "reel-1",
    title: "Mickey Mantle", // TODO(owner): reel title
    href: PROFILE, // TODO(owner): reel URL
    cover: mantleAfter, // TODO(owner): reel cover photo
    alt: "A Mickey Mantle card after restoration",
  },
  {
    id: "reel-2",
    title: "Charmander", // TODO(owner): reel title
    href: PROFILE, // TODO(owner): reel URL
    cover: charmander, // TODO(owner): reel cover photo
    alt: "A Charmander card before and after restoration",
  },
  {
    id: "reel-3",
    title: "Garchomp", // TODO(owner): reel title
    href: PROFILE, // TODO(owner): reel URL
    cover: garchomp, // TODO(owner): reel cover photo
    alt: "A Garchomp card corner before and after restoration",
  },
  {
    id: "reel-4",
    title: "Before → After", // TODO(owner): reel title
    href: PROFILE, // TODO(owner): reel URL
    cover: beforeAfterHero, // TODO(owner): reel cover photo
    alt: "A card before and after restoration",
  },
];

/** The reel's code when `href` is an Instagram reel link, else null. */
export function reelCode(href: string): string | null {
  const m = href.match(/^https:\/\/(?:www\.)?instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}
