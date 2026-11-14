import Link from "next/link";
import { PageHero } from "@/components/marketing/page-hero";
import type { AgreementDoc } from "@/lib/legal/agreements-v1";
import { LegalDocument } from "./legal-document";
import { CardSprite, PixelIcon } from "@/components/pixel";

/** A card-specific agreement's public page: the wording customers sign, as a template. */
export function AgreementPage({ doc, when, footnote }: { doc: AgreementDoc; when: string; footnote: string }) {
  return (
    <div className="min-h-screen page-glow">
      <div className="max-w-3xl mx-auto px-4 md:px-10 pt-12 md:pt-20 pb-20">
        <PageHero eyebrow="Legal" title={doc.title} lead={when} sprite={<CardSprite variant="slab" scale={4} />} className="mb-10 md:mb-14" />
        <div className="px-window relative p-0 md:p-0">
          <div aria-hidden className="flex h-10 items-center justify-between gap-3 border-b-[3px] border-frame bg-wall px-5 md:px-8">
            <span className="flex items-center gap-2 font-pixel text-xs uppercase tracking-[0.04em] text-ink">
              <PixelIcon name="clipboard" size={16} />
              FORM
            </span>
            <span className="flex gap-1.5">
              <span className="size-2 bg-coral-deep" />
              <span className="size-2 bg-ink/30" />
            </span>
          </div>
          <div className="px-5 py-7 md:px-8 md:py-8">
            <LegalDocument blocks={doc.blocks} />
            <p className="mt-6 flex items-start gap-2 border-t-2 border-dashed border-ink/25 pt-5 text-[13px] leading-relaxed text-ink-soft">
              <span aria-hidden className="font-pixel text-xs text-coral-deep">▶</span>
              <span>{footnote}</span>
            </p>
          </div>
        </div>
        <p className="px-window-ink mt-8 inline-block p-4 text-sm text-ink-soft">
          This sits alongside our <Link href="/terms" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">Terms of Service</Link>.
        </p>
      </div>
    </div>
  );
}
