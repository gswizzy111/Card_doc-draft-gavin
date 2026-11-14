"use client";

import { useState } from "react";

export function ComplaintForm({ caseId, token }: { caseId: string; token: string }) {
  const [complaint, setComplaint] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!complaint.trim()) { setError("Please describe your complaint."); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/cases/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaint: complaint.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong. Please try again."); setSubmitting(false); return; }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-heading text-2xl uppercase leading-tight tracking-[0.02em] text-ink mb-2">Complaint submitted</p>
        <p className="text-sm text-gray-500 leading-relaxed">
          We&apos;ll review your case and get back to you within <strong>3 business days</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
          Your complaint *
        </label>
        <textarea
          className="w-full resize-none py-2.5 min-w-0 rounded-none border-2 border-input bg-panel px-3 text-base shadow-[inset_0_3px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
          rows={6}
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Please describe what happened, including any relevant order details, dates, or other information that will help us investigate..."
          autoFocus
        />
      </div>
      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
      <button
        type="submit"
        disabled={submitting || !complaint.trim()}
        className="w-full h-11 bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-40"
      >
        {submitting ? "Submitting..." : "Submit Complaint"}
      </button>
    </form>
  );
}
