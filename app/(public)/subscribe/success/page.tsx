import Link from "next/link";
import { PurchasePixel } from "@/components/purchase-pixel";
import { readCheckoutReturn } from "@/lib/checkout-return";
import { getSubscriptionPriceCents } from "@/lib/store-config";
import { formatCurrency } from "@/lib/utils";
import { HealSparkles, PixelIcon, pixelButton } from "@/components/pixel";

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
        <div aria-hidden className="relative flex h-32 items-end justify-center overflow-hidden border-b-2 border-frame/30 bg-[color-mix(in_srgb,var(--mint)_35%,var(--panel))] pb-5">
          <HealSparkles />
          <span className="relative"><PixelIcon name="kit" size={48} /></span>
        </div>
        <div className="p-6 md:p-8">
          <h1 className="font-heading text-[2.5rem] md:text-5xl leading-tight text-ink mb-4">
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
