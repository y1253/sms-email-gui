import { Link } from 'react-router-dom';
import { Check, Mail, Reply, Sparkles } from 'lucide-react';
import { usePricing, formatPrice } from '../api/pricing';
import SiteNav from '@/components/marketing/SiteNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * The long-form explanation this page used to carry — what an email to text
 * service is, the carrier gateway shutdown, the comparison table, the FAQ —
 * now lives on /what-is-email-to-text. Anything added back here should earn
 * its place above the pricing card.
 */
const steps = [
  {
    icon: Mail,
    title: 'Connect your Gmail',
    desc: 'One click with Google sign-in. No password shared, no forwarding rules to maintain.',
  },
  {
    icon: Sparkles,
    title: 'AI writes the summary',
    desc: 'AI condenses each important email into one 160-character text, sender and subject kept intact.',
  },
  {
    icon: Reply,
    title: 'Reply by text',
    desc: 'Text back R and your message. It goes out as a real email from your address.',
  },
];

const audiences = ['Spotty coverage', 'On-call & field work', 'Roaming data off', 'Flip & basic phones'];

const perks = [
  'One Gmail + one phone number',
  'Unlimited email forwarding',
  'AI-powered SMS summaries',
  'Reply & compose via text',
];

/** One SMS bubble. `from` = the service (left), `you` = the user (right). */
function Bubble({ side, children }: { side: 'from' | 'you'; children: React.ReactNode }) {
  const isYou = side === 'you';
  return (
    <div className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[86%] rounded-2xl px-4 py-3 font-mono text-[13px] leading-relaxed',
          'whitespace-pre-line break-words',
          isYou
            ? 'rounded-br-sm bg-primary text-primary-foreground'
            : 'rounded-bl-sm bg-background text-foreground/85 ring-1 ring-foreground/10',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  );
}

export default function Landing() {
  const { data: pricing } = usePricing();
  const price = formatPrice(pricing);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-20 lg:grid-cols-2 lg:gap-16 lg:pt-22 lg:pb-24">
        <div className="flex flex-col items-start gap-6">
          <h1 className="font-heading text-4xl leading-[1.05] font-extrabold tracking-tight text-pretty sm:text-5xl lg:text-[3.4rem]">
            Email to text, summarized by AI
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
            EmailOnText watches your Gmail, has AI condense each important email into a single text
            message, and lets you reply right from your messages app — no internet, no data plan, no
            app to install.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Button className="h-12 px-7 text-base" render={<Link to="/register" />}>
              Get started
            </Button>
            <Button
              variant="link"
              className="h-12 px-0 text-base"
              render={<Link to="/how-it-works" />}
            >
              See how it works →
            </Button>
          </div>
          {/* Dropped rather than shown half-empty if /pricing ever fails. */}
          {price && (
            <p className="text-sm text-muted-foreground">
              {price}/{pricing?.interval ?? 'month'} · one Gmail account paired with one phone number
            </p>
          )}
        </div>

        {/* What an alert actually looks like — the exact SMS the service sends. */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
            What lands on your phone
          </span>
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted p-4 sm:p-5">
            <Bubble side="from">
              {`To: you@gmail.com
From: Bob Smith bob@work.com

Invoice #204 is due Friday — reply to confirm receipt.

📎+2  |  Reply: R 481920`}
            </Bubble>
            <Bubble side="you">R On my way, thanks!</Bubble>
            <Bubble side="from">{'Sent to Bob Smith <bob@work.com>'}</Bubble>
          </div>
          <span className="text-xs text-muted-foreground">
            Sample thread. Real alerts carry your own sender and subject.
          </span>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-11 px-6">
          <h2 className="font-heading text-3xl font-bold tracking-tight">How it works</h2>
          <div className="grid w-full gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="[--card-spacing:--spacing(7)]">
                <CardContent className="flex flex-col gap-2.5">
                  <Icon className="size-6 text-primary" strokeWidth={1.7} aria-hidden="true" />
                  <h3 className="font-heading mt-1.5 text-[17px] font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="link" className="h-auto p-0" render={<Link to="/how-it-works" />}>
            See the full command reference →
          </Button>
        </div>
      </section>

      {/* Why it still works when the free gateways don't */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-4">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-pretty">
            Built for the places email doesn’t reach
          </h2>
          <p className="leading-relaxed text-muted-foreground text-pretty">
            The free carrier gateways — <code className="font-mono text-sm">vtext.com</code>,{' '}
            <code className="font-mono text-sm">tmomail.net</code> — shut down between 2024 and 2025.
            EmailOnText runs on registered SMS infrastructure, so it keeps working.
          </p>
          <Button variant="link" className="h-auto p-0" render={<Link to="/what-is-email-to-text" />}>
            What is an email to text service? →
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {audiences.map((a) => (
            <div key={a} className="rounded-xl border border-border px-4 py-4 text-sm font-medium">
              {a}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-muted py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-9 px-6">
          <h2 className="font-heading text-3xl font-bold tracking-tight">Simple pricing</h2>
          <Card className="w-full max-w-sm [--card-spacing:--spacing(8)]">
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-1">
                <span className="font-heading text-5xl leading-none font-extrabold tracking-tight text-primary">
                  {price}
                </span>
                <span className="text-sm text-muted-foreground">
                  per set / {pricing?.interval ?? 'month'}
                </span>
              </div>
              <ul className="flex flex-col gap-3">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm">
                    <Check className="size-4 shrink-0 text-success" strokeWidth={2.5} aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
              <Button className="h-12 w-full text-base" render={<Link to="/register" />}>
                Get started
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <SiteFooter mt={false} />
    </div>
  );
}
