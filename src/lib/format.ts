// Amounts from Stripe arrive in minor units (cents). Assumes a 2-decimal
// currency — zero-decimal ones (JPY) would need the /100 dropped.
export function formatMoney(minorUnits: number, currency = 'usd'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(minorUnits / 100);
}

/** Short form for dense rows and tables: "Jul 29, 2026". */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Long form for prose, matching the wording already used in SetSettingsDialog:
 * "July 29, 2026".
 */
export function formatLongDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
