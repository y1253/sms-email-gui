import api from './client';

export type Card = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
};

export const attachCard = (paymentMethodId: string) =>
  api.post<{ message: string }>('/cc', { paymentMethodId }).then((r) => r.data);

export const listCards = () =>
  api.get<Card[]>('/cc').then((r) => r.data);

export const deleteCard = (cc_id: string) =>
  api.delete<{ message: string }>('/cc', { data: { cc_id } }).then((r) => r.data);

// A Stripe invoice. `amount` is in minor units (cents) — format with formatMoney.
export type BillingInvoice = {
  id: string;
  number: string | null;
  status: 'paid' | 'open' | 'draft' | 'uncollectible' | 'void' | string;
  amount: number;
  currency: string;
  created: string;
  paidAt: string | null;
  description: string | null;
  subscriptionId: string | null;
  // Both null while the invoice is a draft — render the links conditionally.
  hostedInvoiceUrl: string | null;
  invoicePdf: string | null;
};

export type InvoicePage = {
  data: BillingInvoice[];
  hasMore: boolean;
  nextCursor: string | null;
};

export type BillingSubscription = {
  setId: number;
  email: string;
  phone: string;
  createdAt: string;
  status: 'active' | 'pending_cancel';
  promo: boolean;
  stripeSubscriptionId: string | null;
  pendingCancelAt: string | null;
  currentPeriodEnd: string | null;
  stripeStatus: string | null;
  amount: number | null;
  currency: string | null;
  interval: string | null;
};

// Transactions come live from Stripe — the `transaction` table is never written.
// Mounted under /cc because nginx only proxies a fixed set of prefixes.
export const listInvoices = (params?: { limit?: number; startingAfter?: string }) =>
  api.get<InvoicePage>('/cc/invoices', { params }).then((r) => r.data);

export const listSubscriptions = () =>
  api.get<BillingSubscription[]>('/cc/subscriptions').then((r) => r.data);
