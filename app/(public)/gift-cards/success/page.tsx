import Link from "next/link";
import { PurchasePixel } from "@/components/purchase-pixel";
import { readCheckoutReturn } from "@/lib/checkout-return";
import { HealSparkles, PixelIcon, pixelButton } from "@/components/pixel";

export default async function GiftCardSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  // Stripe's ?session_id=, for the Meta Purchase event (lib/checkout-return.ts)
  const { sessionId, amountCents, currency } = await readCheckoutReturn(
    (await searchParams).session_id,
    "Gift card success page",
  );
  return (
    <div className="min-h-screen page-glow flex items-center justify-center px-4 py-14 md:py-20">
      <PurchasePixel sessionId={sessionId} amountCents={amountCents} currency={currency} />
      {/* The gift shop's discharge screen */}
      <div className="px-window w-full max-w-md p-0 md:p-0 text-center">
        <div aria-hidden className="relative flex h-32 items-end justify-center overflow-hidden border-b-2 border-frame/30 bg-[color-mix(in_srgb,var(--mint)_35%,var(--panel))] pb-5">
          <HealSparkles />
          <span className="relative"><PixelIcon name="gift" size={48} /></span>
        </div>
        <div className="p-6 md:p-8">
          <h1 className="font-heading text-[2.5rem] md:text-5xl leading-tight text-ink mb-4">Gift Card Purchased!</h1>
          <p className="text-ink-soft mb-8">
            The gift card code has been emailed. It can be applied at checkout on any restoration order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/gift-cards" className={pixelButton({ size: "md" })}>
              Buy Another
            </Link>
            <Link href="/" className={pixelButton({ tone: "panel", size: "md" })}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
