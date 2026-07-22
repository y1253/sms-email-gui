import api from './client';

export type EmailPhoneSet = {
  setId: number;
  email: { emailId: number; email: string };
  phone: { phoneId: number; phone: string };
  createdAt: string;
  pendingCancelAt: string | null;
  allowedSenders: string[];
  stripeSubscriptionId: string | null;
};

export const createSet = (emailId: number, phoneId: number, promoCode?: string) =>
  api.post<EmailPhoneSet>('/sets', { emailId, phoneId, ...(promoCode ? { promoCode } : {}) }).then((r) => r.data);

export const validatePromo = (code: string) =>
  api.get<{ valid: boolean }>('/sets/validate-promo', { params: { code } }).then((r) => r.data);

export const listSets = () =>
  api.get<EmailPhoneSet[]>('/sets').then((r) => r.data);

export const deleteSet = (setId: number) =>
  api.delete<{ message: string }>(`/sets/${setId}`).then((r) => r.data);

export const updateSenders = (setId: number, senders: string[]) =>
  api.put<{ updated: true }>(`/sets/${setId}/senders`, { senders }).then((r) => r.data);

export const cancelSubscription = (setId: number) =>
  api.post<{ cancelAt: string }>(`/sets/${setId}/cancel`).then((r) => r.data);
