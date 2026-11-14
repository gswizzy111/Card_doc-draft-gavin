"use client";

import { useEffect, useState, Suspense } from "react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { pixelButton } from "@/components/pixel/pixel-button";
import { DocSprite } from "@/components/pixel/sprites";
import { WindowTab } from "@/components/pixel/window";

const SIZES = ["Small", "Medium", "Large", "XL"] as const;

type UpsellProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  images: string[];
  inventory_count: number;
};

function UpsellInner() {
  const { items, totalCents, addItem } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInternational = searchParams.get("international") === "true";
  const destination = isInternational ? "/cart/checkout?international=true" : "/cart/checkout";

  const [products, setProducts] = useState<UpsellProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [sizes, setSizes] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/shop/upsell-products")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products ?? []);
        setLoading(false);
        if (!d.products?.length) router.replace(destination);
      })
      .catch(() => {
        setLoading(false);
        router.replace(destination);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAdd(product: UpsellProduct) {
    const isGlove = product.name.toLowerCase().includes("glove");
    const size = sizes[product.id];
    if (isGlove && !size) return;
    addItem({
      id: isGlove && size ? `${product.id}-${size}` : product.id,
      name: product.name,
      slug: product.slug,
      price_cents: product.price_cents,
      image: product.images?.[0] ?? undefined,
      size: isGlove && size ? size : undefined,
    });
    setAdded((prev) => ({ ...prev, [product.id]: true }));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <DocSprite scale={3} label="Loading" />
      </div>
    );
  }

  const cartIds = new Set(items.map((i) => i.id));

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-10 md:py-16">

        {/* Header */}
        <div className="mb-10 md:mb-12">
          <p className="mb-5 inline-flex h-8 items-center gap-2 bg-butter px-3 font-pixel text-xs uppercase tracking-[0.04em] text-ink px-frame">
            <span aria-hidden className="text-coral-deep">▶</span>
            Pre-Checkout
          </p>
          <h1 className="font-heading text-[2.5rem] uppercase leading-[0.95] tracking-[0.01em] text-ink [text-shadow:3px_3px_0_var(--wall)] md:text-6xl">Want to add anything else?</h1>
          <div className="mt-6 flex max-w-xl items-end gap-3">
            <span aria-hidden className="mb-1 shrink-0"><DocSprite scale={2} /></span>
            <div className="px-window px-dialog flex-1 p-4 pr-9">
              <p className="text-[15px] leading-relaxed text-ink">These pair great with your order.</p>
              <span aria-hidden className="px-dialog-next">▼</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left — upsell products */}
          <div className="flex w-full flex-1 flex-col gap-6">
            {products.map((product) => {
              const isGlove = product.name.toLowerCase().includes("glove");
              const selectedSize = sizes[product.id];
              const inCart = cartIds.has(product.id) || added[product.id];
              return (
                <div
                  key={product.id}
                  className={`px-window-ink flex flex-wrap items-start gap-4 p-4 sm:flex-nowrap sm:p-5 ${
                    inCart ? "bg-[#e6f4ea]" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="size-20 shrink-0 overflow-hidden bg-muted p-[3px] px-frame">
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div aria-hidden className="h-full w-full px-dither" />
                    )}
                  </div>

                  {/* Info + size */}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-xl uppercase leading-tight tracking-[0.02em] text-ink">{product.name}</p>
                    {product.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{product.description}</p>
                    )}
                    <p className="mt-2 inline-flex h-7 items-center gap-2 bg-butter pr-2 pl-1.5 font-heading text-lg leading-none tabular-nums text-ink px-frame">
                      <span aria-hidden className="size-1.5 bg-ink" />
                      {formatCurrency(product.price_cents)}
                    </p>

                    {isGlove && !inCart && (
                      <div className="mt-3">
                        <p className="mb-2.5 font-pixel text-xs uppercase tracking-[0.04em] text-ink">Select Size</p>
                        <div className="flex flex-wrap gap-2.5">
                          {SIZES.map((s) => (
                            <button
                              key={s}
                              onClick={() => setSizes((prev) => ({ ...prev, [product.id]: s }))}
                              aria-pressed={selectedSize === s}
                              className={pixelButton({
                                tone: selectedSize === s ? "ink" : "panel",
                                size: "sm",
                                className: "h-11 min-w-14 text-base normal-case",
                              })}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        {!selectedSize && (
                          <p className="mt-2 text-sm text-ink-soft">Select a size to add.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Add button */}
                  <div className="w-full shrink-0 sm:w-auto sm:pt-1">
                    {inCart ? (
                      <span className="inline-flex h-9 items-center gap-1.5 bg-mint px-2.5 font-pixel text-xs uppercase tracking-[0.04em] text-ink px-frame">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Added
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAdd(product)}
                        disabled={isGlove && !selectedSize}
                        className={pixelButton({ size: "sm", className: "h-11 w-full disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto" })}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right — order summary + continue */}
          <div className="w-full shrink-0 lg:sticky lg:top-24 lg:w-80">
            <div className="px-window mt-4 p-6">
              <WindowTab aria-hidden cursor>BAG</WindowTab>
              <h2 className="mb-4 font-heading text-2xl uppercase tracking-[0.02em] text-ink">Your Cart</h2>
              <div className="flex flex-col gap-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="mr-2 truncate text-ink-soft">{item.name} × {item.quantity}</span>
                    <span className="shrink-0 font-medium tabular-nums">{formatCurrency(item.price_cents * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm">
                  <span className="text-ink-soft">Sales Tax (6.625%)</span>
                  <span className="font-medium tabular-nums">{formatCurrency(Math.round(totalCents * 0.06625))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-soft">Shipping</span>
                  <span className="text-ink-soft">At checkout</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between border-t-[3px] border-dashed border-ink/40 pt-3 font-heading text-2xl uppercase text-ink">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCurrency(totalCents + Math.round(totalCents * 0.06625))}</span>
                </div>
              </div>

              <button
                onClick={() => router.push(destination)}
                className={pixelButton({ size: "md", className: "w-full" })}
              >
                Continue to Checkout →
              </button>
              <button
                onClick={() => router.back()}
                className="mt-2 flex min-h-11 w-full items-center justify-center text-sm text-ink-soft hover:text-ink hover:underline"
              >
                ← Back to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpsellPage() {
  return (
    <Suspense>
      <UpsellInner />
    </Suspense>
  );
}
