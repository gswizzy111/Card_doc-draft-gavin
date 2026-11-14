import { cn } from "@/lib/utils";

/**
 * Condition bar, the healing metaphor. Decorative only: it never shows a
 * number. `level` is 0 to 1; low levels draw coral, mid butter, high mint.
 * `animate` fills it from `from` to full once (steps; static under reduced
 * motion). `stepped` makes later `level` changes move the fill in four
 * frames (a progress track); static under reduced motion.
 */
export function HpBar({
  level = 1,
  label = "HP",
  animate = false,
  from = 0.15,
  stepped = false,
  className,
}: {
  level?: number;
  label?: string | null;
  animate?: boolean;
  from?: number;
  stepped?: boolean;
  className?: string;
}) {
  const v = Math.max(0, Math.min(1, level));
  const color = v < 0.34 ? "bg-coral" : v < 0.67 ? "bg-butter" : "bg-mint";
  return (
    <div aria-hidden className={cn("flex items-center gap-2", className)}>
      {label && <span className="font-pixel text-[0.75rem] leading-none text-ink">{label}</span>}
      <span className="hp-bar block flex-1">
        <span
          className={cn("hp-bar-fill", animate ? "bg-mint" : color, animate && "motion-safe:animate-[px-hp-fill_1.2s_steps(8,end)_400ms_both]", stepped && "motion-safe:transition-[width] motion-safe:duration-300 motion-safe:[transition-timing-function:steps(4,end)]")}
          style={{ width: animate ? "100%" : `${v * 100}%`, ["--hp-from" as string]: from }}
        />
      </span>
    </div>
  );
}
