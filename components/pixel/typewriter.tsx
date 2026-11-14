"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";

/**
 * Short dialog text that types itself out, one character per tick, like an
 * NPC line. Screen readers get the whole string at once; with reduced motion
 * (and before hydration) the full text shows. Keep it to a sentence or two.
 *
 * Revision 2: typing is off by default (the full text shows at once); pass
 * `animate` to opt back in for one short line.
 */
export function Typewriter({
  text,
  speed = 28,
  delay = 250,
  className,
  animate = false,
}: {
  text: string;
  animate?: boolean;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (reduce || !animate) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setShown(i);
      if (i < text.length) timer = setTimeout(tick, speed);
    };
    timer = setTimeout(() => {
      setShown(0);
      tick();
    }, delay);
    return () => clearTimeout(timer);
  }, [text, speed, delay, reduce, animate]);

  const count = reduce || !animate || shown === null ? text.length : shown;
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="grid">
        {/* The full text reserves the space so nothing jumps while typing. */}
        <span className="invisible col-start-1 row-start-1">{text}</span>
        <span className="col-start-1 row-start-1">{text.slice(0, count)}</span>
      </span>
    </span>
  );
}
