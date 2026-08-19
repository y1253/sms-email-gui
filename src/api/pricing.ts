import { useQuery } from '@tanstack/react-query';
import api from './client';
import { FALLBACK_PRICE } from '@/seo/routes';

export type Pricing = {
  price: number;
  currency: string;
  interval: string;
};

// Single source of truth for the displayed subscription price — fetched from
// the server so every page shows the same value (set via the PRICE env var).
export const getPricing = () =>
  api.get<Pricing>('/pricing').then((r) => r.data);

/**
 * Rendered until the live call resolves — which, during prerender, is always:
 * react-query only fetches from its subscription effect, and effects don't run
 * under renderToString. Without this the landing page would ship a literal `…`
 * where the price belongs, on the one page that most needs real text.
 */
export const FALLBACK_PRICING: Pricing = {
  price: FALLBACK_PRICE,
  currency: 'usd',
  interval: 'month',
};

export const usePricing = () =>
  useQuery({
    queryKey: ['pricing'],
    queryFn: getPricing,
    // placeholderData, not initialData: it is never written to the cache and
    // never suppresses the real fetch, so server render == client first render
    // == the fallback price, and the live value replaces it a moment later.
    placeholderData: FALLBACK_PRICING,
  });

// Assumes USD ($). If more currencies are added, format from p.currency here.
export const formatPrice = (p?: Pricing) => (p ? `$${p.price}` : '');
