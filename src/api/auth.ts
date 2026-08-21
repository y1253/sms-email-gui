import api from './client';

export const register = (data: {
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
}) => api.post<{ token: string }>('/users/create', data).then((r) => r.data);

export const login = (data: { email: string; password: string }) =>
  api.post<{ token: string }>('/users/login', data).then((r) => r.data);

export const googleLogin = (credential: string) =>
  api.post<{ accessToken: string }>('/users/google', { credential }).then((r) => r.data);

export type Profile = {
  userId: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  /** 'reg' | 'google' — Google accounts have no password to change. */
  authType: string | null;
};

export const getProfile = () =>
  api.get<Profile>('/users/profile').then((r) => r.data);

export const updateProfile = (data: { first_name: string; last_name?: string }) =>
  api.put<Profile>('/users/profile', data).then((r) => r.data);

export const changePassword = (data: {
  current_password: string;
  new_password: string;
}) => api.post<{ ok: true }>('/users/password', data).then((r) => r.data);

/**
 * Always resolves ok, even for an address with no account — the server refuses
 * to reveal which addresses are registered, so the UI shows one message either
 * way.
 */
export const forgotPassword = (data: { email: string }) =>
  api.post<{ ok: true }>('/users/forgot-password', data).then((r) => r.data);
