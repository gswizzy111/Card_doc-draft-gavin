"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";
import { useForwardOnly } from "@/components/motion/use-scroll-once";

type Step = {
  n: string;
  title: string;
  /** A short line under the title (a condition or the order status during the step) */
  note?: string;
  /** Text, or richer content such as a list */
  body: React.ReactNode;
};

/**
 * Sticky scroll walkthrough: the current step's number and title stay pinned
 * on the left while the steps scroll past on the right; a progress rule fills
 * with scroll and the step in the middle of the viewport lights up. The rule
 * and the step markers keep how far the reader got (they don't empty again
 * on the way back up); the highlight follows the step in view.
 */
export function StepWalkthrough({ title, steps }: { title: string; steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [reached, setReached] = useState(0);
  const reduce = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const smooth = useSpring(useForwardOnly(scrollYProgress), { bounce: 0, duration: 0.3 });
  const progress = useTransform(smooth, (v) => Math.min(1, Math.max(0, v)));

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.index);
          setActive(i);
          setReached((r) => Math.max(r, i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = steps[active];

  return (
    <div ref={ref} className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
      <div className="md:sticky md:top-32 md:self-start">
        <h2 className="font-heading font-bold text-[2.125rem] md:text-5xl leading-[1.05] tracking-[-0.02em] text-ink mb-6 [text-wrap:balance]">{title}</h2>
        <div className="hidden md:block" aria-hidden>
          <div className="flex items-baseline gap-4">
            <span key={current.n} className="font-heading font-bold text-[6rem] leading-none tracking-[-0.04em] text-coral-deep tabular-nums motion-safe:animate-[rx-in_320ms_cubic-bezier(0.23,1,0.32,1)_both]">
              {current.n}
            </span>
            <span className="font-pixel text-sm text-ink-soft">/ {steps.length}</span>
          </div>
          <p key={current.title} className="mt-3 font-heading text-2xl font-semibold leading-snug text-ink motion-safe:animate-[rx-in_320ms_cubic-bezier(0.23,1,0.32,1)_both]">
            {current.title}
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Progress rule */}
        <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-tile" aria-hidden />
        <motion.div
          className="absolute left-[15px] top-2 bottom-2 w-[2px] origin-top bg-mint-deep"
          style={{ scaleY: reduce ? 1 : progress }}
          aria-hidden
        />
        <ol className="flex flex-col gap-10 md:gap-0">
          {steps.map((step, i) => (
            <li
              key={step.n}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-index={i}
              className="relative flex items-start gap-5 md:min-h-[38vh] md:py-6"
            >
              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center font-pixel text-xs px-frame transition-colors duration-200 ease-out ${
                  i <= reached ? "bg-mint text-ink" : "bg-panel text-ink-soft"
                }`}
              >
                {step.n}
              </span>
              <div className={`min-w-0 flex-1 transition-opacity duration-200 ease-out ${i === active ? "opacity-100" : "md:opacity-75"}`}>
                <p className="font-heading font-semibold text-xl sm:text-[1.375rem] md:text-2xl leading-snug tracking-[-0.01em] text-ink [overflow-wrap:anywhere]">{step.title}</p>
                {step.note && <p className="mt-1 text-sm font-medium text-coral-deep leading-relaxed max-w-[52ch]">{step.note}</p>}
                {typeof step.body === "string" ? (
                  <p className="mt-1.5 text-[15px] md:text-base text-muted-foreground leading-relaxed max-w-[48ch]">{step.body}</p>
                ) : (
                  <div className="mt-1.5 text-[15px] md:text-base text-muted-foreground leading-relaxed max-w-[52ch]">{step.body}</div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
