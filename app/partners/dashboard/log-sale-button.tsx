"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductType = "kit" | "polish" | "spray";

const PRODUCTS: { type: ProductType; label: string }[] = [
  { type: "kit",    label: "Restoration Kit" },
  { type: "polish", label: "Card Polish" },
  { type: "spray",  label: "Card Spray" },
];

type Props = {
  remainingKits: number;
  remainingPolish: number;
  remainingSpray: number;
};

export function LogSaleButton({ remainingKits, remainingPolish, remainingSpray }: Props) {
  const [open, setOpen] = useState(false);
  const [productType, setProductType] = useState<ProductType>("kit");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const remaining = productType === "kit" ? remainingKits : productType === "polish" ? remainingPolish : remainingSpray;
  const anyAvailable = remainingKits > 0 || remainingPolish > 0 || remainingSpray > 0;

  async function submit() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/partners/kit-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, notes, product_type: productType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOpen(false);
      setQuantity(1);
      setNotes("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        disabled={!anyAvailable}
        className="px-btn w-full h-14 disabled:opacity-40 px-5 text-base"
      >
        Log a Sale
      </button>
    );
  }

  return (
    <div className="col-span-2 bg-powder/30 border border-frame/50 p-4 flex flex-col gap-3">
      <p className="text-sm font-bold text-ink">Log a Sale</p>

      {/* Product selector */}
      <div className="flex gap-2">
        {PRODUCTS.map((p) => {
          const rem = p.type === "kit" ? remainingKits : p.type === "polish" ? remainingPolish : remainingSpray;
          return (
            <button
              key={p.type}
              onClick={() => { setProductType(p.type); setQuantity(1); }}
              disabled={rem <= 0}
              className={`flex-1 py-2 border text-xs font-bold transition-colors disabled:opacity-40 ${
                productType === p.type
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-panel border-frame/50 text-ink hover:border-primary"
              }`}
            >
              {p.label}
              <span className="block text-xs font-normal">{rem} left</span>
            </button>
          );
        })}
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-ink shrink-0">Qty sold</label>
        <input
          type="number"
          min={1}
          max={remaining}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(remaining, parseInt(e.target.value) || 1)))}
          className="w-20 text-center h-11 min-w-0 rounded-none border-2 border-input bg-panel px-3 text-base shadow-[inset_0_2px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
        />
        <span className="text-xs text-frame-deep">of {remaining} remaining</span>
      </div>

      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="w-full h-11 min-w-0 rounded-none border-2 border-input bg-panel px-3 text-base shadow-[inset_0_2px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
      />

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={saving || remaining <= 0}
          className="px-btn px-4 disabled:opacity-50 h-11 text-base"
        >
          {saving ? "Saving..." : "Confirm Sale"}
        </button>
        <button onClick={() => setOpen(false)} className="text-sm px-4 py-2 text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>
    </div>
  );
}
