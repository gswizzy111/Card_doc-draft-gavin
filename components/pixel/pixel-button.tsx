import { cn } from "@/lib/utils";

export type PixelTone = "coral" | "mint" | "panel" | "butter" | "powder" | "ink";

const TONE: Record<PixelTone, string> = {
  coral: "",
  mint: "px-btn-mint",
  panel: "px-btn-panel",
  butter: "px-btn-butter",
  powder: "px-btn-powder",
  ink: "px-btn-ink",
};

const SIZE = {
  sm: "h-10 gap-1.5 px-3.5 text-sm",
  md: "h-12 gap-2 px-5 text-base",
  lg: "h-14 gap-2.5 px-7 text-lg",
} as const;

/**
 * Class string for a chunky pixel button, for links and other elements that
 * should look like one: `<Link className={pixelButton({ tone: "mint" })}>`.
 * (components/ui/button covers real buttons.)
 */
export function pixelButton({
  tone = "coral",
  size = "md",
  className,
}: { tone?: PixelTone; size?: keyof typeof SIZE; className?: string } = {}) {
  return cn("px-btn", TONE[tone], SIZE[size], className);
}
