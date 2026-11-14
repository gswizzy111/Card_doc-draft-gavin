import { REASONS } from "@/lib/about";
import { PixelIcon, type PixelIconName } from "@/components/pixel";

/**
 * The clinic's status strip: four quiet facts (cards restored, free photo
 * review, reply time, years collecting), each with a small pixel icon.
 * Phones scroll them sideways; wider screens wrap them.
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
