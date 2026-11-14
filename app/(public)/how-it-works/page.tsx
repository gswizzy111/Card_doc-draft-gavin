import Link from "next/link";
import type { Metadata } from "next";
import { canonical } from "@/lib/seo";
import { PageHero } from "@/components/marketing/page-hero";
import { StepWalkthrough } from "@/components/motion/step-walkthrough";
import { CardSprite, HpBar, PixelIcon, StatusChip, pixelButton, type ClinicStatus, type PixelIconName } from "@/components/pixel";

export const metadata: Metadata = {
  alternates: canonical("/how-it-works"),
  title: "How It Works — The Card Doc",
  description:
    "The Card Doc is a trading card restoration and grading-prep shop in Ridgewood, New Jersey. Mail us your cards from anywhere in the US, we do the work by hand in our shop, and we ship them back ready for grading or your personal collection.",
};

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-2.5 flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="mt-[0.55em] size-2 shrink-0 bg-coral-deep" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const STEPS = [
  {
    n: "1",
    title: "Choose Your Service, Tier, and Add-Ons",
    note: "(Tiers, services, and add-ons lock at checkout and cannot be changed afterward)",
    body: "Pick Restoration or Prep based on your card's current declared value (what it's worth right now, not its projected graded value). Every tier gets the exact same care—you are only paying for turnaround speed and the card value each tier accepts.",
  },
  {
    n: "2",
    title: "Book Your Order at theonethatsaveditall.com",
    note: "(Payment is collected in full at checkout)",
    body: (
      <>
        <p>Add each card individually to your order with:</p>
        <List
          items={[
            "Card details & current declared value",
            "1 to 4 clear photos (required)",
            <><strong className="font-semibold text-ink">Order notes:</strong> Let us know if a card is strictly for your Personal Collection (not being graded) so we know which techniques are on the table.</>,
          ]}
        />
      </>
    ),
  },
  {
    n: "3",
    title: "Pack and Ship Your Cards",
    note: "(US & Puerto Rico orders only)",
    body: (
      <>
        <p>How to pack safely:</p>
        <List
          items={[
            "Place each card in a penny sleeve, then inside a Card Saver 1 or toploader.",
            "Sandwich the holders between two pieces of rigid cardboard.",
            "Wrap in bubble wrap and seal inside a padded mailer or small box so nothing shifts.",
          ]}
        />
      </>
    ),
  },
  {
    n: "4",
    title: "Arrival, Check-In, and Evaluation",
    note: "(Allow 1–3 business days after carrier delivery for check-in)",
    body: (
      <>
        <p>
          We collect from our PO Box once daily. Note that carrier tracking saying &ldquo;Delivered&rdquo; means it reached our PO Box; your order status switches to Cards Received once we open your box, log every card, and take &ldquo;before&rdquo; photos.
        </p>
        <p className="mt-3">Our Evaluation Promises:</p>
        <List
          items={[
            <><strong className="font-semibold text-ink">No upside, no charge:</strong> If we can&apos;t improve a restoration card, we refund the service cost and ship it back untouched (you only cover round-trip shipping).</>,
            <><strong className="font-semibold text-ink">No unnecessary work:</strong> If a card booked for restoration only needs a clean, we downgrade it to Prep so you don&apos;t overpay.</>,
            <><strong className="font-semibold text-ink">No surprise charges:</strong> If we spot fixable damage during a Prep order, we always contact you for permission before doing restoration work.</>,
          ]}
        />
      </>
    ),
  },
  {
    n: "5",
    title: "Hands-On Work",
    note: "(Order status: In Progress to Completed)",
    body: "Cards go through gentle rounds of humidity, specialized tool work, pressing, and resting in clamps to coax the card's original fibers back into place. Multiple rounds are normal and built into your turnaround estimate. Every restoration finishes with full Prep.",
  },
  {
    n: "6",
    title: "Return Shipping",
    note: "(Order status: Shipped Back to Delivered)",
    body: "Your cards are placed in fresh penny sleeves and Card Savers (cracked slabs return raw in Card Savers, ready to resubmit), sandwiched between protective plates in a bubble mailer, and shipped home.",
  },
];

const STATUSES: [string, string][] = [
  ["Awaiting Cards", "Order is paid; we're waiting for your package."],
  ["Cards Received", "Picked up from our PO Box, opened, logged, and photographed."],
  ["In Progress", "Your cards are actively on the workbench."],
  ["Completed", "Final quality check; prepping for return mail."],
  ["Shipped Back", "Return label printed—tracking is live on your order page."],
  ["Delivered", "Back in your hands."],
];

const POLICIES: { icon: PixelIconName; title: string; body: string }[] = [
  {
    icon: "chat",
    title: "Getting updates:",
    body: "Log in at theonethatsaveditall.com and hit Request an Update on your order page. The technician working on your card will reply within 1–2 business days.",
  },
  {
    icon: "clock",
    title: "Turnaround times:",
    body: "Estimates start when your status hits Cards Received (or upon arrival for Fast Pass) and do not include shipping transit time.",
  },
  {
    icon: "shield",
    title: "Alteration risk:",
    body: "Prep is a surface clean, with nothing restorative. Restoration carries a risk, low but not zero, that a grader detects it or returns a card as altered.",
  },
  {
    icon: "kit",
    title: "DIY Kits:",
    body: "Ordering a restoration kit from our shop ships like a standard retail order.",
  },
];

// The clinic journey strip: four stations a card passes through (decorative).
const JOURNEY: { status: ClinicStatus; level: number; art: React.ReactNode }[] = [
  { status: "check-in", level: 0.15, art: <CardSprite variant="hurt" scale={2} animate={false} /> },
  { status: "triage", level: 0.4, art: <PixelIcon name="magnifier" size={32} /> },
  { status: "treatment", level: 0.7, art: <PixelIcon name="brush" size={32} /> },
  { status: "discharged", level: 1, art: <CardSprite variant="healed" scale={2} animate={false} /> },
];

// Each tracking status's number color, warming to mint as the card heals.
const STATUS_LOOK: { dot: string }[] = [
  { dot: "text-frame-deep" },
  { dot: "text-frame-deep" },
  { dot: "text-coral-deep" },
  { dot: "text-mint-deep" },
  { dot: "text-mint-deep" },
  { dot: "text-mint-deep" },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-10 py-14 md:py-24">
        <PageHero
          className="mb-12 md:mb-14"
          eyebrow="How It Works"
          title="How It Works"
          lead="The Card Doc is a trading card restoration and grading-prep shop in Ridgewood, New Jersey. Mail us your cards from anywhere in the US, we do the work by hand in our shop, and we ship them back ready for grading or your personal collection."
        />

        {/* The clinic journey: check-in, triage, treatment, discharge */}
        <ol aria-hidden className="hero-in mb-16 grid grid-cols-2 gap-x-5 gap-y-6 md:mb-24 md:grid-cols-4 md:gap-x-8" style={{ ["--d" as string]: 420 }}>
          {JOURNEY.map((j, i) => (
            <li key={j.status} className="relative">
              <div className="px-window-ink flex h-full flex-col items-center gap-3.5 px-3 pt-5 pb-4">
                <div className="grid h-12 place-items-end">{j.art}</div>
                <StatusChip status={j.status} className="max-[420px]:px-2" />
                <HpBar level={j.level} className="w-full" />
              </div>
              {i < JOURNEY.length - 1 && (
                <span className={`absolute top-1/2 -right-[17px] z-[1] -translate-y-1/2 font-pixel text-xs text-coral-deep md:-right-[22px] ${i === 1 ? "hidden md:block" : "block"}`}>▶</span>
              )}
            </li>
          ))}
        </ol>

        {/* The step-by-step process: sticky scroll walkthrough, on the chart */}
        <section className="border-y-2 border-tile py-12 md:py-16">
          <StepWalkthrough title="The Step-by-Step Process" steps={STEPS} />
        </section>

        {/* Statuses and policies */}
        <section className="mt-20 md:mt-28" data-reveal>
          <h2 className="mb-8 font-heading text-[2.125rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink md:mb-10 md:text-5xl [text-wrap:balance]">
            Tracking Statuses &amp; Key Policies
          </h2>

          <div className="px-window overflow-hidden p-0 md:p-0">
            <table className="w-full text-left">
              <thead className="border-b-2 border-tile bg-muted/60">
                <tr>
                  <th scope="col" className="w-[44%] px-4 py-3.5 font-pixel text-xs font-normal uppercase tracking-[0.04em] text-ink-soft md:w-[34%] md:px-7">Order Status</th>
                  <th scope="col" className="px-4 py-3.5 font-pixel text-xs font-normal uppercase tracking-[0.04em] text-ink-soft md:px-7">What It Means</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-tile">
                {STATUSES.map(([status, meaning], i) => (
                  <tr key={status}>
                    <td className="px-4 py-4 align-top md:px-7">
                      <span className="flex items-start gap-2.5 font-semibold text-ink">
                        <span aria-hidden className={`mt-1 shrink-0 font-pixel text-xs tabular-nums ${STATUS_LOOK[i]?.dot ?? "text-ink-soft"}`}>{String(i + 1).padStart(2, "0")}</span>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[15px] leading-relaxed text-ink-soft md:px-7">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
            {POLICIES.map((p) => (
              <div key={p.title} className="flex items-start gap-4 border-t-2 border-tile pt-6">
                <span aria-hidden className="grid size-10 shrink-0 place-items-center bg-butter/70">
                  <PixelIcon name={p.icon} size={24} />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold leading-snug text-ink">{p.title}</h3>
                  <p className="text-sm text-ink-soft mt-1 leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA: the night desk */}
        <section data-reveal className="stage stage-light mt-20 px-frame-shadow p-7 md:mt-28 md:flex md:items-center md:justify-between md:gap-10 md:p-12">
          <div className="mb-8 md:mb-0">
            <div>
              <h3 className="mb-3 font-heading text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-stage-fg md:text-4xl [text-wrap:balance]">Ready to restore your collection?</h3>
              <p className="max-w-xl text-stage-muted">
                Submit your cards for restoration and see the difference professional care can make.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-4 sm:flex-row">
            <Link
              href="/restoration"
              className={pixelButton({ size: "md" })}
            >
              Book Restoration
            </Link>
            <Link
              href="/shop"
              className={pixelButton({ tone: "panel", size: "md" })}
            >
              Browse Kits
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
