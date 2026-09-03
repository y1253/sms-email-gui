import { Link } from 'react-router-dom';
import SiteNav from '@/components/marketing/SiteNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EMAIL_TO_TEXT_FAQ } from '@/seo/routes';

/**
 * The long-form half of the old landing page. It exists so `/` can stay short:
 * everything here was inline on the homepage and pushed the pricing card below
 * a thousand words of explanation.
 *
 * The FAQ pairs render the visible copy *and* generate this route's FAQPage
 * JSON-LD (see `ROUTES` in seo/routes.ts), so they must stay on this page —
 * markup describing questions a page doesn't show is a Google violation.
 */
const audiences = [
  {
    title: 'Spotty coverage',
    desc: 'Rural areas, basements, warehouses, and mountain roads where SMS lands and the mail app times out.',
  },
  {
    title: 'On-call and field work',
    desc: 'Alerts, dispatch, and customer email that need to reach a person who is nowhere near a screen.',
  },
  {
    title: 'Travelling with data off',
    desc: 'Leave roaming data switched off and still hear about the meeting that moved.',
  },
  {
    title: 'Basic and flip phones',
    desc: 'If it sends and receives texts, it can receive your email. No app, no browser, no smartphone.',
  },
];

const comparison: Array<[string, string, string, string]> = [
  ['Still works in 2026', 'Yes', 'No — retired 2024–2025', 'Yes'],
  ['Reply reaches the sender', 'Yes', 'No', 'No'],
  ['Fits in one text message', 'Yes — AI summary', 'No — body is split', 'No'],
  ['Filters out newsletters', 'Yes — Primary/Important only', 'No', 'Manual rules'],
  ['Works with no data plan', 'Yes', 'Yes', 'Yes'],
  ['Setup effort', 'Two clicks', 'Gateway lookup + filters', 'Filters + forwarding'],
];

export default function WhatIsEmailToText() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main className="mx-auto flex max-w-4xl flex-col gap-14 px-6 pt-12 pb-18">
        <header className="flex flex-col gap-3.5">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            {' / '}
            What is an email to text service?
          </nav>
          <h1 className="font-heading text-4xl leading-tight font-extrabold tracking-tight text-pretty">
            What is an email to text service?
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
            How email-to-SMS worked, why the free carrier gateways went away, and what EmailOnText
            does instead.
          </p>
        </header>

        <section className="flex flex-col gap-4 text-foreground/80">
          <p className="leading-[1.75] text-pretty">
            An email to text service delivers email to a mobile phone as an SMS message, so you can
            read and answer mail without opening an inbox or having a data connection. For years
            this job was done by free carrier gateways — you emailed{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              number@vtext.com
            </code>{' '}
            and it arrived as a text.
          </p>
          <p className="leading-[1.75] text-pretty">
            EmailOnText does the same job in the direction most people actually want: instead of you
            sending texts to other people, it watches the Gmail account you connect and sends{' '}
            <em>your</em> important mail to <em>your</em> phone. Each message is summarized by AI to
            fit a single 160-character text, with the sender and subject line preserved so you can
            tell at a glance whether it needs an answer. Text back and your reply is sent as a real
            email from your real address.
          </p>
          <p className="leading-[1.75] text-pretty">
            Because it runs over registered SMS infrastructure rather than a free relay, it is not
            subject to the shutdowns that took out the carrier gateways.
          </p>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-heading text-3xl font-bold tracking-tight">Who it’s for</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {audiences.map((a) => (
              <Card key={a.title} className="[--card-spacing:--spacing(6)]">
                <CardContent className="flex flex-col gap-1.5">
                  <h3 className="font-heading text-base font-semibold tracking-tight">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-start gap-4">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-pretty">
            Why carrier email to text stopped working
          </h2>
          <p className="leading-[1.75] text-foreground/80 text-pretty">
            Verizon, T-Mobile, and AT&amp;T shut down their free email-to-SMS gateways between late
            2024 and June 2025. The gateways accepted mail from anyone with no sender
            authentication, which made them ideal infrastructure for phishing texts, and there was
            no version of that design that could be made compliant with modern sender verification.
          </p>
          <p className="leading-[1.75] text-foreground/80 text-pretty">
            Addresses like{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              number@vtext.com
            </code>{' '}
            and{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              number@tmomail.net
            </code>{' '}
            now bounce or, worse, accept the message and silently drop it — so alerting pipelines
            built on them look healthy while delivering nothing.
          </p>
          <Button
            variant="link"
            className="h-auto p-0"
            render={<Link to="/guides/carrier-email-to-text-shutdown" />}
          >
            Read the full shutdown timeline →
          </Button>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            Compared to the alternatives
          </h2>
          <p className="leading-relaxed text-muted-foreground text-pretty">
            Outbound services like Textmagic and Notifyre solve a different problem — sending texts
            from your inbox to other people. This table covers getting your own mail to your own
            phone.
          </p>
          <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="px-4 text-muted-foreground">&nbsp;</TableHead>
                  <TableHead className="px-4 font-semibold text-primary">EmailOnText</TableHead>
                  <TableHead className="px-4 text-muted-foreground">Carrier gateway</TableHead>
                  <TableHead className="px-4 text-muted-foreground">Gmail forwarding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparison.map(([label, ours, gateway, gmail]) => (
                  <TableRow key={label}>
                    <TableCell className="px-4 py-3 font-medium">{label}</TableCell>
                    <TableCell className="px-4 py-3 text-foreground/80">{ours}</TableCell>
                    <TableCell className="px-4 py-3 text-foreground/80">{gateway}</TableCell>
                    <TableCell className="px-4 py-3 text-foreground/80">{gmail}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <dl className="flex flex-col gap-5.5">
            {EMAIL_TO_TEXT_FAQ.map(([q, a]) => (
              <div key={q} className="flex flex-col gap-1.5">
                <dt className="font-semibold">{q}</dt>
                <dd className="leading-[1.7] text-foreground/70">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="flex flex-col items-center gap-4 rounded-2xl bg-muted p-8 text-center sm:p-11">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Get your email as text messages
          </h2>
          <p className="max-w-lg leading-relaxed text-muted-foreground text-pretty">
            EmailOnText forwards important Gmail to your phone as SMS, summarized by AI, and lets
            you reply by text — no internet, no data plan, no app to install.
          </p>
          <Button className="mt-1 h-12 px-7 text-base" render={<Link to="/register" />}>
            Get started
          </Button>
        </section>
      </main>

      <SiteFooter mt={false} />
    </div>
  );
}
