import { useQuery } from '@tanstack/react-query';
import { listSubscriptions } from '@/api/billing';
import { useAppShell } from '@/components/layout/AppLayout';
import BillingSummary from '@/components/billing/BillingSummary';
import SubscriptionsSection from '@/components/billing/SubscriptionsSection';
import TransactionsTable from '@/components/billing/TransactionsTable';
import PaymentMethodsSection from '@/components/billing/PaymentMethodsSection';

export default function Billing() {
  const { openAddSet } = useAppShell();

  const { data: subs, isLoading, error, refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: listSubscriptions,
    // Hits Stripe on every call — don't refetch on every focus.
    staleTime: 30_000,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Billing</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Your subscriptions, payments, and saved cards
        </p>
      </div>

      <BillingSummary subs={subs} isLoading={isLoading} />

      <SubscriptionsSection
        subs={subs}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        onAddSet={() => openAddSet()}
      />

      <TransactionsTable />

      <PaymentMethodsSection subs={subs} />
    </div>
  );
}
