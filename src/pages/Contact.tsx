import { Link } from 'react-router-dom';
import SiteFooter from '@/components/marketing/SiteFooter';
import { SUPPORT_EMAIL } from '../lib/support';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
        <Link to="/" className="text-xl font-bold text-blue-600">EmailOnText</Link>
        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          ← Back to home
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Contact us</h1>
        <p className="text-gray-500 text-lg mb-10 max-w-2xl">
          Questions about your account, billing, or a message that didn't arrive? Email us —
          a real person reads every message.
        </p>

        <section className="space-y-8 text-gray-700 leading-relaxed">
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Email support</p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-2xl font-semibold text-blue-600 hover:underline break-all"
            >
              {SUPPORT_EMAIL}
            </a>
            <p className="text-sm text-gray-500 mt-3">
              We reply within 1–2 business days.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">What to include</h2>
            <p>So we can find your account and help on the first reply, please tell us:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>The Gmail address you connected to EmailOnText.</li>
              <li>The phone number you receive texts on.</li>
              <li>
                What you expected to happen and what happened instead — and, if it's about a
                specific text, the message number shown at the end of it.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Faster than email</h2>
            <p>Two things you can answer yourself right now:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                Text <strong>HELP</strong> to the number your alerts come from and you'll get the
                full list of SMS commands back straight away.
              </li>
              <li>
                <Link to="/how-it-works" className="text-blue-600 hover:underline">How it works</Link>{' '}
                walks through replying to an email, sending a new one, and managing your sets.
              </li>
            </ul>
            <p className="mt-3">
              To stop receiving texts at any time, reply <strong>STOP</strong> to any message.
              Reply <strong>START</strong> to turn them back on.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Privacy and billing requests</h2>
            <p>
              Requests to delete your account or export your data, and any question about the{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> or{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>,
              go to the same address —{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600 hover:underline">
                {SUPPORT_EMAIL}
              </a>
              . You can also disconnect a Gmail account or remove a phone number yourself from your
              dashboard at any time.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
