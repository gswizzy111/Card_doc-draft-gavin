"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusChip, type ClinicStatus } from "@/components/pixel/status-chip";
import { HpBar } from "@/components/pixel/hp-bar";
import { CardSprite, DocSprite, PixelIcon } from "@/components/pixel/sprites";

// The status board beside the form: the four clinic stations (decorative).
const BOARD: { status: ClinicStatus; level: number; art: React.ReactNode }[] = [
  { status: "check-in", level: 0.15, art: <CardSprite variant="hurt" scale={2} animate={false} /> },
  { status: "triage", level: 0.4, art: <PixelIcon name="magnifier" size={32} /> },
  { status: "treatment", level: 0.7, art: <PixelIcon name="brush" size={32} /> },
  { status: "discharged", level: 1, art: <CardSprite variant="healed" scale={2} /> },
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
    <section className="page-glow flex-1 px-4 py-12 md:px-10 md:py-20">
      <div className="mx-auto grid w-full max-w-5xl items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14">
        {/* The front desk: look up a patient's chart */}
        <div className="min-w-0">
          <p aria-hidden className="mb-5 inline-flex h-8 items-center gap-2 bg-butter px-3 font-pixel text-xs uppercase tracking-[0.04em] text-ink px-frame">
            <span className="text-coral-deep">▶</span>PATIENT LOOKUP
          </p>
          <h1 className="font-heading uppercase tracking-[0.01em] leading-[0.95] text-[clamp(2.5rem,11vw,4.5rem)] text-ink [text-shadow:3px_3px_0_var(--wall)] mb-6">
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
                  className="h-12 font-pixel tracking-[0.04em] md:text-[15px]"
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

        {/* The ward's status board (decorative): where a chart can stand */}
        <aside aria-hidden className="px-window-night p-5 md:p-6 lg:mt-[8.25rem]">
          <div className="mb-5 flex items-center justify-between gap-3 border-b-2 border-dashed border-stage-muted/40 pb-4">
            <span className="font-pixel text-xs uppercase tracking-[0.04em] text-butter">STATUS BOARD</span>
            <span className="flex gap-1.5">
              <span className="size-2 bg-mint px-blink" />
              <span className="size-2 bg-stage-muted/50" />
            </span>
          </div>
          <ol className="flex flex-col gap-4">
            {BOARD.map((b) => (
              <li key={b.status} className="flex items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center bg-panel px-frame">{b.art}</span>
                <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                  <StatusChip status={b.status} className="self-start" />
                  <HpBar level={b.level} className="[&>span:first-child]:text-stage-fg" />
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-end justify-between gap-3 border-t-2 border-dashed border-stage-muted/40 pt-5">
            <DocSprite scale={2} />
            <span className="font-pixel text-xs uppercase tracking-[0.04em] text-stage-muted px-blink">NEXT ▼</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
