import { cn } from "@/lib/utils";

/**
 * Background wrapper: plain floor cream (revision 2 retired the tile art; the
 * `size` prop is kept for old call sites and no longer changes anything).
 * Use `.faint-grid` in a className for the one place a page wants texture.
 */
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
