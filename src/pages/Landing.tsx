import { Link } from 'react-router-dom';
import { usePricing, formatPrice } from '../api/pricing';
import SiteFooter from '@/components/marketing/SiteFooter';
import { HOME_FAQ } from '@/seo/routes';

const steps = [
  {
    icon: '📧',
    title: 'Connect your Gmail',
    desc: 'Link your Gmail account in one click with Google sign-in. No password shared, no forwarding rules to maintain.',
  },
  {
    icon: '📱',
    title: 'Get emails as text messages',
    desc: 'Important email is summarized to fit one SMS — sender and subject intact — and sent to your phone within seconds.',
  },
  {
    icon: '↩️',
    title: 'Reply by text',
    desc: 'Text back to answer the sender, or compose a new email from your messages app. No internet needed.',
  },
];

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
  ['Fits in one text message', 'Yes — summarized', 'No — body is split', 'No'],
  ['Filters out newsletters', 'Yes — Primary/Important only', 'No', 'Manual rules'],
  ['Works with no data plan', 'Yes', 'Yes', 'Yes'],
  ['Setup effort', 'Two clicks', 'Gateway lookup + filters', 'Filters + forwarding'],
];

export default function Landing() {
  const { data: pricing } = usePricing();

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
        <span className="text-xl font-bold text-blue-600">EmailOnText</span>
        <div className="flex gap-3">
          <Link to="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
            How it works
          </Link>
          <Link to="/guides" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
            Guides
          </Link>
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
            Log in
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Email to Text Service — Get Your Gmail as SMS
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          EmailOnText forwards important email to your phone as a text message and lets you reply
          right from your messages app. No internet, no data plan, no app to install.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 text-lg"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="bg-gray-100 text-gray-800 font-semibold px-8 py-3 rounded-xl hover:bg-gray-200 text-lg"
          >
            Log in
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="text-4xl mb-4" aria-hidden="true">{step.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-10">
            <Link to="/how-it-works" className="text-blue-600 hover:underline">
              See the full command reference →
            </Link>
          </p>
        </div>
      </section>

      {/* What it is */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is an email to text service?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            An email to text service delivers email to a mobile phone as an SMS message, so you can
            read and answer mail without opening an inbox or having a data connection. For years
            this job was done by free carrier gateways — you emailed{' '}
            <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">number@vtext.com</code> and
            it arrived as a text.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            EmailOnText does the same job in the direction most people actually want: instead of you
            sending texts to other people, it watches the Gmail account you connect and sends{' '}
            <em>your</em> important mail to <em>your</em> phone. Each message is summarized by AI to
            fit a single 160-character text, with the sender and subject line preserved so you can
            tell at a glance whether it needs an answer. Text back and your reply is sent as a real
            email from your real address.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Because it runs over registered SMS infrastructure rather than a free relay, it is not
            subject to the shutdowns that took out the carrier gateways.
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Who it’s for</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {audiences.map((a) => (
              <div key={a.title} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{a.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carrier shutdown */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why carrier email to text stopped working
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Verizon, T-Mobile, and AT&amp;T shut down their free email-to-SMS gateways between late
            2024 and June 2025. The gateways accepted mail from anyone with no sender
            authentication, which made them ideal infrastructure for phishing texts, and there was
            no version of that design that could be made compliant with modern sender verification.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Addresses like{' '}
            <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">number@vtext.com</code> and{' '}
            <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm">number@tmomail.net</code>{' '}
            now bounce or, worse, accept the message and silently drop it — so alerting pipelines
            built on them look healthy while delivering nothing.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <Link
              to="/guides/carrier-email-to-text-shutdown"
              className="text-blue-600 hover:underline"
            >
              Read the full shutdown timeline →
            </Link>
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Compared to the alternatives
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Outbound services like Textmagic and Notifyre solve a different problem — sending texts
            from your inbox to other people. This table covers getting your own mail to your own
            phone.
          </p>
          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm p-6">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-3 pr-4 font-semibold text-gray-900">&nbsp;</th>
                  <th className="py-3 pr-4 font-semibold text-blue-600">EmailOnText</th>
                  <th className="py-3 pr-4 font-semibold text-gray-900">Carrier gateway</th>
                  <th className="py-3 font-semibold text-gray-900">Gmail forwarding</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(([label, ours, gateway, gmail]) => (
                  <tr key={label} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-4 font-medium text-gray-900">{label}</td>
                    <td className="py-3 pr-4 text-gray-700">{ours}</td>
                    <td className="py-3 pr-4 text-gray-700">{gateway}</td>
                    <td className="py-3 text-gray-700">{gmail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Simple pricing</h2>
          <div className="bg-white rounded-2xl shadow-md ring-1 ring-gray-200 p-10">
            <p className="text-5xl font-extrabold text-blue-600 mb-2">{formatPrice(pricing)}</p>
            <p className="text-gray-500 mb-6">per set / {pricing?.interval ?? 'month'}</p>
            <ul className="text-sm text-gray-700 space-y-3 text-left mb-8">
              {[
                'One Gmail + one phone number',
                'Unlimited email forwarding',
                'AI-powered SMS summaries',
                'Reply & compose via text',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-green-500 font-bold" aria-hidden="true">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="block bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ — pairs also generate the FAQPage JSON-LD, so they must stay visible here */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently asked questions
          </h2>
          <dl className="space-y-8">
            {HOME_FAQ.map(([q, a]) => (
              <div key={q}>
                <dt className="font-semibold text-gray-900 mb-2">{q}</dt>
                <dd className="text-gray-600 leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <SiteFooter mt={false} />
    </div>
  );
}
