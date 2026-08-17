import api from './client';
import type { BillingInvoice } from './billing';

export type AdminAccount = {
  userId: number;
  name: string;
  email: string | null;
  authType: string | null;
  createdAt: string;
  active: number | null;
  setCount: number;
  // Billing state, derived live from Stripe. nextRenewalAt is the soonest
  // upcoming charge; pendingCancelAt the soonest date service stops.
  nextRenewalAt: string | null;
  pendingCancelAt: string | null;
  pendingCancelCount: number;
  promoCount: number;
  subscriptionsError: string | null;
  emails: string[];
  phones: string[];
};

export type AdminAccountSet = {
  setId: number;
  createdAt: string;
  deletedAt: string | null;
  stripeSubscriptionId: string | null;
  pendingCancelAt: string | null;
  email: string | null;
  phone: string | null;
  promo: boolean;
  // Derived from Stripe, not from the DB — `pendingCancelAt` above goes stale
  // when a subscription is cancelled from the Stripe dashboard.
  status: 'active' | 'cancelled' | 'pending_cancel';
  renewsAt: string | null;
  endsAt: string | null;
  stripeStatus: string | null;
  amount: number | null;
  currency: string | null;
  interval: string | null;
  /** Stripe and the DB disagree about whether this set is cancelling. */
  dbDrift: boolean;
};

export type AdminAccountDetail = {
  userId: number;
  name: string;
  email: string | null;
  authType: string | null;
  createdAt: string;
  active: number | null;
  stripeCustomerId: string | null;
  emails: { email: string; addedAt: string; deletedAt: string | null }[];
  phones: { phone: string; addedAt: string; deletedAt: string | null }[];
  sets: AdminAccountSet[];
  setCounts: { total: number; active: number };
  nextRenewalAt: string | null;
  subscriptionsError: string | null;
  // Live Stripe invoices, same shape and source as the user's Billing page —
  // the `transaction` table is never written to. Amounts are in minor units.
  transactions: BillingInvoice[];
  // Set only when Stripe itself failed; an empty list with a null error means
  // the account genuinely has no charges.
  transactionsError: string | null;
};

// Admin routes are gated server-side by the JWT (x-token, added by the axios
// interceptor) plus the ADMIN_EMAILS allowlist — no separate admin password.
export async function getAdminAccounts(): Promise<AdminAccount[]> {
  const res = await api.get<AdminAccount[]>('/admin/accounts');
  // Guard against a misrouted request returning the SPA's index.html (HTTP 200,
  // but the body is HTML, not the accounts array) — otherwise the table render
  // crashes on accounts.map and the page goes blank.
  if (!Array.isArray(res.data)) {
    throw new Error('Unexpected response from /admin/accounts');
  }
  return res.data;
}

export const getAdminAccount = (userId: number) =>
  api
    .get<AdminAccountDetail>(`/admin/accounts/${userId}`)
    .then((r) => r.data);

export type DeletedContact = {
  userId: number;
  value: string;
  originalId: number;
  createdAt: string;
  deletedAt: string;
};

export type DeletedContacts = {
  emails: DeletedContact[];
  phones: DeletedContact[];
};

export const getDeletedContacts = () =>
  api
    .get<DeletedContacts>('/admin/deleted')
    .then((r) => r.data);
