"use client";

import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import { pixelButton } from "@/components/pixel/pixel-button";

interface Props {
  product: {
    id: string;
    name: string;
    price_cents: number;
    slug: string;
    image?: string;
  };
}

export function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      className={pixelButton({
        tone: added ? "mint" : "coral",
        size: "sm",
        className: "h-11 w-full sm:w-auto sm:min-w-20",
      })}
    >
      {added ? "Added!" : "Add"}
    </button>
  );
}
