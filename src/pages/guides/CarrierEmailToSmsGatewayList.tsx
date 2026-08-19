import { Link } from 'react-router-dom';
import { H2, P, UL, Callout } from './GuideLayout';

type Row = {
  carrier: string;
  sms: string;
  mms?: string;
  status: 'dead' | 'live' | 'unreliable';
  note: string;
};

const ROWS: Row[] = [
  {
    carrier: 'Verizon',
    sms: 'number@vtext.com',
    mms: 'number@vzwpix.com',
    status: 'dead',
    note: 'Discontinued late 2024, fully retired June 17, 2025.',
  },
  {
    carrier: 'AT&T',
    sms: 'number@txt.att.net',
    mms: 'number@mms.att.net',
    status: 'dead',
    note: 'Officially discontinued June 17, 2025.',
  },
  {
    carrier: 'T-Mobile',
    sms: 'number@tmomail.net',
    status: 'dead',
    note: 'Intermittent from November 2024, stopped entirely December 2024.',
  },
  {
    carrier: 'Sprint (now T-Mobile)',
    sms: 'number@messaging.sprintpcs.com',
    status: 'dead',
    note: 'Network shut down in 2022; addresses folded into T-Mobile and then retired.',
  },
  {
    carrier: 'US Cellular',
    sms: 'number@email.uscc.net',
    status: 'unreliable',
    note: 'Still accepts mail at time of writing, delivery is inconsistent.',
  },
  {
    carrier: 'Boost Mobile',
    sms: 'number@sms.myboostmobile.com',
    status: 'unreliable',
    note: 'Works intermittently; no published commitment to keep it running.',
  },
  {
    carrier: 'Cricket Wireless',
    sms: 'number@sms.cricketwireless.net',
    status: 'unreliable',
    note: 'AT&T-owned; expected to follow the parent network eventually.',
  },
  {
    carrier: 'Google Fi',
    sms: 'number@msg.fi.google.com',
    status: 'live',
    note: 'Still operating. Google has not announced a retirement date.',
  },
  {
    carrier: 'Consumer Cellular',
    sms: 'number@mailmymobile.net',
    status: 'unreliable',
    note: 'MVNO on AT&T/T-Mobile; delivery depends on the underlying network.',
  },
  {
    carrier: 'Ting',
    sms: 'number@message.ting.com',
    status: 'unreliable',
    note: 'MVNO; same caveat as above.',
  },
];

const BADGE: Record<Row['status'], { label: string; cls: string }> = {
  dead: { label: 'Retired', cls: 'bg-red-100 text-red-700' },
  unreliable: { label: 'Unreliable', cls: 'bg-amber-100 text-amber-800' },
  live: { label: 'Working', cls: 'bg-green-100 text-green-700' },
};

export default function CarrierEmailToSmsGatewayList() {
  return (
    <>
      <P>
        Most copies of this list floating around the web are five years stale and present every row
        as though it still works. This one marks each address with its actual status as of 2026.
        Replace <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">number</code> with the
        10-digit phone number, no dashes or country code.
      </P>

      <Callout>
        <strong>Read this before you copy an address.</strong> The three carriers covering the large
        majority of US phones — Verizon, AT&amp;T, and T-Mobile — have all retired their gateways.
        If you are troubleshooting alerts that stopped arriving, this is almost certainly why. The{' '}
        <Link to="/guides/carrier-email-to-text-shutdown" className="text-blue-600 hover:underline">
          shutdown timeline
        </Link>{' '}
        has the details.
      </Callout>

      <H2>US carrier email-to-SMS gateways</H2>
      <div className="overflow-x-auto -mx-6 px-6 my-6">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 text-left">
              <th className="py-2 pr-4 font-semibold text-gray-900">Carrier</th>
              <th className="py-2 pr-4 font-semibold text-gray-900">Gateway address</th>
              <th className="py-2 pr-4 font-semibold text-gray-900">Status</th>
              <th className="py-2 font-semibold text-gray-900">Notes</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.carrier} className="border-b border-gray-100 align-top">
                <td className="py-3 pr-4 font-medium text-gray-900 whitespace-nowrap">{r.carrier}</td>
                <td className="py-3 pr-4 font-mono text-xs text-gray-700">
                  <div>{r.sms}</div>
                  {r.mms && <div className="text-gray-400 mt-1">{r.mms} (MMS)</div>}
                </td>
                <td className="py-3 pr-4 whitespace-nowrap">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${BADGE[r.status].cls}`}>
                    {BADGE[r.status].label}
                  </span>
                </td>
                <td className="py-3 text-gray-600">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>Why "unreliable" is not the same as "working"</H2>
      <P>
        Several MVNO gateways still accept mail. That is not the same as delivering it. What we see
        in practice with the remaining ones:
      </P>
      <UL>
        <li>
          <strong>Silent drops.</strong> The message is accepted over SMTP and never delivered. No
          bounce, no error — the worst possible failure mode for an alerting pipeline, because
          everything looks healthy.
        </li>
        <li>
          <strong>Aggressive filtering.</strong> Anything that looks automated gets binned. Sending
          more than a handful a day tends to trip it.
        </li>
        <li>
          <strong>Sudden retirement.</strong> MVNOs ride the big three's networks. As the underlying
          carriers tighten sender requirements, the MVNO gateways follow. None of the ones listed
          above carries a published commitment to keep running.
        </li>
        <li>
          <strong>Delay.</strong> Messages that do land can arrive minutes to hours late, which
          defeats most of the reason for sending a text.
        </li>
      </UL>

      <H2>What to use instead</H2>
      <P>
        It depends on which direction you need, and the two are not interchangeable:
      </P>
      <UL>
        <li>
          <strong>Texting other people programmatically</strong> — use a messaging API (Twilio,
          SignalWire, Sinch) or an outbound email-to-SMS provider (Textmagic, Notifyre). Expect
          10DLC registration and per-message pricing.
        </li>
        <li>
          <strong>Getting your own email onto your own phone</strong> — this is what most people
          were using the gateway for, and a business SMS platform is the wrong shape for it. An{' '}
          <Link to="/" className="text-blue-600 hover:underline">email to text service</Link> like
          EmailOnText connects to your Gmail, texts you the mail that matters, and — unlike any
          gateway ever did — lets you reply to the sender straight from the text thread.
        </li>
      </UL>
      <P>
        If your use case was the second one, the{' '}
        <Link to="/guides/forward-gmail-to-text-message" className="text-blue-600 hover:underline">
          Gmail forwarding guide
        </Link>{' '}
        walks through both the manual route and the automatic one.
      </P>
    </>
  );
}
