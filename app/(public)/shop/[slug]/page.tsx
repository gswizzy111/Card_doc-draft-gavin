import { cache } from "react";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { JsonLd } from "@/components/seo/json-ld";
import { ORG_ID, SITE, breadcrumbs, canonical } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AddToCartButtonLarge } from "./add-to-cart-button-large";
import { Info, RefreshCw } from "lucide-react";
import { isSoldOut } from "@/lib/site-config";
import { PixelViewContent } from "@/components/pixel-view-content";
import { getSubscriptionPriceCents } from "@/lib/store-config";
import { PixelIcon, Window, pixelButton } from "@/components/pixel";

export const dynamic = "force-dynamic";

const getProduct = cache(async (slug: string) => {
  const admin = createAdminClient();
  const { data } = await admin.from("products").select("*").eq("slug", slug).eq("active", true).single();
  return data;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const description = typeof product.description === "string" ? product.description.slice(0, 160) : undefined;
  const image = product.images?.[0];
  return {
    title: `${product.name} | The Card Doc`,
    description,
    alternates: canonical(`/shop/${slug}`),
    openGraph: image ? { images: [image] } : undefined,
  };
}

function DescriptionBlock({ text }: { text: string }) {
  // If description contains "includes:" pull out the items after it and render as bullets
  const match = text.match(/^(.+?includes:)\s*/i);
  if (match) {
    const itemsText = text.slice(match[0].length);
    // Split before each quantity pattern like "10x", "2x", "5×", "1×"
    const items = itemsText.split(/\s+(?=\d+[x×])/).filter(Boolean);
    if (items.length > 1) {
      return (
        <ul className="flex flex-col gap-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed">
              <span className="mt-[9px] size-2 shrink-0 bg-mint-deep" aria-hidden />
              <span className="text-ink">{item.trim()}</span>
            </li>
          ))}
        </ul>
      );
    }
  }
  return <p className="text-[15px] leading-relaxed text-ink">{text}</p>;
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, subscriptionPriceCents] = await Promise.all([getProduct(slug), getSubscriptionPriceCents()]);

  if (!product) notFound();

  const inStock = !isSoldOut() && (product.inventory_count === null || product.inventory_count === undefined || product.inventory_count > 0);
  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description ?? undefined,
      image: product.images?.length ? product.images : undefined,
      sku: String(product.id),
      category: product.category ?? undefined,
      brand: { "@type": "Brand", name: "The Card Doc" },
      offers: {
        "@type": "Offer",
        price: (product.price_cents / 100).toFixed(2),
        priceCurrency: "USD",
        availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: `${SITE}/shop/${product.slug}`,
        seller: { "@id": ORG_ID },
      },
    },
    breadcrumbs([
      { name: "Shop Kits", path: "/shop" },
      { name: product.name, path: `/shop/${product.slug}` },
    ]),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-10 md:py-14">
      <JsonLd data={structured} />
      <PixelViewContent contentName={product.name} contentCategory={product.category ?? "Shop"} />
      <Link
        href="/shop"
        className="menu-cursor-item mb-8 inline-flex min-h-11 items-center gap-2 font-pixel text-xs uppercase tracking-[0.04em] text-ink-soft hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-frame-deep"
      >
        &larr; Back to Shop
      </Link>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        {/* The item on the exam table */}
        <div className="flex flex-col gap-5">
          <div className="px-window-ink p-3">
            <div className="relative aspect-square overflow-hidden bg-muted shadow-[inset_0_0_0_3px_var(--ink)]">
              {product.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover p-[3px]" />
              ) : (
                <div aria-hidden className="grid h-full w-full place-items-center px-dither">
                  <PixelIcon name="kit" size={48} />
                </div>
              )}
            </div>
          </div>
          {product.images?.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {product.images.slice(1).map((url: string, i: number) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt={product.name} className="size-16 bg-panel object-cover p-[3px] px-frame" />
              ))}
            </div>
          )}
        </div>

        {/* Item card */}
        <div className="flex flex-col gap-7">
          <div>
            {product.category && (
              <p className="mb-4 inline-flex h-7 items-center gap-2 bg-powder px-2.5 font-pixel text-xs uppercase tracking-[0.04em] text-ink px-frame">
                <span aria-hidden className="size-2 bg-frame-deep" />
                {product.category}
              </p>
            )}
            <h1 className="mb-5 font-heading text-[2.5rem] uppercase leading-[0.95] tracking-[0.01em] text-ink [text-shadow:3px_3px_0_var(--wall)] md:text-6xl">{product.name}</h1>

            <p className="inline-flex h-12 items-center gap-2.5 bg-butter pr-4 pl-3 font-heading text-[2rem] leading-none text-ink tabular-nums px-frame-shadow">
              <span aria-hidden className="size-2 bg-ink" />
              {formatCurrency(product.price_cents)}
            </p>
          </div>

          {product.description && (
            <Window title="ITEM INFO" className="pt-6">
              <DescriptionBlock text={product.description} />
            </Window>
          )}

          {product.inventory_count > 0 && product.inventory_count <= 5 && (
            <p className="inline-flex items-center gap-2 self-start font-pixel text-xs uppercase tracking-[0.04em] text-coral-deep">
              <span aria-hidden className="size-2 bg-coral-deep px-blink" />
              Only {product.inventory_count} left in stock
            </p>
          )}

          <div className="flex flex-col gap-4">
            {isSoldOut() ? (
              <div className="flex h-14 items-center justify-center bg-muted px-frame">
                <span className="font-heading text-lg uppercase tracking-[0.04em] text-ink-soft">Sold Out — Back Soon</span>
              </div>
            ) : product.inventory_count === 0 ? (
              <p className="font-heading text-xl uppercase tracking-[0.02em] text-ink-soft">Out of stock</p>
            ) : (
              <AddToCartButtonLarge
                product={{
                  id: product.id,
                  name: product.name,
                  price_cents: product.price_cents,
                  slug: product.slug,
                  image: product.images?.[0],
                }}
                requiresSize={product.name.toLowerCase().includes("glove")}
              />
            )}

            {!isSoldOut() && product.name.toLowerCase().includes("kit") && (
              <Link
                href="/subscribe"
                className={pixelButton({ tone: "mint", size: "lg", className: "h-auto min-h-14 w-full whitespace-normal py-3 text-center text-base leading-tight" })}
              >
                <RefreshCw className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                Subscribe — {formatCurrency(subscriptionPriceCents)}/mo · Save every month
              </Link>
            )}

            <p className="mt-1 flex items-start gap-2.5 bg-panel/80 p-3 text-sm leading-relaxed text-ink px-frame">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-coral-deep" strokeWidth={1.75} />
              All sales final. Defective or missing items are replaced or refunded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
