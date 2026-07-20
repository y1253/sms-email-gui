import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Zap, LogOut, Plus, Mail, Smartphone, Loader2, Settings2, HelpCircle,
} from 'lucide-react';
import { listSets, type EmailPhoneSet } from '@/api/sets';
import { getProfile } from '@/api/auth';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import AddSetModal from '@/components/AddSetModal';
import SetSettingsDialog from '@/components/SetSettingsDialog';
import ManageAccountsSection from '@/components/ManageAccountsSection';

function Spin({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} />;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsSet, setSettingsSet] = useState<EmailPhoneSet | null>(null);
  const [newEmailId, setNewEmailId] = useState<number | null>(null);

  // Auto-open the add-set modal when returning from Gmail OAuth, preselecting
  // the account that was just connected.
  useEffect(() => {
    if (searchParams.get('addSet') === '1') {
      const id = Number(searchParams.get('emailId'));
      setNewEmailId(Number.isFinite(id) && id > 0 ? id : null);
      setModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const { data: sets, isLoading } = useQuery({ queryKey: ['sets'], queryFn: listSets });
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: getProfile });

  // Google accounts without a given_name, and legacy rows, have no first name.
  const displayName = profile?.firstName || profile?.email?.split('@')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-foreground/5 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Zap className="size-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold tracking-tight">SMSMail</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/how-it-works"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: 'gap-2 text-muted-foreground hover:text-foreground',
              })}
            >
              <HelpCircle className="size-3.5" />
              How it works
            </Link>
            <Button size="sm" className="gap-1.5" onClick={() => setModalOpen(true)}>
              <Plus className="size-3.5" />
              New Set
            </Button>
            {displayName && (
              <span className="hidden max-w-[12rem] truncate pl-1 text-sm font-medium sm:inline">
                {displayName}
              </span>
            )}
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
        </div>
      </header>

      {/* Page */}
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight">My Sets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Each set routes one Gmail inbox to one phone number via SMS
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spin className="size-6 text-muted-foreground" />
          </div>
        ) : (sets?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sets!.map((s) => (
              <Card
                key={s.setId}
                className="overflow-hidden ring-1 ring-foreground/8 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSettingsSet(s)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                      <Zap className="size-4 text-amber-500" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {s.pendingCancelAt ? (
                        <Badge className="border-amber-200 bg-amber-50 text-amber-700 text-[11px]">
                          Cancelling
                        </Badge>
                      ) : (
                        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]">
                          Active
                        </Badge>
                      )}
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); setSettingsSet(s); }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Settings2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="size-3.5 text-rose-400 shrink-0" />
                      <span className="text-sm font-medium truncate">{s.email?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="size-3.5 text-violet-400 shrink-0" />
                      <span className="text-sm text-muted-foreground">{s.phone?.phone}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">
                      Since {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                    {s.allowedSenders?.length > 0 && (
                      <p className="text-[11px] text-muted-foreground">
                        Only {s.allowedSenders.length} sender{s.allowedSenders.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add new set tile */}
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-3 p-8 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary hover:bg-primary/5 min-h-[160px]"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                <Plus className="size-5" />
              </div>
              <span className="text-sm font-medium">Add set</span>
            </button>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 shadow-sm">
              <Zap className="size-10 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold">No sets yet</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Create your first set to start forwarding Gmail emails to your phone as SMS.
              </p>
            </div>
            <Button onClick={() => setModalOpen(true)} className="gap-2">
              <Plus className="size-4" />
              Create your first set
            </Button>
          </div>
        )}

        {!isLoading && <ManageAccountsSection sets={sets ?? []} />}
      </main>

      <AddSetModal
        open={modalOpen}
        onOpenChange={(v) => { setModalOpen(v); if (!v) setNewEmailId(null); }}
        initialEmailId={newEmailId}
      />
      <SetSettingsDialog
        set={settingsSet}
        open={!!settingsSet}
        onOpenChange={(v) => { if (!v) setSettingsSet(null); }}
      />
    </div>
  );
}
