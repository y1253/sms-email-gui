import { Link } from 'react-router-dom';
import { GUIDES } from '@/seo/routes';
import { H2, H3, P, UL, Callout, Faq } from './GuideLayout';

const guide = GUIDES.find((g) => g.slug === 'forward-gmail-to-text-message')!;

export default function ForwardGmailToTextMessage() {
  return (
    <>
      <P>
        Gmail cannot send a text message. It can only forward to an email address. Every method of
        getting Gmail onto your phone as SMS therefore comes down to one question: what turns that
        forwarded email into a text?
      </P>
      <P>
        There are two answers. One is free, manual, and now mostly broken. The other is automatic.
        Both are below, with the limits of each stated plainly.
      </P>

      <H2>Method 1: Gmail filter + a carrier gateway</H2>
      <P>
        The classic approach. Gmail forwards matching mail to a carrier's email-to-SMS address,
        which converts it to a text.
      </P>

      <H3>Step by step</H3>
      <UL>
        <li>
          Find your carrier's gateway address — the format is your 10-digit number followed by the
          carrier's domain. Check the{' '}
          <Link to="/guides/carrier-email-to-sms-gateway-list" className="text-blue-600 hover:underline">
            current gateway list
          </Link>{' '}
          first, because most of the major ones no longer work.
        </li>
        <li>
          In Gmail, open <strong>Settings → Forwarding and POP/IMAP → Add a forwarding address</strong>{' '}
          and enter the gateway address.
        </li>
        <li>
          Gmail sends a confirmation code to that address, which arrives as a text on your phone.
          Enter it back in Gmail to verify.
        </li>
        <li>
          Go to <strong>Settings → Filters and Blocked Addresses → Create a new filter</strong>. To
          forward everything, put <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">@</code>{' '}
          in the From field; to forward only specific senders, list them instead.
        </li>
        <li>
          Click <strong>Create filter</strong>, tick <strong>Forward it to</strong>, choose the
          gateway address, and save.
        </li>
      </UL>

      <Callout>
        <strong>Do not skip the filter.</strong> Turning on blanket forwarding sends every
        newsletter, receipt, and promotional email to your phone. On a metered plan that gets
        expensive fast, and on any plan it buries the messages that mattered.
      </Callout>

      <H3>What this method cannot do</H3>
      <UL>
        <li>
          <strong>Your carrier's gateway is probably dead.</strong> Verizon, T-Mobile, and AT&amp;T
          all shut theirs down between late 2024 and June 2025. Verification will simply never
          arrive, or forwarded mail will vanish silently.
        </li>
        <li>
          <strong>You cannot reply.</strong> The text arrives from the gateway, not the sender.
          Replying to it reaches the gateway, which is either not listening or no longer exists. The
          original sender never hears from you.
        </li>
        <li>
          <strong>The message gets mangled.</strong> Gmail forwards the whole body. SMS holds 160
          characters. A normal email is split across five or ten texts arriving out of order, with
          the useful part usually in the middle, wrapped in quoted signatures and legal footers.
        </li>
        <li>
          <strong>No triage.</strong> A filter matches on sender or keyword. It has no notion of
          which mail is actually important today.
        </li>
      </UL>

      <H2>Method 2: an email to text service</H2>
      <P>
        The second answer is to use a service that owns real SMS infrastructure and connects to your
        inbox directly, which removes the gateway from the equation entirely.
      </P>
      <P>
        <Link to="/" className="text-blue-600 hover:underline">EmailOnText</Link> works this way.
        You connect Gmail through Google sign-in — no password shared, no forwarding rules to
        maintain — and verify your phone number once. From then on:
      </P>
      <UL>
        <li>
          Only mail Gmail classifies as Primary or Important is forwarded, so promotions and
          newsletters stay off your phone without you writing a single filter rule.
        </li>
        <li>
          Each email is summarized to fit one 160-character SMS, with the sender and subject line
          preserved so you can judge at a glance whether it needs an answer.
        </li>
        <li>
          You can reply to the actual sender by texting back{' '}
          <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">R</code> and your message, or
          start a new email with{' '}
          <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">S someone@example.com</code>.
          The{' '}
          <Link to="/how-it-works" className="text-blue-600 hover:underline">
            full command reference
          </Link>{' '}
          covers replying to a specific message and setting subject lines.
        </li>
        <li>
          It runs over registered SMS infrastructure rather than a free relay, so it is not subject
          to the shutdown that took out the carrier gateways.
        </li>
      </UL>

      <H2>Which to choose</H2>
      <P>
        If you are on a carrier whose gateway still works, you only care about one or two specific
        senders, and you never need to reply — method 1 is free and worth trying. Accept that it may
        stop working without notice.
      </P>
      <P>
        If you need reliable delivery, want to answer email from your phone, or your carrier is one
        of the big three, method 1 is not available to you at any level of effort. That is the gap
        an email to text service fills.
      </P>

      <Faq pairs={guide.faq!} />
    </>
  );
}
