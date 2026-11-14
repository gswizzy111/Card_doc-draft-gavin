"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";
import { useForwardOnly } from "@/components/motion/use-scroll-once";

/**
 * A before/after photo "developed" by a scan beam as it scrolls into view:
 * the beam sweeps left to right (the order the photo reads, before then
 * after) and leaves the full-colour image behind it. A developed photo stays
 * developed when the page scrolls back up. Both layers use the same file, so
 * it downloads once. Reduced motion: the finished image.
 */
export function ScanReveal({ src, alt, sizes }: { src: StaticImageData; alt: string; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "center 45%"] });
  const p = useSpring(useForwardOnly(scrollYProgress), { bounce: 0, duration: 0.35 });
  // 24 whole frames across the photo: a scan line, not a glide.
  const percent = useTransform(p, (v) => Math.round(Math.min(1, Math.max(0, v)) * 24) / 24 * 100);
  const clipPath = useMotionTemplate`inset(-10% calc(100% - ${percent}%) -10% -10%)`;
  const beamX = useMotionTemplate`${percent}%`;
  const beamOpacity = useTransform(p, [0, 0.04, 0.94, 1], [0, 1, 1, 0]);

  const image = (
    <Image src={src} alt={alt} sizes={sizes} className="w-full h-auto" />
  );

  if (reduce) return (
    <div ref={ref} className="relative">
      {image}
    </div>
  );

  return (
    <div ref={ref} className="relative">
      {/* Undeveloped */}
      <div aria-hidden className="opacity-40 grayscale brightness-75">
        <Image src={src} alt="" sizes={sizes} className="w-full h-auto" />
      </div>
      {/* Developed */}
      <motion.div className="absolute inset-0" style={{ clipPath }}>
        {image}
      </motion.div>
      {/* Beam */}
      <motion.div aria-hidden className="pointer-events-none absolute -inset-y-[6%] inset-x-0" style={{ x: beamX }}>
        <motion.div className="absolute inset-y-0 -left-[3px] w-[6px] bg-mint shadow-[0_0_0_3px_var(--ink)]" style={{ opacity: beamOpacity }}>
          <div className="absolute inset-y-0 left-[9px] w-[6px] bg-mint/35" />
        </motion.div>
      </motion.div>
    </div>
  );
}
