"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusChip, type ClinicStatus } from "@/components/pixel/status-chip";
import { HpBar } from "@/components/pixel/hp-bar";
import { CardSprite, PixelIcon } from "@/components/pixel/sprites";

// Beside the form: the four clinic stations an order passes through.
const BOARD: { status: ClinicStatus; level: number; art: React.ReactNode }[] = [
  { status: "check-in", level: 0.15, art: <CardSprite variant="hurt" scale={1} animate={false} /> },
  { status: "triage", level: 0.4, art: <PixelIcon name="magnifier" size={24} /> },
  { status: "treatment", level: 0.7, art: <PixelIcon name="brush" size={24} /> },
  { status: "discharged", level: 1, art: <CardSprite variant="healed" scale={1} animate={false} /> },
];

export function TrackForm({ initialOrder = "" }: { initialOrder?: string }) {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) {
      toast.error("Please enter both your order number and email.");
      return;
    }
    setLoading(true);
    router.push(
      `/orders/${orderNumber.trim().toUpperCase()}?email=${encodeURIComponent(email.trim())}`
    );
  }

  return (
    <section className="flex-1 px-4 py-14 md:px-10 md:py-24">
      <div className="mx-auto grid w-full max-w-5xl items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14">
        {/* Look up an order */}
        <div className="min-w-0">
          <h1 className="font-heading font-bold tracking-[-0.03em] leading-[1.05] text-[clamp(2.25rem,9vw,3.5rem)] text-ink mb-6">
            Track your order.
          </h1>

          <div className="px-window-ink p-5 pt-6 md:p-7">
            <p className="text-ink-soft mb-6">
              Enter your order number and email to view status.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  placeholder="R1042 or K5"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  autoComplete="off"
                  className="h-12 md:text-[15px]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base mt-2"
                disabled={loading}
              >
                {loading ? "Looking up..." : "View Order"}
              </Button>
            </form>
          </div>
        </div>

        {/* The four stations an order moves through (decorative) */}
        <aside aria-hidden className="border-t-2 border-tile lg:mt-[5.75rem]">
          <ol className="divide-y-2 divide-tile">
            {BOARD.map((b) => (
              <li key={b.status} className="flex items-center gap-4 py-4">
                <span className="grid size-10 shrink-0 place-items-center bg-panel">{b.art}</span>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                  <StatusChip status={b.status} />
                  <HpBar level={b.level} label={null} className="w-24 sm:w-32" />
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}
