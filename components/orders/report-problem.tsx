"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { PhotoUploader } from "@/components/order-builder/photo-uploader";
import { PROBLEM_NOTICE } from "@/lib/problem-report-notice";

/** "Report a problem" on an order page (Terms Section 20). */
export function ReportProblem({ orderRef, email }: { orderRef: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function send() {
    setBusy(true);
    setError("");
    const res = await fetch(`/api/orders/${encodeURIComponent(orderRef)}/problem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, description: description.trim(), photo_urls: photos }),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    setBusy(false);
    if (!res?.ok) { setError(data.error ?? "Something went wrong. Please email thecarddoc1@gmail.com."); return; }
    setSent(true);
  }

  return (
    <div className="px-window-ink p-6 mb-5">
      <h2 className="font-heading text-2xl leading-tight text-ink mb-1">Report a problem</h2>
      <p className="text-sm text-muted-foreground flex items-start gap-2">
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-primary" strokeWidth={1.75} />
        {PROBLEM_NOTICE}
      </p>
      {sent ? (
        <p className="mt-4 text-sm text-mint-deep flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Thanks. We got your report and will reply by email.</p>
      ) : !open ? (
        <button type="button" onClick={() => setOpen(true)} className="mt-4 h-10 px-4 border border-foreground/60 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors">
          Report a problem
        </button>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">Order <span className="font-mono">{orderRef}</span></p>
          <label htmlFor="problem-text" className="text-xs font-semibold text-muted-foreground">What happened?</label>
          <textarea
            id="problem-text"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Which card or item, what you noticed, and when it was delivered"
            className="w-full min-h-24 py-2.5 min-w-0 rounded-none border-2 border-input bg-panel px-3 text-base shadow-[inset_0_2px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
          />
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">Photos of the item and the packaging</p>
            <PhotoUploader photoUrls={photos} onChange={setPhotos} max={6} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="button" onClick={send} disabled={busy || description.trim().length < 10} className="px-btn self-start h-11 px-5 disabled:opacity-40 text-base">
            {busy ? "Sending…" : "Send report"}
          </button>
        </div>
      )}
    </div>
  );
}
