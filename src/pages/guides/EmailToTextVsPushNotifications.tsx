import { Link } from 'react-router-dom';
import { H2, P, UL, Callout } from './GuideLayout';

const ROWS: Array<[string, string, string]> = [
  ['Needs a data connection', 'No — rides the cellular control channel', 'Yes'],
  ['Needs a smartphone', 'No — any phone that receives SMS', 'Yes'],
  ['Needs an app installed', 'No', 'Yes'],
  ['Works while roaming with data off', 'Yes', 'No'],
  ['Works on 1–2 bars / 2G', 'Usually', 'Rarely'],
  ['Survives being muted by habit', 'Mostly — texts stay salient', 'No — the main failure mode'],
  ['Battery cost', 'Negligible', 'Background sync + radio'],
  ['Delivery when phone is off', 'Queued at the network, delivered on power-up', 'Depends on the push service'],
  ['Message length', '160 characters', 'Effectively unlimited'],
  ['Rich content (images, buttons)', 'No', 'Yes'],
  ['Marginal cost', 'Per message or per subscription', 'Free'],
];

export default function EmailToTextVsPushNotifications() {
  return (
    <>
      <P>
        Both put email on your phone. They fail in completely different ways, and the choice is
        really a question of which failure you can live with.
      </P>

      <H2>Side by side</H2>
      <div className="overflow-x-auto -mx-6 px-6 my-6">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 text-left">
              <th className="py-2 pr-4 font-semibold text-gray-900">&nbsp;</th>
              <th className="py-2 pr-4 font-semibold text-gray-900">Email to text (SMS)</th>
              <th className="py-2 font-semibold text-gray-900">Push notification</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, sms, push]) => (
              <tr key={label} className="border-b border-gray-100 align-top">
                <td className="py-3 pr-4 font-medium text-gray-900">{label}</td>
                <td className="py-3 pr-4 text-gray-700">{sms}</td>
                <td className="py-3 text-gray-700">{push}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>Where push wins</H2>
      <P>
        For most people on a modern phone with a decent plan, push is better and it is not close.
        It is free, instant, carries the full message with formatting and attachments, threads
        properly, and gives you actions — archive, snooze, reply inline — straight from the
        notification. If you have a smartphone with reliable data and you actually read your
        notifications, you do not need anything else.
      </P>

      <H2>Where push quietly fails</H2>
      <UL>
        <li>
          <strong>Weak signal.</strong> Push needs a working data connection to a push service. One
          bar is often enough for SMS and not enough to complete the handshake push depends on.
        </li>
        <li>
          <strong>No data plan, or data exhausted.</strong> Push stops. SMS does not.
        </li>
        <li>
          <strong>Roaming with data off.</strong> The standard way to avoid bill shock abroad also
          switches off every push notification you have.
        </li>
        <li>
          <strong>Battery optimization.</strong> Both Android and iOS aggressively throttle
          background refresh. Mail notifications arriving in a batch an hour late is a
          feature working as designed, not a bug.
        </li>
        <li>
          <strong>Basic phones.</strong> No app, no push, by definition.
        </li>
      </UL>

      <Callout>
        <strong>The failure mode people underrate is attention, not delivery.</strong> A phone with
        forty apps sending push is a phone whose owner has learned to dismiss notifications without
        reading them. SMS still carries an implicit weight — most people's text threads are people
        they know. That advantage is real, and it is also fragile: text someone about every
        newsletter and it evaporates within a week. This is the entire argument for filtering hard
        rather than forwarding everything.
      </Callout>

      <H2>Using both</H2>
      <P>
        These are not mutually exclusive, and the sensible setup for most people is both. Leave push
        on for normal use, where it does the better job. Add email to text as the path that survives
        when push cannot: bad coverage, no data, roaming, a dead-quiet inbox at 3am that someone
        needs to hear about.
      </P>
      <P>
        <Link to="/" className="text-blue-600 hover:underline">EmailOnText</Link> is built for that
        second role. It forwards only mail Gmail classifies as Primary or Important, summarizes each
        one to a single 160-character message so the sender and subject fit on the lock screen, and
        lets you reply to the sender by texting back — which no push notification can do once the
        data connection is gone.
      </P>
      <P>
        If the no-data case is the one you care about, the{' '}
        <Link to="/guides/read-email-without-internet" className="text-blue-600 hover:underline">
          no-internet guide
        </Link>{' '}
        explains why SMS gets through when the mail app cannot connect at all.
      </P>
    </>
  );
}
