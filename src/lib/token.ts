/**
 * Reading the JWT the client is holding, including whether it is still alive.
 *
 * The `exp` check here is a UX shortcut, never a security control — the server
 * is the only authority on whether a token is valid. Its job is to redirect an
 * expired session at the route guard, before the app shell mounts and fires a
 * round of doomed requests. Every ambiguous case therefore resolves to "still
 * valid" and lets the server rule on it.
 */

/**
 * One minute of slack on the expiry comparison. A client clock running fast
 * would otherwise sign people out early; a slow one just skips the shortcut and
 * falls through to the server's 401.
 */
const SKEW_MS = 60_000;

/** There is no localStorage during prerender, and no token either. */
export const readToken = (): string | null =>
  typeof window === 'undefined' ? null : localStorage.getItem('token');

/**
 * True only when the token provably expired more than SKEW_MS ago. A token this
 * cannot parse — wrong shape, bad base64, no numeric `exp` — is reported as not
 * expired, so a decoding bug can never lock anyone out of the app.
 */
export function isExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.');
    if (!payload) return false;
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(json) as { exp?: unknown };
    if (typeof exp !== 'number' || !Number.isFinite(exp)) return false;
    return Date.now() > exp * 1000 + SKEW_MS;
  } catch {
    return false;
  }
}

/**
 * Wipes the signed-in state. Both storages wholesale rather than known keys, so
 * nothing survives by having been added later and forgotten here — same rule as
 * the sidebar's logout button, which is the other caller of this idea.
 */
export function clearSession(): void {
  localStorage.clear();
  sessionStorage.clear();
}

/**
 * End the session and hand the user to the login page with an explanation.
 *
 * A full page navigation rather than a router one, deliberately. The obvious
 * alternative — <Navigate> from the route guard — does not work: neither a
 * search string nor router `state` survives the transition, so the login page
 * mounts with nothing to explain itself with. A reload also drops the React
 * Query cache, every component's state and every in-flight request for free,
 * which the interceptor (outside the React tree, with no queryClient to reach
 * for) needs anyway. `replace` keeps the dead page out of history, so the back
 * button cannot return to a signed-in looking shell.
 *
 * clearSession must come first: if a stale token survived the reload the next
 * page would tear down again on its first request, and a hard redirect loop
 * hammering the API is far worse than a stuck session.
 */
export function signOut(reason: SignOutReason): void {
  clearSession();
  window.location.replace(`/login?reason=${reason}`);
}

/** Why the user is being signed out. The login page owns the copy for each. */
export type SignOutReason = 'expired' | 'revoked' | 'invalid';
