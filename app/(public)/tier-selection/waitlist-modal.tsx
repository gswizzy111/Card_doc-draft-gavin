"use client";

import { useState, useEffect } from "react";
import { RestorationWaitlistForm } from "@/app/(public)/restoration/restoration-waitlist-form";

export function WaitlistModal() {
  const [open, setOpen] = useState(false);

  // Small delay so the page renders first
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop: the clinic dims, a dither over dusk */}
      <div
        className="absolute inset-0 bg-night/70 px-dither"
        onClick={() => setOpen(false)}
      />

      {/* Modal: the front desk's dialog box */}
      <div className="relative z-10 w-full max-w-md animate-[rx-in_200ms_ease-out_both] motion-reduce:animate-none">
        <div className="px-window max-h-[calc(100dvh-6rem)] overflow-y-auto p-6 pb-8 md:p-8 md:pb-9">
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 grid size-11 place-items-center text-ink hover:bg-butter focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-frame-deep"
            aria-label="Close"
          >
            <span aria-hidden className="font-heading text-3xl leading-none">×</span>
          </button>

          <div className="mb-6 pr-8">
            <p className="rx-label mb-3 text-coral-deep">
              Restoration Services
            </p>
            <h2 className="font-heading text-[2rem] leading-none text-ink mb-2.5">
              We&apos;re Currently Closed
            </h2>
            <p className="text-[15px] leading-relaxed text-ink-soft">
              Sign up below and we&apos;ll notify you the moment we start accepting new restoration orders.
            </p>
          </div>

          <RestorationWaitlistForm onSuccess={() => setOpen(false)} />

          <button
            onClick={() => setOpen(false)}
            className="mt-3 flex min-h-11 w-full items-center justify-center text-sm text-ink-soft underline underline-offset-2 hover:text-ink"
          >
            No thanks, just browsing
          </button>
        </div>
      </div>
    </div>
  );
}
