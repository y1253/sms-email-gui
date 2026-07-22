import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Mail, Smartphone, Loader2, CreditCard, ChevronLeft, Trash2,
} from 'lucide-react';
import { getAdminAccount, type AdminAccountSet } from '@/api/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const SESSION_KEY = 'admin_pwd';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function SetStatusBadge({ set }: { set: AdminAccountSet }) {
  if (set.status === 'cancelled') {
    return (
      <Badge variant="secondary" className="text-[11px]">
        Cancelled{set.deletedAt ? ` · ${formatDate(set.deletedAt)}` : ''}
      </Badge>
    );
  }
  if (set.status === 'pending_cancel') {
    return (
      <Badge className="border-amber-200 bg-amber-50 text-amber-700 text-[11px]">
        Cancels{set.pendingCancelAt ? ` ${formatDate(set.pendingCancelAt)}` : ''}
      </Badge>
    );
  }
  return (
    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]">
      Active
    </Badge>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default function AdminAccountDetail() {
  const navigate = useNavigate();
  const { userId: userIdParam } = useParams();
  const userId = Number(userIdParam);
  const password = sessionStorage.getItem(SESSION_KEY) ?? '';

  // Self-gate: without the admin password there's nothing to fetch with, so
  // bounce back to the password prompt on /admin.
  if (!password) {
    return <Navigate to="/admin" replace />;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-account', userId],
    queryFn: () => getAdminAccount(password, userId),
    enabled: Number.isFinite(userId),
  });

  const txTotal = data
    ? data.transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 gap-1.5 text-muted-foreground"
          onClick={() => navigate('/admin')}
        >
          <ChevronLeft className="size-4" />
          Back to accounts
        </Button>

        {isLoading || !data ? (
          isError ? (
            <div className="py-16 text-center text-sm text-destructive">
              Failed to load account.{' '}
              <button className="underline" onClick={() => navigate('/admin')}>
                Back to accounts
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )
        ) : (
          <div className="space-y-6">
            {/* Header / profile */}
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight">{data.name}</h1>
                <Badge
                  className={
                    data.active
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]'
                      : 'text-[11px]'
                  }
                  variant={data.active ? 'default' : 'secondary'}
                >
                  {data.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                <span>{data.email ?? '—'}</span>
                <span className="flex items-center gap-2 text-xs">
                  {data.authType && (
                    <Badge variant="secondary" className="text-[11px]">
                      {data.authType}
                    </Badge>
                  )}
                  <span>Joined {formatDate(data.createdAt)}</span>
                  <span className="text-muted-foreground/60">·</span>
                  <span>ID {data.userId}</span>
                </span>
                {data.stripeCustomerId && (
                  <span className="flex items-center gap-1.5 text-xs">
                    <CreditCard className="size-3.5 shrink-0" />
                    <span className="font-mono">{data.stripeCustomerId}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Summary stats */}
            <Card className="ring-1 ring-foreground/8 shadow-sm">
              <CardContent className="flex flex-wrap gap-x-10 gap-y-4">
                <Stat value={data.setCounts.total} label="Total sets" />
                <Stat value={data.setCounts.active} label="Active sets" />
                <Stat value={data.transactions.length} label="Transactions" />
                <Stat value={`$${txTotal.toFixed(2)}`} label="Total charged" />
              </CardContent>
            </Card>

            {/* Emails & Phones */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="ring-1 ring-foreground/8 shadow-sm">
                <CardContent className="space-y-3">
                  <p className="text-sm font-semibold">Emails</p>
                  {data.emails.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No emails.</p>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {data.emails.map((e, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Mail className="mt-0.5 size-3.5 shrink-0 text-rose-400" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={
                                  e.deletedAt
                                    ? 'truncate line-through text-muted-foreground'
                                    : 'truncate font-medium'
                                }
                              >
                                {e.email}
                              </span>
                              {e.deletedAt && (
                                <Badge variant="secondary" className="shrink-0 gap-1 text-[10px]">
                                  <Trash2 className="size-3" />
                                  {formatDate(e.deletedAt)}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Added {formatDate(e.addedAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="ring-1 ring-foreground/8 shadow-sm">
                <CardContent className="space-y-3">
                  <p className="text-sm font-semibold">Phones</p>
                  {data.phones.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No phones.</p>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {data.phones.map((p, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Smartphone className="mt-0.5 size-3.5 shrink-0 text-violet-400" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={
                                  p.deletedAt
                                    ? 'truncate line-through text-muted-foreground'
                                    : 'truncate font-medium'
                                }
                              >
                                {p.phone}
                              </span>
                              {p.deletedAt && (
                                <Badge variant="secondary" className="shrink-0 gap-1 text-[10px]">
                                  <Trash2 className="size-3" />
                                  {formatDate(p.deletedAt)}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Added {formatDate(p.addedAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sets — active and deleted together */}
            <Card className="ring-1 ring-foreground/8 shadow-sm">
              <CardContent className="space-y-3">
                <p className="text-sm font-semibold">
                  Sets{' '}
                  <span className="text-xs font-normal text-muted-foreground">
                    ({data.setCounts.active} active · {data.setCounts.total} total)
                  </span>
                </p>
                {data.sets.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No sets.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {data.sets.map((s) => (
                      <div
                        key={s.setId}
                        className="rounded-lg border border-border p-3 space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 flex-col gap-0.5 text-sm">
                            <span className="flex items-center gap-1.5">
                              <Mail className="size-3.5 shrink-0 text-rose-400" />
                              <span className="truncate font-medium">{s.email ?? '—'}</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <Smartphone className="size-3.5 shrink-0 text-violet-400" />
                              <span>{s.phone ?? '—'}</span>
                            </span>
                          </div>
                          <SetStatusBadge set={s} />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>Created {formatDate(s.createdAt)}</span>
                          {s.promo ? (
                            <Badge variant="secondary" className="text-[11px]">
                              PROMO
                            </Badge>
                          ) : s.stripeSubscriptionId ? (
                            <span className="font-mono">{s.stripeSubscriptionId}</span>
                          ) : (
                            <span>No subscription</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card className="ring-1 ring-foreground/8 shadow-sm">
              <CardContent className="space-y-3">
                <p className="text-sm font-semibold">Transactions</p>
                {data.transactions.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No transactions.</p>
                ) : (
                  <div className="flex flex-col">
                    {data.transactions.map((t, i) => (
                      <div key={i}>
                        {i > 0 && <Separator />}
                        <div className="flex items-center justify-between py-2 text-sm">
                          <span className="font-medium">${t.amount}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(t.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
