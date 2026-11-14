import { cn } from "@/lib/utils";

/**
 * The ▶ menu cursor. Place it as the first child of an element with the
 * `menu-cursor-item` class: it shows on hover, keyboard focus, highlighted
 * menu items and the current page, and nudges in two frames (still under
 * reduced motion). `always` keeps it visible.
 */
export function MenuCursor({ always = false, className }: { always?: boolean; className?: string }) {
  return (
    <span aria-hidden className={cn("menu-cursor", always && "!visible", className)}>
      ▶
    </span>
  );
}
