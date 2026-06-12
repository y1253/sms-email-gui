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
