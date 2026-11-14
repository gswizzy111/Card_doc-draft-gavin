import Link from "next/link";
import { Download } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import type { DocBlock } from "@/lib/legal/legal-doc";
import { LegalDocument } from "./legal-document";
import { PixelIcon, pixelButton } from "@/components/pixel";

/**
 * One version of the Terms of Service: version and effective date up top, a
 * PDF download, contents, and the text exactly as published.
 */
export function TermsView({
  version,
  effectiveLabel,
  blocks,
  notice,
  otherVersions = [],
}: {
  version: string;
  effectiveLabel: string;
  blocks: DocBlock[];
  /** Shown above the text, e.g. on an earlier version's page. */
  notice?: React.ReactNode;
  otherVersions?: { version: string; label: string }[];
}) {
  const headings = blocks.filter((b): b is Extract<DocBlock, { kind: "heading" }> => b.kind === "heading");
  return (
    <div className="min-h-screen page-glow">
      <div className="max-w-6xl mx-auto px-4 md:px-10 pt-12 md:pt-20 pb-20">
        <PageHero
          eyebrow="Legal"
          title="Terms of Service"
          lead={`Version ${version} · Effective ${effectiveLabel}`}
          sprite={<PixelIcon name="clipboard" size={96} />}
          className="mb-8"
        />
        <a href={`/terms/v${version}/pdf`} className={pixelButton({ tone: "panel", size: "md", className: "mb-12 md:mb-16" })}>
          <Download className="h-4 w-4" strokeWidth={2} />
          Download PDF
        </a>

        {notice && (
          <div className="px-window-ink mb-10 flex items-start gap-3 bg-[color-mix(in_srgb,var(--butter)_35%,var(--panel))] p-4 md:p-5 text-sm text-ink leading-relaxed">
            <span aria-hidden className="mt-0.5 shrink-0 font-pixel text-xs text-coral-deep">▶</span>
            <div>{notice}</div>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
          <nav aria-label="Sections" className="lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:p-1">
            {/* On a phone the contents fold away so the Terms start right below */}
            <details className="group px-window-ink lg:hidden p-0 md:p-0">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                <span>Contents ({headings.length} sections)</span>
                <span aria-hidden className="font-pixel text-xs text-coral-deep group-open:rotate-180">▼</span>
              </summary>
              <div className="border-t-2 border-dashed border-ink/20 px-4 py-4">
                <SectionLinks headings={headings} otherVersions={otherVersions} />
              </div>
            </details>
            <div className="hidden lg:block px-window-ink p-4">
              <SectionLinks headings={headings} otherVersions={otherVersions} />
            </div>
          </nav>

          {/* The long chart: the Terms word for word, in a calm readable window */}
          <article className="px-window min-w-0 p-5 sm:p-8 md:p-10 lg:p-12 text-foreground">
            <div className="max-w-[68ch]">
              <LegalDocument blocks={blocks} />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

type Heading = Extract<DocBlock, { kind: "heading" }>;

function SectionLinks({ headings, otherVersions }: { headings: Heading[]; otherVersions: { version: string; label: string }[] }) {
  return (
    <>
      <p className="hidden lg:block font-pixel text-xs uppercase tracking-[0.04em] text-ink-soft mb-3">Contents</p>
      <ol className="flex flex-col text-sm">
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="menu-cursor-item flex min-h-9 items-start gap-1.5 py-1.5 pr-1 leading-snug text-ink-soft hover:bg-butter/60 hover:text-ink focus-visible:text-ink transition-colors duration-100">
              <span aria-hidden className="menu-cursor mt-[0.3em] w-3 shrink-0">▶</span>
              <span>{h.text}</span>
            </a>
          </li>
        ))}
      </ol>
      <p className="mt-6 border-t-2 border-dashed border-ink/20 pt-4 text-sm text-ink-soft">Signed separately when it applies:</p>
      <ul className="mt-2 flex flex-col gap-1.5 text-sm">
        <li><Link href="/agreements/slab-removal" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">Slab Removal Authorization</Link></li>
      </ul>
      {otherVersions.length > 0 && (
        <>
          <p className="mt-6 text-sm text-ink-soft">Other versions:</p>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm">
            {otherVersions.map((v) => (
              <li key={v.version}>
                <Link href={`/terms/v${v.version}`} className="text-ink-soft underline underline-offset-2 hover:text-ink">{v.label}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
