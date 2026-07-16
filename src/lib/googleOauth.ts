// Builds the Google consent URL for connecting a Gmail account to a set.
// Requests the full-mailbox scope (needed to watch/read/send mail) with
// offline access + forced consent so a refresh token is always returned and
// the scope checkboxes are re-shown on retry.
// Shared by AddSetModal (initiate) and GoogleCallback (retry after failure).
export function buildGmailConnectUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI as string,
    response_type: 'code',
    scope: ['email', 'profile', 'https://mail.google.com/'].join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state: 'gmail_addset',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}
