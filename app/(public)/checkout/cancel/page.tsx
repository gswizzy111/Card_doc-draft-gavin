import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardSprite } from "@/components/pixel";

export default function CheckoutCancelPage() {
  return (
    <section className="page-glow flex-1 flex items-center justify-center py-16 md:py-24 px-4">
      <div className="max-w-lg w-full flex flex-col items-center gap-7 text-center">
        {/* Back in the waiting room: nothing was checked in */}
        <div aria-hidden>
          <CardSprite variant="hurt" scale={3} animate={false} />
        </div>
        <h1 className="font-heading text-[2.5rem] md:text-5xl leading-tight text-ink">
          Checkout cancelled.
        </h1>
        <p className="max-w-md text-ink-soft leading-relaxed">
          Your order wasn&apos;t placed and you weren&apos;t charged. Your
          selections are still saved if you&apos;d like to return.
        </p>
        <Button render={<Link href="/order" />} className="h-12 px-8 text-base">
          Return to Order Builder
        </Button>
      </div>
    </section>
  );
}
