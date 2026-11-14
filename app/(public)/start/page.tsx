import Link from "next/link";
import type { Metadata } from "next";
import { getCardsRestoredStat } from "@/lib/site-stats";
import { TrustPills } from "@/components/marketing/trust-pills";
import { JsonLd } from "@/components/seo/json-ld";
import { INSTAGRAM_URL, breadcrumbs, canonical } from "@/lib/seo";
import { SERVICE_CARDS } from "@/lib/service-cards";
import { CardSprite, DocSprite, MenuCursor, PixelIcon, Window, pixelButton, type CardVariant } from "@/components/pixel";

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
  "/tier-selection": { band: "bg-rx-soft", variant: "healed" },
  "/prep": { band: "bg-powder", variant: "sleeve" },
};

export default async function StartPage() {
  const cardsRestored = await getCardsRestoredStat();
  const [restoration, prep, kits] = SERVICE_CARDS;

  return (
    <div className="min-h-screen page-glow">
      <JsonLd data={breadcrumbs([{ name: "What Are You Sending?", path: "/start" }])} />
      <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-20 md:px-10 md:pt-20 md:pb-28">
        <p aria-hidden className="hero-in mb-5 inline-flex h-8 items-center gap-2 bg-butter px-3 font-pixel text-xs uppercase tracking-[0.04em] text-ink px-frame md:text-[13px]">
          <span className="text-coral-deep">▶</span>CHECK-IN
        </p>
        <h1 className="hero-in font-heading uppercase leading-[0.9] tracking-[0.01em] text-ink text-[clamp(2.75rem,11vw,6.5rem)] [text-shadow:4px_4px_0_var(--wall)]">
          What are you <span className="text-coral-deep">sending?</span>
        </h1>
        <div className="hero-in mt-7 flex max-w-2xl items-end gap-3 md:gap-4" style={{ ["--d" as string]: 200 }}>
          <DocSprite scale={2} className="mb-1 shrink-0" />
          <Window variant="dialog" className="flex-1 p-4 pr-9 md:p-5 md:pr-10">
            <p className="text-[15px] leading-relaxed text-ink md:text-base">
              Pick Restoration or Prep based on your card&apos;s current declared value (what it&apos;s worth right now, not its projected graded value).
            </p>
          </Window>
        </div>

        {/* The check-in menu: two services, the ▶ cursor on the one you point at */}
        <ul className="mt-12 grid gap-7 md:mt-14 md:grid-cols-2 md:gap-8">
          {[restoration, prep].map(({ href, name, line, price, action }) => (
            <li key={href}>
              <Link href={href} className="comic-lift group px-window-ink grid h-full grid-cols-[5.5rem_1fr] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-frame-deep sm:grid-cols-[8.5rem_1fr]">
                <span className={`relative grid place-items-center border-r-[3px] border-ink ${ART[href]?.band ?? "bg-muted"}`}>
                  <span aria-hidden className="absolute inset-0 px-dither opacity-50" />
                  <span className="relative sm:hidden"><CardSprite variant={ART[href]?.variant ?? "healed"} scale={3} /></span>
                  <span className="relative hidden sm:block"><CardSprite variant={ART[href]?.variant ?? "healed"} scale={4} /></span>
                </span>
                <span className="flex flex-col p-5 sm:p-7">
                  <span className="flex items-center gap-2 font-heading text-[2.1rem] uppercase leading-none tracking-[0.02em] text-ink sm:text-[2.75rem]">
                    <MenuCursor className="invisible text-base group-hover:visible group-focus-visible:visible max-md:hidden" />
                    {name}
                  </span>
                  <span className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{line}</span>
                  <span className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                    <span className="inline-flex h-8 items-center bg-butter px-2.5 font-pixel text-xs uppercase tracking-[0.04em] text-ink tabular-nums px-frame">
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
          className="comic-lift group mt-7 flex flex-col gap-4 bg-wall px-5 py-5 px-frame-shadow focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-frame-deep sm:flex-row sm:items-center sm:justify-between sm:px-7 md:mt-8"
        >
          <span className="flex items-center gap-4">
            <span aria-hidden className="grid size-14 shrink-0 place-items-center bg-panel px-frame">
              <PixelIcon name="kit" size={32} />
            </span>
            <span>
              <span className="flex items-center gap-2 font-heading text-2xl uppercase leading-none tracking-[0.02em] text-ink">
                <MenuCursor className="invisible text-sm group-hover:visible group-focus-visible:visible max-md:hidden" />
                {kits.name}
              </span>
              <span className="mt-1.5 block text-sm text-ink">{kits.line}</span>
            </span>
          </span>
          <span className={pixelButton({ tone: "panel", size: "sm", className: "self-start sm:self-auto" })}>{kits.action}</span>
        </Link>

        <TrustPills cardsRestored={cardsRestored} align="start" className="mt-12" />

        {/* The four stops, as a route map */}
        <div className="px-window-ink mt-12 px-5 py-8 sm:px-8">
          <ol className="relative grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            <span aria-hidden className="absolute top-[22px] right-[12.5%] left-[12.5%] hidden border-t-[3px] border-dashed border-ink/60 md:block" />
            {STEPS.map((title, i) => (
              <li key={title} className="relative flex flex-col items-center text-center">
                <span className={`grid size-11 place-items-center font-pixel text-base tabular-nums text-ink px-frame ${i === 0 ? "bg-coral-fill" : "bg-panel"}`}>
                  {i + 1}
                </span>
                <span className="mt-3.5 max-w-[16ch] font-heading text-base uppercase leading-tight tracking-[0.02em] text-ink">{title}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex justify-center">
            <Link href="/how-it-works" className={pixelButton({ tone: "panel", size: "sm" })}>How It Works</Link>
          </div>
        </div>

        <div className="stage stage-light mt-12 flex flex-col gap-5 px-6 py-7 px-frame-shadow sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
          <div className="flex items-center gap-4">
            <span aria-hidden className="grid size-14 shrink-0 place-items-center bg-powder px-frame">
              <PixelIcon name="camera" size={32} />
            </span>
            <div>
              <p className="font-heading text-[1.75rem] uppercase leading-none tracking-[0.02em]">Free Photo Review</p>
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
