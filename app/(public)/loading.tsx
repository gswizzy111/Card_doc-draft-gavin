import { ViewTransition } from "react";
import { DocSprite } from "@/components/pixel/sprites";

export default function Loading() {
  return (
    // The skeleton dissolves into the page when it arrives (CSS: .skeleton-out).
    <ViewTransition exit="skeleton-out" default="none">
      {/* Fills the screen so the footer doesn't flash up under a short skeleton. */}
      <div className="relative min-h-[100svh]" aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading</span>
        <div className="route-progress" aria-hidden />
        <div className="max-w-6xl mx-auto px-4 md:px-10 py-12 md:py-20" aria-hidden>
          <div className="skeleton h-8 w-28 mb-6" />
          <div className="skeleton h-12 md:h-16 w-[80%] md:w-[55%] mb-3" />
          <div className="skeleton h-12 md:h-16 w-[60%] md:w-[40%] mb-8" />
          <div className="px-window flex max-w-2xl items-center gap-4 p-5 mb-12">
            <DocSprite scale={2} className="shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="skeleton h-4 w-[90%]" />
              <div className="skeleton h-4 w-[60%]" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="px-window-ink h-72 p-4">
                <div className="skeleton h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ViewTransition>
  );
}
