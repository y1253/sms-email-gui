import api from './client';

export type EmailAccount = {
  emailId: number;
  email: string;
  addedAt: string;
};

export const connectEmail = (code: string) =>
  api.post<EmailAccount>('/emails/google/connect', { code }).then((r) => r.data);

export const listEmails = () =>
  api.get<EmailAccount[]>('/emails').then((r) => r.data);
