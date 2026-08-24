/**
 * Pull the server's message off an axios error. The API returns
 * `{ statusCode, message }`; anything unexpected is masked server-side, so the
 * fallback is what the user sees for genuine 500s and network failures.
 */
export function apiError(err: unknown, fallback = 'Something went wrong'): string {
  // A timeout never reaches the server, so there is no `response` to read and
  // the caller's fallback ("Couldn't send the email") would blame the wrong
  // thing. Say what actually happened instead — retrying is the right move.
  const code = (err as any)?.code;
  if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') {
    return "The server didn't respond. Please try again.";
  }

  const message = (err as any)?.response?.data?.message;
  if (Array.isArray(message)) return message[0] ?? fallback;
  return typeof message === 'string' && message ? message : fallback;
}
