import { PREVIEW_MODE } from "@/lib/preview";

export function PreviewBanner() {
  if (!PREVIEW_MODE) return null;
  return (
    <div className="w-full bg-butter border-b-[3px] border-ink text-ink">
      <p className="max-w-7xl mx-auto px-4 md:px-10 py-2 text-xs md:text-sm text-center">
        <span aria-hidden className="mr-2 inline-block font-pixel text-[0.6875rem] align-[1px]">!</span>
        <span className="font-bold">Preview site.</span>{" "}
        Checkout, payments, shipping and accounts are not functional yet.
      </p>
    </div>
  );
}
