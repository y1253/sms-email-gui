import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Smartphone, Mail, ExternalLink, CheckCircle2, Loader2,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { listPhones, addPhone, verifyPhone } from '@/api/phones';
import { listEmails } from '@/api/emails';

function buildGmailAddSetUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI as string,
    response_type: 'code',
    scope: ['email', 'profile', 'https://mail.google.com/'].join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state: 'gmail_addset',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

function Spin({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} />;
}

interface AddSetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddSetModal({ open, onOpenChange }: AddSetModalProps) {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: phones, isLoading: loadingPhones } = useQuery({
    queryKey: ['phones'],
    queryFn: listPhones,
    enabled: open,
  });
  const { data: emails, isLoading: loadingEmails } = useQuery({
    queryKey: ['emails'],
    queryFn: listEmails,
    enabled: open,
  });

  const [selectedPhoneId, setSelectedPhoneId] = useState<number | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null);
  const [promo, setPromo] = useState('');

  const [phoneStep, setPhoneStep] = useState<'idle' | 'code'>('idle');
  const [countryCode, setCountryCode] = useState('1');
  const [phoneInput, setPhoneInput] = useState(''); // national part
  const [codeInput, setCodeInput] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Digits only, country code included, no "+" — the format the backend stores
  // and matches inbound SMS against.
  const fullPhone = `${countryCode}${phoneInput}`.replace(/\D/g, '');

  // Reset form state when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedPhoneId(null);
      setSelectedEmailId(null);
      setPromo('');
      setPhoneStep('idle');
      setCountryCode('1');
      setPhoneInput('');
      setCodeInput('');
      setPhoneError('');
    }
  }, [open]);

  const addPhoneMut = useMutation({
    mutationFn: () => addPhone(fullPhone),
    onSuccess: () => { setPhoneStep('code'); setPhoneError(''); },
    onError: (e: any) => setPhoneError(e.response?.data?.message ?? 'Failed to send code'),
  });

  const verifyMut = useMutation({
    mutationFn: () => verifyPhone(fullPhone, codeInput),
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ['phones'] });
      setSelectedPhoneId(res.phoneId);
      setPhoneStep('idle');
      setCountryCode('1');
      setPhoneInput('');
      setCodeInput('');
      setPhoneError('');
    },
    onError: (e: any) => setPhoneError(e.response?.data?.message ?? 'Invalid code'),
  });

  const canActivate = selectedPhoneId !== null && selectedEmailId !== null;

  const handleActivate = () => {
    const selectedEmail = emails?.find((e) => e.emailId === selectedEmailId);
    const selectedPhone = phones?.find((p) => p.phoneId === selectedPhoneId);
    navigate('/checkout', {
      state: {
        emailId: selectedEmailId,
        phoneId: selectedPhoneId,
        email: selectedEmail?.email,
        phone: selectedPhone?.phone,
        promo: promo || undefined,
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4">
          <DialogTitle className="text-base font-semibold">New Set</DialogTitle>
          <DialogDescription className="text-xs">
            Connect a phone and Gmail inbox to start forwarding emails as SMS.
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x max-h-[60vh] overflow-y-auto">
          {/* ── Left: Phone ───────────────────────────── */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                <Smartphone className="size-3.5 text-violet-600" />
              </div>
              <span className="text-sm font-semibold">Phone Number</span>
              {selectedPhoneId !== null && (
                <Badge className="ml-auto gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]">
                  <CheckCircle2 className="size-3" />
                  Selected
                </Badge>
              )}
            </div>

            {loadingPhones ? (
              <div className="flex justify-center py-3"><Spin /></div>
            ) : (phones?.length ?? 0) > 0 ? (
              <div className="space-y-1.5">
                {phones!.map((ph) => (
                  <button
                    key={ph.phoneId}
                    onClick={() => setSelectedPhoneId(ph.phoneId)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                      selectedPhoneId === ph.phoneId
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-input hover:bg-muted/50',
                    )}
                  >
                    <Smartphone className="size-3.5 text-violet-500 shrink-0" />
                    <span className="font-medium">{ph.phone}</span>
                    {selectedPhoneId === ph.phoneId && (
                      <CheckCircle2 className="size-3.5 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {(phones?.length ?? 0) > 0 ? 'Or add new number' : 'Add your number'}
              </p>

              {phoneStep === 'idle' ? (
                <div className="flex gap-2">
                  <div className="flex items-center h-8 w-16 shrink-0 rounded-lg border border-input px-2 text-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                    <span className="text-muted-foreground">+</span>
                    <input
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value.replace(/\D/g, ''))}
                      inputMode="numeric"
                      maxLength={4}
                      aria-label="Country code"
                      className="w-full bg-transparent outline-none pl-1"
                    />
                  </div>
                  <Input
                    placeholder="555 000 0000"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="flex-1 h-8 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => addPhoneMut.mutate()}
                    disabled={!countryCode || fullPhone.length < 10 || addPhoneMut.isPending}
                  >
                    {addPhoneMut.isPending ? <Spin /> : 'Send code'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Code sent to{' '}
                    <span className="font-medium text-foreground">+{countryCode} {phoneInput}</span>
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="000000"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      maxLength={6}
                      className="flex-1 h-8 text-sm tracking-[0.5em] text-center font-mono"
                    />
                    <Button
                      size="sm"
                      onClick={() => verifyMut.mutate()}
                      disabled={codeInput.length < 6 || verifyMut.isPending}
                    >
                      {verifyMut.isPending ? <Spin /> : 'Verify'}
                    </Button>
                  </div>
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                    onClick={() => { setPhoneStep('idle'); setCodeInput(''); setPhoneError(''); }}
                  >
                    ← Back
                  </button>
                </div>
              )}
              {phoneError && <p className="text-xs text-destructive">{phoneError}</p>}
            </div>
          </div>

          {/* ── Right: Gmail ──────────────────────────── */}
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-rose-100">
                <Mail className="size-3.5 text-rose-600" />
              </div>
              <span className="text-sm font-semibold">Gmail Account</span>
              {selectedEmailId !== null && (
                <Badge className="ml-auto gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]">
                  <CheckCircle2 className="size-3" />
                  Selected
                </Badge>
              )}
            </div>

            {loadingEmails ? (
              <div className="flex justify-center py-3"><Spin /></div>
            ) : (emails?.length ?? 0) > 0 ? (
              <div className="space-y-1.5">
                {emails!.map((em) => (
                  <button
                    key={em.emailId}
                    onClick={() => setSelectedEmailId(em.emailId)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                      selectedEmailId === em.emailId
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-input hover:bg-muted/50',
                    )}
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[11px] font-bold text-rose-600">
                      {em.email[0].toUpperCase()}
                    </div>
                    <span className="font-medium truncate">{em.email}</span>
                    {selectedEmailId === em.emailId && (
                      <CheckCircle2 className="size-3.5 text-primary ml-auto shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="space-y-2">
              <a href={buildGmailAddSetUrl()}>
                <Button size="sm" variant="outline" className="gap-2 w-full">
                  <ExternalLink className="size-3.5" />
                  Connect Gmail
                </Button>
              </a>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                You'll be redirected to Google to grant access, then brought right back here.
              </p>
            </div>
          </div>
        </div>

        <Separator />
        <div className="px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Input
            placeholder="Promo code (optional)"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            className="flex-1 h-8 text-sm"
          />
          <Button
            onClick={handleActivate}
            disabled={!canActivate}
            className="gap-2 shrink-0"
          >
            Activate →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
