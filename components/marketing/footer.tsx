import Link from "next/link";
import { CurrentYear } from "@/components/marketing/current-year";
import { DocPortrait } from "@/components/pixel/doc-portrait";
import { MenuCursor } from "@/components/pixel/menu-cursor";

/**
 * The clinic after hours: a calm night band with the sign-off. `sprite` is
 * an opt-in slot for one small pixel illustration beside the name (md and
 * up); it is empty by default.
 */
export function Footer({ sprite = null }: { sprite?: React.ReactNode } = {}) {
  return (
    <footer className="stage stage-light mt-auto overflow-hidden">
      {/* Thin trim line: the wall meets the night */}
      <div aria-hidden className="wall-trim" />

      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-14 md:pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 md:gap-12">
          {/* Brand: the doc at the desk */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <DocPortrait size="sm" alt="The Card Doc" />
              <span className="font-heading font-bold text-2xl md:text-[1.75rem] text-stage-fg">The Card Doc</span>
              {sprite && <span aria-hidden className="ml-2 hidden self-end md:inline-flex">{sprite}</span>}
            </div>
            <p className="max-w-md text-[15px] text-stage-muted leading-relaxed">
              Expert PSA prep and card restoration. Every card treated like it&apos;s worth a fortune.
            </p>
            <p className="font-pixel text-xs text-stage-muted mt-auto pt-2">
              &copy; <CurrentYear builtYear={new Date().getFullYear()} /> The Card Doc. All rights reserved.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3.5">
            <p className="rx-label !text-rx-bright">Contact</p>
            <a
              href="https://www.instagram.com/the_card_doc"
              target="_blank"
              rel="noopener noreferrer"
              className="menu-cursor-item draw-underline self-start inline-flex items-center gap-2 font-heading text-xl md:text-2xl font-semibold text-stage-fg hover:text-rx-bright transition-colors duration-100"
            >
              <MenuCursor className="absolute -left-5" />
              DM us on @the_card_doc
            </a>
            <p className="text-sm text-stage-muted">We reply within 1 business day.</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stage-muted/25 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/terms" className="inline-flex min-h-11 items-center text-xs font-semibold text-stage-muted hover:text-stage-fg transition-colors duration-75">
              Terms of Service
            </Link>
            <Link href="/privacy" className="inline-flex min-h-11 items-center text-xs font-semibold text-stage-muted hover:text-stage-fg transition-colors duration-75">
              Privacy Policy
            </Link>
            <Link href="/affiliates" className="inline-flex min-h-11 items-center text-xs font-semibold text-stage-muted hover:text-stage-fg transition-colors duration-75">
              Creator Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Sign: rises into place in frames, lit butter under a mouse pointer */}
      <div aria-hidden className="overflow-hidden select-none">
        <div data-reveal="rise" className="max-w-[100rem] mx-auto px-3 md:px-6">
          <p className="wordmark wordmark-lit font-heading font-bold whitespace-nowrap text-center text-[12vw] 2xl:text-[12.5rem] !leading-[0.8] !tracking-[-0.03em] translate-y-[0.14em]">
            The Card Doc
          </p>
        </div>
      </div>
    </footer>
  );
}
