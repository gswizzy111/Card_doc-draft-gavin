import { cn } from "@/lib/utils";
import { SparkleSprite } from "./sprites";

const SPOTS = [
  { left: "12%", top: "70%", delay: 0 },
  { left: "30%", top: "55%", delay: 0.5 },
  { left: "52%", top: "75%", delay: 0.9 },
  { left: "70%", top: "60%", delay: 0.3 },
  { left: "86%", top: "72%", delay: 1.2 },
  { left: "42%", top: "40%", delay: 1.4 },
];

/**
 * Healing sparkles: the art's mint sparkle sprite (12x12, drawn at 2x) twinkling
 * through its frames while it rises in stepped frames. Server-safe. Under
 * reduced motion they hold still as a static scatter of full stars. Place
 * inside a `relative` parent.
 */
export function HealSparkles({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {SPOTS.slice(0, Math.min(count, SPOTS.length)).map((s, i) => (
        <span
          key={i}
          className="heal-sparkle heal-sparkle-sprite"
          style={{ left: s.left, top: s.top, ["--delay" as string]: `${s.delay}s` }}
        >
          <SparkleSprite scale={2} delay={s.delay} />
        </span>
      ))}
    </span>
  );
}
