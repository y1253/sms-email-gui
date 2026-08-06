// Sign-in / sign-up only. `openid` is required — without it Google returns no
// id_token and the server rejects the exchange. No offline access: the login
// path discards refresh tokens, and asking for them only adds a consent prompt.
export function buildGoogleAuthUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI as string,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
    state: 'auth',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

// Builds the Google consent URL for connecting a Gmail account to a set.
// Requests the two narrowest scopes that cover what the server actually does:
// readonly (watch / history / fetch message bodies) and send (reply / compose).
// Deliberately NOT the full-mailbox scope — nothing in the app deletes or
// modifies mail, and the consent screen must match the scopes registered on the
// Cloud Console. `openid` is required for the id_token the server reads the
// connected address from. Offline access + forced consent so a refresh token is
// always returned and the scope checkboxes are re-shown on retry.
// Shared by AddSetModal (initiate) and GoogleCallback (retry after failure).
export function buildGmailConnectUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI as string,
    response_type: 'code',
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state: 'gmail_addset',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}
