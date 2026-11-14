"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, CircleUserRound, Menu, ShoppingCart, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";
import { useCart } from "@/lib/cart-context";
import { DocPortrait } from "@/components/pixel/doc-portrait";
import { MenuCursor } from "@/components/pixel/menu-cursor";

// Primary service tabs — shown prominently
const TABS = [
  { href: "/tier-selection", label: "Restorations", match: ["/tier-selection", "/restoration"] },
  { href: "/prep", label: "Prep", match: ["/prep"] },
  { href: "/shop", label: "Kits", match: ["/shop", "/cart"] },
];

// Secondary nav links
const SEC_LINKS = [
  { href: "/track", label: "Track Order" },
  { href: "/gift-cards", label: "Gift Cards" },
];

// Featured in the Explore menu: what restoration can and can't fix.
const FIX_PAGE = { href: "/what-we-can-fix", label: "What We Can Fix" };

// Pages to read before ordering (Explore menu and the phone menu).
const LEARN_LINKS = [
  FIX_PAGE,
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About Us" },
];

const ACCOUNT_LINKS = [...SEC_LINKS, { href: "/account", label: "My Account" }];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

// Every public page, grouped, for the Explore menu.
const EXPLORE_GROUPS = [
  { label: "Services", links: TABS },
  { label: "Before You Order", links: LEARN_LINKS.filter((l) => l !== FIX_PAGE) },
  { label: "Orders & Account", links: ACCOUNT_LINKS },
];

// Pixel-honest motion: progress snaps to whole frames.
const FRAMES = (n: number) => (t: number) => Math.min(1, Math.floor(t * n + 0.0001) / n);

// One-line hints under each service in the mobile menu (owner's own copy).
const TAB_HINTS: Record<string, string> = {
  "/tier-selection": "From $75 / card",
  "/prep": "From $25 / card",
  "/shop": "US shipping at cost + $2 handling",
};

/**
 * The clinic's top menu: the logo portrait, three service tabs and Explore.
 * The ▶ cursor shows on hover, focus and the current tab. `sprite` is an
 * opt-in slot beside the logo (empty by default; revision 2).
 */
export function Nav({ sprite }: { sprite?: React.ReactNode } = {}) {
  const [open, setOpen] = useState(false);
  // Client-only flag for the portal (no setState-in-effect, no hydration mismatch).
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [exploreOpen, setExploreOpen] = useState(false);
  const { itemCount } = useCart();
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();

  // Close on navigation (derived during render), then lock page scroll and
  // listen for Escape while open.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setExploreOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function isTabActive(tab: typeof TABS[number]) {
    return tab.match.some((m) => pathname.startsWith(m));
  }

  const isCurrent = (href: string) => pathname === href;
  const exploreActive = LEARN_LINKS.some((l) => isCurrent(l.href));
  // Keep the hover pill on Explore while its menu is open and the pointer is in it.
  const exploreHighlighted = hovered === "explore" || (exploreOpen && hovered === null);

  const cartLink = (
    <Link
      href="/cart"
      aria-label="Cart"
      className="press relative inline-flex h-10 w-10 items-center justify-center text-ink transition-colors duration-75 hover:bg-butter"
    >
      <ShoppingCart className="h-5 w-5" strokeWidth={2} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-coral-fill text-ink font-pixel text-xs leading-none flex items-center justify-center shadow-[0_0_0_2px_var(--ink)]">
          {itemCount}
        </span>
      )}
    </Link>
  );

  return (
    <header className="relative bg-panel border-b-2 border-ink/80">
      <nav className="max-w-7xl mx-auto px-4 md:px-10 h-16 flex items-center justify-between gap-4 md:grid md:grid-cols-[1fr_auto_1fr] lg:gap-6">
        {/* Logo: the doc's portrait, framed like a party member */}
        <Link href="/" className="group flex items-center gap-3 shrink-0 justify-self-start">
          <DocPortrait size="xs" alt="The Card Doc" />
          <span className="font-heading text-xl font-bold text-ink whitespace-nowrap">The Card Doc</span>
          {sprite && <span aria-hidden className="hidden lg:inline-flex">{sprite}</span>}
        </Link>

        {/* Desktop: three service tabs and Explore, as a command bar */}
        <div className="hidden md:flex items-center gap-1 self-stretch" onMouseLeave={() => setHovered(null)}>
          {TABS.map((tab) => {
            const active = isTabActive(tab);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => setHovered(tab.href)}
                className={`menu-cursor-item relative flex items-center gap-1.5 px-3 font-heading text-base font-semibold transition-colors duration-100 ${
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                <MenuCursor />
                <span className="relative">{tab.label}</span>
                {active && <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 bg-coral-deep" />}
              </Link>
            );
          })}

          {/* Explore: every page on the site, with What We Can Fix up top */}
          <MenuPrimitive.Root open={exploreOpen} onOpenChange={setExploreOpen}>
            <MenuPrimitive.Trigger
              openOnHover
              delay={80}
              closeDelay={120}
              onMouseEnter={() => setHovered("explore")}
              data-active={exploreHighlighted ? "" : undefined}
              className={`menu-cursor-item group relative flex items-center gap-1.5 px-3 font-heading text-base font-semibold outline-none transition-colors duration-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-frame-deep ${
                exploreActive || exploreOpen ? "text-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              <MenuCursor />
              <span className="relative">Explore</span>
              <ChevronDown
                className="relative h-4 w-4 group-data-[popup-open]:rotate-180"
                strokeWidth={2.5}
                aria-hidden
              />
              {exploreActive && <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 bg-coral-deep" />}
            </MenuPrimitive.Trigger>
            <MenuPrimitive.Portal>
              <MenuPrimitive.Positioner side="bottom" align="center" sideOffset={10} collisionPadding={16} className="z-[60] outline-none">
                <MenuPrimitive.Popup
                  className="px-window w-[min(44rem,calc(100vw-2rem))] origin-(--transform-origin) text-ink outline-none transition-opacity duration-100 ease-[steps(2,end)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
                >
                  <div className="p-3">
                    <MenuPrimitive.LinkItem
                      closeOnClick
                      render={<Link href={FIX_PAGE.href} />}
                      aria-current={isCurrent(FIX_PAGE.href) ? "page" : undefined}
                      className="menu-cursor-item group/fix flex items-center justify-between gap-6 bg-butter/45 px-5 py-4 outline-none transition-colors duration-100 data-[highlighted]:bg-butter/80"
                    >
                      <span>
                        <span className="rx-label block !text-coral-deep">Sports cards &amp; TCG</span>
                        <span className="mt-1 flex items-center gap-2 font-heading text-xl font-semibold text-ink">
                          <MenuCursor />
                          {FIX_PAGE.label}
                        </span>
                        <span className="mt-1 block text-sm text-ink-soft">
                          Restoration has real limits. Here&apos;s an honest breakdown.
                        </span>
                      </span>
                    </MenuPrimitive.LinkItem>
                  </div>

                  <div className="grid grid-cols-3 gap-x-2 px-3 pb-3">
                    {EXPLORE_GROUPS.map((group) => (
                      <MenuPrimitive.Group key={group.label} className="flex flex-col">
                        <MenuPrimitive.GroupLabel className="rx-label px-3 pt-2 pb-1.5 text-muted-foreground">
                          {group.label}
                        </MenuPrimitive.GroupLabel>
                        {group.links.map((l) => {
                          const current = isCurrent(l.href);
                          return (
                            <MenuPrimitive.LinkItem
                              key={l.href}
                              closeOnClick
                              render={<Link href={l.href} />}
                              aria-current={current ? "page" : undefined}
                              className="menu-cursor-item grid grid-cols-[0.9rem_1fr] items-baseline px-2 py-2 outline-none transition-colors duration-75 data-[highlighted]:bg-powder/45"
                            >
                              <MenuCursor />
                              <span className={`text-[15px] font-semibold ${current ? "text-coral-deep" : "text-ink"}`}>{l.label}</span>
                              {TAB_HINTS[l.href] && (
                                <span className="col-start-2 font-pixel text-xs text-ink-soft tabular-nums">{TAB_HINTS[l.href]}</span>
                              )}
                            </MenuPrimitive.LinkItem>
                          );
                        })}
                      </MenuPrimitive.Group>
                    ))}
                  </div>

                  <div className="flex items-center gap-5 border-t border-rule bg-muted/50 px-6 py-3">
                    {LEGAL_LINKS.map((l) => (
                      <MenuPrimitive.LinkItem
                        key={l.href}
                        closeOnClick
                        render={<Link href={l.href} />}
                        aria-current={isCurrent(l.href) ? "page" : undefined}
                        className="text-xs font-semibold text-ink-soft outline-none transition-colors duration-75 data-[highlighted]:text-ink data-[highlighted]:underline"
                      >
                        {l.label}
                      </MenuPrimitive.LinkItem>
                    ))}
                  </div>
                </MenuPrimitive.Popup>
              </MenuPrimitive.Positioner>
            </MenuPrimitive.Portal>
          </MenuPrimitive.Root>
        </div>

        <div className="hidden md:flex items-center justify-self-end gap-1 shrink-0">
          {cartLink}
          <Link
            href="/account"
            aria-label="My Account"
            title="My Account"
            className="press inline-flex h-10 w-10 items-center justify-center text-ink transition-colors duration-75 hover:bg-butter"
          >
            <CircleUserRound className="h-5 w-5" strokeWidth={2} />
          </Link>
          <div className="ml-3 hidden lg:block">
            <Link href="/restoration" className="comic-btn comic-btn-sm">
              Book a Restoration
            </Link>
          </div>
        </div>

        {/* Mobile right */}
        <div className="flex items-center gap-1 md:hidden">
          {cartLink}
          <button
            onClick={() => setOpen(!open)}
            className="px-btn px-btn-panel h-10 w-10 ml-1"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" strokeWidth={2.25} /> : <Menu className="h-5 w-5" strokeWidth={2.25} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu: a full-screen night window, portaled to <body> so its
          fixed positioning is never trapped. Opens in stepped frames. */}
      {mounted && createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.12 : 0.2, ease: FRAMES(3) }}
            className="stage vt-menu md:hidden !fixed inset-0 z-[70] flex flex-col overflow-y-auto overscroll-contain bg-night text-stage-fg pt-[env(safe-area-inset-top)] pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-stage-muted/25 px-4">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                <DocPortrait size="xs" alt="The Card Doc" />
                <span className="font-heading text-xl font-bold">The Card Doc</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="px-btn px-btn-panel h-10 w-10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={2.25} />
              </button>
            </div>

            <nav className="mt-6 flex-1 px-4">
              <p className="rx-label !text-stage-muted mb-3">Services</p>
              <ul className="px-window-night flex flex-col gap-1 p-2">
                {TABS.map((tab, i) => {
                  const active = isTabActive(tab);
                  return (
                    <li key={tab.href}>
                      <motion.div
                        initial={reduce ? false : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.24, ease: FRAMES(3), delay: 0.08 + i * 0.06 }}
                      >
                        <Link
                          href={tab.href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className="menu-cursor-item press grid grid-cols-[1.25rem_1fr] items-center gap-x-1 px-2 py-3 hover:bg-white/[0.06]"
                        >
                          <MenuCursor className="text-[1rem]" />
                          <span className={`block font-heading text-[1.75rem] leading-tight font-semibold ${active ? "text-rx-bright" : "text-stage-fg"}`}>
                            {tab.label}
                          </span>
                          <span className="col-start-2 mt-1.5 block font-pixel text-xs text-stage-muted">{TAB_HINTS[tab.href]}</span>
                        </Link>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>

              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: FRAMES(2), delay: 0.28 }}
                className="mt-8"
              >
                <p className="rx-label !text-stage-muted mb-3">Before You Order</p>
                <ul className="px-window-night flex flex-col p-2">
                  {LEARN_LINKS.map((l) => {
                    const current = isCurrent(l.href);
                    return (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={() => setOpen(false)}
                          aria-current={current ? "page" : undefined}
                          className="menu-cursor-item press grid h-12 grid-cols-[1.25rem_1fr] items-center gap-x-1 px-2 hover:bg-white/[0.06]"
                        >
                          <MenuCursor />
                          <span className={`font-heading text-xl font-medium ${current ? "text-rx-bright" : "text-stage-fg"}`}>
                            {l.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: FRAMES(2), delay: 0.36 }}
                className="mt-8 grid grid-cols-2 gap-3"
              >
                {[...ACCOUNT_LINKS, { href: "/cart", label: "Cart" }].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="px-btn px-btn-panel h-12 justify-between px-4 font-sans text-[15px] font-bold"
                  >
                    {l.label}
                    {l.href === "/cart" && itemCount > 0 && (
                      <span className="min-w-5 h-5 px-1.5 bg-coral-fill font-pixel text-xs text-ink flex items-center justify-center shadow-[0_0_0_2px_var(--ink)]">{itemCount}</span>
                    )}
                  </Link>
                ))}
              </motion.div>
            </nav>

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: FRAMES(2), delay: 0.44 }}
              className="mt-10 px-4 text-sm"
            >
              <p className="rx-label !text-stage-muted mb-2">Contact</p>
              <a href="https://www.instagram.com/the_card_doc" target="_blank" rel="noopener noreferrer" className="block font-semibold text-stage-fg underline decoration-rx-bright decoration-2 underline-offset-4">
                DM us on @the_card_doc
              </a>
              <p className="mt-1 text-stage-muted">We reply within 1 business day.</p>
              <div className="mt-6 flex items-center gap-5">
                {LEGAL_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-xs font-semibold text-stage-muted hover:text-stage-fg">
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body)}
    </header>
  );
}
