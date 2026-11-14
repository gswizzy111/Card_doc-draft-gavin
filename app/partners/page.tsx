"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PartnerLoginPage() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/partners/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Invalid passcode");
      router.push("/partners/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid passcode");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen page-glow flex items-center justify-center px-4">
      <div className="px-window-ink p-8 w-full max-w-sm">
        <h1 className="font-heading text-3xl leading-tight text-ink mb-1">Partner Portal</h1>
        <p className="text-sm text-muted-foreground mb-6">The Card Doc</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter your passcode"
              className="w-full h-11 min-w-0 rounded-none border-2 border-input bg-panel px-3 text-base shadow-[inset_0_2px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="px-btn w-full h-11 disabled:opacity-50 px-5 text-base"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
