import Link from "next/link";
import { DocPortrait } from "@/components/pixel";
import { PIXEL_FIELD } from "@/components/ui/input";

/** The customer portal's centered card: confirm, forgot and reset password. */
export function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="page-glow flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex min-h-11 items-center gap-3 font-heading text-3xl tracking-[0.02em] text-ink hover:text-coral-deep focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-frame-deep">
            <DocPortrait size="xs" alt="" />
            The Card Doc
          </Link>
          <p className="mt-3 inline-flex h-7 items-center bg-butter px-2.5 font-pixel text-xs uppercase tracking-[0.04em] text-ink px-frame">Customer portal</p>
        </div>
        <div className="px-window p-6 sm:p-8">
          <h1 className="mb-2 font-heading text-3xl uppercase leading-tight tracking-[0.02em] text-ink">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export const FIELD_CN = PIXEL_FIELD;
export const LABEL_CN = "block mb-1.5 font-pixel text-xs uppercase tracking-[0.04em] text-ink";
export const BUTTON_CN = "px-btn h-12 w-full px-5 text-base disabled:opacity-50";
