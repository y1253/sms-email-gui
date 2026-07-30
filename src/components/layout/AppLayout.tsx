import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer, DrawerContent, DrawerTitle,
} from '@/components/ui/drawer';
import AddSetModal from '@/components/AddSetModal';
import AppSidebar from './AppSidebar';

type AppShell = {
  /** Open the add-set flow, optionally preselecting a just-connected Gmail account. */
  openAddSet: (emailId?: number | null) => void;
};

const AppShellContext = createContext<AppShell | null>(null);

export function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error('useAppShell must be used inside AppLayout');
  return ctx;
}

export default function AppLayout() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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

  // Close the drawer on navigation — covers back/forward too, not just clicks.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const openAddSet = (emailId?: number | null) => {
    setNewEmailId(emailId ?? null);
    setModalOpen(true);
  };

  return (
    <AppShellContext.Provider value={{ openAddSet }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        {/* Desktop rail */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-foreground/5 bg-background/70 backdrop-blur-md md:flex">
          <AppSidebar />
        </aside>

        {/* Mobile drawer — same nav content, slides in from the left */}
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen} swipeDirection="left">
          {/* Width via inline style — the popup's own responsive
              --drawer-content-width rules would otherwise win. */}
          <DrawerContent
            className="bg-background"
            style={{ '--drawer-content-width': '16rem' } as React.CSSProperties}
          >
            <DrawerTitle className="sr-only">Navigation</DrawerTitle>
            <AppSidebar onNavigate={() => setMobileOpen(false)} />
          </DrawerContent>
        </Drawer>

        <div className="md:pl-60">
          <header className="sticky top-0 z-20 border-b border-foreground/5 bg-background/70 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 sm:px-5">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                className="text-muted-foreground hover:text-foreground md:hidden"
              >
                <Menu className="size-4" />
              </Button>
              <div className="flex-1" />
              <Button size="sm" className="gap-1.5" onClick={() => openAddSet()}>
                <Plus className="size-3.5" />
                New Set
              </Button>
            </div>
          </header>

          <main className="mx-auto max-w-5xl px-4 py-10">
            <Outlet />
          </main>
        </div>

        <AddSetModal
          open={modalOpen}
          onOpenChange={(v) => { setModalOpen(v); if (!v) setNewEmailId(null); }}
          initialEmailId={newEmailId}
        />
      </div>
    </AppShellContext.Provider>
  );
}
