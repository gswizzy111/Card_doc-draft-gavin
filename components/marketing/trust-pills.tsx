import { REASONS } from "@/lib/about";
import { PixelIcon, type PixelIconName } from "@/components/pixel";

/**
 * The clinic's status strip: four pixel chips (cards restored, free photo
 * review, reply time, years collecting). Phones scroll them sideways;
 * wider screens wrap them.
 */
export function TrustPills({ cardsRestored, className = "", align = "center" }: { cardsRestored: string; className?: string; align?: "center" | "start" }) {
  const pills: { icon: PixelIconName; tile: string; text: string }[] = [
    { icon: "heart-plus", tile: "bg-rx-soft", text: `${cardsRestored} Cards Restored` },
    { icon: "camera", tile: "bg-powder", text: "Free Photo Review" },
    { icon: "chat", tile: "bg-mint", text: "We reply within 1 business day." },
    { icon: "user", tile: "bg-butter", text: REASONS.items[1].title },
  ];
  return (
    <div className={`relative ${className}`}>
      <ul
        aria-label="Why collectors trust The Card Doc"
        className={`no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 py-[6px] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 ${align === "center" ? "sm:justify-center" : ""}`}
      >
        {pills.map(({ icon, tile, text }) => (
          <li
            key={text}
            className="flex h-9 shrink-0 snap-start items-center gap-2 whitespace-nowrap bg-panel pr-3 text-[13px] font-semibold text-ink px-frame"
          >
            <span aria-hidden className={`grid h-full w-9 place-items-center border-r-[3px] border-ink ${tile}`}>
              <PixelIcon name={icon} size={16} />
            </span>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
