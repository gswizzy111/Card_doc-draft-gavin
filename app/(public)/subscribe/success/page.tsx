import Link from "next/link";
import { PurchasePixel } from "@/components/purchase-pixel";
import { readCheckoutReturn } from "@/lib/checkout-return";
import { getSubscriptionPriceCents } from "@/lib/store-config";
import { formatCurrency } from "@/lib/utils";
import { HealSparkles, PixelIcon, StatusChip, pixelButton } from "@/components/pixel";

export const dynamic = "force-dynamic";

export default async function SubscribeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  // Stripe's ?session_id=, for the Meta Purchase event (lib/checkout-return.ts)
  const [priceCents, purchase] = await Promise.all([
    getSubscriptionPriceCents(),
    searchParams.then((p) => readCheckoutReturn(p.session_id, "Kit Club success page")),
  ]);
  return (
    <div className="min-h-screen page-glow flex items-center justify-center px-4 py-14 md:py-20">
      <PurchasePixel sessionId={purchase.sessionId} amountCents={purchase.amountCents} currency={purchase.currency} />
      {/* The pharmacy's refill slip: filled */}
      <div className="px-window w-full max-w-md p-0 md:p-0 text-center">
        <div aria-hidden className="relative flex h-40 items-end justify-center overflow-hidden border-b-[3px] border-frame bg-mint/45 pb-5">
          <HealSparkles count={6} />
          <span className="relative grid size-24 place-items-center bg-butter px-frame">
            <PixelIcon name="kit" size={64} />
          </span>
        </div>
        <div className="p-6 md:p-8">
          <StatusChip status="discharged" className="mb-5" />
          <h1 className="font-heading uppercase text-[2.5rem] md:text-5xl leading-[0.95] tracking-[0.01em] text-ink [text-shadow:3px_3px_0_var(--wall)] mb-4">
            You&rsquo;re subscribed!
          </h1>
          <p className="text-ink-soft text-base mb-8">
            Your first kit will ship within 1-2 business days. You&rsquo;ll be billed {formatCurrency(priceCents)} on the
            same day each month.
          </p>
          <Link href="/" className={pixelButton({ size: "md", className: "w-full sm:w-auto" })}>
            Back to home
          </Link>
          <p className="text-sm text-ink-soft mt-7 border-t-2 border-dashed border-ink/20 pt-5">
            Need to cancel?{" "}
            <Link href="/subscribe/manage" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">
              Manage your subscription
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
