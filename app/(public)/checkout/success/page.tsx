import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { OpenFileButton } from "@/components/open-file-button";
import { PurchasePixel } from "@/components/purchase-pixel";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { CHECKOUT_SESSION_COOKIE, CHECKOUT_SESSION_ID } from "@/lib/tracking-guard";
import { CardSprite, DocSprite, HealSparkles, PixelIcon, StatusChip, pixelButton } from "@/components/pixel";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  // Stripe adds ?session_id=; the first script on the page then takes it out
  // of the address (analytics must never see it) and keeps it in a cookie for
  // this page, so a reload still finds the order (lib/tracking-guard.ts)
  const fromUrl = (await searchParams).session_id;
  const candidate = fromUrl ?? (await cookies()).get(CHECKOUT_SESSION_COOKIE)?.value;
  const session_id = candidate && CHECKOUT_SESSION_ID.test(candidate) ? candidate : undefined;
  let order: {
    id: string;
    order_number: string | number;
    customer_email: string;
    inbound_method: string;
    shipping_label_url: string | null;
  } | null = null;
  let amountTotal: number | null = null;
  let currency = "usd";

  if (session_id) {
    const admin = createAdminClient();

    // Run Supabase lookup and Stripe session fetch in parallel
    const [bySessionResult, stripeResult] = await Promise.allSettled([
      admin
        .from("orders")
        .select("id, order_number, customer_email, inbound_method, shipping_label_url")
        .eq("stripe_session_id", session_id)
        .maybeSingle(),
      stripe.checkout.sessions.retrieve(session_id),
    ]);

    const bySession = bySessionResult.status === "fulfilled" ? bySessionResult.value.data : null;
    const stripeSession = stripeResult.status === "fulfilled" ? stripeResult.value : null;

    // Only a completed checkout is a purchase
    if (stripeSession?.status === "complete" && stripeSession.amount_total != null) {
      amountTotal = stripeSession.amount_total;
      currency = stripeSession.currency ?? "usd";
    }

    if (bySession) {
      order = bySession;
    } else if (stripeSession) {
      // Fallback: use order_id from Stripe metadata
      const orderId = stripeSession.metadata?.order_id;
      if (orderId) {
        const { data: byId } = await admin
          .from("orders")
          .select("id, order_number, customer_email, inbound_method, shipping_label_url")
          .eq("id", orderId)
          .maybeSingle();
        if (byId) order = byId;

        // Opportunistically save the stripe_session_id for future lookups
        if (byId) {
          await admin
            .from("orders")
            .update({ stripe_session_id: session_id })
            .eq("id", orderId)
            .is("stripe_session_id", null);
        }
      }
    }
  }

  return (
    <section className="page-glow flex-1 flex items-center justify-center min-h-[70vh] px-4 py-14 md:py-20">
      <PurchasePixel sessionId={session_id} amountCents={amountTotal} currency={currency} orderId={order?.id} />
      {/* Admitted: the order's chart is open at the front desk */}
      <div className="px-window w-full max-w-md p-0 md:p-0 text-center">
        <div aria-hidden className="relative flex h-40 items-end justify-center gap-5 overflow-hidden border-b-[3px] border-frame bg-mint/45 pb-5">
          <HealSparkles count={6} />
          <span className="relative"><DocSprite scale={3} /></span>
          <span className="relative"><CardSprite variant="healed" scale={3} /></span>
        </div>
        <div className="flex flex-col items-center gap-6 p-6 md:p-8">
          <StatusChip status="check-in">ADMITTED</StatusChip>
          <div>
            <h1 className="font-heading uppercase text-[2.5rem] md:text-5xl leading-[0.95] tracking-[0.01em] text-ink [text-shadow:3px_3px_0_var(--wall)] mb-3">Order Confirmed!</h1>
            {order?.order_number ? (
              <p className="text-ink-soft text-sm">
                Order <span className="inline-flex items-center bg-butter px-2 py-0.5 font-pixel text-xs text-ink px-frame">#{order.order_number}</span>
              </p>
            ) : (
              <p className="text-ink-soft text-sm">Your payment was received successfully.</p>
            )}
          </div>
          <p className="text-ink">
            Thank you! We&apos;ll send confirmation to your email with next steps.
          </p>

          {order?.inbound_method === "buy_label" && (
            <div className="w-full bg-[color-mix(in_srgb,var(--powder)_35%,var(--panel))] p-4 text-left px-frame">
              <p className="flex items-center gap-2 font-semibold text-ink text-sm mb-1.5">
                <PixelIcon name="box" size={16} />
                Your prepaid shipping label
              </p>
              {order.shipping_label_url ? (
                <>
                  <p className="text-ink-soft text-sm mb-4">
                    Print this label, attach it to your package, and drop it off at the carrier.
                  </p>
                  {/* A button, not a link: analytics runs on this page (components/open-file-button.tsx) */}
                  <OpenFileButton
                    url={order.shipping_label_url}
                    className={pixelButton({ tone: "powder", size: "sm", className: "cursor-pointer" })}
                  >
                    Download Label (PDF)
                  </OpenFileButton>
                </>
              ) : (
                <p className="text-ink-soft text-sm">
                  Your label is being generated — check your order tracking page in a moment.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            {order?.order_number && (
              <Button
                render={<Link href={`/orders/${order.order_number}`} />}
                className="h-12 text-base w-full"
              >
                Track Your Order
              </Button>
            )}
            <Button
              variant="outline"
              render={<Link href="/" />}
              className="h-12 text-base w-full"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
