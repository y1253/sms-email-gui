import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import App from './App';

/**
 * Re-exported so scripts/prerender.mjs pulls the renderer and the metadata out
 * of the same bundle — one artifact, one source of truth.
 */
export { ROUTES, SITE_URL, APP_SHELL_META } from './seo/routes';

/**
 * Renders a route to HTML at build time.
 *
 * The provider tree here must mirror main.tsx exactly or hydration diverges.
 * Two deliberate differences, both DOM-neutral:
 *   - StaticRouter in place of BrowserRouter.
 *   - ReactQueryDevtools omitted; it renders null outside development.
 * The <Toaster> is NOT optional — sonner always emits a <section>, so dropping
 * it would shift every sibling node.
 */
export function render(url: string): string {
  // Fresh client per page so nothing leaks between routes. Nothing actually
  // fetches: react-query only starts a request from its subscription effect,
  // and effects never run under renderToString.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
        <Toaster position="bottom-right" richColors />
      </QueryClientProvider>
    </StrictMode>,
  );
}
