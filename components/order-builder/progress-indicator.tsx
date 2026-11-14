import { Check } from "lucide-react";
const STEPS = [
  { n: 1, label: "Cards" },
  { n: 2, label: "Your Info" },
  { n: 3, label: "Shipping" },
  { n: 4, label: "Review" },
];

/**
 * The check-in track: four stops on a segmented bar that fills in mint as
 * each step is done. The current stop is coral.
 */
export function ProgressIndicator({ currentStep }: { currentStep: number }) {
  const done = Math.max(0, Math.min(STEPS.length - 1, currentStep - 1));
  return (
    <div className="relative w-full px-1 pt-1">
      {/* Track: night rail with a mint fill, drawn between the first and last stop */}
      <div aria-hidden className="absolute top-[23px] right-[12.5%] left-[12.5%] h-0.5 bg-ink/15">
        <span
          className="block h-full bg-mint-deep transition-[width] duration-300 ease-out motion-reduce:transition-none"
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
                {state === "done" ? <Check className="h-4 w-4" strokeWidth={3} /> : step.n}
              </span>
              <span
                className={`max-w-[8ch] text-center sm:max-w-none text-sm leading-tight ${
                  state === "current" ? "font-semibold text-ink" : "text-ink-soft"
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
