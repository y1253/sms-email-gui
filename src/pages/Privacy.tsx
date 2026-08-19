import { Link } from 'react-router-dom';
import SiteFooter from '@/components/marketing/SiteFooter';
import { SUPPORT_EMAIL } from '../lib/support';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
        <Link to="/" className="text-xl font-bold text-blue-600">EmailOnText</Link>
        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          ← Back to home
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Effective date: June 15, 2025</p>

        <section className="space-y-8 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Introduction</h2>
            <p>
              EmailOnText ("we", "our", or "us") operates an email-to-SMS forwarding service. This Privacy
              Policy explains what personal data we collect, how we use it, and your rights regarding
              that data. By using EmailOnText you agree to this policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account information:</strong> Your name and email address when you register.
              </li>
              <li>
                <strong>Gmail OAuth credentials:</strong> An OAuth refresh token that lets us access
                your Gmail on your behalf. This token is stored encrypted with AES-256-GCM and is
                never shared with third parties beyond what is required to operate the service.
              </li>
              <li>
                <strong>Email content:</strong> We read incoming emails transiently to generate an
                SMS summary. Email bodies are not stored after the summary is sent.
              </li>
              <li>
                <strong>Phone numbers:</strong> The mobile number you link to receive SMS messages.
              </li>
              <li>
                <strong>Payment information:</strong> Billing is handled entirely by Stripe. We never
                see or store your card number — only a Stripe customer ID and subscription ID.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Read your Gmail to detect new emails and generate SMS summaries.</li>
              <li>Deliver those summaries to your verified phone number via SMS.</li>
              <li>Allow you to reply to or compose emails by sending SMS commands.</li>
              <li>Process your monthly subscription payment.</li>
              <li>Send service-related notifications (e.g., verification codes).</li>
            </ul>
            <p className="mt-3">
              EmailOnText's use of information received from Google APIs adheres to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements. Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                We only use Google user data to provide and improve the user-facing
                email-to-SMS features described above.
              </li>
              <li>
                We do not transfer Google user data to others except as necessary to
                provide these features, to comply with applicable law, or as part of a
                merger or acquisition with your explicit consent.
              </li>
              <li>
                We do not use Google user data for serving advertisements, and we never
                sell it.
              </li>
              <li>
                We do not allow humans to read your Gmail data, except: with your
                affirmative consent for specific messages, where necessary for security
                purposes (such as investigating abuse), to comply with applicable law,
                or where the data has been aggregated and anonymized. Email content is
                processed transiently and automatically to produce SMS summaries.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Third-Party Services</h2>
            <p>We share data with the following third parties only as necessary to operate the service:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Google LLC</strong> — Gmail API access via OAuth 2.0.</li>
              <li>
                <strong>OpenAI, Inc.</strong> — Email content is sent to OpenAI to generate a
                plain-text summary. OpenAI processes this data under their own privacy policy.
              </li>
              <li>
                <strong>SignalWire, Inc.</strong> — Delivers SMS messages to your phone number.
              </li>
              <li>
                <strong>Stripe, Inc.</strong> — Processes subscription payments securely.
              </li>
            </ul>
            <p className="mt-3">We do not sell your data to any third party.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Data Retention</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Gmail refresh tokens are deleted immediately when you disconnect your Gmail account.</li>
              <li>Phone numbers are retained until you delete them from your account.</li>
              <li>Email summaries sent via SMS are not stored on our servers after delivery.</li>
              <li>Account data is retained until you request account deletion.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Security</h2>
            <p>
              Gmail refresh tokens are encrypted at rest using AES-256-GCM before being stored in
              our database. We use HTTPS for all data in transit. Access to production systems is
              restricted to authorised personnel.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Your Rights</h2>
            <p>You may at any time:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Disconnect your Gmail account, which revokes our access and deletes your stored token.</li>
              <li>Remove your phone number from your account.</li>
              <li>Cancel your subscription and request full account deletion.</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, use the controls in your dashboard or contact us at the
              address below.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Children's Privacy</h2>
            <p>
              EmailOnText is not directed at children under 13. We do not knowingly collect personal
              information from children.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">9. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. We will notify you of material changes
              via email or an in-app notice. Continued use of the service after the effective date
              constitutes acceptance of the updated policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">10. Contact</h2>
            <p>
              Questions or requests regarding this Privacy Policy should be sent to{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600 hover:underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
