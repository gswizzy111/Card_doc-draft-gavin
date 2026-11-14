import type { CustomerInfo } from "@/lib/types";

/** The customer's contact and address, beside the order summary on the review step. */
export function YourInformation({ customer, onEdit }: { customer: CustomerInfo; onEdit: () => void }) {
  return (
    <div className="px-window-ink p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-2xl uppercase leading-tight tracking-[0.02em] text-ink">Your Information</h3>
        <button type="button" onClick={onEdit} className="-my-2 inline-flex min-h-11 items-center px-2 font-pixel text-xs uppercase tracking-[0.04em] text-coral-deep hover:bg-butter/40 hover:underline">
          Edit
        </button>
      </div>
      <div className="text-sm text-muted-foreground flex flex-col gap-0.5 [overflow-wrap:anywhere]">
        <p>{customer.name}</p>
        <p>{customer.email}</p>
        <p>{customer.phone}</p>
        <p>
          {customer.street1}
          {customer.street2 ? `, ${customer.street2}` : ""}
        </p>
        <p>
          {customer.city}, {customer.state} {customer.zip}
        </p>
      </div>
    </div>
  );
}
