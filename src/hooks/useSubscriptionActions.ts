import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cancelSubscription, resumeSubscription } from '@/api/sets';

/**
 * Cancel/resume mutations shared by the set settings dialog and the Billing
 * page. Both `['sets']` and `['subscriptions']` are invalidated so cancelling
 * from either surface updates the other.
 */
export function useSubscriptionActions(
  setId: number | undefined,
  opts?: { onCancelled?: () => void },
) {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['sets'] });
    qc.invalidateQueries({ queryKey: ['subscriptions'] });
  };

  const cancelMut = useMutation({
    mutationFn: () => cancelSubscription(setId!),
    onSuccess: () => {
      invalidate();
      opts?.onCancelled?.();
      toast.success('Subscription cancelled');
    },
  });

  const resumeMut = useMutation({
    mutationFn: () => resumeSubscription(setId!),
    onSuccess: () => {
      invalidate();
      toast.success('Subscription resumed');
    },
  });

  return { cancelMut, resumeMut };
}
