import { useInfiniteQuery } from '@tanstack/react-query';
import { Download, ExternalLink, Loader2 } from 'lucide-react';
import { listInvoices, type BillingInvoice } from '@/api/billing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { apiError } from '@/lib/errors';
import { formatDate, formatMoney } from '@/lib/format';

const PAGE_SIZE = 12;

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  paid: { label: 'Paid', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  open: { label: 'Unpaid', className: 'border-amber-200 bg-amber-50 text-amber-700' },
  draft: { label: 'Pending', className: 'border-border bg-muted text-muted-foreground' },
  uncollectible: { label: 'Failed', className: 'border-destructive/30 bg-destructive/10 text-destructive' },
  void: { label: 'Void', className: 'border-border bg-muted text-muted-foreground' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_BADGE[status] ?? {
    label: status,
    className: 'border-border bg-muted text-muted-foreground',
  };
  return <Badge className={cn('text-[11px] capitalize', s.className)}>{s.label}</Badge>;
}

export default function TransactionsTable() {
  const {
    data, isLoading, error, refetch,
    fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['invoices'],
    queryFn: ({ pageParam }) =>
      listInvoices({ limit: PAGE_SIZE, startingAfter: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => (page.hasMore ? (page.nextCursor ?? undefined) : undefined),
    staleTime: 30_000,
  });

  const invoices: BillingInvoice[] = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold">Transactions</h2>

      <Card className="ring-1 ring-foreground/8 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-start gap-3 p-5">
              <p className="text-sm text-destructive">
                {apiError(error, "Couldn't load transactions")}
              </p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium">No transactions yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Invoices appear here after your first payment.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">Date</TableHead>
                    <TableHead className="hidden sm:table-cell">Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-5 text-right">
                      <span className="sr-only">Receipt</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="pl-5 font-medium">
                        {formatDate(inv.paidAt ?? inv.created)}
                      </TableCell>
                      <TableCell className="hidden max-w-xs truncate sm:table-cell text-muted-foreground">
                        {inv.description ?? inv.number ?? '—'}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(inv.amount, inv.currency)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={inv.status} />
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Both are null while an invoice is still a draft. */}
                          {inv.hostedInvoiceUrl && (
                            <a
                              href={inv.hostedInvoiceUrl}
                              target="_blank"
                              rel="noreferrer"
                              aria-label="View invoice"
                              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                          {inv.invoicePdf && (
                            <a
                              href={inv.invoicePdf}
                              target="_blank"
                              rel="noreferrer"
                              aria-label="Download receipt"
                              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Download className="size-3.5" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {hasNextPage && (
                <div className="flex justify-center border-t border-foreground/5 p-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      'Load more'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
