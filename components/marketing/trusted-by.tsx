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
        <Window className="lift flex h-full items-center gap-4 px-4 py-4 transition-transform duration-150 group-hover:-translate-y-1 group-focus-visible:-translate-y-1 md:gap-5 md:px-6 md:py-5">
          <span aria-hidden className="grid size-16 shrink-0 place-items-center bg-powder px-frame md:size-20">
            <PixelIcon name="user" size={48} />
          </span>
          <span className="flex min-w-0 flex-col gap-1.5">
            <span className="font-heading text-3xl uppercase leading-none text-ink group-hover:text-coral-deep md:text-4xl">
              {page.name}
            </span>
            {page.role && <span className="text-[15px] leading-snug text-ink-soft">{page.role}</span>}
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft">
              <span className="font-semibold text-ink">{page.handle}</span>
              {page.followers && <span>{page.followers} followers</span>}
              <span aria-hidden className="font-pixel text-xs uppercase text-frame-deep">▶ {page.platform}</span>
            </span>
          </span>
        </Window>
      </a>
    </li>
  );
}

/**
 * "Trusted by": people The Card Doc has restored cards for, shown as the
 * clinic's guest register: one window per person (role, handle and
 * followers), each linking to their page. Renders nothing until
 * lib/trusted-by.ts has entries.
 */
export function TrustedBy() {
  if (TRUSTED_BY.length === 0) return null;

  return (
    <section aria-labelledby="trusted-by" className="wall-band border-b-[3px] border-ink">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-10 md:py-20">
        <div data-reveal className="flex items-center gap-4">
          <span aria-hidden className="grid size-12 place-items-center bg-butter px-frame md:size-14">
            <PixelIcon name="star" size={32} />
          </span>
          <h2 id="trusted-by" className="font-heading text-[clamp(2.5rem,6vw,4rem)] uppercase leading-[0.9] text-ink">
            Trusted by
          </h2>
        </div>
        <ul className={`mt-8 grid gap-6 md:mt-10 ${TRUSTED_BY.length > 1 ? "md:grid-cols-2" : ""} ${TRUSTED_BY.length > 2 ? "lg:grid-cols-3" : ""}`}>
          {TRUSTED_BY.map((page, i) => <Guest key={page.href} page={page} i={i} />)}
        </ul>
      </div>
    </section>
  );
}
