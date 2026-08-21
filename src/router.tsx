import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import GoogleCallback from './pages/GoogleCallback';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import AppLayout from './components/layout/AppLayout';
import Admin from './pages/Admin';
import AdminAccountDetail from './pages/AdminAccountDetail';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import GuidesIndex from './pages/guides/GuidesIndex';
import GuidePage from './pages/guides/GuidePage';
import NotFound from './pages/NotFound';

/** There is no localStorage during prerender, and no token either. */
const readToken = () =>
  typeof window === 'undefined' ? null : localStorage.getItem('token');

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Protected routes are never prerendered, so redirecting synchronously is fine.
  if (!readToken()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  // Deferred to an effect so the FIRST client render is always `children`,
  // matching the prerendered HTML byte for byte. A synchronous <Navigate> here
  // would diverge from the server output for a logged-in visitor on `/`, which
  // React 19 punishes with a full client re-render of the root.
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setRedirecting(true);
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return redirecting ? null : <>{children}</>;
}

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnlyRoute><Landing /></PublicOnlyRoute>} />
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
      <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      {/* Sidebar shell. No index route — every entry point navigates to
          /dashboard explicitly, so Sets is the default tab. */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/account" element={<Account />} />
      </Route>
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/accounts/:userId" element={<AdminAccountDetail />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/contact" element={<Contact />} />
      {/* Prerendered marketing content. Static imports only — a lazy boundary
          would render a Suspense fallback that doesn't match the served HTML. */}
      <Route path="/guides" element={<GuidesIndex />} />
      <Route path="/guides/:slug" element={<GuidePage />} />
      {/* Renders a real not-found page rather than bouncing to `/`, which
          produced soft-404s: every unknown URL returned the homepage at 200. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
