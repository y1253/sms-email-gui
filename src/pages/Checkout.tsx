import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Mail, Smartphone, CreditCard, Loader2, Check, ChevronLeft, Zap,
} from 'lucide-react';
import { attachCard, listCards } from '@/api/billing';
import { createSet } from '@/api/sets';
import { usePricing, formatPrice } from '@/api/pricing';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string)
  : null;

function Spin({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} />;
}

interface CheckoutFormProps {
  emailId: number;
  phoneId: number;
  email: string;
  phone: string;
  promo?: string;
}

function CheckoutForm({ emailId, phoneId, email, phone, promo }: CheckoutFormProps) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { data: cards, isLoading: loadingCards } = useQuery({
    queryKey: ['cards'],
    queryFn: listCards,
  });
  const { data: pricing } = usePricing();

  const [selectedCardId, setSelectedCardId] = useState<string | 'new'>('new');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pre-select the first saved card once loaded
  useEffect(() => {
    if (cards && cards.length > 0 && selectedCardId === 'new') {
      setSelectedCardId(cards[0].id);
    }
  }, [cards]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      if (selectedCardId === 'new') {
        if (!stripe || !elements) {
          setError('Stripe failed to load. Please refresh.');
          setLoading(false);
          return;
        }
        const card = elements.getElement(CardElement);
        if (!card) { setLoading(false); return; }

        const { error: stripeErr, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card,
        });
        if (stripeErr) {
          setError(stripeErr.message ?? 'Card error');
          setLoading(false);
          return;
        }
        await attachCard(paymentMethod!.id);
      }

      await createSet(emailId, phoneId, promo);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
          <Check className="size-8 text-emerald-600" />
        </div>
        <div>
          <p className="text-base font-semibold">Set activated!</p>
          <p className="text-sm text-muted-foreground mt-0.5">Redirecting to dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order summary */}
      <div className="rounded-xl overflow-hidden ring-1 ring-foreground/8">
        <div className="px-4 py-3 bg-muted/30 border-b border-foreground/5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Activating
          </p>
        </div>
        <div className="px-4 py-3 space-y-2 bg-card">
          <div className="flex items-center gap-2.5">
            <Mail className="size-3.5 text-rose-400 shrink-0" />
            <span className="text-sm font-medium truncate">{email}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Smartphone className="size-3.5 text-violet-400 shrink-0" />
            <span className="text-sm text-muted-foreground">{phone}</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight">{formatPrice(pricing) || '…'}</p>
          <p className="text-sm text-muted-foreground mt-0.5">per {pricing?.interval ?? 'month'} · cancel anytime</p>
        </div>
        {promo && (
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
            Promo: {promo}
          </Badge>
        )}
      </div>

      <Separator />

      {/* Payment */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Payment method</p>

        {loadingCards ? (
          <div className="flex justify-center py-6"><Spin /></div>
        ) : (
          <>
            {(cards?.length ?? 0) > 0 && (
              <div className="space-y-2">
                {cards!.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCardId(c.id)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                      selectedCardId === c.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-input hover:bg-muted/50',
                    )}
                  >
                    <div className="flex h-6 w-10 shrink-0 items-center justify-center rounded bg-slate-800 text-[10px] font-bold uppercase tracking-wide text-white">
                      {c.brand}
                    </div>
                    <span className="font-medium">•••• {c.last4}</span>
                    <span className="text-muted-foreground text-xs ml-auto">
                      {c.expMonth}/{c.expYear}
                    </span>
                    {selectedCardId === c.id && (
                      <Check className="size-3.5 text-primary shrink-0" />
                    )}
                  </button>
                ))}

                <button
                  onClick={() => setSelectedCardId('new')}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                    selectedCardId === 'new'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-input hover:bg-muted/50',
                  )}
                >
                  <CreditCard className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Add new card</span>
                  {selectedCardId === 'new' && (
                    <Check className="size-3.5 text-primary ml-auto shrink-0" />
                  )}
                </button>
              </div>
            )}

            {selectedCardId === 'new' && (
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
            )}
          </>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button className="w-full gap-2" onClick={handleSubmit} disabled={loading}>
        {loading && <Spin />}
        {loading ? 'Processing…' : 'Pay & Activate'}
      </Button>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { data: pricing } = usePricing();

  useEffect(() => {
    if (!state?.emailId || !state?.phoneId) {
      navigate('/dashboard', { replace: true });
    }
  }, []);

  if (!state?.emailId || !state?.phoneId) {
    return null;
  }

  const { emailId, phoneId, email, phone, promo } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-foreground/5 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-2 px-5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Zap className="size-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold tracking-tight">SMSMail</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight">Checkout</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Activate your new set with a {formatPrice(pricing)}/{pricing?.interval ?? 'month'} subscription
          </p>
        </div>

        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              emailId={emailId}
              phoneId={phoneId}
              email={email}
              phone={phone}
              promo={promo}
            />
          </Elements>
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Set <code className="font-mono font-semibold">VITE_STRIPE_PUBLIC_KEY</code> in{' '}
            <code className="font-mono font-semibold">client/.env</code> and restart the dev server.
          </div>
        )}
      </main>
    </div>
  );
}
