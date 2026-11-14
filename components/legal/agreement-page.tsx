import Link from "next/link";
import { PageHero } from "@/components/marketing/page-hero";
import type { AgreementDoc } from "@/lib/legal/agreements-v1";
import { LegalDocument } from "./legal-document";

/** A card-specific agreement's public page: the wording customers sign, as a template. */
export function AgreementPage({ doc, when, footnote }: { doc: AgreementDoc; when: string; footnote: string }) {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-10 pt-14 md:pt-24 pb-24">
        <PageHero eyebrow="Legal" title={doc.title} lead={when} className="mb-10 md:mb-14" />
        <div className="px-window relative p-0 md:p-0">
          <div className="px-5 py-7 md:px-10 md:py-10">
            <LegalDocument blocks={doc.blocks} />
            <p className="mt-8 border-t-2 border-tile pt-5 text-[13px] leading-relaxed text-ink-soft">
              {footnote}
            </p>
          </div>
        </div>
        <p className="mt-8 text-sm text-ink-soft">
          This sits alongside our <Link href="/terms" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">Terms of Service</Link>.
        </p>
      </div>
    </div>
  );
}
