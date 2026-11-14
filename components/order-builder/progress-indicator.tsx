import { Check } from "lucide-react";
const STEPS = [
  { n: 1, label: "Cards" },
  { n: 2, label: "Your Info" },
  { n: 3, label: "Shipping" },
  { n: 4, label: "Review" },
];

/**
 * The check-in track: four stops on a segmented bar that fills in mint as
 * each step is done. The current stop is coral with a ▼ over it.
 */
export function ProgressIndicator({ currentStep }: { currentStep: number }) {
  const done = Math.max(0, Math.min(STEPS.length - 1, currentStep - 1));
  return (
    <div className="relative w-full px-1 pt-1">
      {/* Track: night rail with a mint fill, drawn between the first and last stop */}
      <div aria-hidden className="absolute top-[22px] right-[12.5%] left-[12.5%] h-3 bg-night shadow-[0_0_0_2px_var(--ink),inset_0_0_0_2px_var(--panel)]">
        <span
          className="block h-full bg-mint bg-[repeating-linear-gradient(90deg,transparent_0_6px,color-mix(in_srgb,var(--ink)_18%,transparent)_6px_8px)] transition-[width] duration-300 ease-[steps(4,end)] motion-reduce:transition-none"
          style={{ width: `${(done / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
      <ol className="relative grid grid-cols-4">
        {STEPS.map((step) => {
          const state = step.n < currentStep ? "done" : step.n === currentStep ? "current" : "next";
          return (
            <li key={step.n} className="flex flex-col items-center gap-2" aria-current={state === "current" ? "step" : undefined}>
              <span
                className={`relative grid size-10 place-items-center font-pixel text-sm tabular-nums text-ink px-frame ${
                  state === "done" ? "bg-mint" : state === "current" ? "bg-coral-fill" : "bg-panel"
                }`}
              >
                {state === "current" && (
                  <span aria-hidden className="absolute -top-5 left-1/2 -translate-x-1/2 font-pixel text-xs leading-none text-coral-deep px-bob">▼</span>
                )}
                {state === "done" ? <Check className="h-4 w-4" strokeWidth={3} /> : step.n}
              </span>
              <span
                className={`max-w-[8ch] text-center font-pixel text-xs uppercase leading-tight tracking-normal ${
                  state === "current" ? "text-ink" : "text-ink-soft"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
