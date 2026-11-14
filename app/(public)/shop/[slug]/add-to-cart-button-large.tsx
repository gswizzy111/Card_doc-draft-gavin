"use client";

import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap } from "lucide-react";
import { pixelButton } from "@/components/pixel/pixel-button";

const SIZES = ["Small", "Medium", "Large", "XL"] as const;

interface Props {
  product: {
    id: string;
    name: string;
    price_cents: number;
    slug: string;
    image?: string;
  };
  requiresSize?: boolean;
}

export function AddToCartButtonLarge({ product, requiresSize }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [size, setSize] = useState<string | null>(null);
  const router = useRouter();

  function buildItem() {
    return {
      ...product,
      id: requiresSize && size ? `${product.id}-${size}` : product.id,
      size: requiresSize && size ? size : undefined,
    };
  }

  function handleAdd() {
    if (requiresSize && !size) return;
    addItem(buildItem());
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    if (requiresSize && !size) return;
    addItem(buildItem());
    router.push("/cart/checkout");
  }

  return (
    <div className="flex flex-col gap-4">
      {requiresSize && (
        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5 font-pixel text-xs uppercase tracking-[0.04em] text-ink">Select Size</legend>
          <div className="grid grid-cols-4 gap-3">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={pixelButton({
                  tone: size === s ? "ink" : "panel",
                  size: "sm",
                  className: "h-11 w-full px-1 text-base normal-case",
                })}
              >
                {s}
              </button>
            ))}
          </div>
          {!size && (
            <p className="text-sm text-ink-soft">Please select a size before adding to cart.</p>
          )}
        </fieldset>
      )}

      <button
        onClick={handleBuyNow}
        disabled={requiresSize && !size}
        className={pixelButton({ tone: "coral", size: "lg", className: "w-full disabled:cursor-not-allowed disabled:opacity-45" })}
      >
        <Zap className="h-4 w-4 fill-current" />
        Buy It Now
      </button>
      <button
        onClick={handleAdd}
        disabled={requiresSize && !size}
        className={pixelButton({
          tone: added ? "mint" : "panel",
          size: "lg",
          className: "w-full disabled:cursor-not-allowed disabled:opacity-45",
        })}
      >
        <ShoppingCart className="h-4 w-4" strokeWidth={1.75} />
        {added ? "Added to Cart!" : "Add to Cart"}
      </button>
    </div>
  );
}
