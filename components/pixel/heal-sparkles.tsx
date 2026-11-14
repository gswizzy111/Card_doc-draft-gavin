import { cn } from "@/lib/utils";

const SPOTS = [
  { left: "12%", top: "70%", delay: "0s", color: "text-mint" },
  { left: "30%", top: "55%", delay: "0.5s", color: "text-butter" },
  { left: "52%", top: "75%", delay: "0.9s", color: "text-coral" },
  { left: "70%", top: "60%", delay: "0.3s", color: "text-mint" },
  { left: "86%", top: "72%", delay: "1.2s", color: "text-powder" },
  { left: "42%", top: "40%", delay: "1.4s", color: "text-butter" },
];

/**
 * Healing sparkles: little pixel plus-signs rising in stepped frames.
 * Pure CSS (server-safe). Under reduced motion they hold still as a static
 * scatter. Place inside a `relative` parent.
 */
export function HealSparkles({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {SPOTS.slice(0, count).map((s, i) => (
        <span
          key={i}
          className={cn("heal-sparkle", s.color)}
          style={{ left: s.left, top: s.top, ["--delay" as string]: s.delay }}
        />
      ))}
    </span>
  );
}
