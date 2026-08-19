import { Link } from 'react-router-dom';
import { GUIDES } from '@/seo/routes';
import { H2, P, UL, Callout, Faq } from './GuideLayout';

const guide = GUIDES.find((g) => g.slug === 'read-email-without-internet')!;

export default function ReadEmailWithoutInternet() {
  return (
    <>
      <P>
        Every mail app on your phone needs a data connection. No Wi-Fi, no cellular data, no
        roaming plan — no email. The inbox is right there on the screen and completely inert.
      </P>
      <P>
        SMS is different, and the reason is worth understanding, because it is what makes reading
        email without internet possible at all.
      </P>

      <H2>Why SMS gets through when data does not</H2>
      <P>
        Text messages do not travel over the data connection. They ride the cellular control
        channel — the same low-bandwidth signalling path the network uses to page your phone about
        an incoming call. It is always on whenever your phone has any registration with a tower at
        all.
      </P>
      <P>Practically, that means SMS keeps working when:</P>
      <UL>
        <li>You have one bar and the data connection has given up.</li>
        <li>You are on a plan with no data allowance, or you have burned through it.</li>
        <li>
          You are roaming and have data switched off to avoid charges — texts still arrive, usually
          at a small fixed cost or free on the receiving end.
        </li>
        <li>You are on 2G-only coverage where modern data is unusable.</li>
        <li>
          You are on a basic phone or flip phone that has no mail app and no browser worth using.
        </li>
        <li>
          The network is congested. Voice and SMS get priority; data is what degrades first at a
          crowded venue or during an emergency.
        </li>
      </UL>

      <Callout>
        <strong>The nuance nobody mentions:</strong> "no internet" is rarely a binary. Most of the
        time you have a technically-present data connection that is too weak to complete a TLS
        handshake and sync a mailbox. Your mail app shows a spinner and eventually times out, which
        reads as "no email" even though the phone is connected. SMS has no handshake to fail — the
        message is either delivered or queued at the network until it can be.
      </Callout>

      <H2>Getting email onto a phone with no data</H2>
      <P>
        The mechanism is simple: something with a working internet connection needs to watch your
        inbox and convert new mail into text messages. That something cannot be your phone, because
        your phone is the thing without a connection. It has to be a service.
      </P>
      <P>
        Carrier email-to-SMS gateways used to fill this role for free. They were shut down between
        late 2024 and June 2025 —{' '}
        <Link to="/guides/carrier-email-to-text-shutdown" className="text-blue-600 hover:underline">
          why that happened
        </Link>{' '}
        is its own story — and forwarding Gmail to one no longer works for most US phones.
      </P>
      <P>
        <Link to="/" className="text-blue-600 hover:underline">EmailOnText</Link> is built for
        exactly this case. You connect your Gmail account once, from any device with a connection.
        After that the service does the watching, and your phone only ever needs to receive SMS:
      </P>
      <UL>
        <li>
          Important mail arrives as a text with the sender, subject, and a summary that fits in one
          message.
        </li>
        <li>
          You reply by texting back{' '}
          <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">R</code> followed by your
          message — the reply is sent as a real email from your real address, so the recipient sees
          a normal reply in their thread.
        </li>
        <li>
          You can start a new email with{' '}
          <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">S someone@example.com</code>{' '}
          and your message.
        </li>
        <li>
          Nothing is installed on the phone. There is no app to keep logged in, no background sync,
          and no battery cost beyond receiving a text.
        </li>
      </UL>

      <H2>Where this actually matters</H2>
      <UL>
        <li>
          <strong>Rural and mountain coverage.</strong> Voice and text reach where LTE does not.
        </li>
        <li>
          <strong>International travel.</strong> Leave data roaming off and still get the message
          about the moved meeting.
        </li>
        <li>
          <strong>Deliberately minimal phones.</strong> People moving to a dumbphone to get away
          from apps still need to hear about the important email.
        </li>
        <li>
          <strong>Older relatives.</strong> A phone that only does calls and texts is often the
          point. Email still reaches them.
        </li>
        <li>
          <strong>Work sites and warehouses.</strong> Metal buildings and basements kill data long
          before they kill SMS.
        </li>
      </UL>
      <P>
        None of this requires giving up your existing email setup. Your inbox stays exactly where it
        is — the phone just gains a way to reach it that does not depend on a data connection.
      </P>

      <Faq pairs={guide.faq!} />
    </>
  );
}
