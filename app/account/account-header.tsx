import Link from "next/link";
import { LogoutButton } from "./logout-button";

/** The customer portal header: Orders, Settings, the signed-in email, Log out. */
export function AccountHeader({ email, active }: { email: string; active: "orders" | "settings" }) {
  const tab = (href: string, label: string, on: boolean) => (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={`menu-cursor-item inline-flex min-h-11 items-center gap-1.5 font-heading text-lg uppercase tracking-[0.03em] ${on ? "text-ink underline underline-offset-[6px] decoration-[3px] decoration-coral-deep" : "text-ink-soft hover:text-ink"}`}
    >
      {label}
    </Link>
  );
  return (
    <header className="sticky top-0 z-10 border-b-[3px] border-ink bg-panel shadow-[0_3px_0_var(--trim)]">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-5 sm:gap-6 min-w-0">
          <Link href="/" className="inline-flex min-h-11 shrink-0 items-center font-heading text-xl tracking-[0.02em] text-ink hover:text-coral-deep">
            The Card Doc
          </Link>
          <nav aria-label="Account" className="flex items-center gap-4">
            {tab("/account", "Orders", active === "orders")}
            {tab("/account/settings", "Settings", active === "settings")}
          </nav>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden text-sm text-ink-soft md:block">{email}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
