"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";

type Item = { id: string; url: string; alt?: string };

// Column travel in px across the wall's pass through the viewport.
const TRAVEL = [-90, 60, -140, 40];

function Column({ items, progress, travel, offset }: { items: Item[]; progress: MotionValue<number>; travel: number; offset: boolean }) {
  // Whole 3px steps, so the screenshots move on the UI's pixel grid.
  const y = useTransform(progress, (v) => Math.round((-travel / 2 + travel * v) / 3) * 3);
  return (
    <motion.div style={{ y }} className={`flex flex-col gap-5 md:gap-6 ${offset ? "pt-16 md:pt-24" : ""}`}>
      {items.map((t) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={t.id}
          src={t.url}
          alt={t.alt ?? "Customer review"}
          loading="lazy"
          className="w-full h-auto bg-panel p-[3px] px-frame-shadow"
        />
      ))}
    </motion.div>
  );
}

/**
 * Customer messages as a wall whose columns drift at different speeds while
 * it scrolls past (parallax), so the screenshots read as a pile of real
 * conversations. 2 columns on phones, 3 on tablets, 4 on desktop. Reduced
 * motion: a still, staggered wall.
 */
export function ParallaxWall({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const [cols, setCols] = useState(4);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const still = useTransform(scrollYProgress, () => 0.5);

  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => setCols(lg.matches ? 4 : md.matches ? 3 : 2);
    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);

  const columns: Item[][] = Array.from({ length: cols }, () => []);
  items.forEach((t, i) => columns[i % cols].push(t));

  return (
    <div
      ref={ref}
      className="relative overflow-hidden py-10 [mask-image:linear-gradient(to_bottom,transparent,#000_8%,#000_92%,transparent)]"
    >
      <div className="grid gap-5 md:gap-6" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {columns.map((col, i) => (
          <Column
            key={`${i}-${reduce}`}
            items={col}
            progress={reduce ? still : scrollYProgress}
            travel={TRAVEL[i % TRAVEL.length]}
            offset={i % 2 === 1}
          />
        ))}
      </div>
    </div>
  );
}
