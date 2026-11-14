"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { US_STATES } from "@/lib/constants";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
import { subscriptionDisclosures, subscriptionEnrollLabel } from "@/lib/subscription-terms";
import { MissingNote, Need, Req, revealMissing } from "@/components/checkout/required";
import { PixelIcon } from "@/components/pixel/sprites";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function SubscribeForm({ priceCents }: { priceCents: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Enrolling is its own affirmative choice, never pre-checked (Terms Section 26)
  const [enroll, setEnroll] = useState(false);
  // Pressed subscribe with something missing: outline it in red
  const [showMissing, setShowMissing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const miss = (v: string) => showMissing && !v.trim();
  const ready = !!(form.name.trim() && form.email.trim() && form.phone.trim() && form.street1.trim() && form.city.trim() && form.state && form.zip.trim() && enroll);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) {
      setShowMissing(true);
      revealMissing();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subscribe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, enroll }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong. Please try again."); return; }
      if (data.url) router.push(data.url);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const priceLabel = formatPrice(priceCents);

  return (
    <div className="min-h-screen page-glow">
      <div className="max-w-5xl mx-auto px-4 md:px-10 py-12 md:py-20">

        {/* Hero: the clinic pharmacy's refill plan */}
        <div className="mb-10 md:mb-14">
          <h1 className="font-heading leading-tight text-ink text-[clamp(2.5rem,9vw,4rem)]">Monthly Kit Club</h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12 lg:items-start">
          {/* The refill label: what the plan includes */}
          <div className="lg:sticky lg:top-28">
            <div className="px-window-ink p-0 md:p-0">
              <div className="p-5 md:p-6">
                <p className="text-lg md:text-xl font-medium text-ink leading-relaxed">
                  Get a fresh restoration kit delivered every month — <span className="whitespace-nowrap font-heading text-2xl md:text-3xl text-coral-deep [font-feature-settings:'lnum'_1]">{priceLabel}/mo</span>
                </p>
                <ul className="mt-6 flex flex-col gap-3 border-t-2 border-dashed border-ink/25 pt-5 text-base text-ink">
                  <li className="flex items-center gap-3"><span aria-hidden className="grid size-6 shrink-0 place-items-center"><PixelIcon name="kit" size={16} /></span>1 Restoration Kit every month</li>
                  <li className="flex items-center gap-3"><span aria-hidden className="grid size-6 shrink-0 place-items-center"><PixelIcon name="calendar" size={16} /></span>Automatic billing — cancel anytime</li>
                  <li className="flex items-center gap-3"><span aria-hidden className="grid size-6 shrink-0 place-items-center"><PixelIcon name="box" size={16} /></span>Free US shipping included</li>
                </ul>
              </div>
            </div>
          </div>

        {/* Form card */}
        <div className="px-window p-5 md:p-8">
          <h2 className="font-heading text-3xl text-ink mb-6">Your shipping details</h2>

          {error && (
            <div role="alert" className="mb-6 bg-rx-soft px-4 py-3 text-sm font-semibold text-destructive px-frame">{error}</div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Need missing={miss(form.name)}>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink">Full Name<Req /></label>
              <input id="name" name="name" type="text" required value={form.name} onChange={handleChange}
                placeholder="Jane Smith" className="h-12 w-full rounded-none border-2 border-input bg-panel px-3.5 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]" />
            </Need>
            <Need missing={miss(form.email)}>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">Email<Req /></label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="jane@example.com" className="h-12 w-full rounded-none border-2 border-input bg-panel px-3.5 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]" />
            </Need>
            <Need missing={miss(form.phone)}>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-ink">Phone<Req /></label>
              <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange}
                placeholder="(555) 555-5555" className="h-12 w-full rounded-none border-2 border-input bg-panel px-3.5 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]" />
            </Need>
            <Need missing={miss(form.street1)}>
              <label htmlFor="street1" className="mb-1.5 block text-sm font-semibold text-ink">Street Address<Req /></label>
              <AddressAutocomplete
                id="street1"
                value={form.street1}
                onChange={(v) => setForm((prev) => ({ ...prev, street1: v }))}
                onPlaceSelect={(f) => setForm((prev) => ({ ...prev, street1: f.street1, city: f.city, state: f.state, zip: f.zip }))}
                placeholder="123 Main St"
                className="h-12 w-full rounded-none border-2 border-input bg-panel px-3.5 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
              />
            </Need>
            <div>
              <label htmlFor="street2" className="mb-1.5 block text-sm font-semibold text-ink">
                Apt / Suite <span className="text-ink-soft font-normal">(optional)</span>
              </label>
              <input id="street2" name="street2" type="text" value={form.street2} onChange={handleChange}
                placeholder="Apt 4B" className="h-12 w-full rounded-none border-2 border-input bg-panel px-3.5 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Need missing={miss(form.city)} className="col-span-2 sm:col-span-1">
                <label htmlFor="city" className="mb-1.5 block text-sm font-semibold text-ink">City<Req /></label>
                <input id="city" name="city" type="text" required value={form.city} onChange={handleChange}
                  placeholder="Chicago" className="h-12 w-full rounded-none border-2 border-input bg-panel px-3.5 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]" />
              </Need>
              <Need missing={miss(form.state)}>
                <label htmlFor="state" className="mb-1.5 block text-sm font-semibold text-ink">State<Req /></label>
                <select id="state" name="state" required value={form.state} onChange={handleChange}
                  className="h-12 w-full rounded-none border-2 border-input bg-panel px-3.5 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]">
                  <option value="">—</option>
                  {US_STATES.map((s) => <option key={s.value} value={s.value}>{s.value}</option>)}
                </select>
              </Need>
              <Need missing={miss(form.zip)}>
                <label htmlFor="zip" className="mb-1.5 block text-sm font-semibold text-ink">ZIP<Req /></label>
                <input id="zip" name="zip" type="text" required value={form.zip} onChange={handleChange}
                  placeholder="60601" className="h-12 w-full rounded-none border-2 border-input bg-panel px-3.5 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]" />
              </Need>
            </div>

            <div className="mt-2 bg-[color-mix(in_srgb,var(--butter)_30%,var(--panel))] p-4">
              <p className="text-sm font-semibold text-ink mb-2.5">Before you subscribe</p>
              <ul className="flex flex-col gap-1.5 text-sm text-ink-soft list-[square] marker:text-coral-deep pl-5">
                {subscriptionDisclosures(priceCents).map((d) => <li key={d}>{d}</li>)}
              </ul>
            </div>
            <Need missing={showMissing && !enroll} note="Check this box to subscribe.">
            <label className="flex min-h-11 items-start gap-3 py-1 text-sm cursor-pointer">
              <input type="checkbox" checked={enroll} onChange={(e) => setEnroll(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-primary" />
              <span className="font-semibold text-ink">{subscriptionEnrollLabel(priceCents)}<Req /></span>
            </label>
            </Need>

            <MissingNote show={showMissing && !ready} />
            <button type="submit" disabled={loading}
              className="px-btn mt-2 h-12 w-full text-base disabled:opacity-60">
              {loading ? "Redirecting to checkout…" : `Subscribe — ${priceLabel}/mo`}
            </button>

            <p className="text-center text-xs text-ink-soft">
              Secured by Stripe. Cancel anytime online or by email.
            </p>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}
