import axios from 'axios';
import { signOut, type SignOutReason } from '@/lib/token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  // Without this axios waits forever (its default is 0), so anything that stops
  // the API from answering — a wedged request, a stalled SMTP round-trip, the
  // wrong process on the port — leaves the calling button spinning with no
  // error. 30s clears the slowest legitimate route: POST /users/forgot-password
  // blocks on Gmail because it sends the mail before rewriting the password.
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-token'] = token;
  }
  return config;
});

/** The reasons the server reports; anything else falls back to the generic copy. */
const REASONS: readonly string[] = ['expired', 'revoked', 'invalid'];

/** Set once we have committed to leaving, so the several queries a page fires
 *  in parallel (Billing runs subscriptions + cards + the sidebar's profile)
 *  produce one navigation rather than one each. */
let leaving = false;

api.interceptors.response.use(undefined, (error) => {
  // Every caller still sees the rejection, so existing per-request error
  // handling (inline messages, toasts, apiError) is unchanged.
  if (typeof window === 'undefined' || leaving) return Promise.reject(error);

  const data = error.response?.status === 401 ? error.response.data : undefined;
  if (data?.code !== 'SESSION_INVALID') return Promise.reject(error);

  // Nothing to expire. /admin is not behind ProtectedRoute, so a logged-out
  // visitor lands there and 401s on its first fetch; Admin.tsx renders its own
  // "not authorized" message and must be left to it.
  const current = localStorage.getItem('token');
  if (!current) return Promise.reject(error);

  // The failing request may predate a token swap — changing a password rotates
  // token_version server-side and stores the replacement, so anything already
  // in flight comes back with a revoked token through no fault of the session
  // the user is now holding. Only the current token's failure ends the session.
  const sent =
    error.config?.headers?.get?.('x-token') ??
    (error.config?.headers as Record<string, string> | undefined)?.['x-token'];
  if (sent && sent !== current) return Promise.reject(error);

  leaving = true;
  signOut(
    (REASONS.includes(data.reason) ? data.reason : 'invalid') as SignOutReason,
  );
  return Promise.reject(error);
});

export default api;
