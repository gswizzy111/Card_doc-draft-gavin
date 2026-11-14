import Image from "next/image";
import type { Photo } from "@/lib/about";

/**
 * A genuine photo from lib/about.ts in a pixel frame (panel mat, ink stepped
 * outline) with an optional caption. `bare` drops the mat for a photo that
 * already sits inside a pixel window. Renders nothing for an empty slot, so
 * the page never shows a placeholder.
 */
export function PhotoFigure({
  photo,
  sizes,
  aspect,
  preload,
  bare = false,
  className = "",
}: {
  photo: Photo | null;
  sizes: string;
  /** Crop to a fixed ratio (e.g. "aspect-[4/5]"); otherwise the photo's own. */
  aspect?: string;
  preload?: boolean;
  /** No mat or outline: for a photo inside a pixel window. */
  bare?: boolean;
  className?: string;
}) {
  if (!photo) return null;
  return (
    <figure className={className}>
      <div className={bare ? "bg-ink p-[3px]" : "bg-panel p-2 md:p-2.5 px-frame-shadow"}>
        <div className={`overflow-hidden ${bare ? "" : "shadow-[0_0_0_2px_var(--frame)]"} ${aspect ?? ""}`}>
          <Image
            src={photo.src}
            alt={photo.alt}
            sizes={sizes}
            preload={preload}
            className={aspect ? "h-full w-full object-cover" : "block h-auto w-full"}
          />
        </div>
      </div>
      {photo.caption && (
        <figcaption className="mt-3 inline-flex items-center gap-2 bg-panel px-2.5 py-1.5 text-[13px] text-ink-soft px-frame">
          <span aria-hidden className="font-pixel text-xs text-coral-deep">▶</span>
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}
