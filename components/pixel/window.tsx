import { cn } from "@/lib/utils";

type WindowTone = "frame" | "ink" | "night";

const TONE: Record<WindowTone, string> = {
  frame: "px-window",
  ink: "px-window-ink",
  night: "px-window-night",
};

/**
 * The clinic's core container: a pixel window with stepped corners.
 *
 * - `variant="window"`: a plain panel.
 * - `variant="dialog"`: an NPC dialog box; a ▼ blinks in the corner
 *   (static under reduced motion). Pass `next={false}` to hide it.
 * - `tone`: `frame` (blue frame, default), `ink` (ink outline) or `night`.
 * - `title`: an optional tab label that sits on the top edge.
 *
 * The outline draws 3px outside the box, so leave a little room around it.
 */
export function Window({
  as: Tag = "div",
  variant = "window",
  tone = "frame",
  title,
  next = true,
  className,
  children,
  ...props
}: {
  as?: "div" | "section" | "article" | "aside" | "figure";
  variant?: "window" | "dialog";
  tone?: WindowTone;
  title?: React.ReactNode;
  next?: boolean;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      data-slot="pixel-window"
      className={cn(TONE[tone], variant === "dialog" && "px-dialog", "p-5 md:p-6", title ? "mt-4" : "", className)}
      {...props}
    >
      {title && <WindowTab>{title}</WindowTab>}
      {children}
      {variant === "dialog" && next && (
        <span aria-hidden className="px-dialog-next">
          ▼
        </span>
      )}
    </Tag>
  );
}

/**
 * The butter tab that sits on a window's top edge. `<Window title>` uses it;
 * use it directly on a plain `.px-window*` element (give that element
 * `relative mt-4`). `cursor` adds the ▶ before the label.
 */
export function WindowTab({
  cursor = false,
  className,
  children,
  ...props
}: {
  cursor?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={cn(
        "absolute -top-4 left-4 z-[1] inline-flex h-7 items-center gap-1.5 bg-butter px-2.5 font-pixel text-xs uppercase text-ink px-frame",
        className
      )}
    >
      {cursor && <span aria-hidden className="text-coral-deep">▶</span>}
      {children}
    </span>
  );
}
