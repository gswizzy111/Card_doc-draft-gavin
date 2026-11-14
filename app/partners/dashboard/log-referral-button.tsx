"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogReferralButton() {
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/partners/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_name: clientName, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOpen(false);
      setClientName("");
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
        className="w-full h-14 bg-panel px-frame text-foreground font-bold hover:border-primary/40 transition-colors text-sm"
      >
        Log Referral
      </button>
    );
  }

  return (
    <div className="col-span-2 bg-secondary/40 border border-border p-4 flex flex-col gap-3">
      <p className="text-sm font-bold text-foreground">Log Referral</p>
      <input
        type="text"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        placeholder="Client name"
        className="w-full h-11 min-w-0 rounded-none border-2 border-input bg-panel px-3 text-base shadow-[inset_0_3px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
      />
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes — e.g. restoration, PSA prep (optional)"
        className="w-full h-11 min-w-0 rounded-none border-2 border-input bg-panel px-3 text-base shadow-[inset_0_3px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={saving}
          className="px-btn px-4 disabled:opacity-50 h-11 text-base"
        >
          {saving ? "Saving..." : "Log Referral"}
        </button>
        <button onClick={() => setOpen(false)} className="text-sm px-4 py-2 text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>
    </div>
  );
}
