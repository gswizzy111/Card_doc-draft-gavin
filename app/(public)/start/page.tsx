import Link from "next/link";
import type { Metadata } from "next";
import { getCardsRestoredStat } from "@/lib/site-stats";
import { TrustPills } from "@/components/marketing/trust-pills";
import { JsonLd } from "@/components/seo/json-ld";
import { INSTAGRAM_URL, breadcrumbs, canonical } from "@/lib/seo";
import { SERVICE_CARDS } from "@/lib/service-cards";
import { CardSprite, MenuCursor, PixelIcon, pixelButton, type CardVariant } from "@/components/pixel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "What Are You Sending? | The Card Doc",
  description: "Expert card restoration & PSA prep — every card treated like it's worth a fortune.",
  alternates: canonical("/start"),
};

const STEPS = [
  "Choose Your Service, Tier, and Add-Ons",
  "Pack and Ship Your Cards",
  "Hands-On Work",
  "Return Shipping",
];

// Each service's patient on the check-in menu (pixel art, decorative)
const ART: Record<string, { band: string; variant: CardVariant }> = {
  "/tier-selection": { band: "bg-[color-mix(in_srgb,var(--rx-soft)_60%,var(--panel))]", variant: "healed" },
  "/prep": { band: "bg-[color-mix(in_srgb,var(--powder)_45%,var(--panel))]", variant: "sleeve" },
};

export default async function StartPage() {
  const cardsRestored = await getCardsRestoredStat();
  const [restoration, prep, kits] = SERVICE_CARDS;

  return (
    <div className="min-h-screen page-glow">
      <JsonLd data={breadcrumbs([{ name: "What Are You Sending?", path: "/start" }])} />
      <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-20 md:px-10 md:pt-20 md:pb-28">
        <h1 className="hero-in font-heading leading-[0.9] text-ink text-[clamp(2.5rem,8vw,4.75rem)]">
          What are you <span className="text-coral-deep">sending?</span>
        </h1>
        <p className="hero-in mt-6 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg" style={{ ["--d" as string]: 120 }}>
          Pick Restoration or Prep based on your card&apos;s current declared value (what it&apos;s worth right now, not its projected graded value).
        </p>

        {/* The check-in menu: two services, the ▶ cursor on the one you point at */}
        <ul className="mt-12 grid gap-7 md:mt-14 md:grid-cols-2 md:gap-8">
          {[restoration, prep].map(({ href, name, line, price, action }) => (
            <li key={href}>
              <Link href={href} className="comic-lift group px-window-ink grid h-full grid-cols-[5rem_1fr] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-frame-deep sm:grid-cols-[7.5rem_1fr]">
                <span className={`relative grid place-items-center border-r-2 border-ink/15 ${ART[href]?.band ?? "bg-muted"}`}>
                  <span className="relative sm:hidden"><CardSprite variant={ART[href]?.variant ?? "healed"} scale={2} animate={false} /></span>
                  <span className="relative hidden sm:block"><CardSprite variant={ART[href]?.variant ?? "healed"} scale={3} animate={false} /></span>
                </span>
                <span className="flex flex-col p-5 sm:p-7">
                  <span className="flex items-center gap-2 font-heading text-[2.1rem] leading-none text-ink sm:text-[2.75rem]">
                    <MenuCursor className="invisible text-base group-hover:visible group-focus-visible:visible max-md:hidden" />
                    {name}
                  </span>
                  <span className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{line}</span>
                  <span className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                    <span className="font-pixel text-xs uppercase tracking-[0.04em] text-ink-soft tabular-nums">
                      {price}
                    </span>
                    <span className={pixelButton({ size: "sm" })}>{action}</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={kits.href}
          className="comic-lift group mt-7 flex flex-col gap-4 bg-[color-mix(in_srgb,var(--wall)_40%,var(--panel))] px-5 py-5 px-frame-shadow focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-frame-deep sm:flex-row sm:items-center sm:justify-between sm:px-7 md:mt-8"
        >
          <span className="flex items-center gap-4">
            <PixelIcon name="kit" size={32} className="shrink-0" />
            <span>
              <span className="flex items-center gap-2 font-heading text-2xl leading-none text-ink">
                <MenuCursor className="invisible text-sm group-hover:visible group-focus-visible:visible max-md:hidden" />
                {kits.name}
              </span>
              <span className="mt-1.5 block text-sm text-ink">{kits.line}</span>
            </span>
          </span>
          <span className={pixelButton({ tone: "panel", size: "sm", className: "self-start sm:self-auto" })}>{kits.action}</span>
        </Link>

        <TrustPills cardsRestored={cardsRestored} align="start" className="mt-14" />

        {/* The four stops, as a route map */}
        <div className="mt-16 border-y-2 border-ink/15 px-1 py-10 sm:px-4">
          <ol className="relative grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            <span aria-hidden className="absolute top-[22px] right-[12.5%] left-[12.5%] hidden border-t-2 border-dashed border-ink/60 md:block" />
            {STEPS.map((title, i) => (
              <li key={title} className="relative flex flex-col items-center text-center">
                <span className={`grid size-11 place-items-center font-pixel text-base tabular-nums text-ink px-frame ${i === 0 ? "bg-coral-fill" : "bg-panel"}`}>
                  {i + 1}
                </span>
                <span className="mt-3.5 max-w-[16ch] font-heading text-base leading-tight text-ink">{title}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex justify-center">
            <Link href="/how-it-works" className={pixelButton({ tone: "panel", size: "sm" })}>How It Works</Link>
          </div>
        </div>

        <div className="stage stage-light mt-12 flex flex-col gap-5 px-6 py-7 px-frame-shadow sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
          <div className="flex items-center gap-4">
            <PixelIcon name="camera" size={32} className="shrink-0" />
            <div>
              <p className="font-heading text-[1.75rem] leading-none">Free Photo Review</p>
              <p className="mt-2 text-sm text-stage-muted">We reply within 1 business day.</p>
            </div>
          </div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={pixelButton({ tone: "panel", size: "sm", className: "self-start whitespace-normal sm:self-auto" })}>
            DM us on @the_card_doc
            <span className="sr-only">on Instagram (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
