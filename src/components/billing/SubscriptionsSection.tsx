import { Link } from 'react-router-dom';
import { Mail, Smartphone, Plus } from 'lucide-react';
import type { BillingSubscription } from '@/api/billing';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SubscriptionActions from '@/components/SubscriptionActions';
import { apiError } from '@/lib/errors';
import { billingLine } from '@/lib/billing';

interface Props {
  subs: BillingSubscription[] | undefined;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  onAddSet: () => void;
}

/** Adapts the customer-side shape to the shared line builder. */
function subLine(s: BillingSubscription): string {
  return billingLine({
    promo: s.promo,
    amount: s.amount,
    currency: s.currency,
    interval: s.interval,
    cancelling: s.status === 'pending_cancel',
    periodEnd: s.currentPeriodEnd,
  });
}

export default function SubscriptionsSection({
  subs, isLoading, error, onRetry, onAddSet,
}: Props) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold">Active subscriptions</h2>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <Card key={i} className="ring-1 ring-foreground/8 shadow-sm">
              <CardContent className="p-5 space-y-2">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="ring-1 ring-foreground/8 shadow-sm">
          <CardContent className="flex flex-col items-start gap-3 p-5">
            <p className="text-sm text-destructive">{apiError(error, "Couldn't load subscriptions")}</p>
            <Button size="sm" variant="outline" onClick={onRetry}>Retry</Button>
          </CardContent>
        </Card>
      ) : (subs?.length ?? 0) === 0 ? (
        <Card className="ring-1 ring-foreground/8 shadow-sm">
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-sm font-medium">No active subscriptions</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Create a set to start forwarding Gmail emails to your phone as SMS.
            </p>
            <Button size="sm" className="gap-1.5" onClick={onAddSet}>
              <Plus className="size-3.5" />
              Create a set
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {subs!.map((s) => (
            <Card key={s.setId} className="ring-1 ring-foreground/8 shadow-sm">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {s.promo ? (
                      <Badge className="border-violet-200 bg-violet-50 text-violet-700 text-[11px]">
                        Promo
                      </Badge>
                    ) : s.status === 'pending_cancel' ? (
                      <Badge className="border-amber-200 bg-amber-50 text-amber-700 text-[11px]">
                        Cancelling
                      </Badge>
                    ) : (
                      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]">
                        Active
                      </Badge>
                    )}
                    <Link
                      to="/dashboard"
                      className={buttonVariants({
                        variant: 'ghost',
                        size: 'xs',
                        className: 'text-muted-foreground hover:text-foreground',
                      })}
                    >
                      Manage set
                    </Link>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="size-3.5 shrink-0 text-rose-400" />
                      <span className="truncate text-sm font-medium">{s.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="size-3.5 shrink-0 text-violet-400" />
                      <span className="text-sm text-muted-foreground">{s.phone}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">{subLine(s)}</p>
                </div>

                <div className="shrink-0 sm:max-w-xs">
                  {s.promo ? (
                    <p className="text-xs text-muted-foreground">
                      No billing on promo sets. Delete the set from Sets to stop forwarding.
                    </p>
                  ) : (
                    <SubscriptionActions
                      setId={s.setId}
                      pendingCancelAt={s.pendingCancelAt}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
