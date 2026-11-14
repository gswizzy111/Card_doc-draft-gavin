import { PIXEL_FIELD } from "@/components/ui/input";
/** The creator portal's centered card: sign-in and password setup. */
export function PortalCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="page-glow flex min-h-screen items-center justify-center px-4 py-16">
      <div className="px-window w-full max-w-sm p-6 sm:p-8">
        <p className="rx-label text-coral-deep">The Card Doc</p>
        <h1 className="mt-4 mb-6 font-heading text-3xl leading-tight text-ink">{title}</h1>
        {children}
      </div>
    </div>
  );
}

export const PORTAL_LABEL_CN = "block mb-1.5 text-sm font-semibold text-ink";
export const PORTAL_INPUT_CN = PIXEL_FIELD;
export const PORTAL_BUTTON_CN = "px-btn h-12 w-full px-5 text-base disabled:opacity-50";
