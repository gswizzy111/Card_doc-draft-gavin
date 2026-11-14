"use client";

import { Check } from "lucide-react";
import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="mt-8 inline-flex items-center gap-2 bg-mint px-4 py-3 text-base font-semibold text-ink px-frame">
        <Check className="h-4 w-4 shrink-0" strokeWidth={3} />You&apos;re on the list — we&apos;ll email you when we&apos;re back.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 flex flex-col items-center gap-3">
      <p className="mb-1 font-pixel text-xs uppercase tracking-[0.06em] text-stage-muted">
        Get notified when we&apos;re back
      </p>
      <div className="flex w-full max-w-[420px] gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="h-12 min-w-0 flex-1 border-2 border-stage-muted bg-night-raise px-4 text-base text-stage-fg outline-none placeholder:text-stage-muted focus-visible:border-butter focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-butter/35"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-btn h-12 shrink-0 px-5 text-base disabled:opacity-60"
        >
          {status === "loading" ? "..." : "Notify Me"}
        </button>
      </div>
      {error && <p className="text-sm font-semibold text-rx-bright">{error}</p>}
    </form>
  );
}
