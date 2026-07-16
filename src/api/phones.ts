import api from './client';

export type Phone = {
  phoneId: number;
  phone: string;
  addedAt: string;
};

export const listPhones = () =>
  api.get<Phone[]>('/phones').then((r) => r.data);

export const addPhone = (phone: string, consent: boolean) =>
  api.post<{ sent: boolean }>('/phones', { phone, consent }).then((r) => r.data);

export const verifyPhone = (phone: string, code: string) =>
  api.post<{ verified: true; phoneId: number }>('/phones/verify', { phone, code }).then((r) => r.data);

export const deletePhone = (phoneId: number) =>
  api.delete<{ message: string }>('/phones/delete', { data: { phoneId } }).then((r) => r.data);
