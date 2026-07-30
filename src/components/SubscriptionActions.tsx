import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { apiError } from '@/lib/errors';
import { formatLongDate } from '@/lib/format';
import { useSubscriptionActions } from '@/hooks/useSubscriptionActions';

function Spin({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} />;
}

interface Props {
  setId: number;
  pendingCancelAt: string | null;
  /** Promo sets have no Stripe subscription, so there is nothing to cancel. */
  isPromo?: boolean;
  className?: string;
}

/**
 * Cancel / confirm / resubscribe controls for one set's subscription. Shared by
 * SetSettingsDialog and the Billing page so both show identical copy.
 */
export default function SubscriptionActions({
  setId,
  pendingCancelAt,
  isPromo = false,
  className,
}: Props) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { cancelMut, resumeMut } = useSubscriptionActions(setId, {
    onCancelled: () => setConfirmCancel(false),
  });

  if (isPromo) return null;

  const cancelDate = formatLongDate(pendingCancelAt);

  if (pendingCancelAt) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-amber-200 bg-amber-50 text-amber-700 text-[11px]">
            Cancels {cancelDate}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Forwarding stays active until that date
          </span>
        </div>
        <Button size="sm" onClick={() => resumeMut.mutate()} disabled={resumeMut.isPending}>
          {resumeMut.isPending ? <Spin /> : 'Resubscribe'}
        </Button>
        <p className="text-xs text-muted-foreground">
          Billing continues as normal — you won't be charged again until {cancelDate}.
        </p>
        {resumeMut.isError && (
          <p className="text-xs text-destructive">{apiError(resumeMut.error)}</p>
        )}
      </div>
    );
  }

  if (confirmCancel) {
    return (
      <div
        className={cn(
          'rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2.5',
          className,
        )}
      >
        <p className="text-xs text-amber-800 flex gap-1.5 items-start">
          <AlertTriangle className="size-3.5 shrink-0 mt-0.5 text-amber-600" />
          Your subscription will be cancelled at the end of the billing period. Email
          forwarding stays active until then.
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => cancelMut.mutate()}
            disabled={cancelMut.isPending}
          >
            {cancelMut.isPending ? <Spin /> : 'Confirm cancel'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setConfirmCancel(false)}
            disabled={cancelMut.isPending}
          >
            Keep active
          </Button>
        </div>
        {cancelMut.isError && (
          <p className="text-xs text-destructive">{apiError(cancelMut.error)}</p>
        )}
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className={cn(
        'text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60 hover:bg-destructive/5',
        className,
      )}
      onClick={() => setConfirmCancel(true)}
    >
      Cancel subscription
    </Button>
  );
}
