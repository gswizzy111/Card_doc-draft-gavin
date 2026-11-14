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
 * - `variant="dialog"`: a dialog box. The ▼ prompt is opt-in (revision 2):
 *   `next` shows it still in the corner, `next="blink"` makes it blink
 *   (static under reduced motion). Keep the blink to the home hero at most.
 * - `tone`: `frame` (blue frame, default), `ink` (ink outline) or `night`.
 * - `title`: an optional tab label that sits on the top edge.
 *
 * The outline draws 2px outside the box, so leave a little room around it.
 */
export function Window({
  as: Tag = "div",
  variant = "window",
  tone = "frame",
  title,
  next = false,
  className,
  children,
  ...props
}: {
  as?: "div" | "section" | "article" | "aside" | "figure";
  variant?: "window" | "dialog";
  tone?: WindowTone;
  title?: React.ReactNode;
  next?: boolean | "blink";
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      data-slot="pixel-window"
      className={cn(TONE[tone], variant === "dialog" && "px-dialog", "p-5 md:p-7", title ? "mt-4" : "", className)}
      {...props}
    >
      {title && <WindowTab>{title}</WindowTab>}
      {children}
      {variant === "dialog" && next && (
        <span aria-hidden className={cn("px-dialog-next", next === "blink" && "px-dialog-next-blink")}>
          ▼
        </span>
      )}
    </Tag>
  );
}

/**
 * The small label tab that sits on a window's top edge. `<Window title>` uses it;
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
        "absolute -top-3.5 left-4 z-[1] inline-flex h-6 items-center gap-1.5 bg-butter px-2 font-pixel text-[0.6875rem] uppercase leading-none tracking-[0.04em] text-ink shadow-[0_0_0_2px_color-mix(in_srgb,var(--ink)_70%,var(--panel))]",
        className
      )}
    >
      {cursor && <span aria-hidden className="text-coral-deep">▶</span>}
      {children}
    </span>
  );
}
