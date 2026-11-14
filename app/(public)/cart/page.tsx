"use client";

import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { pixelButton } from "@/components/pixel/pixel-button";
import { Window } from "@/components/pixel/window";
import { PixelIcon } from "@/components/pixel/sprites";
import { Trash2, Plus, Minus } from "lucide-react";

const TAX_RATE = 0.06625;

export default function CartPage() {
  const { items, totalCents, removeItem, updateQty } = useCart();
  const taxCents = Math.round(totalCents * TAX_RATE);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center md:py-28">
        {/* An empty item bag */}
        <div aria-hidden className="mb-8">
          <PixelIcon name="cart" size={48} />
        </div>
        <h1 className="mb-3 font-heading text-4xl leading-tight text-ink">Your cart is empty</h1>
        <p className="mb-7 text-[15px] text-ink-soft">Browse the shop to add products.</p>
        <Link href="/shop" className={pixelButton({ size: "md", className: "px-8" })}>Browse Shop</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-10 md:py-16">
      <div className="mb-10">
        <h1 className="font-heading text-[2.5rem] leading-tight text-ink md:text-5xl">Your Cart</h1>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Items: the bag's slots */}
        <Window className="self-start p-0 md:p-0 lg:col-span-2">
          <ul className="divide-y-2 divide-rule">
          {items.map((item) => (
            <li key={item.id} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 p-4 sm:flex sm:gap-5 sm:p-5">
              <div className="row-span-2 size-[4.5rem] shrink-0 self-start overflow-hidden bg-muted p-[2px] px-frame sm:self-auto">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div aria-hidden className="grid h-full w-full place-items-center px-dither">
                    <PixelIcon name="box" size={32} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-lg leading-tight text-ink">{item.name}</p>
                {item.size && (
                  <p className="mt-0.5 text-sm text-ink-soft">Size: {item.size}</p>
                )}
                <p className="mt-1 font-pixel text-xs tabular-nums text-ink-soft">{formatCurrency(item.price_cents)}</p>
              </div>
              {/* Phones: quantity and total share a line under the name; from sm the row is one line */}
              <div className="col-start-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:contents">
                <div className="flex items-center">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    aria-label={`Decrease quantity of ${item.name}`}
                    className={pixelButton({ tone: "panel", size: "sm", className: "size-11 px-0" })}
                  >
                    <Minus className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                  <span className="grid h-11 w-10 place-items-center font-heading text-xl tabular-nums text-ink">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                    className={pixelButton({ tone: "panel", size: "sm", className: "size-11 px-0" })}
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="w-20 text-right font-heading text-xl tabular-nums text-ink">
                    {formatCurrency(item.price_cents * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="grid size-11 place-items-center text-ink-soft hover:bg-rx-soft hover:text-coral-deep focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </li>
          ))}
          </ul>
        </Window>

        {/* Summary: the receipt */}
        <div className="lg:col-span-1">
          <Window className="sticky top-24">
            <h2 className="mb-5 font-heading text-2xl text-ink">Order Summary</h2>
            <div className="mb-6 flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between gap-3 text-ink-soft">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatCurrency(totalCents)}</span>
              </div>
              <div className="flex justify-between gap-3 text-ink-soft">
                <span>Sales Tax (6.625%)</span>
                <span className="tabular-nums">{formatCurrency(taxCents)}</span>
              </div>
              <div className="flex justify-between gap-3 text-ink-soft">
                <span>Shipping</span>
                <span className="text-right">Calculated at checkout</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between border-t-2 border-dashed border-ink/40 pt-3 font-heading text-2xl text-ink">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(totalCents + taxCents)}</span>
              </div>
            </div>
            <Link href="/cart/upsell" className={pixelButton({ size: "md", className: "w-full" })}>
              Checkout — US Shipping
            </Link>
            <Link href="/cart/upsell?international=true" className={pixelButton({ tone: "panel", size: "md", className: "mt-3 w-full" })}>
              International Shipping
            </Link>
            <Link href="/shop" className="mt-3 flex min-h-11 items-center justify-center text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline">
              Continue shopping
            </Link>
          </Window>
        </div>
      </div>
    </div>
  );
}
