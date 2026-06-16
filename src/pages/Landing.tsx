import { Link } from 'react-router-dom';

const steps = [
  {
    icon: '📧',
    title: 'Connect your Gmail',
    desc: 'Link your Gmail account in one click using Google OAuth.',
  },
  {
    icon: '📱',
    title: 'Get emails as SMS',
    desc: 'Important emails are summarized and sent to your phone instantly.',
  },
  {
    icon: '↩️',
    title: 'Reply by text',
    desc: 'Text back to reply or compose new emails — no internet needed.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
        <span className="text-xl font-bold text-blue-600">SMSMail</span>
        <div className="flex gap-3">
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
          Your Gmail, delivered by text
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          No internet? No problem. SMSMail forwards important emails to your phone as SMS and lets you reply right from your messages app.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 text-lg"
          >
            Get started free
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
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Simple pricing</h2>
          <div className="bg-white rounded-2xl shadow-md ring-1 ring-gray-200 p-10">
            <p className="text-5xl font-extrabold text-blue-600 mb-2">$10</p>
            <p className="text-gray-500 mb-6">per set / month</p>
            <ul className="text-sm text-gray-700 space-y-3 text-left mb-8">
              {[
                'One Gmail + one phone number',
                'Unlimited email forwarding',
                'AI-powered SMS summaries',
                'Reply & compose via text',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-green-500 font-bold">✓</span> {f}
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

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} SMSMail. All rights reserved.{' '}
        <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
        {' · '}
        <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
      </footer>
    </div>
  );
}
