import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CreditCard, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteCard, listCards, type BillingSubscription } from '@/api/billing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { apiError } from '@/lib/errors';
import AddCardDialog from './AddCardDialog';

function Spin({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} />;
}

interface Props {
  /** Used to warn before removing the last card while a paid set is live. */
  subs: BillingSubscription[] | undefined;
}

export default function PaymentMethodsSection({ subs }: Props) {
  const qc = useQueryClient();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const { data: cards, isLoading, error, refetch } = useQuery({
    queryKey: ['cards'],
    queryFn: listCards,
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteCard(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cards'] });
      setConfirmId(null);
      toast.success('Card removed');
    },
    onError: (err) => toast.error(apiError(err, "Couldn't remove card")),
  });

  // Removing the only card leaves nothing to bill: the renewal fails and the
  // webhook tears the set down.
  const hasBillableSub = (subs ?? []).some((s) => !s.promo && s.status === 'active');
  const isLastCard = (cards?.length ?? 0) === 1;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Payment methods</h2>
        {(cards?.length ?? 0) > 0 && (
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setAddOpen(true)}>
            <Plus className="size-3.5" />
            Add card
          </Button>
        )}
      </div>

      <Card className="ring-1 ring-foreground/8 shadow-sm">
        <CardContent className="p-5">
          {isLoading ? (
            <div className="space-y-2">
              {[0, 1].map((i) => <Skeleton key={i} className="h-11 w-full" />)}
            </div>
          ) : error ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-destructive">{apiError(error, "Couldn't load cards")}</p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
            </div>
          ) : (cards?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center gap-3 py-5 text-center">
              <p className="text-sm font-medium">No cards saved</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Add a card so your subscriptions can renew.
              </p>
              <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
                <Plus className="size-3.5" />
                Add card
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {cards!.map((c) => (
                <div key={c.id} className="space-y-2">
                  <div className="flex items-center gap-3 rounded-lg border border-input px-3 py-2.5 text-sm">
                    <div className="flex h-6 w-10 shrink-0 items-center justify-center rounded bg-slate-800 text-[10px] font-bold uppercase tracking-wide text-white">
                      {c.brand}
                    </div>
                    <span className="font-medium">•••• {c.last4}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {c.expMonth}/{c.expYear}
                    </span>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Remove card"
                      onClick={() => setConfirmId(confirmId === c.id ? null : c.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>

                  {confirmId === c.id && (
                    <div className="space-y-2.5 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                      <p className="flex items-start gap-1.5 text-xs text-destructive">
                        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                        {isLastCard && hasBillableSub
                          ? 'This is your only card. Without one, your next renewal will fail and email forwarding will be cancelled.'
                          : `Remove the card ending in ${c.last4}?`}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMut.mutate(c.id)}
                          disabled={deleteMut.isPending}
                        >
                          {deleteMut.isPending ? <Spin /> : 'Remove card'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmId(null)}
                          disabled={deleteMut.isPending}
                        >
                          Keep card
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <p className="flex items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
                <CreditCard className="size-3" />
                Renewals are charged to your default card.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddCardDialog open={addOpen} onOpenChange={setAddOpen} />
    </section>
  );
}
