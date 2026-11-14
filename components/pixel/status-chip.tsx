import { cn } from "@/lib/utils";

export type ClinicStatus = "check-in" | "triage" | "treatment" | "discharged";

const STATUS: Record<ClinicStatus, { label: string; className: string; dot: string }> = {
  "check-in": { label: "CHECK-IN", className: "bg-powder/55 text-ink", dot: "bg-frame-deep" },
  triage: { label: "TRIAGE", className: "bg-butter/60 text-ink", dot: "bg-coral-deep" },
  treatment: { label: "IN TREATMENT", className: "bg-rx-soft text-ink", dot: "bg-coral-deep" },
  discharged: { label: "DISCHARGED", className: "bg-mint/55 text-ink", dot: "bg-mint-deep" },
};

/**
 * A clinic status chip: CHECK-IN, TRIAGE, IN TREATMENT or DISCHARGED.
 * Decorative labels only; pass `children` to replace the default text.
 * Revision 2: use chips only where they explain the process (how it works,
 * before/after), not as decoration on every card.
 */
export function StatusChip({
  status,
  children,
  className,
}: {
  status: ClinicStatus;
  children?: React.ReactNode;
  className?: string;
}) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 px-2 font-pixel text-[0.6875rem] leading-none uppercase tracking-[0.04em] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--ink)_22%,transparent)]",
        s.className,
        className
      )}
    >
      <span aria-hidden className={cn("size-1.5", s.dot)} />
      {children ?? s.label}
    </span>
  );
}
