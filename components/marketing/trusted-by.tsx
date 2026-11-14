import { VelocityMarquee } from "@/components/motion/velocity-marquee";
import { TRUSTED_BY, type TrustedPage } from "@/lib/trusted-by";
import { PixelIcon } from "@/components/pixel";

// Each copy of the marquee row repeats the list until it holds at least this
// many names, so even a short list is wider than the screen and loops without
// a gap.
const MIN_PER_COPY = 4;

function Entry({ page, decorative }: { page: TrustedPage; decorative: boolean }) {
  return (
    <li className={`shrink-0 flex items-center ${decorative ? "marquee-repeat" : ""}`} aria-hidden={decorative || undefined}>
      <a
        href={page.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={decorative ? -1 : undefined}
        className="menu-cursor-item group flex min-h-11 items-center gap-3 px-6 py-1.5 md:px-10"
      >
        <span aria-hidden className="menu-cursor">▶</span>
        <span className="whitespace-nowrap font-heading text-3xl uppercase leading-none text-ink group-hover:text-coral-deep md:text-4xl">
          {page.name}
        </span>
        <span className="whitespace-nowrap text-[13px] text-ink-soft">
          {page.role && <>{page.role} · </>}
          <span className="font-semibold text-ink">{page.handle}</span>
          {page.followers && <> {page.followers} followers</>}
        </span>
      </a>
      <span aria-hidden className="shrink-0">
        <PixelIcon name="star" size={16} />
      </span>
    </li>
  );
}

/**
 * "Trusted by": people The Card Doc has restored cards for, as the clinic's
 * guest register: a slow marquee of names (role, handle and followers beside
 * each, linking to their page) on a panel strip, that surges with scroll
 * speed and pauses under a mouse. Static, one of each, wrapping under reduced
 * motion. Renders nothing until lib/trusted-by.ts has entries.
 */
export function TrustedBy() {
  if (TRUSTED_BY.length === 0) return null;
  const reps = Math.ceil(MIN_PER_COPY / TRUSTED_BY.length);
  const row = Array.from({ length: reps }, (_, r) => TRUSTED_BY.map((page) => ({ page, decorative: r > 0 }))).flat();

  return (
    <section aria-labelledby="trusted-by" className="relative border-b-[3px] border-ink bg-panel pt-9 pb-6 md:pt-10 md:pb-7">
      <p
        id="trusted-by"
        data-reveal
        className="absolute -top-4 left-1/2 z-[1] inline-flex h-8 -translate-x-1/2 items-center gap-2 bg-butter px-3 font-pixel text-xs uppercase leading-none text-ink px-frame"
      >
        <span aria-hidden className="text-coral-deep">▶</span>
        Trusted by
      </p>
      <div className="marquee-mask overflow-hidden">
        <VelocityMarquee>
          <ul className="flex">
            {row.map(({ page, decorative }, i) => <Entry key={i} page={page} decorative={decorative} />)}
          </ul>
          <ul aria-hidden className="marquee-dupe flex">
            {row.map(({ page }, i) => <Entry key={i} page={page} decorative />)}
          </ul>
        </VelocityMarquee>
      </div>
    </section>
  );
}
