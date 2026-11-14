"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";

// Booking and checkout pages, where the dock would cover the form: the
// restoration and prep order forms, the cart and its checkout, gift cards,
// subscriptions and the pages a payment returns to.
const HIDE_ON = [
  "/restoration",
  "/tier-selection",
  "/order",
  "/prep/order",
  "/cart",
  "/checkout",
  "/gift-cards",
  "/subscribe",
  "/shop/order-confirmed",
];

/** True on a listed page or anything under it ("/cart" hides "/cart/checkout"). */
export function hidesBookingButton(pathname: string) {
  return HIDE_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

// Pixel-honest motion: the button climbs in four whole frames, not a glide.
const frames = (n: number) => (t: number) => Math.min(1, Math.ceil(t * n) / n);

/**
 * Phone call button: a small night-window button with the Doc's portrait and
 * a blinking call light, bottom right. It climbs in once the visitor scrolls
 * past the first screen, tucks away when the footer arrives (so it never
 * covers the end of the page) and pads for the home indicator.
 */
export function RestorationBubble() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();
  const [pastHero, setPastHero] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const hidden = hidesBookingButton(pathname);

  useEffect(() => {
    if (hidden) return;
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:85svh;pointer-events:none";
    document.body.appendChild(sentinel);
    const heroIo = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting));
    heroIo.observe(sentinel);

    const footer = document.querySelector("footer");
    const footIo = new IntersectionObserver(([e]) => setAtFooter(e.isIntersecting), { rootMargin: "0px 0px -10% 0px" });
    if (footer) footIo.observe(footer);
    return () => {
      heroIo.disconnect();
      footIo.disconnect();
      sentinel.remove();
    };
  }, [hidden, pathname]);

  if (hidden) return null;
  const show = pastHero && !atFooter;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="dock"
          initial={reduce ? { opacity: 0 } : { y: "140%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "140%" }}
          transition={reduce ? { duration: 0.2, ease: frames(2) } : { duration: 0.24, ease: frames(4) }}
          className="vt-dock md:hidden fixed right-3 bottom-0 z-50 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        >
          <Link
            href="/restoration"
            className="press group flex items-center gap-2.5 bg-night py-1.5 pr-1.5 pl-1.5 text-stage-fg px-frame-shadow"
          >
            <span aria-hidden className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/card-doctor.jpg" alt="" className="block size-11 bg-panel object-cover object-[50%_18%] p-[2px] shadow-[inset_0_0_0_2px_var(--frame)]" />
              <span className="absolute -top-1 -right-1 size-3 bg-mint px-frame px-blink" />
            </span>
            <span className="flex flex-col items-start gap-1 pr-1">
              <span className="font-heading text-[17px] uppercase leading-none">Book a Restoration</span>
              <span className="inline-flex h-6 items-center bg-butter px-1.5 font-pixel text-xs leading-none text-ink tabular-nums">
                From $75 / card
              </span>
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
