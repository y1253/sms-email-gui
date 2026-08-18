import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Zap, CreditCard, HelpCircle, Mail, LogOut } from 'lucide-react';
import { getProfile } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Sets is first — it is the default landing tab for every entry point.
const NAV_ITEMS = [
  { to: '/dashboard', label: 'Sets', icon: Zap },
  { to: '/billing', label: 'Billing', icon: CreditCard },
  { to: '/how-it-works', label: 'How it works', icon: HelpCircle },
  { to: '/contact', label: 'Contact', icon: Mail },
];

interface AppSidebarProps {
  /** Called after a nav item is clicked, so the mobile drawer can close itself. */
  onNavigate?: () => void;
}

export default function AppSidebar({ onNavigate }: AppSidebarProps) {
  const navigate = useNavigate();
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: getProfile });

  // Google accounts without a given_name, and legacy rows, have no first name.
  const displayName = profile?.firstName || profile?.email?.split('@')[0];

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-full flex-col">
      <Link
        to="/dashboard"
        onClick={onNavigate}
        className="flex h-14 shrink-0 items-center gap-2.5 px-5"
      >
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary shadow-sm">
          <Zap className="size-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-bold tracking-tight">EmailOnText</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-foreground/5 px-3 py-3">
        {displayName && (
          <p className="truncate px-3 pb-1.5 text-sm font-medium">{displayName}</p>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="size-3.5" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
