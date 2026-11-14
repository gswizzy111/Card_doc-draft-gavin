"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";
import { BeforeAfter } from "@/components/motion/before-after";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";
import type { ResultCase } from "@/lib/about";

/**
 * Real before/after results on the night stage (the clinic's patient wall),
 * one case per slide, each photo in a quiet frame. The slides
 * sit in a native scroll-snap track: phones swipe between them (the next one
 * peeks in), and the case names above jump to one on any screen. A slider
 * case is the drag/keyboard <BeforeAfter/>; a composite case is the owner's
 * own side-by-side photo. Cases come from RESULTS in lib/about.ts.
 */
export function ResultsGallery({ cases }: { cases: ResultCase[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = usePrefersReducedMotion();

  // The case in view is the slide whose start is nearest the track's scroll
  // position (read on scroll, so a swipe, a trackpad or a tap all agree).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
        const slides = Array.from(track.children) as HTMLElement[];
        let best = 0;
        slides.forEach((s, i) => {
          if (Math.abs(s.offsetLeft - pad - track.scrollLeft) < Math.abs(slides[best].offsetLeft - pad - track.scrollLeft)) best = i;
        });
        setActive(best);
      });
    };
    track.addEventListener("scroll", update, { passive: true });
    return () => {
      track.removeEventListener("scroll", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  function go(i: number) {
    const track = trackRef.current;
    const slide = track?.children[i] as HTMLElement | undefined;
    if (!track || !slide) return;
    // Scroll the track only (scrollIntoView would also move the page). The
    // track is the slides' offset parent, so offsetLeft includes its padding.
    const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    track.scrollTo({ left: slide.offsetLeft - pad, behavior: reduce ? "auto" : "smooth" });
    setActive(i);
  }

  if (cases.length === 0) return null;

  return (
    <div>
      {cases.length > 1 && (
        <div className="mb-8 md:mb-10 flex flex-wrap items-center gap-3" aria-label="Choose a result">
          {cases.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => go(i)}
              aria-controls={`result-${c.id}`}
              aria-current={i === active ? "true" : undefined}
              className={`press inline-flex h-10 items-center px-4 text-sm font-semibold transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-butter ${
                i === active
                  ? "bg-butter text-ink px-frame"
                  : "bg-night-raise text-stage-fg shadow-[inset_0_0_0_2px_color-mix(in_srgb,var(--stage-muted)_45%,transparent)] hover:bg-[color-mix(in_srgb,var(--butter)_22%,var(--night-raise))]"
              }`}
            >
              {c.card}
            </button>
          ))}
          <span className="ml-auto rx-label text-butter tabular-nums" aria-live="polite">
            {active + 1} / {cases.length}
          </span>
        </div>
      )}

      <div
        ref={trackRef}
        className="relative -mx-4 md:mx-0 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 md:scroll-px-0 md:px-0 md:gap-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cases.map((c, i) => (
          <article
            key={c.id}
            id={`result-${c.id}`}
            data-index={i}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${cases.length}: ${c.card}`}
            className={`${cases.length > 1 ? "w-[88%]" : "w-full"} md:w-full shrink-0 snap-start grid gap-7 md:gap-12 md:grid-cols-12 md:items-center`}
          >
            <div className="md:col-span-7">
              {c.kind === "slider" ? (
                <div className="bg-panel p-2 md:p-3 px-frame-shadow shadow-[0_0_0_2px_var(--frame)]">
                  <BeforeAfter
                    before={c.before}
                    after={c.after}
                    beforeAlt={c.beforeAlt}
                    afterAlt={c.afterAlt}
                    sizes="(min-width: 1152px) 620px, (min-width: 768px) 56vw, 88vw"
                  />
                </div>
              ) : (
                <div className="mx-auto max-w-[30rem] bg-panel p-2 md:p-3 px-frame-shadow">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    sizes="(min-width: 768px) 480px, 88vw"
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-5">
              <h3 className="font-heading font-bold text-[1.75rem] md:text-4xl leading-tight tracking-[-0.02em] text-stage-fg">{c.card}</h3>
              {c.detail && <p className="mt-3 rx-label text-butter">{c.detail}</p>}
              <p className="mt-4 text-base md:text-[17px] leading-relaxed text-stage-muted max-w-[42ch]">{c.caption}</p>
              {c.kind === "slider" && (
                <p className="mt-6 flex items-center gap-2.5 text-sm text-stage-muted">
                  <ChevronsLeftRight className="h-4 w-4 text-rx-bright" strokeWidth={1.75} aria-hidden />
                  Drag the handle, or use the arrow keys, to compare.
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
