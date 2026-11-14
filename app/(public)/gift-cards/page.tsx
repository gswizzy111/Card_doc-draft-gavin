"use client";

import { useState } from "react";
import { MissingNote, Need, Req, revealMissing } from "@/components/checkout/required";
import { PixelIcon } from "@/components/pixel/sprites";

const PRESET_AMOUNTS = [25, 50, 75, 100, 150, 200];

export default function GiftCardsPage() {
  const [amountDollars, setAmountDollars] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const [purchaserName, setPurchaserName] = useState("");
  const [purchaserEmail, setPurchaserEmail] = useState("");

  const [sendToRecipient, setSendToRecipient] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Pressed purchase with something missing: outline it in red
  const [showMissing, setShowMissing] = useState(false);

  const effectiveAmountDollars = useCustom
    ? parseFloat(customAmount.replace(/[^0-9.]/g, "")) || null
    : amountDollars;

  const isValid =
    effectiveAmountDollars !== null &&
    effectiveAmountDollars >= 10 &&
    effectiveAmountDollars <= 1000 &&
    purchaserName.trim().length > 0 &&
    purchaserEmail.trim().length > 0 &&
    (!sendToRecipient || (recipientName.trim().length > 0 && recipientEmail.trim().length > 0));

  const amountOk = effectiveAmountDollars !== null && effectiveAmountDollars >= 10 && effectiveAmountDollars <= 1000;
  const miss = (v: string) => showMissing && !v.trim();

  async function handleCheckout() {
    if (!isValid || !effectiveAmountDollars) {
      setShowMissing(true);
      revealMissing();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/gift-cards/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_cents: Math.round(effectiveAmountDollars * 100),
          purchaser_name: purchaserName.trim(),
          purchaser_email: purchaserEmail.trim(),
          recipient_name: sendToRecipient ? recipientName.trim() : purchaserName.trim(),
          recipient_email: sendToRecipient ? recipientEmail.trim() : purchaserEmail.trim(),
          personal_message: personalMessage.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen page-glow">
      <div className="max-w-5xl mx-auto px-4 md:px-10 py-12 md:py-20">
        {/* The clinic gift shop: the sign on the wall */}
        <div className="mb-10 md:mb-12">
          <h1 className="font-heading leading-tight text-ink text-[clamp(2.5rem,9vw,4rem)]">Gift Cards</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft leading-relaxed">
            Give the gift of card restoration. The recipient gets a code they can apply at checkout.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12 lg:items-start">
          {/* The gift card on the counter: a decorative preview of the chosen amount */}
          <div aria-hidden className="relative mx-auto w-full max-w-[17rem] sm:max-w-[22rem] lg:sticky lg:top-28">
            <div className="relative aspect-[8/5] overflow-hidden bg-coral-fill px-frame-shadow">
              <div className="absolute inset-y-0 left-[18%] w-4 bg-butter shadow-[inset_3px_0_0_var(--ink),inset_-3px_0_0_var(--ink)]" />
              <div className="absolute inset-x-0 top-[40%] h-4 bg-butter shadow-[inset_0_3px_0_var(--ink),inset_0_-3px_0_var(--ink)]" />
              <div className="absolute left-[18%] top-[40%] -ml-4 -mt-4">
                <PixelIcon name="heart-plus" size={48} />
              </div>
              <span className="absolute right-3 top-3 font-pixel text-xs uppercase tracking-[0.04em] text-ink">The Card Doc</span>
              <div className="absolute bottom-3 right-3 bg-panel px-3 py-1.5 px-frame">
                <span className="font-heading text-3xl leading-none text-ink [font-feature-settings:'lnum'_1]">
                  {effectiveAmountDollars ? `$${effectiveAmountDollars}` : "$"}
                </span>
              </div>
            </div>
          </div>

          <div className="px-window-ink p-5 md:p-8 flex flex-col gap-7">

          {/* Amount selection */}
          <Need missing={showMissing && !amountOk} note="Choose an amount from $10 to $1,000.">
            <p className="rx-label text-coral-deep mb-4">Select Amount<Req /></p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => { setAmountDollars(amt); setUseCustom(false); }}
                  aria-pressed={!useCustom && amountDollars === amt}
                  className={`px-btn h-12 w-full px-1 text-xl [font-feature-settings:'lnum'_1] ${
                    !useCustom && amountDollars === amt
                      ? "px-btn-butter"
                      : "px-btn-panel"
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => { setUseCustom(true); setAmountDollars(null); }}
              aria-pressed={useCustom}
              className={`px-btn h-12 w-full text-base ${
                useCustom
                  ? "px-btn-butter"
                  : "px-btn-panel"
              }`}
            >
              Custom amount
            </button>
            {useCustom && (
              <div className="mt-4 flex items-center gap-2">
                <span className="font-heading text-2xl text-ink">$</span>
                <input
                  type="number"
                  min={10}
                  max={1000}
                  step={1}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount (10–1000)"
                  className="h-12 w-full rounded-none border-2 border-input bg-panel px-3 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px] flex-1 min-w-0"
                  autoFocus
                />
              </div>
            )}
          </Need>

          {/* Purchaser info */}
          <div className="border-t-2 border-dashed border-ink/25 pt-6">
            <p className="rx-label text-coral-deep mb-4">Your Info<Req /></p>
            <div className="flex flex-col gap-3">
              <Need className="flex flex-col" missing={miss(purchaserName)} note="Enter your name.">
<input
                type="text"
                value={purchaserName}
                onChange={(e) => setPurchaserName(e.target.value)}
                placeholder="Your name"
                className="h-12 w-full rounded-none border-2 border-input bg-panel px-3 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
              />
</Need>
              <Need className="flex flex-col" missing={miss(purchaserEmail)} note="Enter your email.">
<input
                type="email"
                value={purchaserEmail}
                onChange={(e) => setPurchaserEmail(e.target.value)}
                placeholder="Your email (we'll send you a receipt)"
                className="h-12 w-full rounded-none border-2 border-input bg-panel px-3 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
              />
</Need>
            </div>
          </div>

          {/* Send to recipient toggle */}
          <div className="border-t-2 border-dashed border-ink/25 pt-6">
            <label className="flex min-h-11 items-center gap-3 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={sendToRecipient}
                onChange={(e) => setSendToRecipient(e.target.checked)}
                className="h-5 w-5 shrink-0 accent-primary"
              />
              <span className="text-[15px] font-semibold text-ink">Send the gift card directly to someone else</span>
            </label>
            {sendToRecipient && (
              <div className="flex flex-col gap-3">
                <Need className="flex flex-col" missing={miss(recipientName)} note="Enter the recipient's name.">
<input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Recipient's name"
                  className="h-12 w-full rounded-none border-2 border-input bg-panel px-3 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
                />
</Need>
                <Need className="flex flex-col" missing={miss(recipientEmail)} note="Enter the recipient's email.">
<input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="Recipient's email"
                  className="h-12 w-full rounded-none border-2 border-input bg-panel px-3 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
                />
</Need>
                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Personal message (optional)"
                  rows={3}
                  className="h-12 w-full rounded-none border-2 border-input bg-panel px-3 text-base text-ink shadow-[inset_0_2px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px] h-auto py-2.5 resize-none"
                />
              </div>
            )}
          </div>

          {error && <p className="bg-rx-soft px-3 py-2 text-sm font-semibold text-destructive px-frame">{error}</p>}

          <div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="px-btn h-12 w-full text-base disabled:opacity-60"
          >
            {loading
              ? "Redirecting..."
              : effectiveAmountDollars
              ? `Purchase $${effectiveAmountDollars} Gift Card`
              : "Purchase Gift Card"
            }
          </button>
          <MissingNote show={showMissing && !isValid} />
          </div>

          <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
            <span>
            The gift card code will be emailed immediately after purchase.
            Gift cards never expire and can be used on any restoration order.
            </span>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
