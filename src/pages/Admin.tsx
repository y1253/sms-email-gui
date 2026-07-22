import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight } from 'lucide-react';
import {
  getAdminAccounts,
  getDeletedContacts,
  type AdminAccount,
  type DeletedContacts,
} from '@/api/admin';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Account = AdminAccount;

const SESSION_KEY = 'admin_pwd';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Admin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [deleted, setDeleted] = useState<DeletedContacts | null>(null);
  const [view, setView] = useState<'accounts' | 'deleted'>('accounts');

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setLoading(true);
      getAdminAccounts(saved)
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
      const data = await getAdminAccounts(password);
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
    setDeleted(null);
    setPassword('');
    setView('accounts');
  }

  const deletedCount = deleted ? deleted.emails.length + deleted.phones.length : null;

  const adminPwd = sessionStorage.getItem(SESSION_KEY) ?? '';

  // Load the deletion archive once authenticated.
  useEffect(() => {
    if (accounts && adminPwd) {
      getDeletedContacts(adminPwd).then(setDeleted).catch(() => {});
    }
  }, [accounts]);

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
            <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {view === 'accounts'
                ? `${accounts.length} account${accounts.length === 1 ? '' : 's'}`
                : deletedCount === null
                  ? 'Loading…'
                  : `${deletedCount} archived deletion${deletedCount === 1 ? '' : 's'}`}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLock}>
            Lock
          </Button>
        </div>

        {/* View toggle */}
        <div className="mb-4 inline-flex rounded-lg border border-border bg-muted/40 p-1">
          {(['accounts', 'deleted'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                view === v
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {v === 'accounts' ? 'Accounts' : 'Deleted'}
              {v === 'deleted' && deletedCount ? (
                <span className="ml-1.5 text-xs text-muted-foreground">{deletedCount}</span>
              ) : null}
            </button>
          ))}
        </div>

        {view === 'accounts' && (
        <Card className="overflow-hidden ring-1 ring-foreground/8 shadow-sm p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Auth</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Sets</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Connected Emails</th>
                  <th className="px-4 py-3">Phones</th>
                  <th className="px-4 py-3" aria-label="View" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {accounts.map((a) => (
                  <tr
                    key={a.userId}
                    onClick={() => navigate(`/admin/accounts/${a.userId}`)}
                    className="group cursor-pointer hover:bg-muted/30 transition-colors"
                  >
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
                    <td className="px-4 py-3">
                      <Badge
                        variant={a.active ? 'default' : 'secondary'}
                        className={
                          a.active
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]'
                            : 'text-[11px]'
                        }
                      >
                        {a.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.setCount}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(a.createdAt)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {a.emails.length ? a.emails.join(', ') : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {a.phones.length ? a.phones.join(', ') : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ChevronRight className="inline size-4 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        )}

        {view === 'deleted' && (
          deleted ? (
          <Card className="overflow-hidden ring-1 ring-foreground/8 shadow-sm p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Value</th>
                    <th className="px-4 py-3">Account #</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Deleted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ...deleted.emails.map((d) => ({ ...d, type: 'email' as const })),
                    ...deleted.phones.map((d) => ({ ...d, type: 'phone' as const })),
                  ]
                    .sort((a, b) => +new Date(b.deletedAt) - +new Date(a.deletedAt))
                    .map((d) => (
                      <tr key={`${d.type}-${d.originalId}-${d.deletedAt}`}>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-[11px]">
                            {d.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium">{d.value}</td>
                        <td className="px-4 py-3 text-muted-foreground">{d.userId}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(d.createdAt)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(d.deletedAt)}</td>
                      </tr>
                    ))}
                  {deleted.emails.length + deleted.phones.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                        No deletions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
          ) : (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )
        )}
      </div>
    </div>
  );
}
