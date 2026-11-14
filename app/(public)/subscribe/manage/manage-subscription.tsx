"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { PixelIcon } from "@/components/pixel/sprites";

type SubResult = {
  found: boolean;
  id?: string;
  status?: string;
  created_at?: string;
  cancelled_at?: string;
  /** What this subscriber pays a month */
  price_cents?: number;
};

const LINK_EXPIRED = "This link has expired or was already used. Enter your email to get a new one.";

/**
 * Shows a Kit Club subscription and cancels it, only for someone who proved
 * the inbox: the one-time link this page emails (?token=...), or a signed-in
 * account with the same email. Typing an email only sends that link.
 */
export function ManageSubscription({ token }: { token: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [result, setResult] = useState<SubResult | null>(null);
  const [sentTo, setSentTo] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [cancelError, setCancelError] = useState("");

  // Opened from the emailed link, or signed in: show the subscription
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch("/api/subscriptions/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(token ? { token } : {}),
        });
        const data = await res.json().catch(() => ({}));
        if (!live) return;
        if (data.code === "LINK_EXPIRED") setLookupError(LINK_EXPIRED);
        else if (!res.ok) { if (token) setLookupError("Something went wrong. Please try again."); }
        else if (data.found) setResult(data);
        else if (token) setLookupError("No subscription found for that email address.");
      } catch {
        if (live && token) setLookupError("Something went wrong. Please try again.");
      } finally {
        if (live) setChecking(false);
      }
    })();
    return () => { live = false; };
  }, [token]);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setLookupError("");
    setSentTo("");
    try {
      const res = await fetch("/api/subscriptions/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setLookupError(data.error ?? "Something went wrong. Please try again."); return; }
      setSentTo(email.trim());
    } catch {
      setLookupError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!result?.id) return;
    if (!confirm("Are you sure you want to cancel your subscription? This will stop future billing immediately.")) return;
    setCancelling(true);
    setCancelError("");
    try {
      const res = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(token ? { token } : {}), subscriptionId: result.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setCancelError(data.error ?? "Failed to cancel."); return; }
      setCancelled(true);
      setResult({ ...result, status: "cancelled" });
    } catch {
      setCancelError("Network error. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  return (
    <div className="min-h-screen page-glow flex items-center justify-center px-4 py-14 md:py-20">
      <div className="w-full max-w-lg">
        <Link href="/" className="mb-6 inline-flex min-h-11 items-center gap-2 bg-panel px-3 text-sm font-semibold text-ink px-frame hover:bg-butter transition-colors duration-100">← Back to home</Link>

      {/* The pharmacy counter */}
      <div className="px-window p-0 md:p-0">
        <div aria-hidden className="flex h-10 items-center justify-between gap-3 border-b-[3px] border-frame bg-mint px-5">
          <span className="flex items-center gap-2 font-pixel text-xs uppercase tracking-[0.04em] text-ink">
            <PixelIcon name="kit" size={16} />
            PHARMACY
          </span>
          <span className="flex gap-1.5">
            <span className="size-2 bg-ink" />
            <span className="size-2 bg-ink/40" />
          </span>
        </div>
        <div className="p-5 md:p-8">
        <h1 className="font-heading uppercase text-[2.25rem] md:text-5xl leading-[0.95] tracking-[0.01em] text-ink mb-3">Manage Your Subscription</h1>
        <p className="text-[15px] text-ink-soft mb-6">Enter the email you used to subscribe. We&apos;ll email you a link to manage it.</p>

        <form onSubmit={handleLookup} className="flex gap-3 mb-6">
          <label htmlFor="manage-email" className="sr-only">Email</label>
          <input
            id="manage-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="h-12 flex-1 min-w-0 rounded-none border-2 border-ink bg-panel px-3 text-base text-ink shadow-[inset_0_3px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-btn h-12 shrink-0 px-4 text-base disabled:opacity-60"
          >
            {loading ? "…" : "Send link"}
          </button>
        </form>

        {sentTo && (
          <div role="status" className="mb-5 bg-[color-mix(in_srgb,var(--mint)_40%,var(--panel))] px-4 py-3 text-sm text-ink leading-relaxed px-frame">
            If there&apos;s a subscription for <span className="font-semibold [overflow-wrap:anywhere]">{sentTo}</span>, we just emailed it a link to manage it. The link expires in 1 hour. Not there in a minute? Check your Spam, Junk and Promotions folders.
          </div>
        )}

        {lookupError && (
          <p role="alert" className="mb-5 bg-rx-soft px-3 py-2 text-sm font-semibold text-destructive px-frame">{lookupError}</p>
        )}

        {checking && token && (
          <p className="font-pixel text-xs uppercase tracking-[0.04em] text-ink-soft px-blink">Loading…</p>
        )}

        {result?.found && (
          <div className="bg-panel p-5 space-y-4 px-frame shadow-[inset_0_6px_0_var(--mint)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-heading uppercase text-2xl tracking-[0.02em] text-ink">Monthly Kit Club</p>
                {typeof result.price_cents === "number" && (
                  <p className="text-sm text-ink-soft mt-0.5 [font-feature-settings:'lnum'_1]">{formatCurrency(result.price_cents)} / month</p>
                )}
              </div>
              <span className={`inline-flex h-7 shrink-0 items-center gap-2 px-2.5 font-pixel text-xs uppercase tracking-[0.04em] text-ink px-frame ${
                result.status === "active"
                  ? "bg-mint"
                  : "bg-muted"
              }`}>
                <span aria-hidden className={`size-2 ${result.status === "active" ? "bg-mint-deep" : "bg-ink-soft"}`} />
                {result.status === "active" ? "Active" : "Cancelled"}
              </span>
            </div>

            {result.created_at && (
              <p className="text-sm text-ink-soft">
                Subscribed on <span className="font-semibold text-ink">{formatDate(result.created_at)}</span>
              </p>
            )}

            {result.cancelled_at && (
              <p className="text-sm text-ink-soft">
                Cancelled on <span className="font-semibold text-ink">{formatDate(result.cancelled_at)}</span>
              </p>
            )}

            {cancelled && (
              <div className="bg-[color-mix(in_srgb,var(--mint)_40%,var(--panel))] px-4 py-3 text-sm text-ink font-semibold px-frame">
                Your subscription has been cancelled. You won&apos;t be charged again.
              </div>
            )}

            {result.status === "active" && !cancelled && (
              <div className="pt-4 border-t-2 border-dashed border-ink/25 space-y-3">
                {cancelError && <p className="bg-rx-soft px-3 py-2 text-sm font-semibold text-destructive px-frame">{cancelError}</p>}
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-btn px-btn-danger h-12 w-full text-base disabled:opacity-60"
                >
                  {cancelling ? "Cancelling…" : "Cancel my subscription"}
                </button>
                <p className="text-xs text-ink-soft text-center">
                  Cancellation is immediate. No refunds for the current billing period.
                </p>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
      </div>
    </div>
  );
}
