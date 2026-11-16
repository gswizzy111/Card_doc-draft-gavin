import { ArrowUpRight } from "lucide-react";
import { TRUSTED_BY, type TrustedPage } from "@/lib/trusted-by";
import { cn } from "@/lib/utils";

/** One person as an ink nameplate: name, role, handle, followers and the platform tag. */
function Nameplate({ page, i }: { page: TrustedPage; i: number }) {
  return (
    <li data-reveal style={{ transitionDelay: `${i * 90}ms` }} className="min-w-0">
      <a
        href={page.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-[18px] bg-ink p-6 text-white shadow-[var(--print-shadow)] transition-transform duration-300 ease-[var(--ease-out)] hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-cobalt motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-7"
      >
        {/* Brushed plate highlight along the top edge. */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <span className="flex items-start justify-between gap-4">
          <span className="min-w-0">
            <span className="caps block font-display text-[34px] font-black leading-[0.9] tracking-[0.005em] md:text-[44px]">
              {page.name}
            </span>
            {page.role && <span className="mt-2.5 block text-[15px] leading-snug text-on-dark-muted">{page.role}</span>}
          </span>
          <span
            aria-hidden
            className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors duration-200 group-hover:bg-sun group-hover:text-ink"
          >
            <ArrowUpRight className="size-5" strokeWidth={1.75} />
          </span>
        </span>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/15 pt-4 text-sm">
          <span className="font-bold text-white">{page.handle}</span>
          {page.followers && (
            <span className="text-on-dark-muted">
              <span className="font-display text-lg font-black text-sun">{page.followers}</span> followers
            </span>
          )}
          <span className="label-caps ml-auto rounded-[5px] bg-sun px-2 py-1 text-[13px] text-ink">{page.platform}</span>
        </span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </li>
  );
}

/**
 * "Trusted by": people The Card Doc has restored cards for, as ink
 * nameplates (role, handle, followers and the platform), each linking to
 * their page. No photos or likeness. Renders nothing until lib/trusted-by.ts
 * has entries. `bare` drops the section wrapper so it can sit inside another
 * band (the home page's reviews).
 */
export function TrustedBy({ bare = false, className = "" }: { bare?: boolean; className?: string }) {
  if (TRUSTED_BY.length === 0) return null;

  const body = (
    <div className={cn("grid gap-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:items-center lg:gap-14", className)}>
      <h2 id="trusted-by" data-reveal className="display-md text-ink">
        Trusted by
      </h2>
      <ul className={cn("grid gap-5", TRUSTED_BY.length > 1 && "md:grid-cols-2", TRUSTED_BY.length > 2 && "xl:grid-cols-3")}>
        {TRUSTED_BY.map((page, i) => <Nameplate key={page.href} page={page} i={i} />)}
      </ul>
    </div>
  );

  if (bare) return body;
  return (
    <section aria-labelledby="trusted-by" className="surface-chalk">
      <div className="wrap py-16 md:py-24">{body}</div>
    </section>
  );
}
