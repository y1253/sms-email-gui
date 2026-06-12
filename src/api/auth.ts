import api from './client';

export const register = (data: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}) => api.post<{ token: string }>('/users/create', data).then((r) => r.data);

export const login = (data: { email: string; password: string }) =>
  api.post<{ token: string }>('/users/login', data).then((r) => r.data);

export const googleLogin = (credential: string) =>
  api.post<{ accessToken: string }>('/users/google', { credential }).then((r) => r.data);

export const getProfile = () =>
  api.get<{ userId: number; email: string; firstName: string; lastName: string }>(
    '/users/profile',
  ).then((r) => r.data);
