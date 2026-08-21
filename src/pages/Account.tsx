import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, KeyRound, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';
import { changePassword, getProfile, updateProfile } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { apiError } from '@/lib/errors';

function Spin({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} />;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

/** An Input with a show/hide toggle, matching the in-field icon idiom. */
function PasswordInput({
  value,
  onChange,
  invalid,
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={cn(
          'w-full pr-8',
          invalid && 'border-destructive focus-visible:border-destructive',
        )}
      />
      <button
        // type="button" — a bare button inside a form submits it.
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

const MIN_PASSWORD = 12;

export default function Account() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameError, setNameError] = useState('');

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pwError, setPwError] = useState('');

  // Seed the inputs once the profile lands. Keyed off the id so a refetch of
  // the same user never clobbers what they are typing.
  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.firstName ?? '');
    setLastName(profile.lastName ?? '');
  }, [profile?.userId]);

  const profileMut = useMutation({
    mutationFn: () =>
      updateProfile({ first_name: firstName.trim(), last_name: lastName.trim() || undefined }),
    onSuccess: () => {
      // The sidebar reads the same query, so its name updates immediately.
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile saved');
    },
    onError: (err) => toast.error(apiError(err, "Couldn't save profile")),
  });

  const passwordMut = useMutation({
    mutationFn: () => changePassword({ current_password: current, new_password: next }),
    onSuccess: (data) => {
      // The change revoked every token for this account, this tab's included.
      // Swap in the replacement before anything else fires a request.
      localStorage.setItem('token', data.token);
      setCurrent('');
      setNext('');
      setConfirm('');
      toast.success('Password updated. Other devices have been signed out.');
    },
    onError: (err) => setPwError(apiError(err, "Couldn't update password")),
  });

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setNameError('First name is required');
      return;
    }
    setNameError('');
    profileMut.mutate();
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Mirror the server DTO so an obvious miss doesn't cost a round trip.
    if (next.length < MIN_PASSWORD) {
      setPwError(`New password must be at least ${MIN_PASSWORD} characters`);
      return;
    }
    if (next !== confirm) {
      setPwError('New passwords do not match');
      return;
    }
    setPwError('');
    passwordMut.mutate();
  };

  const isGoogle = profile?.authType === 'google';

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Account</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Your name, email, and password
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Profile</h2>
        <Card className="ring-1 ring-foreground/8 shadow-sm">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <User className="size-4 text-sky-400" />
              <p className="text-sm font-semibold">Your details</p>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <form onSubmit={saveProfile} className="space-y-3">
                <Field label="First name">
                  <Input
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setNameError('');
                    }}
                    autoComplete="given-name"
                    className={cn(
                      'w-full',
                      nameError && 'border-destructive focus-visible:border-destructive',
                    )}
                  />
                </Field>
                <Field label="Last name">
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    className="w-full"
                  />
                </Field>
                <Field label="Email">
                  {/* Read-only: it is the login identity and the Google account
                      link, so changing it needs its own verification flow. */}
                  <Input value={profile?.email ?? ''} disabled className="w-full" />
                </Field>
                {nameError && <p className="text-xs text-destructive">{nameError}</p>}
                <Button type="submit" size="sm" disabled={profileMut.isPending} className="gap-2">
                  {profileMut.isPending && <Spin />}
                  Save changes
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Password</h2>
        <Card className="ring-1 ring-foreground/8 shadow-sm">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <KeyRound className="size-4 text-amber-500" />
              <p className="text-sm font-semibold">Change password</p>
            </div>

            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : isGoogle ? (
              <p className="text-xs text-muted-foreground">
                You sign in with Google, so there is no password on this account.
              </p>
            ) : (
              <form onSubmit={savePassword} className="space-y-3">
                <Field label="Current password">
                  <PasswordInput
                    value={current}
                    onChange={(v) => {
                      setCurrent(v);
                      setPwError('');
                    }}
                    autoComplete="current-password"
                  />
                </Field>
                <Field label="New password">
                  <PasswordInput
                    value={next}
                    onChange={(v) => {
                      setNext(v);
                      setPwError('');
                    }}
                    autoComplete="new-password"
                  />
                </Field>
                <Field label="Confirm new password">
                  <PasswordInput
                    value={confirm}
                    onChange={(v) => {
                      setConfirm(v);
                      setPwError('');
                    }}
                    invalid={confirm.length > 0 && next !== confirm}
                    autoComplete="new-password"
                  />
                </Field>
                <p className="text-xs text-muted-foreground">
                  At least {MIN_PASSWORD} characters.
                </p>
                {pwError && <p className="text-xs text-destructive">{pwError}</p>}
                <Button
                  type="submit"
                  size="sm"
                  disabled={passwordMut.isPending || !current || !next || !confirm}
                  className="gap-2"
                >
                  {passwordMut.isPending && <Spin />}
                  Update password
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
