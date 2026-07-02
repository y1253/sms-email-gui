import { useQuery } from '@tanstack/react-query';
import { Mail, Smartphone, Loader2, CreditCard } from 'lucide-react';
import { getAdminAccount, type AdminAccountSet } from '@/api/admin';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Props {
  userId: number | null;
  password: string;
  onClose: () => void;
}

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

export default function AdminAccountDialog({ userId, password, onClose }: Props) {
  const open = userId != null;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-account', userId],
    queryFn: () => getAdminAccount(password, userId as number),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        {isLoading || !data ? (
          isError ? (
            <div className="py-8 text-center text-sm text-destructive">
              Failed to load account.
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>{data.name}</DialogTitle>
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
              <div className="mt-1 flex flex-col gap-0.5 text-sm text-muted-foreground">
                <span>{data.email ?? '—'}</span>
                <span className="flex items-center gap-2 text-xs">
                  {data.authType && (
                    <Badge variant="secondary" className="text-[11px]">
                      {data.authType}
                    </Badge>
                  )}
                  <span>Joined {formatDate(data.createdAt)}</span>
                </span>
                {data.stripeCustomerId && (
                  <span className="flex items-center gap-1.5 text-xs">
                    <CreditCard className="size-3.5 shrink-0" />
                    <span className="font-mono">{data.stripeCustomerId}</span>
                  </span>
                )}
              </div>
            </DialogHeader>

            {/* Summary */}
            <div className="flex gap-4 text-sm">
              <div>
                <span className="font-semibold">{data.setCounts.total}</span>{' '}
                <span className="text-muted-foreground">total sets</span>
              </div>
              <div>
                <span className="font-semibold">{data.setCounts.active}</span>{' '}
                <span className="text-muted-foreground">active</span>
              </div>
            </div>

            <Separator />

            {/* Sets */}
            <div className="space-y-2.5">
              <p className="text-sm font-medium">Sets</p>
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
                        <div className="flex flex-col gap-0.5 text-sm min-w-0">
                          <span className="flex items-center gap-1.5">
                            <Mail className="size-3.5 text-rose-400 shrink-0" />
                            <span className="font-medium truncate">
                              {s.email ?? '—'}
                            </span>
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Smartphone className="size-3.5 text-violet-400 shrink-0" />
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
            </div>

            <Separator />

            {/* Transactions */}
            <div className="space-y-2.5">
              <p className="text-sm font-medium">Transactions</p>
              {data.transactions.length === 0 ? (
                <p className="text-xs text-muted-foreground">No transactions.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {data.transactions.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-medium">${t.amount}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(t.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
