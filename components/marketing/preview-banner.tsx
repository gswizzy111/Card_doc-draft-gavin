import { PREVIEW_MODE } from "@/lib/preview";

export function PreviewBanner() {
  if (!PREVIEW_MODE) return null;
  return (
    <div className="w-full border-b border-rule bg-muted text-ink-soft">
      <p className="max-w-7xl mx-auto px-4 md:px-10 py-1.5 text-xs md:text-[13px] text-center">
        <span aria-hidden className="mr-2 inline-block size-1.5 -translate-y-px bg-coral-deep align-middle" />
        <span className="font-bold text-ink">Preview site.</span>{" "}
        Checkout, payments, shipping and accounts are not functional yet.
      </p>
    </div>
  );
}
