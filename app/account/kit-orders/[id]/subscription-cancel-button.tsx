"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SubscriptionCancelButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleCancel() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/account/subscriptions/cancel", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please contact us.");
      return;
    }
    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <div className="bg-mint/25 border border-mint-deep/50 px-4 py-3 text-sm text-mint-deep font-semibold">
        ✓ Subscription cancelled. No future charges will occur.
      </div>
    );
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm font-semibold px-4 py-2 bg-rx-soft text-destructive border border-destructive/50 hover:bg-rx-soft transition-colors"
      >
        Cancel Subscription
      </button>
    );
  }

  return (
    <div className="border border-destructive/50 p-4 bg-rx-soft flex flex-col gap-3">
      <p className="text-sm font-semibold text-destructive">Are you sure you want to cancel?</p>
      <p className="text-xs text-destructive">
        Your subscription will be cancelled immediately. Any kit that has already shipped is yours to keep.
        Future monthly charges will stop.
      </p>
      {error && <p className="text-xs text-destructive font-semibold">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Cancelling…" : "Yes, Cancel Subscription"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-4 py-2 text-sm font-semibold bg-panel px-frame text-foreground hover:bg-secondary transition-colors"
        >
          Keep Subscription
        </button>
      </div>
    </div>
  );
}
