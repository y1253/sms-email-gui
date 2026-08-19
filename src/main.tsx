import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

// entry-server.tsx mirrors this tree. Keep them in sync — any structural
// difference shows up as a hydration mismatch on the prerendered pages.
const tree = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster position="bottom-right" richColors />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);

const container = document.getElementById('root')!;

// Prerendered marketing pages ship markup inside #root; the SPA fallback shell
// (app.html) ships an empty one, so the DOM tells us which mode to use.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
