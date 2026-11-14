import { cn } from "@/lib/utils";

/**
 * Section header device: a peach clinic wall with a wainscot trim stripe.
 * `sprite` is a slot for a pixel sprite (plant, machine, sign) that stands
 * on the trim at the right.
 */
export function WallBand({
  as: Tag = "div",
  sprite,
  className,
  innerClassName,
  children,
  ...props
}: {
  as?: "div" | "section" | "header";
  sprite?: React.ReactNode;
  innerClassName?: string;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={cn("wall-band", className)} {...props}>
      <div className={cn("relative mx-auto max-w-7xl px-4 md:px-10", innerClassName)}>
        {children}
        {sprite && (
          <div aria-hidden className="pointer-events-none absolute right-4 bottom-0 hidden md:block md:right-10">
            {sprite}
          </div>
        )}
      </div>
    </Tag>
  );
}
