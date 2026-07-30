import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Stripe invoice statuses, relabelled in the language the page uses. Shared by
// the customer's Billing table and the admin account detail card so both read
// the same for the same invoice.
const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  paid: { label: 'Paid', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  open: { label: 'Unpaid', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  draft: { label: 'Pending', className: 'border-border bg-muted text-muted-foreground' },
  uncollectible: { label: 'Failed', className: 'border-destructive/30 bg-destructive/10 text-destructive' },
  void: { label: 'Void', className: 'border-border bg-muted text-muted-foreground' },
};

export default function InvoiceStatusBadge({ status }: { status: string }) {
  const s = STATUS_BADGE[status] ?? {
    label: status,
    className: 'border-border bg-muted text-muted-foreground',
  };
  return <Badge className={cn('text-[11px] capitalize', s.className)}>{s.label}</Badge>;
}
