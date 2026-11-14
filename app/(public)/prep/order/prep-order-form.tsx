"use client";

import { Check, Hammer, Mailbox, Package, X } from "lucide-react";
import { CardSprite, PixelIcon } from "@/components/pixel/sprites";
import { SigningSection, emptySigning, signingReady, slabSigned, submittedSigning, type SigningState, type SlabCard } from "@/components/checkout/signing-section";
import { SlabAuthorizationDialog } from "@/components/checkout/slab-authorization-dialog";
import { Need, Req, revealMissing } from "@/components/checkout/required";
import { CardIdentityFields, emptyIdentity, identityPayload, type CardIdentity } from "@/components/checkout/card-identity-fields";
import { InsuranceElectionBox, type InsuranceElection } from "@/components/checkout/insurance-election";
import { SIGN_BUTTON_LABEL, VALUE_HELP } from "@/lib/legal/current-terms";
import { useAccountPrefill } from "@/lib/use-account-prefill";
import { useState, useCallback } from "react";
import Link from "next/link";
import { PhotoUploader } from "@/components/order-builder/photo-uploader";
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";
import { US_STATES } from "@/lib/constants";
import { bulkDiscountCentsOf, bulkDiscountPercent } from "@/lib/bulk-pricing";

type CardRow = CardIdentity & {
  id: string;
  name: string;
  declaredValueDollars: string;
  photoUrls: string[];
  /** Open this card's graded holder ($7, needs its own signed authorization) */
  slab: boolean;
};

type ShippingRate = {
  id: string;
  carrier: string;
  service: string;
  amount_cents: number;
  estimated_days: number | null;
  duration_terms: string | null;
};

// Prep ships within the United States and Puerto Rico only (as restoration does)
const COUNTRY = "US";

const HIGH_VALUE_THRESHOLD_CENTS = 150000; // $1,500
const NJ_TAX_RATE = 0.06625;

function estimateInsuranceCents(declaredValueCents: number): number {
  if (declaredValueCents <= 0) return 0;
  return Math.max(100, Math.round(declaredValueCents * 0.015));
}

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function emptyCard(): CardRow {
  return { id: crypto.randomUUID(), name: "", declaredValueDollars: "", photoUrls: [], slab: false, ...emptyIdentity() };
}

function etaLabel(rate: ShippingRate): string {
  if (rate.estimated_days !== null) {
    return rate.estimated_days === 1 ? "1 business day" : `${rate.estimated_days} business days`;
  }
  return rate.duration_terms ?? "Delivery time varies";
}

interface PrepOrderFormProps {
  standardPriceCents: number;
  preGradePriceCents: number;
  slabCrackPriceCents: number;
}

export function PrepOrderForm({ standardPriceCents, preGradePriceCents, slabCrackPriceCents }: PrepOrderFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Pressed the sign button with something missing: outline it in red
  const [showMissing, setShowMissing] = useState(false);

  // Customer
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Cards
  const [cards, setCards] = useState<CardRow[]>([emptyCard()]);

  // Add-ons
  const [addPreGrade, setAddPreGrade] = useState(false);

  // The signatures and consents for the Terms of Service v1.0 (components/checkout/signing-section.tsx)
  const [signing, setSigning] = useState<SigningState>(emptySigning());
  // The card whose slab authorization pop-up is open
  const [slabDialogId, setSlabDialogId] = useState<string | null>(null);
  const [insuranceElection, setInsuranceElection] = useState<InsuranceElection>(null);

  // Shipping
  const [shippingMethod, setShippingMethod] = useState<"buy_label" | "self_ship">("buy_label");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [zip, setZip] = useState("");
  // Signed in: fill contact and address from the account (only empty fields)
  useAccountPrefill((p) => {
    setName((v) => v || p.name);
    setEmail((v) => v || p.email);
    setPhone((v) => v || p.phone);
    if (p.address) {
      const a = p.address;
      setStreet1((v) => v || a.street1);
      setStreet2((v) => v || a.street2);
      setCity((v) => v || a.city);
      setStateCode((v) => v || a.state);
      setZip((v) => v || a.zip);
    }
  });

  // Rate fetching
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState("");
  const [ratesFetchedFor, setRatesFetchedFor] = useState("");
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);

  // Insurance (only the prepaid label's trip to us can be insured through us)
  const [insuranceValueDollars, setInsuranceValueDollars] = useState("");

  const [notes, setNotes] = useState("");
  const [socialHandle, setSocialHandle] = useState("");

  function resetAddress() {
    setSelectedRate(null);
    setRates([]);
    setRatesFetchedFor("");
  }

  function addCard() { setCards((p) => [...p, emptyCard()]); }
  function removeCard(id: string) { setCards((p) => p.filter((c) => c.id !== id)); }
  function updateCardName(id: string, v: string) { setCards((p) => p.map((c) => c.id === id ? { ...c, name: v } : c)); }
  function updateCardValue(id: string, v: string) { setCards((p) => p.map((c) => c.id === id ? { ...c, declaredValueDollars: v } : c)); }
  function updateCardPhotos(id: string, urls: string[]) { setCards((p) => p.map((c) => c.id === id ? { ...c, photoUrls: urls } : c)); }
  function updateCard(id: string, patch: Partial<CardRow>) { setCards((p) => p.map((c) => c.id === id ? { ...c, ...patch } : c)); }

  const filledCards = cards.filter((c) => c.name.trim());
  const addInsurance = shippingMethod === "buy_label" && insuranceElection === "purchased";
  const slabCardOf = (c: CardRow): SlabCard => ({
    index: filledCards.indexOf(c),
    id: c.id,
    details: { card_name: c.name.trim(), ...identityPayload(c), declared_value_cents: cardValueCents(c) },
  });
  const slabCards: SlabCard[] = filledCards.flatMap((c) => (c.slab ? [slabCardOf(c)] : []));
  const slabDialogRow = cards.find((c) => c.id === slabDialogId);
  const slabDialogCard = slabDialogRow ? slabCardOf(slabDialogRow) : null;
  // Picking slab removal opens its authorization; closing it unsigned takes the slab off
  function closeSlabDialog(signed: boolean) {
    if (!signed && slabDialogId) updateCard(slabDialogId, { slab: false });
    setSlabDialogId(null);
  }
  const slabCrackCount = slabCards.length;

  function cardValueCents(card: CardRow): number {
    return Math.round((parseFloat(card.declaredValueDollars.replace(/[^0-9.]/g, "")) || 0) * 100);
  }

  function cardPrepCents(card: CardRow): number {
    const val = cardValueCents(card);
    if (val >= HIGH_VALUE_THRESHOLD_CENTS) return Math.round(val * 0.02);
    return standardPriceCents;
  }

  function cardPriceLabel(card: CardRow): string {
    const val = cardValueCents(card);
    if (val === 0) return fmt(standardPriceCents);
    if (val >= HIGH_VALUE_THRESHOLD_CENTS) return `${fmt(Math.round(val * 0.02))} (2%)`;
    return fmt(standardPriceCents);
  }

  const prepSubtotal = filledCards.reduce((sum, c) => sum + cardPrepCents(c), 0);
  const preGradeSubtotal = addPreGrade ? filledCards.length * preGradePriceCents : 0;
  const slabCrackSubtotal = slabCrackCount * slabCrackPriceCents;
  const serviceSubtotal = prepSubtotal + preGradeSubtotal + slabCrackSubtotal;
  // Bulk pricing, as the checkout charges it: 10+ cards 10% off, 20+ 15% off
  // the per-card prep price of every card, including cards $1,500 and over
  // (not the add-ons or shipping), taxed after the discount
  const bulkPercent = bulkDiscountPercent(filledCards.length);
  const bulkDiscountCents = bulkDiscountCentsOf(prepSubtotal, bulkPercent);
  const taxCents = Math.round((serviceSubtotal - bulkDiscountCents) * NJ_TAX_RATE);
  // The prepaid label pays the rate twice (to us and back); shipping your own
  // way pays it once, for the trip back to you
  const shippingTrips = shippingMethod === "buy_label" ? 2 : 1;
  const shippingCents = (selectedRate?.amount_cents ?? 0) * shippingTrips;
  const insuranceDeclaredValueCents = addInsurance ? Math.round((parseFloat(insuranceValueDollars) || 0) * 100) : 0;
  const estimatedInsuranceCents = estimateInsuranceCents(insuranceDeclaredValueCents);
  const totalEstimate = serviceSubtotal - bulkDiscountCents + taxCents + shippingCents + estimatedInsuranceCents;
  const totalDeclaredValueCents = filledCards.reduce((sum, c) => sum + cardValueCents(c), 0);

  // Rates are quoted per address and per method (to us, or back to you)
  const addressFingerprint = [shippingMethod, street1.trim(), street2.trim(), city.trim(), stateCode.trim(), zip.trim()].join("|");
  const addressComplete = !!(street1.trim() && city.trim() && zip.trim() && stateCode);
  const addressChangedSinceFetch = rates.length > 0 && ratesFetchedFor !== addressFingerprint;

  const fetchRates = useCallback(async () => {
    setRatesError("");
    setRatesLoading(true);
    setSelectedRate(null);
    const totalValueUsd = totalDeclaredValueCents > 0 ? totalDeclaredValueCents / 100 : filledCards.length * 25;
    try {
      // The prepaid label is quoted from the customer to us; self-ship's paid
      // return is quoted for the trip it pays for, from us to the customer.
      const res = shippingMethod === "self_ship"
        ? await fetch("/api/shipping/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to_address: {
              name: name.trim(), email: email.trim(), phone: phone.trim(), street1: street1.trim(), street2: street2.trim(),
              city: city.trim(), state: stateCode.trim(), zip: zip.trim(), country: COUNTRY,
            },
            parcel: { length: 6, width: 4, height: 2, weight: 8 },
            from_business: true,
          }),
        })
        : await fetch("/api/prep/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // The label's sender details (USPS requires an email on the from-address)
            name: name.trim() || undefined,
            email: email.trim() || undefined,
            phone: phone.trim() || undefined,
            street1: street1.trim(),
            street2: street2.trim() || undefined,
            city: city.trim(),
            state: stateCode.trim() || undefined,
            zip: zip.trim(),
            country: COUNTRY,
            card_count: Math.max(1, filledCards.length),
            total_value_usd: totalValueUsd,
          }),
        });
      const data = await res.json();
      const quoted: ShippingRate[] | null = !res.ok || !data.rates?.length
        ? null
        : shippingMethod === "self_ship"
          ? (data.rates as { object_id: string; carrier: string; service_level: string; amount_cents: number; days: number | null; duration_terms: string }[])
            .map((r) => ({ id: r.object_id, carrier: r.carrier, service: r.service_level, amount_cents: r.amount_cents, estimated_days: r.days, duration_terms: r.duration_terms || null }))
          : data.rates;
      if (!quoted) {
        setRatesError(data.error && shippingMethod !== "self_ship" ? data.error : "Could not fetch rates. Please try again.");
        setRates([]);
      } else {
        setRates(quoted);
        setRatesFetchedFor(addressFingerprint);
      }
    } catch {
      setRatesError("Network error fetching rates. Please try again.");
      setRates([]);
    } finally {
      setRatesLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [street1, street2, city, stateCode, zip, addressFingerprint, filledCards.length, totalDeclaredValueCents, shippingMethod]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    // Says what's wrong, outlines the missing fields in red and scrolls to the first
    const fail = (message: string) => {
      setError(message);
      setShowMissing(true);
      revealMissing();
    };

    // A ticked slab whose card changed after signing: its authorization pops up again
    const unsignedSlab = slabCards.find((c) => !slabSigned(signing, c));
    if (unsignedSlab) { setSlabDialogId(unsignedSlab.id ?? null); return; }
    if (filledCards.length < 1) { return fail("Please add at least one card."); }
    if (filledCards.some((c) => cardValueCents(c) <= 0)) { return fail("Please enter a declared value for every card."); }
    if (!name.trim()) { return fail("Name is required."); }
    if (!email.trim()) { return fail("Email is required."); }
    if (!phone.trim()) { return fail("Phone is required."); }
    // The cards come back to this address either way
    if (!street1.trim() || !city.trim() || !zip.trim()) {
      return fail(shippingMethod === "buy_label"
        ? "Full address is required to generate a prepaid label."
        : "Full address is required so we can ship your cards back.");
    }
    if (!stateCode) {
      return fail("State is required for US addresses.");
    }
    if (!selectedRate) {
      return fail("Please check shipping rates and select an option before continuing.");
    }

    if (insuranceElection === null) { return fail("Please choose whether to buy or decline shipping insurance."); }
    if (addInsurance && insuranceDeclaredValueCents <= 0) { return fail("Enter the amount to insure, or decline shipping insurance."); }
    if (!signingReady(signing, slabCards)) {
      return fail("Please check both boxes under Sign to confirm your order, and type your full legal name.");
    }

    setShowMissing(false);
    setSubmitting(true);
    try {
      const res = await fetch("/api/prep/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_email: email.trim(),
          customer_phone: phone.trim(),
          cards: filledCards.map((c) => ({
            card_name: c.name.trim(),
            ...identityPayload(c),
            declared_value_cents: cardValueCents(c),
            photo_urls: c.photoUrls,
            needs_slab_crack: c.slab || undefined,
          })),
          add_pre_grade: addPreGrade,
          insurance_election: insuranceElection,
          shipping_method: shippingMethod,
          country: COUNTRY,
          street1: street1.trim(),
          street2: street2.trim() || undefined,
          city: city.trim(),
          state: stateCode.trim() || undefined,
          zip: zip.trim(),
          shipping_rate_object_id: selectedRate?.id,
          shipping_amount_cents: shippingCents,
          ...(shippingMethod === "buy_label" ? {
            add_insurance: addInsurance,
            insurance_amount_cents: insuranceDeclaredValueCents,
          } : {}),
          social_handle: socialHandle.trim() || undefined,
          customer_notes: notes.trim() || undefined,
          ...submittedSigning(signing, slabCards),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      try { window.location.assign(data.url); } catch { setSubmitting(false); }
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  const input = "h-11 w-full border-2 border-ink bg-panel px-3 text-base text-ink shadow-[inset_0_3px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]";
  const labelCls = "mb-1.5 block font-pixel text-xs uppercase tracking-[0.04em] text-ink-soft";
  const selectCls = `${input} cursor-pointer`;

  const miss = (v: string | undefined | null) => showMissing && !v?.trim();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-16">
      <SlabAuthorizationDialog card={slabDialogCard} state={signing} onChange={setSigning} onClose={closeSlabDialog} />
      <div className="mb-8">
        <Link href="/prep" className="-ml-1 inline-flex min-h-11 items-center px-1 text-sm font-semibold text-coral-deep underline-offset-4 hover:underline">← Back to Prep Pricing</Link>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <p aria-hidden className="mb-3 inline-flex h-7 items-center gap-2 bg-butter px-2.5 font-pixel text-xs uppercase tracking-[0.04em] text-ink px-frame">
              <span className="text-coral-deep">▶</span>CHECK-IN
            </p>
            <h1 className="font-heading text-5xl uppercase leading-none tracking-[0.02em] text-ink [text-shadow:3px_3px_0_var(--wall)] md:text-6xl">Prep Order</h1>
          </div>
          <CardSprite variant="sleeve" scale={3} className="mb-1 shrink-0" />
        </div>
        <p className="mt-5 bg-panel px-4 py-3 text-sm text-ink-soft px-frame">
          Cards under $1,500: {fmt(standardPriceCents)}/card &nbsp;·&nbsp; Cards $1,500+: 2% of declared value
        </p>
      </div>

      {/* Not-included disclaimer */}
      <div className="mb-2 bg-rx-soft px-5 py-4 px-frame">
        <p className="mb-3 font-pixel text-xs uppercase tracking-[0.04em] text-coral-deep">Prep does not include:</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {["Crease work", "Edge & corner work", "Dent removal", "Any restorative work"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-ink">
              <span aria-hidden className="grid size-4 shrink-0 place-items-center bg-panel text-coral-deep px-frame">
                <X className="h-3 w-3" strokeWidth={3} />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink">
          Need restoration? <Link href="/tier-selection" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">See our Restoration tiers →</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">

        {/* Customer */}
        <div className="px-window-ink p-5 md:p-6 flex flex-col gap-4">
          <h2 className="font-heading text-[1.75rem] uppercase leading-none tracking-[0.02em] text-ink">Your Info</h2>
          <Need missing={miss(name)}>
            <label className={labelCls}>Full Name<Req /></label>
            <input className={input} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" />
          </Need>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
            <Need missing={miss(email)}>
              <label className={labelCls}>Email<Req /></label>
              <input className={input} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
            </Need>
            <Need missing={miss(phone)}>
              <label className={labelCls}>Phone<Req /></label>
              <input className={input} type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 555-5555" />
            </Need>
          </div>
        </div>

        {/* Cards */}
        <div className="px-window-ink p-5 md:p-6 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-[1.75rem] uppercase leading-none tracking-[0.02em] text-ink">Cards<Req /></h2>
              <p className="mt-1.5 text-xs text-ink-soft">Enter value for cards $1,500+</p>
            </div>
            <button type="button" onClick={addCard} className="px-btn px-btn-mint h-11 shrink-0 px-4 text-base">
              + Add Card
            </button>
          </div>

          {cards.map((card, i) => (
            <div key={card.id} className="flex flex-col gap-2.5 border-2 border-dashed border-ink/35 bg-[color-mix(in_srgb,var(--muted)_45%,var(--panel))] p-3 sm:p-4">
              <Need missing={showMissing && !card.name.trim() && (i === 0 || !!card.declaredValueDollars)} note="Enter the card name." className="">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center bg-butter font-pixel text-xs text-ink px-frame">{i + 1}.</span>
                <input
                  className={`${input} flex-1`}
                  value={card.name}
                  onChange={(e) => updateCardName(card.id, e.target.value)}
                  placeholder="Card name (e.g. Charizard Base Set Holo)"
                />
                {cards.length > 1 && (
                  <button type="button" onClick={() => removeCard(card.id)} aria-label="Remove card" className="grid size-11 shrink-0 place-items-center text-2xl leading-none text-red-700 hover:bg-red-50 focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-frame-deep">×</button>
                )}
              </div>
              </Need>
              <Need missing={showMissing && !!card.name.trim() && cardValueCents(card) <= 0} note="Enter a declared value." className="pl-9">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <input
                    className="h-11 w-full border-2 border-ink bg-panel px-3 text-base text-ink shadow-[inset_0_3px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px] pl-7"
                    type="number" min="0" step="1"
                    value={card.declaredValueDollars}
                    onChange={(e) => updateCardValue(card.id, e.target.value)}
                    placeholder="Declared value (required)"
                  />
                </div>
                {card.name.trim() && (
                  <span className={`shrink-0 w-24 text-right font-pixel text-xs ${cardValueCents(card) >= HIGH_VALUE_THRESHOLD_CENTS ? "text-amber-800" : "text-coral-deep"}`}>
                    {cardPriceLabel(card)}/card
                  </span>
                )}
              </div>
              </Need>
              <div className="pl-9 flex flex-col gap-2">
                <p className="text-xs text-ink-soft">{VALUE_HELP}</p>
              </div>
              <div className="pl-9">
                <CardIdentityFields idPrefix={`prep-${card.id}`} value={card} onChange={(patch) => updateCard(card.id, patch)} />
              </div>
              <label className="ml-9 flex cursor-pointer items-start gap-3 border-2 border-ink bg-panel px-3 py-3 hover:bg-[color-mix(in_srgb,var(--butter)_25%,var(--panel))]">
                <input
                  type="checkbox"
                  className="mt-0.5 size-5 shrink-0 accent-[var(--mint-deep)]"
                  checked={card.slab}
                  onChange={(e) => {
                    updateCard(card.id, { slab: e.target.checked });
                    // Its authorization pops up right away
                    if (e.target.checked) setSlabDialogId(card.id);
                  }}
                />
                <span className="text-sm">
                  <span className="font-semibold text-ink">Open this card&apos;s slab? +{fmt(slabCrackPriceCents)}</span>
                  <span className="block text-xs text-ink-soft mt-0.5">For a card in a PSA, BGS or other graded slab. You&apos;ll sign a separate authorization for it.</span>
                </span>
              </label>
              <div className="pl-9">
                <p className="mb-1.5 font-pixel text-xs uppercase tracking-[0.04em] text-ink-soft">Photos <span className="normal-case">(optional)</span></p>
                <PhotoUploader photoUrls={card.photoUrls} onChange={(urls) => updateCardPhotos(card.id, urls)} />
              </div>
            </div>
          ))}

          {filledCards.length > 0 && (
            <div className="mt-1 flex items-center justify-between border-t-[3px] border-ink pt-3">
              <span className="font-pixel text-xs uppercase tracking-[0.04em] text-ink-soft">{filledCards.length} card{filledCards.length !== 1 ? "s" : ""}</span>
              <span className="font-heading text-3xl leading-none text-ink tabular-nums">{fmt(prepSubtotal)}</span>
            </div>
          )}
          {/* Bulk discount (10+ cards), with the restoration review step's wording */}
          {bulkDiscountCents > 0 && (
            <div className="flex items-center gap-3 bg-rx-soft p-4 px-frame">
              <PixelIcon name="star" size={32} className="shrink-0" />
              <div>
                <p className="font-bold text-ink text-sm">{bulkPercent}% bulk discount applied!</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {filledCards.length} cards: {bulkPercent}% off the per-card price.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Add-ons */}
        <div className="px-window-ink p-5 md:p-6 flex flex-col gap-4">
          <h2 className="font-heading text-[1.75rem] uppercase leading-none tracking-[0.02em] text-ink">Add-Ons</h2>

          <button
            type="button"
            onClick={() => setAddPreGrade((v) => !v)}
            className={`flex w-full items-center gap-3 border-2 p-4 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-frame-deep ${addPreGrade ? "border-ink bg-[color-mix(in_srgb,var(--mint)_35%,var(--panel))] shadow-[inset_0_-4px_0_var(--mint)]" : "border-ink/30 bg-panel hover:border-ink"}`}
          >
            <div className={`flex size-6 shrink-0 items-center justify-center border-2 border-ink ${addPreGrade ? "bg-mint" : "bg-panel"}`}>
              {addPreGrade && <Check className="h-4 w-4 text-ink" strokeWidth={3} />}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-heading text-lg uppercase leading-none tracking-[0.02em] text-ink">Pre-Grade Assessment</span>
                <span className="font-pixel text-xs text-coral-deep">+{fmt(preGradePriceCents)}/card</span>
              </div>
              <p className="text-xs text-ink-soft mt-1">We estimate each card&apos;s grade before you submit — so you know what to expect.</p>
            </div>
            {addPreGrade && filledCards.length > 0 && (
              <span className="shrink-0 font-heading text-xl leading-none text-ink tabular-nums">{fmt(preGradeSubtotal)}</span>
            )}
          </button>

          {slabCrackCount > 0 && (
            <div className="flex items-center gap-3 border-2 border-ink bg-panel p-4">
              <Hammer className="h-5 w-5 shrink-0 text-coral-deep" strokeWidth={1.75} />
              <span className="text-sm text-ink">Slab removal: {slabCrackCount} × {fmt(slabCrackPriceCents)} = <span className="font-semibold">{fmt(slabCrackSubtotal)}</span></span>
            </div>
          )}
        </div>

        {/* Shipping */}
        <div className="px-window-ink p-5 md:p-6 flex flex-col gap-4">
          <h2 className="font-heading text-[1.75rem] uppercase leading-none tracking-[0.02em] text-ink">Shipping Your Cards To Us<Req /></h2>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { if (shippingMethod !== "buy_label") resetAddress(); setShippingMethod("buy_label"); }}
              className={`flex h-14 flex-col items-center justify-center gap-1 border-2 font-heading text-base uppercase tracking-[0.03em] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-frame-deep ${shippingMethod === "buy_label" ? "border-ink bg-butter text-ink shadow-[inset_0_-4px_0_#d4b552]" : "border-ink/30 bg-panel text-ink-soft hover:border-ink"}`}>
              <Package className="h-4 w-4" strokeWidth={1.75} />Prepaid Label
            </button>
            <button type="button" onClick={() => { if (shippingMethod !== "self_ship") resetAddress(); setShippingMethod("self_ship"); if (insuranceElection === "purchased") setInsuranceElection(null); }}
              className={`flex h-14 flex-col items-center justify-center gap-1 border-2 font-heading text-base uppercase tracking-[0.03em] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-frame-deep ${shippingMethod === "self_ship" ? "border-ink bg-butter text-ink shadow-[inset_0_-4px_0_#d4b552]" : "border-ink/30 bg-panel text-ink-soft hover:border-ink"}`}>
              <Mailbox className="h-4 w-4" strokeWidth={1.75} />Ship Myself
            </button>
          </div>

          {shippingMethod === "self_ship" && (
            <p className="text-xs text-ink-soft">After checkout you&apos;ll receive our mailing address. Ship using any tracked, insured method and include your order number inside the package.</p>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 border-t-2 border-dashed border-ink/25 pt-4">

              <div>
                <p className={labelCls}>Country</p>
                <p className="flex h-11 items-center border-2 border-ink/30 bg-muted px-3 text-sm text-ink-soft">
                  United States
                </p>
              </div>

              <Need missing={miss(street1)}>
                <label className={labelCls}>Street Address<Req /></label>
                <AddressAutocomplete
                  value={street1}
                  onChange={(v) => { setStreet1(v); setSelectedRate(null); }}
                  onPlaceSelect={(f) => { setStreet1(f.street1); setCity(f.city); setStateCode(f.state); setZip(f.zip); setSelectedRate(null); }}
                  className={input}
                  placeholder="123 Main St"
                />
              </Need>
              <div>
                <label className={labelCls}>Apt / Suite / Unit <span className="normal-case">(optional)</span></label>
                <input className={input} autoComplete="address-line2" value={street2} onChange={(e) => setStreet2(e.target.value)} placeholder="Apt 4B" />
              </div>

              {/* City / state / ZIP */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <Need missing={miss(city)} className="col-span-2">
                  <label className={labelCls}>City<Req /></label>
                  <input className={input} autoComplete="address-level2" value={city} onChange={(e) => { setCity(e.target.value); setSelectedRate(null); }} placeholder="New York" />
                </Need>
                <Need missing={miss(stateCode)}>
                  <label className={labelCls}>State<Req /></label>
                  <select className={selectCls} value={stateCode} onChange={(e) => { setStateCode(e.target.value); setSelectedRate(null); }}>
                    <option value="">—</option>
                    {US_STATES.map((s) => <option key={s.value} value={s.value}>{s.value}</option>)}
                  </select>
                </Need>
                <Need missing={miss(zip)} className="sm:col-span-2">
                  <label className={labelCls}>ZIP Code<Req /></label>
                  <input className={input} autoComplete="postal-code" value={zip} onChange={(e) => { setZip(e.target.value); setSelectedRate(null); }} placeholder="10001" maxLength={10} />
                </Need>
              </div>
            </div>

            {addressComplete && (
              <Need missing={showMissing && !selectedRate} note="Check shipping rates and choose an option." className="flex flex-col gap-3">
                {shippingMethod === "self_ship" ? (
                  <div className="border-2 border-frame bg-[color-mix(in_srgb,var(--powder)_35%,var(--panel))] px-4 py-3 text-xs leading-relaxed text-ink">
                    <strong>Return shipping is paid now.</strong> You send your cards to us your own way; we ship them back to this address with a tracked label.
                  </div>
                ) : (
                  <div className="border-2 border-frame bg-[color-mix(in_srgb,var(--powder)_35%,var(--panel))] px-4 py-3 text-xs leading-relaxed text-ink">
                    <strong>Shipping price covers both ways.</strong> You&apos;re paying for your label to send cards to us <em>and</em> the return shipment back to you — two labels, billed up front.
                  </div>
                )}

                {(rates.length === 0 || addressChangedSinceFetch) && !ratesLoading && (
                  <button type="button" onClick={fetchRates}
                    className="px-btn px-btn-powder h-12 w-full text-base">
                    {addressChangedSinceFetch ? "Refresh Shipping Rates" : "Check Shipping Rates"}
                  </button>
                )}

                {ratesLoading && (
                  <div className="flex items-center justify-center gap-2 py-4 text-sm text-ink-soft">
                    <span aria-hidden className="size-3 bg-coral-deep px-blink" />
                    Fetching rates…
                  </div>
                )}

                {ratesError && (
                  <div className="border-2 border-red-700 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{ratesError}</div>
                )}

                {rates.length > 0 && !addressChangedSinceFetch && (
                  <div className="flex flex-col gap-2">
                    <p className="font-pixel text-xs uppercase tracking-[0.04em] text-ink-soft">{shippingMethod === "self_ship" ? "Select a return shipping option:" : "Select a shipping option:"}</p>
                    {rates.map((rate) => (
                      <button key={rate.id} type="button" onClick={() => setSelectedRate(rate)}
                        className={`flex min-h-14 w-full items-center justify-between gap-3 border-2 px-4 py-3 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-frame-deep ${selectedRate?.id === rate.id ? "border-ink bg-[color-mix(in_srgb,var(--butter)_45%,var(--panel))]" : "border-ink/30 bg-panel hover:border-ink"}`}>
                        <div className="flex items-center gap-3">
                          <div className="flex size-5 shrink-0 items-center justify-center border-2 border-ink bg-panel">
                            {selectedRate?.id === rate.id && <div className="size-2.5 bg-coral-deep" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-ink">{rate.service}</p>
                            <p className="text-xs text-ink-soft">{etaLabel(rate)}</p>
                          </div>
                        </div>
                        <span className="shrink-0 font-heading text-xl leading-none text-ink tabular-nums">{fmt(rate.amount_cents * shippingTrips)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </Need>
            )}

          </div>
        </div>

        {/* Shipping insurance: a required choice, buy or decline (Terms 15.2, 15.4) */}
        <div className="px-window-ink p-5 md:p-6">
          <InsuranceElectionBox
            election={insuranceElection}
            onElection={(e) => {
              setInsuranceElection(e);
              if (e === "purchased" && insuranceValueDollars === "" && totalDeclaredValueCents > 0) {
                setInsuranceValueDollars((totalDeclaredValueCents / 100).toFixed(0));
              }
            }}
            purchaseAvailable={shippingMethod === "buy_label"}
            showMissing={showMissing}
            purchaseMissing={insuranceDeclaredValueCents <= 0}
            unavailableNote="Insurance through us covers our prepaid label's trip to us. Shipping it yourself, you can insure the package with your carrier."
          >
            <div>
              <label className={labelCls}>Amount to insure (USD)<Req /></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <input className={`${input} pl-7`} type="number" min="0" max="10000" step="1"
                  value={insuranceValueDollars} onChange={(e) => setInsuranceValueDollars(e.target.value)}
                  placeholder="Total value of cards in this shipment (USD)" />
              </div>
              <p className="text-xs text-ink-soft mt-1.5">
                Covers the trip to us. Price: {insuranceDeclaredValueCents > 0 ? fmt(estimatedInsuranceCents) : "~1.5% of the amount"}, included in your total.
              </p>
            </div>
          </InsuranceElectionBox>
        </div>

        {/* Feature suggestion */}
        <div className="px-window-ink flex flex-col gap-4 bg-rx-soft p-5 md:p-6">
          <div className="flex items-start gap-3">
            <span aria-hidden className="grid size-12 shrink-0 place-items-center bg-panel px-frame">
              <PixelIcon name="camera" size={32} />
            </span>
            <div>
              <p className="font-heading text-xl uppercase leading-tight tracking-[0.02em] text-ink">Want to be featured?</p>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                Drop your Instagram or Facebook handle. If you allow photos and tagging below, we may share your before &amp; after results and tag you.
              </p>
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft text-sm font-semibold">@</span>
            <input
              className="h-11 w-full border-2 border-ink bg-panel px-3 text-base text-ink shadow-[inset_0_3px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px] pl-7"
              value={socialHandle}
              onChange={(e) => setSocialHandle(e.target.value.replace(/^@/, ""))}
              placeholder="yourhandle  (optional)"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="px-window-ink p-5 md:p-6 flex flex-col gap-2">
          <label className="font-heading text-[1.75rem] uppercase leading-none tracking-[0.02em] text-ink">
            Notes <span className="font-sans text-sm normal-case tracking-normal text-ink-soft">(optional)</span>
          </label>
          <textarea
            className="w-full resize-none border-2 border-ink bg-panel px-3 py-2.5 text-base text-ink shadow-[inset_0_3px_0_var(--muted)] outline-none placeholder:text-muted-foreground focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 md:text-[15px]"
            value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            placeholder="Special instructions, condition notes, etc." />
        </div>

        {/* Order Summary */}
        <div className="px-window p-5 md:p-6">
          <h2 className="font-heading text-[1.75rem] uppercase leading-none tracking-[0.02em] text-ink mb-4">Order Summary</h2>
          <div className="flex flex-col gap-1.5 text-sm">
            {filledCards.length > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prep ({filledCards.length} card{filledCards.length !== 1 ? "s" : ""})</span>
                <span className="font-semibold">{fmt(prepSubtotal)}</span>
              </div>
            )}
            {bulkDiscountCents > 0 && (
              <div className="flex justify-between text-green-700 font-semibold">
                <span>Bulk discount ({bulkPercent}% off, {filledCards.length} cards)</span>
                <span>−{fmt(bulkDiscountCents)}</span>
              </div>
            )}
            {addPreGrade && filledCards.length > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pre-Grade Assessment × {filledCards.length}</span>
                <span className="font-semibold">{fmt(preGradeSubtotal)}</span>
              </div>
            )}
            {slabCrackCount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slab Crack × {slabCrackCount}</span>
                <span className="font-semibold">{fmt(slabCrackSubtotal)}</span>
              </div>
            )}
            {taxCents > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">NJ Sales Tax (6.625%)</span>
                <span className="font-semibold">{fmt(taxCents)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">{shippingMethod === "buy_label" ? "Shipping (inbound + return)" : "Return shipping"}</span>
              {selectedRate
                ? <span className="font-semibold">{fmt(shippingCents)}</span>
                : <span className="text-xs font-semibold text-muted-foreground">select above</span>}
            </div>
            {addInsurance && insuranceDeclaredValueCents > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipment Insurance (~1.5% of value)</span>
                <span className="font-semibold">{fmt(estimatedInsuranceCents)}</span>
              </div>
            )}
            <div className="mt-2 flex items-baseline justify-between border-t-[3px] border-ink pt-3">
              <span className="font-heading text-xl uppercase leading-none tracking-[0.02em] text-ink">
                {!selectedRate ? "Subtotal" : "Total"}
              </span>
              <span className="font-heading text-3xl leading-none text-ink tabular-nums">{totalEstimate > 0 ? fmt(totalEstimate) : "—"}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {!selectedRate
                ? "* Select a shipping option above to see your full total."
                : "* Includes NJ sales tax. Confirmed at Stripe checkout."}
            </p>
          </div>
        </div>

        <div className="px-window-ink p-5 md:p-6">
          <SigningSection
            state={signing}
            onChange={setSigning}
            showMissing={showMissing}
          />
        </div>

        {error && (
          <div className="border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 px-frame">{error}</div>
        )}

        <button type="submit" disabled={submitting}
          className="px-btn h-14 w-full whitespace-normal px-4 text-lg disabled:opacity-60">
          {submitting ? "Redirecting to checkout…" : SIGN_BUTTON_LABEL}
        </button>
      </form>
    </div>
  );
}
