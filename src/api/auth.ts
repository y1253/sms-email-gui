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

/**
 * Changing the password terminates every session for the account, including
 * this one, so the server returns a replacement token for the caller. Store it
 * or the next request 401s.
 */
export const changePassword = (data: {
  current_password: string;
  new_password: string;
}) =>
  api
    .post<{ ok: true; token: string }>('/users/password', data)
    .then((r) => r.data);

/**
 * Resolves only once the email has actually gone out, so the caller can show a
 * real confirmation. Rejects with the reason otherwise: 404 for an address with
 * no account, 400 for a Google-only account that has no password to reset, 503
 * when the send itself failed. `apiError()` surfaces each message verbatim.
 */
export const forgotPassword = (data: { email: string }) =>
  api.post<{ ok: true }>('/users/forgot-password', data).then((r) => r.data);
