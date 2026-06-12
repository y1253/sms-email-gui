import api from './client';

export type EmailPhoneSet = {
  setId: number;
  email: { emailId: number; email: string };
  phone: { phoneId: number; phone: string };
  createdAt: string;
};

export const createSet = (emailId: number, phoneId: number) =>
  api.post<EmailPhoneSet>('/sets', { emailId, phoneId }).then((r) => r.data);

export const listSets = () =>
  api.get<EmailPhoneSet[]>('/sets').then((r) => r.data);

export const deleteSet = (setId: number) =>
  api.delete<{ message: string }>(`/sets/${setId}`).then((r) => r.data);
