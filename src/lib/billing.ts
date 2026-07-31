import { formatDate, formatMoney } from './format';

export type BillingLineInput = {
  promo: boolean;
  amount: number | null;
  currency: string | null;
  interval: string | null;
  /** True when a cancellation is scheduled — the date then means "ends". */
  cancelling: boolean;
  /** Next renewal, or the end date once cancelling. */
  periodEnd: string | Date | null;
};

/**
 * "$10.00 / month · Renews Aug 29, 2026" — or the promo/cancelling variants.
 * Shared by the customer's Billing page and the admin account detail so both
 * describe the same subscription identically.
 */
export function billingLine(s: BillingLineInput): string {
  if (s.promo) return 'Free — promo code';

  const price =
    s.amount != null ? formatMoney(s.amount, s.currency ?? 'usd') : null;
  const recurring = price
    ? `${price}${s.interval ? ` / ${s.interval}` : ''}`
    : null;

  // A pending-cancel subscription is never billed again — never say "Renews".
  const when = s.periodEnd
    ? `${s.cancelling ? 'Ends' : 'Renews'} ${formatDate(s.periodEnd)}`
    : null;

  return (
    [recurring, when].filter(Boolean).join(' · ') ||
    'Subscription details unavailable'
  );
}
