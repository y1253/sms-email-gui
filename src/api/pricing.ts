import { useQuery } from '@tanstack/react-query';
import api from './client';

export type Pricing = {
  price: number;
  currency: string;
  interval: string;
};

// Single source of truth for the displayed subscription price — fetched from
// the server so every page shows the same value (set via the PRICE env var).
export const getPricing = () =>
  api.get<Pricing>('/pricing').then((r) => r.data);

export const usePricing = () =>
  useQuery({ queryKey: ['pricing'], queryFn: getPricing });

// Assumes USD ($). If more currencies are added, format from p.currency here.
export const formatPrice = (p?: Pricing) => (p ? `$${p.price}` : '');
