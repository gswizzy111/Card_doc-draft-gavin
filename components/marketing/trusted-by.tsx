import { TRUSTED_BY, type TrustedPage } from "@/lib/trusted-by";
import { PixelIcon, Window } from "@/components/pixel";

function Guest({ page, i }: { page: TrustedPage; i: number }) {
  return (
    <li data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
      <a
        href={page.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full focus-visible:outline-none"
      >
        <Window tone="ink" className="flex h-full items-center gap-4 px-4 py-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5 md:gap-5 md:px-6 md:py-5">
          <span aria-hidden className="grid size-12 shrink-0 place-items-center bg-powder md:size-14">
            <PixelIcon name="user" size={32} />
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="font-heading text-2xl font-bold leading-tight tracking-[-0.01em] text-ink group-hover:text-coral-deep md:text-[1.75rem]">
              {page.name}
            </span>
            {page.role && <span className="text-[15px] leading-snug text-ink-soft">{page.role}</span>}
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft">
              <span className="font-semibold text-ink">{page.handle}</span>
              {page.followers && <span>{page.followers} followers</span>}
              <span className="font-pixel text-[0.6875rem] uppercase tracking-[0.04em] text-frame-deep">{page.platform}</span>
            </span>
          </span>
        </Window>
      </a>
    </li>
  );
}

/**
 * "Trusted by": people The Card Doc has restored cards for, shown as the
 * clinic's guest register: one quiet card per person (role, handle and
 * followers), each linking to their page. Renders nothing until
 * lib/trusted-by.ts has entries.
 */
export function TrustedBy() {
  if (TRUSTED_BY.length === 0) return null;

  return (
    <section aria-labelledby="trusted-by" className="wall-band">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-10 md:py-24">
        <h2 id="trusted-by" data-reveal className="font-heading font-bold leading-[1.05] tracking-[-0.02em] text-ink text-[clamp(2.125rem,6vw,3.25rem)]">
          Trusted by
        </h2>
        <ul className={`mt-8 grid gap-6 md:mt-10 ${TRUSTED_BY.length > 1 ? "md:grid-cols-2" : ""} ${TRUSTED_BY.length > 2 ? "lg:grid-cols-3" : ""}`}>
          {TRUSTED_BY.map((page, i) => <Guest key={page.href} page={page} i={i} />)}
        </ul>
      </div>
    </section>
  );
}
