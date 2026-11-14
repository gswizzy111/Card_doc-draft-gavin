import { REASONS } from "@/lib/about";
import { PixelIcon, type PixelIconName } from "@/components/pixel";
import styles from "./trust-marquee.module.css";

/**
 * The cards-restored figure the site shows, set by the owner ("5000+").
 * Display only: lib/site-stats.ts still counts the live number.
 */
export const CARDS_RESTORED_DISPLAY = "5000+";

type Pill = { icon: PixelIconName; tile: string; text: string };

function pillsFor(cardsRestored: string): Pill[] {
  return [
    { icon: "heart-plus", tile: "bg-rx-soft", text: `${cardsRestored} Cards Restored` },
    { icon: "camera", tile: "bg-powder", text: "Free Photo Review" },
    { icon: "chat", tile: "bg-mint", text: "We reply within 1 business day." },
    { icon: "user", tile: "bg-butter", text: REASONS.items[1].title },
  ];
}

/**
 * The clinic's status strip: four quiet facts (cards restored, free photo
 * review, reply time, years collecting), each with a small pixel icon.
 * Phones scroll them sideways; wider screens wrap them.
 */
export function TrustPills({
  cardsRestored = CARDS_RESTORED_DISPLAY,
  className = "",
  align = "center",
}: {
  cardsRestored?: string;
  className?: string;
  align?: "center" | "start";
}) {
  const pills = pillsFor(cardsRestored);
  return (
    <div className={`relative ${className}`}>
      <ul
        aria-label="Why collectors trust The Card Doc"
        className={`no-scrollbar -mx-4 flex snap-x gap-x-7 gap-y-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 ${align === "center" ? "sm:justify-center" : ""}`}
      >
        {pills.map(({ icon, tile, text }) => (
          <li
            key={text}
            className="flex h-8 shrink-0 snap-start items-center gap-2 whitespace-nowrap text-[13px] font-semibold text-ink-soft"
          >
            <span aria-hidden className={`grid size-6 place-items-center ${tile}`}>
              <PixelIcon name={icon} size={16} />
            </span>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The same four facts as a slim night band that slides left forever (pure
 * CSS, see trust-marquee.module.css). Screen readers get one plain
 * list; the moving track is decorative. It pauses under a mouse pointer, and
 * under reduced motion it stands still as a centered, wrapping row.
 */
export function TrustMarquee({
  cardsRestored = CARDS_RESTORED_DISPLAY,
  className = "",
}: {
  cardsRestored?: string;
  className?: string;
}) {
  const pills = pillsFor(cardsRestored);
  // Each half of the track holds the list twice, so one half is always wider
  // than the screen and the -50% loop never shows a gap.
  const half = [...pills, ...pills];
  return (
    <div className={`${styles.band} relative overflow-hidden bg-night text-panel ${className}`}>
      <ul aria-label="Why collectors trust The Card Doc" className="sr-only">
        {pills.map(({ text }) => <li key={text}>{text}</li>)}
      </ul>
      <div aria-hidden className={`${styles.track} flex w-max`}>
        {[0, 1].map((copy) => (
          <ul key={copy} className={`flex shrink-0 items-center ${copy === 1 ? styles.copy : ""}`}>
            {half.map(({ icon, tile, text }, i) => (
              <li
                key={`${text}-${i}`}
                className={`flex h-10 shrink-0 items-center gap-2.5 whitespace-nowrap pr-10 text-[13px] font-semibold tracking-[0.01em] md:h-11 md:pr-14 md:text-sm ${i >= pills.length ? styles.copy : ""}`}
              >
                <span className={`grid size-6 place-items-center ${tile}`}>
                  <PixelIcon name={icon} size={16} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
