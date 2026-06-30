import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Account = {
  userId: number;
  name: string;
  email: string | null;
  authType: string | null;
  createdAt: string;
  emails: string[];
  phones: string[];
};

const SESSION_KEY = 'admin_pwd';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[] | null>(null);

  async function fetchAccounts(pwd: string): Promise<Account[]> {
    const res = await api.get<Account[]>('/admin/accounts', {
      headers: { 'x-admin-password': pwd },
    });
    // Guard against a misrouted request returning the SPA's index.html (HTTP 200,
    // but the body is HTML, not the accounts array) — otherwise the table render
    // crashes on accounts.map and the page goes blank.
    if (!Array.isArray(res.data)) {
      throw new Error('Unexpected response from /admin/accounts');
    }
    return res.data;
  }

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setLoading(true);
      fetchAccounts(saved)
        .then(setAccounts)
        .catch(() => sessionStorage.removeItem(SESSION_KEY))
        .finally(() => setLoading(false));
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await fetchAccounts(password);
      sessionStorage.setItem(SESSION_KEY, password);
      setAccounts(data);
    } catch {
      setError('Incorrect password.');
    } finally {
      setLoading(false);
    }
  }

  function handleLock() {
    sessionStorage.removeItem(SESSION_KEY);
    setAccounts(null);
    setPassword('');
  }

  if (loading && accounts === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (accounts === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm ring-1 ring-foreground/8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label htmlFor="admin-pwd" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="admin-pwd"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>
              <Button type="submit" disabled={!password || loading} className="w-full">
                {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Enter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin — Accounts</h1>
            <p className="mt-1 text-sm text-muted-foreground">{accounts.length} accounts</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLock}>
            Lock
          </Button>
        </div>

        <Card className="overflow-hidden ring-1 ring-foreground/8 shadow-sm p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Auth</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Connected Emails</th>
                  <th className="px-4 py-3">Phones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {accounts.map((a) => (
                  <tr key={a.userId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{a.userId}</td>
                    <td className="px-4 py-3 font-medium">{a.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.email ?? '—'}</td>
                    <td className="px-4 py-3">
                      {a.authType ? (
                        <Badge
                          variant={a.authType === 'google' ? 'default' : 'secondary'}
                          className="text-[11px]"
                        >
                          {a.authType}
                        </Badge>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(a.createdAt)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {a.emails.length ? a.emails.join(', ') : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {a.phones.length ? a.phones.join(', ') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
