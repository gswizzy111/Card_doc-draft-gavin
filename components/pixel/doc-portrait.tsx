import { cn } from "@/lib/utils";

const SIZES = {
  xs: "size-9 p-[3px]",
  sm: "size-12 p-1",
  md: "size-20 p-1.5",
  lg: "size-32 p-2",
  xl: "size-44 p-2.5",
} as const;

/**
 * The brand mark (/card-doctor.jpg) in a pixel portrait frame, like an NPC
 * talking. The photo is never pixelated. `nameplate` adds a small name tag
 * under the frame.
 */
export function DocPortrait({
  size = "md",
  nameplate,
  alt = "The Card Doc",
  className,
}: {
  size?: keyof typeof SIZES;
  nameplate?: React.ReactNode;
  alt?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex shrink-0 flex-col items-center", className)}>
      <span className={cn("block bg-powder px-frame", SIZES[size])}>
        <span className="block size-full bg-panel p-[2px] shadow-[inset_0_0_0_1px_var(--frame)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/card-doctor.jpg" alt={alt} className="block size-full object-cover" />
        </span>
      </span>
      {nameplate && (
        <span className="-mt-1 inline-flex h-5 items-center bg-butter px-1.5 font-pixel text-[0.625rem] uppercase leading-none text-ink px-frame">
          {nameplate}
        </span>
      )}
    </span>
  );
}
