import Link from "next/link";
import { PixelIcon, SparkleSprite, StatusChip, Window, pixelButton } from "@/components/pixel";
import { ClearCartAfterPayment } from "@/components/clear-cart-after-payment";
import { PurchasePixel } from "@/components/purchase-pixel";
import { readCheckoutReturn } from "@/lib/checkout-return";

export default async function ShopOrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  // Stripe adds ?session_id=; the first script on the page takes it out of
  // the address before analytics run (lib/tracking-guard.ts). It is read here
  // for the purchase amount and to empty the cart; a reload has none, so
  // neither happens twice.
  // Stripe only returns here after a payment; `complete` is null when the lookup failed
  const { sessionId, amountCents, currency, complete } = await readCheckoutReturn(
    (await searchParams).session_id,
    "Kit order page",
  );

  return (
    <section className="flex min-h-[70vh] flex-1 items-center justify-center px-4 py-16">
      <PurchasePixel sessionId={sessionId} amountCents={amountCents} currency={currency} />
      <ClearCartAfterPayment paid={!!sessionId && complete !== false} />
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        {/* Discharged: the parcel leaves the pharmacy */}
        <div aria-hidden className="relative grid size-32 place-items-center bg-mint px-frame-shadow">
          <span className="absolute inset-2 px-dither opacity-60" />
          <span className="relative"><PixelIcon name="box" size={64} /></span>
          <span className="absolute -top-3 -right-3"><SparkleSprite scale={3} /></span>
          <span className="absolute -bottom-2 -left-3"><SparkleSprite scale={2} delay={0.36} /></span>
        </div>
        <StatusChip status="discharged" />
        <Window variant="dialog" className="w-full px-6 py-7">
          <h1 className="mb-3 font-heading text-[2.75rem] uppercase leading-none tracking-[0.01em] text-ink md:text-5xl">Order Confirmed!</h1>
          <p className="text-[15px] leading-relaxed text-ink-soft">Thanks for your order. We&apos;ll ship it out shortly and send you a tracking number.</p>
        </Window>
        <div className="flex w-full flex-col gap-3">
          <Link href="/shop" className={pixelButton({ size: "md", className: "w-full" })}>Continue Shopping</Link>
          <Link href="/" className={pixelButton({ tone: "panel", size: "md", className: "w-full" })}>Back to Home</Link>
        </div>
      </div>
    </section>
  );
}
