import api from './client';

export type AdminAccount = {
  userId: number;
  name: string;
  email: string | null;
  authType: string | null;
  createdAt: string;
  active: number | null;
  setCount: number;
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
  status: 'active' | 'cancelled' | 'pending_cancel';
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
  transactions: { amount: string; createdAt: string }[];
};

// Admin routes are gated by the x-admin-password header (not the x-token JWT
// interceptor), so the password is passed explicitly on each call.
export async function getAdminAccounts(pwd: string): Promise<AdminAccount[]> {
  const res = await api.get<AdminAccount[]>('/admin/accounts', {
    headers: { 'x-admin-password': pwd },
  });
  // Guard against a misrouted request returning the SPA's index.html (HTTP 200,
  // but the body is HTML, not the accounts array) — otherwise the table render
  // crashes on accounts.map and the page goes blank.
  if (!Array.isArray(res.data)) {
    throw new Error('Unexpected response from /admin/accounts');
  }
  return res.data;
}

export const getAdminAccount = (pwd: string, userId: number) =>
  api
    .get<AdminAccountDetail>(`/admin/accounts/${userId}`, {
      headers: { 'x-admin-password': pwd },
    })
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

export const getDeletedContacts = (pwd: string) =>
  api
    .get<DeletedContacts>('/admin/deleted', {
      headers: { 'x-admin-password': pwd },
    })
    .then((r) => r.data);
