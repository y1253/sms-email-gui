import { CreditCard, CalendarClock, Zap } from 'lucide-react';
import type { BillingSubscription } from '@/api/billing';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatMoney } from '@/lib/format';

interface Props {
  subs: BillingSubscription[] | undefined;
  isLoading: boolean;
}

export default function BillingSummary({ subs, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="ring-1 ring-foreground/8 shadow-sm">
            <CardContent className="p-5 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const all = subs ?? [];
  const active = all.filter((s) => s.status === 'active');
  const promoCount = all.filter((s) => s.promo).length;
  const endingSoon = all.filter((s) => s.status === 'pending_cancel').length;

  // Pending-cancel subscriptions won't be billed again, so they don't count
  // toward the recurring monthly total.
  const billable = active.filter((s) => !s.promo);
  const monthlyTotal = billable.reduce((sum, s) => sum + (s.amount ?? 0), 0);
  const currency = billable.find((s) => s.currency)?.currency ?? 'usd';

  const nextBilling = billable
    .map((s) => s.currentPeriodEnd)
    .filter((d): d is string => !!d)
    .sort()[0];

  const tiles = [
    {
      label: 'Active subscriptions',
      value: String(active.length),
      hint: promoCount > 0 ? `incl. ${promoCount} promo` : null,
      icon: Zap,
    },
    {
      label: 'Monthly total',
      value: formatMoney(monthlyTotal, currency),
      hint: endingSoon > 0 ? `${endingSoon} ending soon` : null,
      icon: CreditCard,
    },
    {
      label: 'Next billing',
      value: nextBilling ? formatDate(nextBilling) : '—',
      hint: null,
      icon: CalendarClock,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tiles.map(({ label, value, hint, icon: Icon }) => (
        <Card key={label} className="ring-1 ring-foreground/8 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="size-3.5 shrink-0" />
              <p className="text-[11px] font-medium uppercase tracking-wide">{label}</p>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
            <p className="mt-0.5 h-4 text-[11px] text-muted-foreground">{hint ?? ''}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
