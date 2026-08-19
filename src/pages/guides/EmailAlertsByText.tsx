import { Link } from 'react-router-dom';
import { H2, H3, P, UL, Callout } from './GuideLayout';

export default function EmailAlertsByText() {
  return (
    <>
      <P>
        Plenty of important things still arrive by email: monitoring alerts, dispatch requests,
        order notifications, a customer asking where their technician is. All of it lands in an
        inbox that nobody is looking at when it matters — overnight, on the road, on a site with no
        signal for the mail app.
      </P>
      <P>
        Routing the subset that matters to a phone as SMS is a small change that removes a whole
        category of "we didn't see it until morning."
      </P>

      <H2>Who this is for</H2>

      <H3>On-call engineers and IT</H3>
      <P>
        Monitoring tools mostly emit email. A full paging platform is the right answer for a large
        rotation with escalation policies and schedules, but it is heavy for a two-person team or a
        single sysadmin. If your escalation policy is "text me," you need email to reach a phone,
        not another dashboard.
      </P>

      <H3>Field service and trades</H3>
      <P>
        Job assignments and customer replies come by email, and the person who needs them is under a
        sink or on a roof. Basements, crawlspaces, and steel-framed buildings kill data long before
        they kill SMS — which is precisely when a text gets through and a mail app does not.
      </P>

      <H3>Drivers and logistics</H3>
      <P>
        Route changes and delivery exceptions arrive by email. Reading a mail app while driving is
        both illegal and a terrible idea; a text read aloud by the car, answerable at the next stop
        with a one-line reply, is workable.
      </P>

      <H3>Small business owners</H3>
      <P>
        Nobody is triaging the shared inbox at 9pm. A booking request or a supplier problem that
        sits until morning has a real cost, and hiring someone to watch an inbox is not a
        proportionate fix.
      </P>

      <H2>What a good setup looks like</H2>
      <UL>
        <li>
          <strong>Filter hard at the source.</strong> Alerting that texts you about everything gets
          muted within a week, and then it is worse than nothing. Only genuinely actionable mail
          should reach the phone.
        </li>
        <li>
          <strong>Front-load the message.</strong> SMS gives you 160 characters and the first line
          shows on the lock screen. Sender and subject need to be at the front, not buried after a
          quoted header block.
        </li>
        <li>
          <strong>Make it two-way.</strong> An alert you cannot acknowledge or answer means picking
          up a laptop anyway. Being able to reply from the text thread is what turns notification
          into resolution.
        </li>
        <li>
          <strong>Use infrastructure that will still exist next year.</strong> Anything built on the
          free carrier gateways is already broken — Verizon, AT&amp;T, and T-Mobile{' '}
          <Link to="/guides/carrier-email-to-text-shutdown" className="text-blue-600 hover:underline">
            retired theirs
          </Link>{' '}
          between late 2024 and June 2025.
        </li>
      </UL>

      <Callout>
        <strong>The failure mode to watch for:</strong> a pipeline built on a carrier gateway
        usually does not announce its own death. The gateway accepts the message over SMTP and
        drops it. Your logs show delivery, your monitoring shows green, and nobody notices until an
        incident goes unhandled. If you have alerting that "has been quiet lately," verify it end to
        end before trusting the quiet.
      </Callout>

      <H2>Setting it up</H2>
      <P>
        <Link to="/" className="text-blue-600 hover:underline">EmailOnText</Link> covers this
        without a paging platform or any code. Connect the Gmail account the alerts land in, verify
        the phone that should receive them, and the mail Gmail classifies as important arrives as
        SMS — summarized to one message, sender and subject intact.
      </P>
      <P>
        Replies go back through the same thread: text{' '}
        <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">R</code> and your message to
        answer the last alert, or{' '}
        <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">R 42</code> to answer a specific
        one by its number, which matters when three alerts arrive together. The{' '}
        <Link to="/how-it-works" className="text-blue-600 hover:underline">command reference</Link>{' '}
        has the rest.
      </P>
      <P>
        Each Gmail-and-phone pairing is its own set, so a shared ops inbox can go to one person's
        phone and a sales inbox to another's, billed separately and switched off independently.
      </P>
      <P>
        If the alerts need to reach someone with no data plan at all, the{' '}
        <Link to="/guides/read-email-without-internet" className="text-blue-600 hover:underline">
          no-internet guide
        </Link>{' '}
        covers why SMS still lands when everything else has given up.
      </P>
    </>
  );
}
