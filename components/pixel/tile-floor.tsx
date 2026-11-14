import { cn } from "@/lib/utils";

/** Background wrapper: the clinic's soft cream tile floor. */
export function TileFloor({
  as: Tag = "div",
  size = "lg",
  className,
  ...props
}: {
  as?: "div" | "section" | "main";
  size?: "lg" | "sm";
} & React.HTMLAttributes<HTMLElement>) {
  return <Tag className={cn(size === "sm" ? "tile-floor-sm" : "tile-floor", className)} {...props} />;
}
