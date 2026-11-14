import Link from "next/link";
import { DocPortrait } from "@/components/pixel";
import { PIXEL_FIELD } from "@/components/ui/input";

/** The customer portal's centered card: confirm, forgot and reset password. */
export function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="page-glow flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex min-h-11 items-center gap-3 font-heading text-3xl text-ink hover:text-coral-deep focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-frame-deep">
            <DocPortrait size="xs" alt="" />
            The Card Doc
          </Link>
          <p className="rx-label mt-2 text-ink-soft">Customer portal</p>
        </div>
        <div className="px-window p-6 sm:p-8">
          <h1 className="mb-2 font-heading text-3xl leading-tight text-ink">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export const FIELD_CN = PIXEL_FIELD;
export const LABEL_CN = "block mb-1.5 text-sm font-semibold text-ink";
export const BUTTON_CN = "px-btn h-12 w-full px-5 text-base disabled:opacity-50";
