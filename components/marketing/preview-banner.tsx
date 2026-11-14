import { PREVIEW_MODE } from "@/lib/preview";
import { PixelIcon } from "@/components/pixel/sprites";

export function PreviewBanner() {
  if (!PREVIEW_MODE) return null;
  return (
    <div className="w-full bg-butter border-b-[3px] border-ink text-ink">
      <p className="max-w-7xl mx-auto px-4 md:px-10 py-2 text-xs md:text-sm text-center">
        <PixelIcon name="heart-plus" size={16} className="mr-2 -mt-0.5" />
        <span className="font-bold">Preview site.</span>{" "}
        Checkout, payments, shipping and accounts are not functional yet.
      </p>
    </div>
  );
}
