import { useState, useEffect } from 'react';
import api from '../api/client';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (accounts === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-sm">
          <h1 className="mb-6 text-xl font-semibold text-gray-900">Admin Access</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="admin-pwd"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              autoFocus
            />
            <Button type="submit" loading={loading} disabled={!password}>
              Enter
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin — Accounts</h1>
            <p className="mt-1 text-sm text-gray-500">{accounts.length} accounts</p>
          </div>
          <Button variant="secondary" onClick={handleLock}>
            Lock
          </Button>
        </div>

        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
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
            <tbody className="divide-y divide-gray-100">
              {accounts.map((a) => (
                <tr key={a.userId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{a.userId}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                  <td className="px-4 py-3 text-gray-600">{a.email ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      a.authType === 'google'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {a.authType ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(a.createdAt)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {a.emails.length ? a.emails.join(', ') : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {a.phones.length ? a.phones.join(', ') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
