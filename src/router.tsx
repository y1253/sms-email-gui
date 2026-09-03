import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { clearSession, isExpired, readToken, signOut } from './lib/token';
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
import WhatIsEmailToText from './pages/WhatIsEmailToText';
import Contact from './pages/Contact';
import GuidesIndex from './pages/guides/GuidesIndex';
import GuidePage from './pages/guides/GuidePage';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = readToken();

  // A token that has plainly run out is torn down here rather than left to the
  // API: mounting the shell just to have its first request 401 costs the user a
  // round-trip staring at a skeleton before the same thing happens. This is the
  // one case that needs signOut's full navigation rather than <Navigate> —
  // the login page has to be told why it is showing.
  const expired = !!token && isExpired(token);
  useEffect(() => {
    if (expired) signOut('expired');
  }, [expired]);

  // Never signed in: no teardown needed and nothing to explain, so the cheap
  // in-router redirect is right. Protected routes are never prerendered, so
  // redirecting synchronously is fine.
  if (!token) return <Navigate to="/login" replace />;

  // Signing out — the effect above is mid-navigation.
  if (expired) return null;

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
    // Same liveness test as ProtectedRoute. If these two ever disagree, a stale
    // token bounces the user /login -> /dashboard -> /login.
    const token = readToken();
    if (token && isExpired(token)) {
      // Arriving at a public page holding a dead token: drop it so the request
      // interceptor stops attaching it, and let this page render.
      clearSession();
      return;
    }
    if (token) {
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
      <Route path="/what-is-email-to-text" element={<WhatIsEmailToText />} />
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
