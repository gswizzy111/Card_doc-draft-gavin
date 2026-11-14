"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck, MailMinus } from "lucide-react";

const ORDER_EMAILS = "Order emails, like confirmations and shipping updates, still arrive.";

export function UnsubscribePanel({ token, email, alreadyUnsubscribed }: { token: string; email: string; alreadyUnsubscribed: boolean }) {
  const [done, setDone] = useState(alreadyUnsubscribed);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  async function unsubscribe() {
    setWorking(true);
    setError("");
    try {
      const res = await fetch("/api/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "We couldn't unsubscribe you just now. Please try again in a minute.");
        return;
      }
      setDone(true);
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setWorking(false);
    }
  }

  const Icon = done ? MailCheck : MailMinus;

  return (
    <div aria-live="polite">
      <span className="mb-6 flex size-12 items-center justify-center bg-rx-soft text-coral-deep px-frame">
        <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
      </span>
      <h1 className="mb-4 font-heading text-3xl uppercase leading-tight tracking-[0.02em] text-ink md:text-4xl">
        {done ? "You're unsubscribed" : "Unsubscribe from marketing emails"}
      </h1>
      <p className="mb-8 text-[17px] leading-relaxed text-ink-soft">
        {done ? (
          <>
            <span className="font-semibold text-ink break-all">{email}</span> won&apos;t get marketing emails from The Card Doc anymore. {ORDER_EMAILS}
          </>
        ) : (
          <>
            Stop marketing emails from The Card Doc to <span className="font-semibold text-ink break-all">{email}</span>. {ORDER_EMAILS}
          </>
        )}
      </p>
      {done ? (
        <Link
          href="/"
          className="px-btn h-12 px-6 text-base"
        >
          Back to home
        </Link>
      ) : (
        <button
          type="button"
          onClick={unsubscribe}
          disabled={working}
          className="px-btn h-12 px-6 text-base disabled:opacity-60"
        >
          {working ? "Unsubscribing…" : "Unsubscribe"}
        </button>
      )}
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
    </div>
  );
}
