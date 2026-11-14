import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OrderBuilder } from "@/components/order-builder/builder";
import { isSoldOut, TIER_SELECTION_ENABLED } from "@/lib/site-config";
import { getRestorationsOpen } from "@/lib/store-config";
import type { RestorationTierId } from "@/lib/restoration-tiers";
import { CardSprite, DocSprite, Window } from "@/components/pixel";
import { PixelViewContent } from "@/components/pixel-view-content";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = "force-dynamic";

export default async function RestorationPage({ searchParams }: PageProps) {
  // Master toggle — if restorations are closed, redirect to tier-selection (shows prices + waitlist)
  const restorationsOpen = await getRestorationsOpen();
  if (!restorationsOpen) {
    redirect("/tier-selection");
  }

  // Get tier from query params
  const params = await searchParams;
  const tierParam = params.tier as string | undefined;

  // If tier selection is enabled and no tier selected, redirect to tier selection page
  if (TIER_SELECTION_ENABLED && !tierParam) {
    redirect("/tier-selection");
  }

  if (isSoldOut()) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center md:py-28">
        <div aria-hidden className="mb-6 flex items-end gap-4">
          <DocSprite scale={3} />
          <CardSprite variant="hurt" scale={3} />
        </div>
        <Window variant="dialog" title="Front desk" className="w-full pb-8 md:pb-9">
          <p className="rx-label text-coral-deep mb-3">Restoration Services</p>
          <h1 className="font-heading text-4xl uppercase leading-none tracking-[0.02em] text-ink mb-4 md:text-5xl">Currently Unavailable</h1>
          <p className="text-ink-soft leading-relaxed">We&apos;re at capacity right now. Check back soon — we&apos;ll be accepting new restoration orders again shortly.</p>
        </Window>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, name, short_description, full_description, price_cents, turnaround_days, display_order, active")
    .eq("active", true)
    .order("display_order");

  return (
    <Suspense>
      <PixelViewContent contentName="Restoration Order" contentCategory="Restoration" />
      <OrderBuilder services={services ?? []} selectedTier={tierParam as RestorationTierId | undefined} />
    </Suspense>
  );
}
