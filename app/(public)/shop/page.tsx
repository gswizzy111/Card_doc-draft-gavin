import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE, breadcrumbs, canonical } from "@/lib/seo";
import { KIT_REVIEW, type Review } from "@/lib/reviews";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "./add-to-cart-button";
import { isSoldOut } from "@/lib/site-config";
import { PixelIcon, WallBand } from "@/components/pixel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Kits | The Card Doc",
  description: "The same pro-grade tools The Card Doc uses — delivered to you. US shipping at cost + $2 handling.",
  alternates: canonical("/shop"),
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  images: string[] | null;
  category: string | null;
  inventory_count: number;
};

function ProductCard({ product }: { product: Product }) {
  const isKit = product.name.toLowerCase().includes("official");
  return (
    <article className="group comic-lift px-window-ink flex flex-col">
      {isKit && (
        <span className="absolute -top-3.5 left-3 z-10 inline-flex h-7 items-center gap-1.5 bg-coral-fill px-2 font-pixel text-xs uppercase tracking-[0.04em] text-ink px-frame">
          <span aria-hidden>★</span>
          Most Popular
        </span>
      )}
      <a
        href={`/shop/${product.slug}`}
        className="block p-2.5 pb-0 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-frame-deep sm:p-3 sm:pb-0"
      >
        {/* The item, on a little display tray */}
        <div className="relative aspect-square overflow-hidden bg-muted shadow-[inset_0_0_0_2px_color-mix(in_srgb,var(--ink)_20%,transparent)]">
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover p-[2px]"
            />
          ) : (
            <div aria-hidden className="grid h-full w-full place-items-center">
              <PixelIcon name="kit" size={48} />
            </div>
          )}
          {isSoldOut() && (
            <div className="absolute inset-[2px] flex items-center justify-center bg-floor/75">
              <span className="inline-flex h-7 items-center bg-ink px-2.5 font-pixel text-xs uppercase tracking-[0.06em] text-panel">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </a>
      <div className="flex flex-1 flex-col gap-3 p-3 pt-3.5 sm:p-4">
        <a
          href={`/shop/${product.slug}`}
          className="menu-cursor-item block flex-1 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-frame-deep"
        >
          <p className="font-heading text-lg leading-[1.05] text-ink sm:text-xl">{product.name}</p>
        </a>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Pixel price tag */}
          <span className="self-start font-heading text-xl leading-none text-ink tabular-nums sm:self-auto">
            {formatCurrency(product.price_cents)}
          </span>
          {isSoldOut() || product.inventory_count === 0 ? (
            <span className="inline-flex h-7 items-center self-start bg-muted px-2 font-pixel text-xs uppercase tracking-[0.04em] text-ink-soft px-frame sm:self-auto">Sold Out</span>
          ) : (
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price_cents: product.price_cents,
                slug: product.slug,
                image: product.images?.[0],
              }}
            />
          )}
        </div>
      </div>
    </article>
  );
}

const SECTION_GRID: Record<number, string> = {
  1: "grid-cols-1 max-w-sm",
  2: "grid-cols-2 max-w-3xl",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3",
  6: "grid-cols-2 md:grid-cols-3",
  7: "grid-cols-2 md:grid-cols-4",
  8: "grid-cols-2 md:grid-cols-4",
  9: "grid-cols-2 md:grid-cols-3",
  12: "grid-cols-2 md:grid-cols-4",
};

function getSectionGridClass(count: number): string {
  return SECTION_GRID[count] ?? "grid-cols-2 md:grid-cols-4";
}

function ProductSection({ title, products, review }: { title: string; products: Product[]; review?: Review }) {
  if (products.length === 0) return null;
  return (
    <section>
      {/* Shelf sign */}
      <div className="mb-8 flex items-center gap-4 md:mb-10">
        <h2 className="font-heading text-[2rem] leading-none text-ink md:text-[2.5rem]">{title}</h2>
        <span aria-hidden className="h-0.5 flex-1 bg-ink/15" />
      </div>
      <div data-reveal="stagger" className={`grid ${getSectionGridClass(products.length)} gap-x-4 gap-y-8 sm:gap-x-6 md:gap-8`}>
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {review && (
        <figure data-reveal className="mt-12 max-w-2xl border-l-4 border-coral-fill pl-5 md:pl-6">
          <blockquote className="font-heading text-2xl leading-snug text-ink md:text-[1.75rem]">
            <p>“{review.quote}”</p>
          </blockquote>
          <figcaption className="mt-3 font-pixel text-xs uppercase tracking-[0.04em] text-ink-soft">{review.from}</figcaption>
        </figure>
      )}
    </section>
  );
}

export default async function ShopPage() {
  const admin = createAdminClient();

  const { data } = await admin
    .from("products")
    .select("id, name, slug, description, price_cents, images, category, inventory_count")
    .eq("active", true)
    .order("display_order", { ascending: true });

  const products: Product[] = (data ?? []) as Product[];

  const kits = products.filter((p) => p.category === "Kits");
  const tools = products.filter((p) => p.category === "Tools");
  const supplies = products.filter((p) => p.category === "Supplies" || p.category === "Cleaning" || p.category === "Storage");

  return (
    <div className="pb-28 md:pb-20">
      <JsonLd
        data={[
          breadcrumbs([{ name: "Shop Kits", path: "/shop" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: products.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: `${SITE}/shop/${p.slug}`,
            })),
          },
        ]}
      />
      {/* The clinic pharmacy: wall, then the counter, then the shelves */}
      <WallBand
        as="header"
        className="pt-10 md:pt-14"
        innerClassName="pb-10 md:pb-14"
      >
        <PageHero eyebrow="The Card Doc" title="Shop" />
      </WallBand>

      <div className="mx-auto max-w-7xl px-4 pt-14 md:px-10 md:pt-20">
        {products.length === 0 && (
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-10">
            {/* Empty shelf, waiting for stock */}
            <div aria-hidden className="w-full max-w-md">
              <div className="grid grid-cols-3 gap-4 px-3">
                {(["kit", "brush", "box"] as const).map((icon) => (
                  <span key={icon} className="grid aspect-square place-items-center border-2 border-dashed border-ink/30 bg-panel/50">
                    <span className="opacity-30 grayscale"><PixelIcon name={icon} size={32} /></span>
                  </span>
                ))}
              </div>
              <div className="mt-1 h-3 border-2 border-ink/70 bg-trim" />
            </div>
            <p className="text-center font-heading text-2xl leading-tight text-ink md:text-3xl">Products coming soon.</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="flex flex-col gap-20 md:gap-24">
            <ProductSection title="Kits" products={kits} review={KIT_REVIEW} />
            <ProductSection title="Tools" products={tools} />
            <ProductSection title="Supplies" products={supplies} />
          </div>
        )}
      </div>
    </div>
  );
}
