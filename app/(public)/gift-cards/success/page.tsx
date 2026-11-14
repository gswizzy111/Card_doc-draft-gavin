import Link from "next/link";
import { PurchasePixel } from "@/components/purchase-pixel";
import { readCheckoutReturn } from "@/lib/checkout-return";
import { HealSparkles, PixelIcon, StatusChip, pixelButton } from "@/components/pixel";

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
        <div aria-hidden className="relative flex h-40 items-end justify-center overflow-hidden border-b-[3px] border-frame bg-mint/45 pb-5">
          <HealSparkles count={6} />
          <span className="relative grid size-24 place-items-center bg-rx-soft px-frame">
            <PixelIcon name="gift" size={64} />
          </span>
        </div>
        <div className="p-6 md:p-8">
          <StatusChip status="discharged" className="mb-5" />
          <h1 className="font-heading uppercase text-[2.5rem] md:text-5xl leading-[0.95] tracking-[0.01em] text-ink [text-shadow:3px_3px_0_var(--wall)] mb-4">Gift Card Purchased!</h1>
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
