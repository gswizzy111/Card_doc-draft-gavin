"use client";

import { useState } from "react";

export function RestorationWaitlistForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/restoration-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); setStatus("error"); return; }
      setStatus("success");
      if (onSuccess) setTimeout(onSuccess, 1800);
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="relative mx-auto max-w-md bg-mint px-6 py-5 text-center px-frame">
        <p className="mb-1 font-heading text-2xl leading-tight text-ink">You&apos;re on the list!</p>
        <p className="text-sm text-ink">We&apos;ll reach out as soon as we&apos;re accepting restorations again.</p>
      </div>
    );
  }

  const inp = "h-12 w-full border-2 border-input bg-panel px-3 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
      <input name="name" required placeholder="Full name *" value={form.name} onChange={handleChange} className={inp} />
      <input name="email" type="email" required placeholder="Email address *" value={form.email} onChange={handleChange} className={inp} />
      <input name="phone" type="tel" placeholder="Phone number (optional)" value={form.phone} onChange={handleChange} className={inp} />
      {error && <p className="bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 px-frame">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-btn mt-1 h-14 w-full text-lg disabled:opacity-60"
      >
        {status === "loading" ? "Submitting…" : "Notify Me When Open"}
      </button>
    </form>
  );
}
