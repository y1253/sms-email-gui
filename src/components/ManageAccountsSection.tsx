import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Smartphone, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { listEmails, deleteEmail } from '@/api/emails';
import { listPhones, deletePhone } from '@/api/phones';
import { type EmailPhoneSet } from '@/api/sets';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

function Spin({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} />;
}

type Pending = {
  kind: 'email' | 'phone';
  id: number;
  label: string;
  affected: number;
};

export default function ManageAccountsSection({ sets }: { sets: EmailPhoneSet[] }) {
  const qc = useQueryClient();
  const [pending, setPending] = useState<Pending | null>(null);

  const { data: emails, isLoading: emailsLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: listEmails,
  });
  const { data: phones, isLoading: phonesLoading } = useQuery({
    queryKey: ['phones'],
    queryFn: listPhones,
  });

  const deleteMut = useMutation({
    // Return the kind so the toast doesn't depend on `pending` still being set.
    mutationFn: async () => {
      if (!pending) return null;
      if (pending.kind === 'email') await deleteEmail(pending.id);
      else await deletePhone(pending.id);
      return pending.kind;
    },
    onSuccess: (kind) => {
      qc.invalidateQueries({ queryKey: ['emails'] });
      qc.invalidateQueries({ queryKey: ['phones'] });
      qc.invalidateQueries({ queryKey: ['sets'] });
      setPending(null);
      if (kind) toast.success(kind === 'email' ? 'Email removed' : 'Phone removed');
    },
  });

  const emailSetCount = (emailId: number) =>
    sets.filter((s) => s.email.emailId === emailId).length;
  const phoneSetCount = (phoneId: number) =>
    sets.filter((s) => s.phone.phoneId === phoneId).length;

  const loading = emailsLoading || phonesLoading;
  const noAccounts =
    !loading && (emails?.length ?? 0) === 0 && (phones?.length ?? 0) === 0;

  const noun = pending?.kind === 'email' ? 'Gmail account' : 'phone number';

  return (
    <section className="mt-12">
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight">Manage accounts</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Remove a connected Gmail account or phone number. Deleting one also deletes
          any set that uses it.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin className="size-5 text-muted-foreground" />
        </div>
      ) : noAccounts ? (
        <p className="text-sm text-muted-foreground">
          No connected accounts yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Gmail accounts */}
          <Card className="ring-1 ring-foreground/8 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="size-4 text-rose-400" />
                <p className="text-sm font-semibold">Gmail accounts</p>
              </div>
              {(emails?.length ?? 0) === 0 ? (
                <p className="text-xs text-muted-foreground">None connected</p>
              ) : (
                <ul className="divide-y divide-foreground/5">
                  {emails!.map((e) => (
                    <li key={e.emailId} className="flex items-center justify-between gap-2 py-2">
                      <span className="text-sm truncate">{e.email}</span>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() =>
                          setPending({
                            kind: 'email',
                            id: e.emailId,
                            label: e.email,
                            affected: emailSetCount(e.emailId),
                          })
                        }
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        aria-label={`Delete ${e.email}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Phone numbers */}
          <Card className="ring-1 ring-foreground/8 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="size-4 text-violet-400" />
                <p className="text-sm font-semibold">Phone numbers</p>
              </div>
              {(phones?.length ?? 0) === 0 ? (
                <p className="text-xs text-muted-foreground">None added</p>
              ) : (
                <ul className="divide-y divide-foreground/5">
                  {phones!.map((p) => (
                    <li key={p.phoneId} className="flex items-center justify-between gap-2 py-2">
                      <span className="text-sm truncate">{p.phone}</span>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() =>
                          setPending({
                            kind: 'phone',
                            id: p.phoneId,
                            label: p.phone,
                            affected: phoneSetCount(p.phoneId),
                          })
                        }
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        aria-label={`Delete ${p.phone}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confirm delete dialog */}
      <Dialog
        open={!!pending}
        onOpenChange={(v) => {
          if (!v && !deleteMut.isPending) {
            setPending(null);
            deleteMut.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {noun}?</DialogTitle>
          </DialogHeader>
          {pending && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{pending.label}</span> will be
                removed{pending.kind === 'email' ? ' and its Gmail connection disconnected' : ''}.
              </p>
              {pending.affected > 0 && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                  <p className="text-xs text-destructive flex gap-1.5 items-start">
                    <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
                    This will also delete {pending.affected} set
                    {pending.affected > 1 ? 's' : ''} and cancel
                    {pending.affected > 1 ? ' their' : ' its'} subscription
                    {pending.affected > 1 ? 's' : ''}. This can't be undone.
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMut.mutate()}
                  disabled={deleteMut.isPending}
                >
                  {deleteMut.isPending ? <Spin /> : 'Delete'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPending(null)}
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
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
