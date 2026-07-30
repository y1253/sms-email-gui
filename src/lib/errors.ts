/**
 * Pull the server's message off an axios error. The API returns
 * `{ statusCode, message }`; anything unexpected is masked server-side, so the
 * fallback is what the user sees for genuine 500s and network failures.
 */
export function apiError(err: unknown, fallback = 'Something went wrong'): string {
  const message = (err as any)?.response?.data?.message;
  if (Array.isArray(message)) return message[0] ?? fallback;
  return typeof message === 'string' && message ? message : fallback;
}
