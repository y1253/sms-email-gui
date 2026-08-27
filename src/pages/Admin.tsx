import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Search,
  X,
} from 'lucide-react';
import {
  getAdminAccounts,
  getDeletedContacts,
  type AdminAccount,
  type DeletedContacts,
} from '@/api/admin';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type Account = AdminAccount;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

type SortKey = 'userId' | 'name' | 'email' | 'setCount' | 'createdAt';
type Sort = { key: SortKey; dir: 'asc' | 'desc' };

type StatusFilter = 'all' | 'active' | 'inactive';
type SetsFilter = 'all' | 'has' | 'none';
type CancelFilter = 'all' | 'cancelling' | 'cancelled';

const NO_NAME = '—';

/** Digits only, so "5551234" matches a stored "+1 (555) 123-4567". */
const digits = (v: string) => v.replace(/\D/g, '');

/** The two text columns can be empty; those rows sort last either direction. */
function blankFor(a: Account, key: SortKey) {
  if (key === 'name') return !a.name || a.name === NO_NAME;
  if (key === 'email') return !a.email;
  return false;
}

function compareBy(a: Account, b: Account, key: SortKey): number {
  switch (key) {
    case 'userId':
      return a.userId - b.userId;
    case 'setCount':
      return a.setCount - b.setCount;
    case 'createdAt':
      return +new Date(a.createdAt) - +new Date(b.createdAt);
    case 'name':
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    case 'email':
      return (a.email ?? '').localeCompare(b.email ?? '', undefined, {
        sensitivity: 'base',
      });
  }
}

/** Matched against name, login email, id, and every connected email/phone. */
function matchesQuery(a: Account, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [a.name, a.email ?? '', String(a.userId), ...a.emails].join(' ');
  if (haystack.toLowerCase().includes(needle)) return true;
  const asDigits = digits(needle);
  return (
    !!asDigits && a.phones.some((p) => digits(p).includes(asDigits))
  );
}

/**
 * A segmented control, same shape as the Accounts/Deleted view toggle below —
 * there is no `select` primitive in components/ui, and one isn't worth adding
 * for three fixed choices apiece.
 */
function FilterGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              value === o.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  sort: Sort;
  onSort: (key: SortKey) => void;
}) {
  const active = sort.key === sortKey;
  const Arrow = active && sort.dir === 'asc' ? ChevronUp : ChevronDown;
  return (
    <th className="px-4 py-3">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
        className={cn(
          'inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-foreground',
          active && 'text-foreground',
        )}
      >
        {label}
        <Arrow className={cn('size-3', active ? 'opacity-100' : 'opacity-25')} />
      </button>
    </th>
  );
}

/**
 * Billing at a glance: a scheduled cancellation is the thing worth spotting in
 * a list, so it wins over the renewal date. All of it comes live from Stripe.
 */
function BillingCell({ account: a }: { account: Account }) {
  if (a.pendingCancelCount > 0) {
    return (
      <Badge className="border-amber-200 bg-amber-50 text-amber-700 text-[11px]">
        Cancels{a.pendingCancelAt ? ` ${formatDate(a.pendingCancelAt)}` : ''}
        {a.pendingCancelCount > 1 ? ` (${a.pendingCancelCount})` : ''}
      </Badge>
    );
  }
  if (a.nextRenewalAt) {
    return (
      <span className="text-muted-foreground">
        Renews {formatDate(a.nextRenewalAt)}
      </span>
    );
  }
  // No paid subscription at all — distinguish a free promo set from nothing.
  if (a.promoCount > 0) {
    return (
      <Badge variant="secondary" className="text-[11px]">
        Promo
      </Badge>
    );
  }
  return <span className="text-muted-foreground">—</span>;
}

export default function Admin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [deleted, setDeleted] = useState<DeletedContacts | null>(null);
  const [view, setView] = useState<'accounts' | 'deleted'>('accounts');

  // Filtering, sorting and search all run client-side: the endpoint is
  // unpaginated and already ships the whole list, and cancellation status is
  // resolved from Stripe in JS after the SQL runs, so it can't be a WHERE.
  const [query, setQuery] = useState('');
  const [joinedFrom, setJoinedFrom] = useState('');
  const [joinedTo, setJoinedTo] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [setsFilter, setSetsFilter] = useState<SetsFilter>('all');
  const [cancelFilter, setCancelFilter] = useState<CancelFilter>('all');
  const [sort, setSort] = useState<Sort>({ key: 'createdAt', dir: 'desc' });

  // Access is enforced server-side by the JWT + ADMIN_EMAILS allowlist. Just try
  // to load; a 401/403 means this user isn't an admin.
  useEffect(() => {
    setLoading(true);
    getAdminAccounts()
      .then(setAccounts)
      .catch((err) => {
        const status = err?.response?.status;
        setError(
          status === 401 || status === 403
            ? 'You are not authorized to view this page.'
            : 'Failed to load admin data.',
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const deletedCount = deleted ? deleted.emails.length + deleted.phones.length : null;

  // Load the deletion archive once the accounts have loaded.
  useEffect(() => {
    if (accounts) {
      getDeletedContacts().then(setDeleted).catch(() => {});
    }
  }, [accounts]);

  const filtered = useMemo(() => {
    if (!accounts) return [];
    // Both bounds are inclusive: the To date covers the whole day it names.
    const from = joinedFrom ? new Date(`${joinedFrom}T00:00:00`) : null;
    const to = joinedTo ? new Date(`${joinedTo}T23:59:59.999`) : null;

    const rows = accounts.filter((a) => {
      if (!matchesQuery(a, query)) return false;

      const joined = new Date(a.createdAt);
      if (from && joined < from) return false;
      if (to && joined > to) return false;

      // `active` is a nullable tinyint; null reads as inactive, matching the
      // Status badge.
      if (statusFilter === 'active' && !a.active) return false;
      if (statusFilter === 'inactive' && a.active) return false;

      if (setsFilter === 'has' && a.setCount === 0) return false;
      if (setsFilter === 'none' && a.setCount > 0) return false;

      if (cancelFilter === 'cancelling' && a.pendingCancelCount === 0) return false;
      if (cancelFilter === 'cancelled' && a.cancelledCount === 0) return false;

      return true;
    });

    const factor = sort.dir === 'asc' ? 1 : -1;
    return rows.sort((a, b) => {
      const blankA = blankFor(a, sort.key);
      const blankB = blankFor(b, sort.key);
      if (blankA !== blankB) return blankA ? 1 : -1;
      return compareBy(a, b, sort.key) * factor;
    });
  }, [accounts, query, joinedFrom, joinedTo, statusFilter, setsFilter, cancelFilter, sort]);

  // A new column starts newest/largest first; dates and counts read better that
  // way, names and emails A-Z.
  const toggleSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'name' || key === 'email' ? 'asc' : 'desc' },
    );

  const filtersActive =
    !!query ||
    !!joinedFrom ||
    !!joinedTo ||
    statusFilter !== 'all' ||
    setsFilter !== 'all' ||
    cancelFilter !== 'all';

  const clearFilters = () => {
    setQuery('');
    setJoinedFrom('');
    setJoinedTo('');
    setStatusFilter('all');
    setSetsFilter('all');
    setCancelFilter('all');
  };

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
            <CardTitle className="text-lg">Admin</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {error || 'Unable to load admin data.'}
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
              Back to dashboard
            </Button>
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
                ? filtersActive
                  ? `${filtered.length} of ${accounts.length} account${accounts.length === 1 ? '' : 's'}`
                  : `${accounts.length} account${accounts.length === 1 ? '' : 's'}`
                : deletedCount === null
                  ? 'Loading…'
                  : `${deletedCount} archived deletion${deletedCount === 1 ? '' : 's'}`}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            Dashboard
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
        <>
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Search</span>
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, email, phone, or #"
                className="pl-8"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Joined from</span>
            <Input
              type="date"
              value={joinedFrom}
              max={joinedTo || undefined}
              onChange={(e) => setJoinedFrom(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Joined to</span>
            <Input
              type="date"
              value={joinedTo}
              min={joinedFrom || undefined}
              onChange={(e) => setJoinedTo(e.target.value)}
              className="w-40"
            />
          </div>

          <FilterGroup
            label="Account"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
          <FilterGroup
            label="Sets"
            value={setsFilter}
            onChange={setSetsFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'has', label: 'Has set' },
              { value: 'none', label: 'No sets' },
            ]}
          />
          <FilterGroup
            label="Cancellation"
            value={cancelFilter}
            onChange={setCancelFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'cancelling', label: 'Cancelling' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />

          {filtersActive && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="size-3.5" />
              Clear
            </Button>
          )}
        </div>

        {/* One Stripe call feeds every row's Billing cell, so if it failed the
            whole column is blank — say so instead of implying nobody pays. */}
        {accounts[0]?.subscriptionsError && (
          <p className="mb-2 text-xs text-destructive">
            {accounts[0].subscriptionsError} — the Billing column is unavailable.
          </p>
        )}
        <Card className="overflow-hidden ring-1 ring-foreground/8 shadow-sm p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <SortHeader label="#" sortKey="userId" sort={sort} onSort={toggleSort} />
                  <SortHeader label="Name" sortKey="name" sort={sort} onSort={toggleSort} />
                  <SortHeader label="Email" sortKey="email" sort={sort} onSort={toggleSort} />
                  <th className="px-4 py-3">Auth</th>
                  <th className="px-4 py-3">Status</th>
                  <SortHeader label="Sets" sortKey="setCount" sort={sort} onSort={toggleSort} />
                  <th className="px-4 py-3">Billing</th>
                  <SortHeader label="Joined" sortKey="createdAt" sort={sort} onSort={toggleSort} />
                  <th className="px-4 py-3">Connected Emails</th>
                  <th className="px-4 py-3">Phones</th>
                  <th className="px-4 py-3" aria-label="View" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a) => (
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
                    <td className="px-4 py-3">
                      <BillingCell account={a} />
                    </td>
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
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-4 py-6 text-center text-muted-foreground">
                      {accounts.length === 0
                        ? 'No accounts yet.'
                        : 'No accounts match these filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
        </>
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
