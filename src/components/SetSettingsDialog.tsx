import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Mail, Smartphone, X, Loader2, AlertTriangle } from 'lucide-react';
import {
  type EmailPhoneSet,
  updateSenders,
  cancelSubscription,
  deleteSet,
} from '@/api/sets';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

function Spin({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} />;
}

interface Props {
  set: EmailPhoneSet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SetSettingsDialog({ set, open, onOpenChange }: Props) {
  const qc = useQueryClient();
  const [senders, setSenders] = useState<string[]>([]);
  const [newSender, setNewSender] = useState('');
  const [senderError, setSenderError] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (set) {
      setSenders(set.allowedSenders ?? []);
      setNewSender('');
      setSenderError('');
      setConfirmCancel(false);
      setConfirmDelete(false);
    }
  }, [set?.setId]);

  const sendersMut = useMutation({
    mutationFn: (list: string[]) => updateSenders(set!.setId, list),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sets'] }),
  });

  const cancelMut = useMutation({
    mutationFn: () => cancelSubscription(set!.setId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sets'] });
      setConfirmCancel(false);
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteSet(set!.setId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sets'] });
      onOpenChange(false);
    },
  });

  function addSender() {
    const email = newSender.trim().toLowerCase();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSenderError('Enter a valid email address');
      return;
    }
    if (senders.includes(email)) {
      setSenderError('Already in list');
      return;
    }
    const next = [...senders, email];
    setSenders(next);
    setNewSender('');
    setSenderError('');
    sendersMut.mutate(next);
  }

  function removeSender(email: string) {
    const next = senders.filter((s) => s !== email);
    setSenders(next);
    sendersMut.mutate(next);
  }

  if (!set) return null;

  const isPaid = set.stripeSubscriptionId && set.stripeSubscriptionId !== 'PROMO';
  const cancelDate = set.pendingCancelAt
    ? new Date(set.pendingCancelAt).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Settings</DialogTitle>
          <div className="flex flex-col gap-0.5 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5 text-rose-400 shrink-0" />
              <span className="font-medium text-foreground">{set.email.email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="size-3.5 text-violet-400 shrink-0" />
              <span>{set.phone.phone}</span>
            </span>
          </div>
        </DialogHeader>

        {/* Allowed Senders */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Allowed senders</p>
            {sendersMut.isPending && <Spin className="text-muted-foreground" />}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {senders.length === 0
              ? 'All incoming emails are forwarded. Add senders below to filter.'
              : 'Only emails from these addresses will be forwarded via SMS.'}
          </p>

          {senders.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {senders.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
                >
                  {s}
                  <button
                    onClick={() => removeSender(s)}
                    disabled={sendersMut.isPending}
                    className="ml-0.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="sender@example.com"
              value={newSender}
              onChange={(e) => {
                setNewSender(e.target.value);
                setSenderError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addSender();
              }}
              className={cn(senderError && 'border-destructive focus-visible:border-destructive')}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={addSender}
              disabled={sendersMut.isPending}
            >
              Add
            </Button>
          </div>
          {senderError && <p className="text-xs text-destructive">{senderError}</p>}
        </div>

        {/* Subscription */}
        {isPaid && (
          <>
            <Separator />
            <div className="space-y-2.5">
              <p className="text-sm font-medium">Subscription</p>
              {cancelDate ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-amber-200 bg-amber-50 text-amber-700 text-[11px]">
                    Cancels {cancelDate}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Forwarding stays active until that date
                  </span>
                </div>
              ) : confirmCancel ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2.5">
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
                    <p className="text-xs text-destructive">
                      {(cancelMut.error as any)?.response?.data?.message ?? 'Something went wrong'}
                    </p>
                  )}
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60 hover:bg-destructive/5"
                  onClick={() => setConfirmCancel(true)}
                >
                  Cancel subscription
                </Button>
              )}
            </div>
          </>
        )}

        {/* Danger zone */}
        <Separator />
        <div className="space-y-2.5">
          <p className="text-sm font-medium">Danger zone</p>
          {confirmDelete ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 space-y-2.5">
              <p className="text-xs text-destructive">
                This will immediately cancel your subscription and stop email forwarding.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMut.mutate()}
                  disabled={deleteMut.isPending}
                >
                  {deleteMut.isPending ? <Spin /> : 'Delete now'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleteMut.isPending}
                >
                  Cancel
                </Button>
              </div>
              {deleteMut.isError && (
                <p className="text-xs text-destructive">
                  {(deleteMut.error as any)?.response?.data?.message ?? 'Something went wrong'}
                </p>
              )}
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmDelete(true)}
            >
              Delete set immediately
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
