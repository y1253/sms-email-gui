import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { attachCard } from '@/api/billing';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { apiError } from '@/lib/errors';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string)
  : null;

function Spin({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} />;
}

function AddCardForm({ onDone }: { onDone: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const qc = useQueryClient();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return;

    setLoading(true);
    setError('');
    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card,
      });
      if (stripeError || !paymentMethod) {
        setError(stripeError?.message ?? 'Could not read card details');
        return;
      }
      await attachCard(paymentMethod.id);
      qc.invalidateQueries({ queryKey: ['cards'] });
      toast.success('Card saved');
      onDone();
    } catch (err) {
      setError(apiError(err, "Couldn't save card"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-input bg-transparent px-3 py-2.5 transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '14px',
                fontFamily: 'inherit',
                color: 'oklch(0.145 0 0)',
                '::placeholder': { color: 'oklch(0.556 0 0)' },
              },
            },
          }}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button className="w-full gap-2" onClick={handleSubmit} disabled={loading || !stripe}>
        {loading && <Spin />}
        {loading ? 'Saving…' : 'Save card'}
      </Button>
    </div>
  );
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddCardDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a card</DialogTitle>
          <DialogDescription>
            Saved cards are used for your subscription renewals.
          </DialogDescription>
        </DialogHeader>

        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <AddCardForm onDone={() => onOpenChange(false)} />
          </Elements>
        ) : (
          <p className="text-sm text-muted-foreground">
            Card entry is unavailable — set <code>VITE_STRIPE_PUBLIC_KEY</code> to enable it.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
