"use client";

import { Info, ShieldCheck, ShieldOff } from "lucide-react";
import { INSURANCE_DECLINED_TEXT, INSURANCE_DETAILS, NOT_INSURED_TEXT } from "@/lib/legal/current-terms";
import { Need, Req } from "./required";

export type InsuranceElection = "purchased" | "declined" | null;

/**
 * The required shipping-insurance choice (Terms 13.3, 15.2, 15.4): buy it or
 * decline it, never assumed. `children` holds the purchase details (amount,
 * options and price) shown once "Buy" is chosen.
 */
export function InsuranceElectionBox({
  election,
  onElection,
  purchaseAvailable = true,
  unavailableNote,
  showMissing = false,
  purchaseMissing = false,
  children,
}: {
  election: InsuranceElection;
  onElection: (e: Exclude<InsuranceElection, null>) => void;
  purchaseAvailable?: boolean;
  unavailableNote?: string;
  /** The customer tried to go on: outline what's missing in red */
  showMissing?: boolean;
  /** "Buy" is chosen but the amount or coverage isn't filled in yet */
  purchaseMissing?: boolean;
  children?: React.ReactNode;
}) {
  const option = (value: Exclude<InsuranceElection, null>, label: string, Icon: typeof ShieldCheck, disabled = false) => (
    <label
      className={`flex min-h-12 items-start gap-3 p-3 px-frame has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-frame-deep ${
        disabled ? "cursor-not-allowed bg-muted opacity-50" : election === value ? "cursor-pointer bg-rx-soft" : "cursor-pointer bg-panel hover:bg-butter/30"
      }`}
    >
      <input
        type="radio"
        name="insurance-election"
        className="mt-0.5 accent-primary"
        checked={election === value}
        disabled={disabled}
        onChange={() => onElection(value)}
      />
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink" strokeWidth={1.75} />
      <span className="text-[15px] font-semibold text-ink">{label}</span>
    </label>
  );

  return (
    <div className="flex flex-col gap-3" id="insurance-election">
      <div>
        <h3 className="font-heading text-xl uppercase tracking-[0.02em] text-ink">Shipping insurance<Req /> <span className="font-sans text-xs normal-case tracking-normal text-ink-soft">(choose one)</span></h3>
        <p className="mt-1 text-sm text-ink-soft">{NOT_INSURED_TEXT}</p>
      </div>
      <Need missing={showMissing && election === null} note="Choose to buy or decline shipping insurance.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {option("purchased", "Buy shipping insurance", ShieldCheck, !purchaseAvailable)}
          {option("declined", "Decline shipping insurance", ShieldOff)}
        </div>
      </Need>
      {!purchaseAvailable && unavailableNote && <p className="text-xs text-muted-foreground">{unavailableNote}</p>}
      {election === "purchased" && purchaseAvailable && (
        <div className="flex flex-col gap-3 bg-panel p-4 px-frame">
          <ul className="flex flex-col gap-1.5 text-[13px] leading-relaxed text-ink-soft">
            {INSURANCE_DETAILS.map((d) => <li key={d}>{d}</li>)}
          </ul>
          <Need missing={showMissing && purchaseMissing} note="Enter the amount to insure and pick a coverage." className="flex flex-col gap-3">
            {children}
          </Need>
        </div>
      )}
      {election === "declined" && (
        <p className="flex items-start gap-2 bg-butter/40 px-3 py-2.5 text-sm text-ink px-frame">
          <Info className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={1.75} />
          {INSURANCE_DECLINED_TEXT}
        </p>
      )}
    </div>
  );
}
