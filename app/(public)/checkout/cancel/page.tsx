import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardSprite, DocSprite, StatusChip } from "@/components/pixel";

export default function CheckoutCancelPage() {
  return (
    <section className="page-glow flex-1 flex items-center justify-center py-16 md:py-24 px-4">
      <div className="max-w-lg w-full flex flex-col items-center gap-7 text-center">
        {/* Back in the waiting room: nothing was checked in */}
        <div aria-hidden className="flex items-end gap-5">
          <DocSprite scale={3} />
          <CardSprite variant="hurt" scale={3} />
        </div>
        <StatusChip status="check-in" className="-mt-2">WAITING ROOM</StatusChip>
        <h1 className="font-heading uppercase text-[2.75rem] md:text-6xl leading-[0.95] tracking-[0.01em] text-ink [text-shadow:3px_3px_0_var(--wall)]">
          Checkout cancelled.
        </h1>
        <div className="px-window px-dialog w-full p-5 pr-10 text-left">
          <p className="text-ink leading-relaxed">
            Your order wasn&apos;t placed and you weren&apos;t charged. Your
            selections are still saved if you&apos;d like to return.
          </p>
          <span aria-hidden className="px-dialog-next">▼</span>
        </div>
        <Button render={<Link href="/order" />} className="h-12 px-8 text-base">
          Return to Order Builder
        </Button>
      </div>
    </section>
  );
}
