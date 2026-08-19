import { Link } from 'react-router-dom';
import { GUIDES } from '@/seo/routes';
import { H2, P, UL, Callout, Faq } from './GuideLayout';

const guide = GUIDES.find((g) => g.slug === 'carrier-email-to-text-shutdown')!;

export default function CarrierEmailToTextShutdown() {
  return (
    <>
      <P>
        For about twenty years, every US carrier ran a free email-to-SMS gateway. You sent an email
        to <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">5551234567@vtext.com</code>{' '}
        and it landed on the phone as a text message. Monitoring systems used it. Schools used it.
        Small businesses built entire alerting workflows on it. It cost nothing and required no
        account.
      </P>
      <P>
        It is gone. Not degraded, not rate-limited — switched off. If your alerts stopped arriving
        somewhere between late 2024 and mid-2025 and you have been assuming it was a configuration
        problem on your end, it was not.
      </P>

      <H2>What shut down, and when</H2>
      <UL>
        <li>
          <strong>Verizon (vtext.com, vzwpix.com)</strong> — discontinued in late 2024, fully
          retired June 17, 2025.
        </li>
        <li>
          <strong>T-Mobile (tmomail.net)</strong> — went intermittent in November 2024 and stopped
          delivering entirely in December 2024. Many people spent weeks assuming the message loss
          was random.
        </li>
        <li>
          <strong>AT&amp;T (txt.att.net)</strong> — officially discontinued June 17, 2025, the same
          day as Verizon.
        </li>
      </UL>
      <P>
        Mail sent to those addresses now either bounces or is silently accepted and dropped. The
        silent-drop case is the one that hurts: nothing in your logs indicates failure, so an
        alerting pipeline can look perfectly healthy while delivering nothing.
      </P>

      <H2>Why the carriers killed it</H2>
      <P>
        The gateways were built in an era when nobody was worried about who was sending mail. They
        accepted a message from any address on the internet, performed no sender authentication, ran
        no meaningful rate limits, and required no business verification. Whatever name the sender
        put in the From field is what showed up on the recipient's phone.
      </P>
      <P>
        That combination made them close to ideal infrastructure for SMS phishing. An attacker could
        send a text that appeared to come from a bank, at scale, for free, with no account to
        suspend and no paper trail. Carriers spent years trying to filter their way out of it before
        concluding the design itself was the problem.
      </P>
      <Callout>
        <strong>The part most write-ups get wrong:</strong> this was not a cost-cutting decision or
        a push to sell paid messaging. The gateways were an unauthenticated relay in a messaging
        ecosystem that has since standardized on verified senders — 10DLC registration, brand
        vetting, campaign approval. There was no version of the free gateway that could be made
        compliant, which is why no carrier replaced it with a paid tier of the same thing.
      </Callout>

      <H2>What still works</H2>
      <P>
        Some smaller carriers and MVNOs still operate gateways — see the{' '}
        <Link to="/guides/carrier-email-to-sms-gateway-list" className="text-blue-600 hover:underline">
          current gateway list
        </Link>{' '}
        for which addresses are still live. Relying on them is a bad bet. They serve a fraction of
        US phones, they carry the same design flaws that got the big three shut down, and each one
        is a single announcement away from going dark with no notice.
      </P>
      <P>The three realistic replacements:</P>
      <UL>
        <li>
          <strong>A messaging API</strong> (Twilio, SignalWire, Sinch). Right answer if you are
          sending programmatically and can write code. You will register a 10DLC campaign and pay
          per message.
        </li>
        <li>
          <strong>An outbound email-to-SMS service</strong> (Textmagic, Notifyre, TXTImpact). These
          replicate the old workflow: you email a special address, they deliver the SMS. Built for
          businesses texting <em>customers</em>, priced per message or per seat.
        </li>
        <li>
          <strong>An inbound email-to-text service</strong> — the opposite direction, and the one
          most people who miss vtext.com actually want. Instead of sending texts to other people,
          you get <em>your own</em> inbox delivered to <em>your own</em> phone.
        </li>
      </UL>

      <H2>Which one you need</H2>
      <P>
        Be honest about which direction you were using the gateway for, because the two categories
        do not substitute for each other.
      </P>
      <P>
        If you were emailing <em>your own number</em> so that important mail reached you when you
        were away from a screen — the overwhelmingly common case for individuals — an outbound
        business SMS platform is the wrong shape and roughly ten times the price. What you want is a
        service that watches your inbox and texts you.
      </P>
      <P>
        That is what{' '}
        <Link to="/" className="text-blue-600 hover:underline">EmailOnText</Link>{' '}
        does: connect Gmail, verify your phone, and important email arrives as SMS — summarized to
        fit one message, with the sender and subject intact. You can reply to the email straight
        from the text thread, which the carrier gateways never supported. It runs over real
        registered SMS infrastructure, so it is not going to disappear the way the free gateways
        did.
      </P>

      <Faq pairs={guide.faq!} />
    </>
  );
}
