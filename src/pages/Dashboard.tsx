import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Mail, Smartphone, CreditCard, Zap,
  CheckCircle2, Loader2, Trash2, ExternalLink, LogOut, Plus,
} from 'lucide-react';
import { listSets, createSet, deleteSet } from '@/api/sets';
import { listEmails } from '@/api/emails';
import { listPhones, addPhone, verifyPhone, deletePhone } from '@/api/phones';
import { listCards, attachCard, deleteCard } from '@/api/billing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string)
  : null;

function buildGmailConnectUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI as string,
    response_type: 'code',
    scope: ['email', 'profile', 'https://mail.google.com/'].join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state: 'gmail',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

function Spin({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} />;
}

// ─── Section card shell ───────────────────────────────────────────────────────

interface SectionCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

function SectionCard({ icon, iconBg, title, description, badge, children }: SectionCardProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/8 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3.5 px-5 py-4">
        <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', iconBg)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug">{title}</p>
          <p className="text-xs text-muted-foreground leading-snug mt-0.5">{description}</p>
        </div>
        {badge}
      </div>
      <Separator />
      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {children}
      </div>
    </div>
  );
}

function DoneBadge({ label }: { label: string }) {
  return (
    <Badge className="gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-700 font-medium">
      <CheckCircle2 className="size-3" />
      {label}
    </Badge>
  );
}

function PendingBadge({ label }: { label: string }) {
  return <Badge variant="secondary" className="font-normal text-muted-foreground">{label}</Badge>;
}

// ─── Gmail ────────────────────────────────────────────────────────────────────

function GmailSection() {
  const { data: emails, isLoading } = useQuery({ queryKey: ['emails'], queryFn: listEmails });
  const connected = (emails?.length ?? 0) > 0;

  return (
    <SectionCard
      icon={<Mail className="size-5 text-rose-500" />}
      iconBg="bg-rose-50"
      title="Gmail Account"
      description="Connect your inbox to forward emails as SMS"
      badge={connected ? <DoneBadge label="Connected" /> : <PendingBadge label="Not connected" />}
    >
      <a href={buildGmailConnectUrl()}>
        <Button size="sm" variant="outline" className="gap-2">
          <ExternalLink className="size-3.5" />
          Connect Gmail
        </Button>
      </a>

      {isLoading ? (
        <div className="flex justify-center py-2"><Spin /></div>
      ) : (emails?.length ?? 0) > 0 ? (
        <div className="space-y-0.5 pt-1">
          {emails!.map((em) => (
            <div
              key={em.emailId}
              className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
                {em.email[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{em.email}</p>
                <p className="text-xs text-muted-foreground">
                  Since {new Date(em.addedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </SectionCard>
  );
}

// ─── Phones ───────────────────────────────────────────────────────────────────

function PhonesSection() {
  const qc = useQueryClient();
  const { data: phones, isLoading } = useQuery({ queryKey: ['phones'], queryFn: listPhones });

  const [step, setStep] = useState<'add' | 'verify'>('add');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const addMut = useMutation({
    mutationFn: () => addPhone(phone),
    onSuccess: () => { setStep('verify'); setError(''); },
    onError: (e: any) => setError(e.response?.data?.message ?? 'Failed to send code'),
  });

  const verifyMut = useMutation({
    mutationFn: () => verifyPhone(phone, code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['phones'] });
      setStep('add'); setPhone(''); setCode(''); setError('');
    },
    onError: (e: any) => setError(e.response?.data?.message ?? 'Invalid code'),
  });

  const deleteMut = useMutation({
    mutationFn: deletePhone,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['phones'] }),
  });

  const verified = (phones?.length ?? 0) > 0;

  return (
    <SectionCard
      icon={<Smartphone className="size-5 text-violet-500" />}
      iconBg="bg-violet-50"
      title="Phone Number"
      description="Receive SMS messages on your verified number"
      badge={verified ? <DoneBadge label="Verified" /> : <PendingBadge label="Not added" />}
    >
      {step === 'add' ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="+1 555 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={() => addMut.mutate()}
              disabled={!phone || addMut.isPending}
            >
              {addMut.isPending ? <Spin /> : 'Send code'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Code sent to <span className="font-medium text-foreground">{phone}</span>
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="flex-1 tracking-[0.5em] text-center font-mono"
            />
            <Button
              size="sm"
              onClick={() => verifyMut.mutate()}
              disabled={code.length < 6 || verifyMut.isPending}
            >
              {verifyMut.isPending ? <Spin /> : 'Verify'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setStep('add'); setError(''); }}>
              Back
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {isLoading ? (
        <div className="flex justify-center py-2"><Spin /></div>
      ) : (phones?.length ?? 0) > 0 ? (
        <div className="space-y-0.5 pt-1">
          {phones!.map((ph) => (
            <div
              key={ph.phoneId}
              className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-muted/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100">
                  <Smartphone className="size-3.5 text-violet-500" />
                </div>
                <span className="text-sm font-medium">{ph.phone}</span>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => deleteMut.mutate(ph.phoneId)}
                disabled={deleteMut.isPending}
                className="text-muted-foreground hover:text-destructive"
              >
                {deleteMut.isPending ? <Spin /> : <Trash2 className="size-4" />}
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </SectionCard>
  );
}

// ─── Billing ──────────────────────────────────────────────────────────────────

function AddCardForm() {
  const qc = useQueryClient();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!stripe || !elements) {
      setError('Stripe failed to load — set VITE_STRIPE_PUBLIC_KEY in client/.env and restart.');
      return;
    }
    setLoading(true);
    setError('');
    const card = elements.getElement(CardElement);
    if (!card) { setLoading(false); return; }

    const { error: stripeErr, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card });
    if (stripeErr) { setError(stripeErr.message ?? 'Card error'); setLoading(false); return; }

    try {
      await attachCard(paymentMethod!.id);
      qc.invalidateQueries({ queryKey: ['cards'] });
      card.clear();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to save card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
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
      <Button size="sm" className="w-full gap-2" onClick={handleAdd} disabled={loading}>
        {loading ? <Spin /> : <Plus className="size-3.5" />}
        Add card
      </Button>
    </div>
  );
}

function BillingSection() {
  const qc = useQueryClient();
  const { data: cards, isLoading } = useQuery({ queryKey: ['cards'], queryFn: listCards });

  const deleteMut = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] }),
  });

  const hasSaved = (cards?.length ?? 0) > 0;

  return (
    <SectionCard
      icon={<CreditCard className="size-5 text-emerald-600" />}
      iconBg="bg-emerald-50"
      title="Payment Method"
      description="$10/month per set · cancel anytime"
      badge={hasSaved ? <DoneBadge label="Saved" /> : <PendingBadge label="Not added" />}
    >
      {stripePromise ? (
        <Elements stripe={stripePromise}>
          <AddCardForm />
        </Elements>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Set <code className="font-mono font-semibold">VITE_STRIPE_PUBLIC_KEY</code> in{' '}
          <code className="font-mono font-semibold">client/.env</code> and restart the dev server.
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-2"><Spin /></div>
      ) : hasSaved ? (
        <div className="space-y-0.5 pt-1">
          {cards!.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-muted/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-11 items-center justify-center rounded-md bg-slate-800 text-[11px] font-bold uppercase tracking-wide text-white">
                  {c.brand}
                </div>
                <div>
                  <p className="text-sm font-medium">•••• {c.last4}</p>
                  <p className="text-xs text-muted-foreground">Expires {c.expMonth}/{c.expYear}</p>
                </div>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => deleteMut.mutate(c.id)}
                disabled={deleteMut.isPending}
                className="text-muted-foreground hover:text-destructive"
              >
                {deleteMut.isPending ? <Spin /> : <Trash2 className="size-4" />}
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </SectionCard>
  );
}

// ─── My Sets ──────────────────────────────────────────────────────────────────

function SetsSection() {
  const qc = useQueryClient();
  const { data: sets, isLoading } = useQuery({ queryKey: ['sets'], queryFn: listSets });
  const { data: emails } = useQuery({ queryKey: ['emails'], queryFn: listEmails });
  const { data: phones } = useQuery({ queryKey: ['phones'], queryFn: listPhones });

  const [emailId, setEmailId] = useState('');
  const [phoneId, setPhoneId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');

  const createMut = useMutation({
    mutationFn: () => createSet(Number(emailId), Number(phoneId), promoCode || undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sets'] });
      setEmailId(''); setPhoneId(''); setPromoCode(''); setError('');
    },
    onError: (e: any) => setError(e.response?.data?.message ?? 'Failed to create set'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteSet,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sets'] }),
  });

  const hasEmail = (emails?.length ?? 0) > 0;
  const hasPhone = (phones?.length ?? 0) > 0;
  const canCreate = hasEmail && hasPhone;

  const missing = [
    !hasEmail && 'a Gmail account',
    !hasPhone && 'a phone number',
  ].filter(Boolean);

  const activeCount = sets?.length ?? 0;

  return (
    <SectionCard
      icon={<Zap className="size-5 text-amber-500" />}
      iconBg="bg-amber-50"
      title="My Sets"
      description="Each set routes one Gmail inbox to one phone"
      badge={
        activeCount > 0 ? (
          <Badge className="border-primary/20 bg-primary/8 text-primary font-medium">
            {activeCount} active
          </Badge>
        ) : undefined
      }
    >
      {canCreate ? (
        <div className="space-y-3 rounded-xl border border-dashed bg-muted/20 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            New set
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              className="h-8 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:ring-[3px] focus:ring-ring/50 focus:border-ring transition-colors"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            >
              <option value="">Select Gmail</option>
              {emails!.map((em) => (
                <option key={em.emailId} value={em.emailId}>{em.email}</option>
              ))}
            </select>
            <select
              className="h-8 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:ring-[3px] focus:ring-ring/50 focus:border-ring transition-colors"
              value={phoneId}
              onChange={(e) => setPhoneId(e.target.value)}
            >
              <option value="">Select phone</option>
              {phones!.map((ph) => (
                <option key={ph.phoneId} value={ph.phoneId}>{ph.phone}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Promo code (optional)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 h-8 text-sm"
            />
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => createMut.mutate()}
              disabled={!emailId || !phoneId || createMut.isPending}
            >
              {createMut.isPending ? <Spin /> : <Plus className="size-3.5" />}
              Create
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      ) : (
        <div className="rounded-xl bg-muted/40 px-4 py-3.5 text-sm text-muted-foreground">
          Add {missing.join(' and ')} above to create your first set.
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-2"><Spin /></div>
      ) : (sets?.length ?? 0) > 0 ? (
        <div className="space-y-0.5 pt-1">
          {sets!.map((s) => (
            <div
              key={s.setId}
              className="flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <Zap className="size-3.5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{s.email?.email}</p>
                  <p className="text-xs text-muted-foreground">{s.phone?.phone}</p>
                </div>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => deleteMut.mutate(s.setId)}
                disabled={deleteMut.isPending}
                className="text-muted-foreground hover:text-destructive"
              >
                {deleteMut.isPending ? <Spin /> : <Trash2 className="size-4" />}
              </Button>
            </div>
          ))}
        </div>
      ) : canCreate ? (
        <p className="text-center text-sm text-muted-foreground py-2">No sets yet.</p>
      ) : null}
    </SectionCard>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem('token'); navigate('/login'); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Sticky nav */}
      <header className="sticky top-0 z-20 border-b border-foreground/5 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Zap className="size-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold tracking-tight">SMSMail</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-3.5" />
            Sign out
          </Button>
        </div>
      </header>

      {/* Page */}
      <main className="mx-auto max-w-2xl space-y-3 px-4 py-8">
        <GmailSection />
        <PhonesSection />
        <BillingSection />
        <SetsSection />
      </main>
    </div>
  );
}
