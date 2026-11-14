import { cn } from "@/lib/utils";

export type ClinicStatus = "check-in" | "triage" | "treatment" | "discharged";

const STATUS: Record<ClinicStatus, { label: string; className: string; dot: string }> = {
  "check-in": { label: "CHECK-IN", className: "bg-powder text-ink", dot: "bg-frame-deep" },
  triage: { label: "TRIAGE", className: "bg-butter text-ink", dot: "bg-coral-deep" },
  treatment: { label: "IN TREATMENT", className: "bg-rx-soft text-ink", dot: "bg-coral" },
  discharged: { label: "DISCHARGED", className: "bg-mint text-ink", dot: "bg-mint-deep" },
};

/**
 * A clinic status chip: CHECK-IN, TRIAGE, IN TREATMENT or DISCHARGED.
 * Decorative labels only; pass `children` to replace the default text.
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
        "inline-flex h-7 items-center gap-2 px-2.5 font-pixel text-[0.75rem] leading-none uppercase tracking-[0.04em] px-frame",
        s.className,
        className
      )}
    >
      <span aria-hidden className={cn("size-2", s.dot)} />
      {children ?? s.label}
    </span>
  );
}
