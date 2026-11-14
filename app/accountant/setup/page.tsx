"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// The same minimum as admin passwords (ADMIN_PASSWORD_MIN in lib/admin-password.ts)
const MIN = 10;

function SetupForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) setError("Missing invite token. Use the link from your invitation email.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < MIN) { setError(`Password must be at least ${MIN} characters.`); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    const res = await fetch("/api/accountant/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/admin/login"), 2500);
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="font-bold text-xl text-foreground mb-2">Password set!</h2>
        <p className="text-sm text-muted-foreground">Redirecting you to the login page…</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-heading text-3xl uppercase leading-tight tracking-[0.02em] text-ink mb-1">Set your password</h1>
      <p className="text-sm text-muted-foreground mb-6">You're setting up accountant access to The Card Doc admin.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={`At least ${MIN} characters`}
            className="w-full h-11 min-w-0 rounded-none border-2 border-input bg-panel px-3 text-base shadow-[inset_0_3px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
            className="w-full h-11 min-w-0 rounded-none border-2 border-input bg-panel px-3 text-base shadow-[inset_0_3px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading || !token}
          className="h-11 bg-primary text-white font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving…" : "Set Password & Continue →"}
        </button>
      </form>
    </>
  );
}

export default function AccountantSetupPage() {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="px-window-ink p-8 w-full max-w-sm">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
          <SetupForm />
        </Suspense>
      </div>
    </div>
  );
}
