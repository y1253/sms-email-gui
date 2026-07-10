import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
        <Link to="/" className="text-xl font-bold text-blue-600">SMSMail</Link>
        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          ← Back to home
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-10">Effective date: June 15, 2025</p>

        <section className="space-y-8 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using SMSMail ("Service"), you agree to be bound by these Terms of
              Service ("Terms"). If you do not agree, do not use the Service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Service Description</h2>
            <p>
              SMSMail forwards incoming Gmail messages to a linked mobile phone number as SMS
              summaries. Users can reply to or compose emails via SMS commands. Each pairing of one
              Gmail account and one phone number is called a "set".
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. SMS Messaging Program</h2>
            <p>
              SMSMail operates an SMS program that delivers your email summaries and
              account notifications to a mobile number you provide.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>How you opt in:</strong> You enter your mobile number in your
                dashboard, check the SMS consent box, and confirm a one-time verification
                code we text to that number. No one else can enroll a number on your behalf.
              </li>
              <li>
                <strong>Message types:</strong> AI-generated summaries of your incoming
                emails, replies you request via SMS, and account/service notifications
                (such as verification codes and billing alerts).
              </li>
              <li>
                <strong>Message frequency:</strong> Message frequency varies and depends on
                how many emails you receive.
              </li>
              <li>
                <strong>Cost:</strong> SMSMail does not charge for SMS, but{' '}
                <strong>message &amp; data rates may apply</strong> from your carrier.
              </li>
              <li>
                <strong>Opt out:</strong> Reply <strong>STOP</strong> to any message to
                unsubscribe and stop all messages. Reply <strong>START</strong> to
                resubscribe.
              </li>
              <li>
                <strong>Help:</strong> Reply <strong>HELP</strong> for assistance, or email
                us at{' '}
                <a href="mailto:yechiel1253@gmail.com" className="text-blue-600 hover:underline">
                  yechiel1253@gmail.com
                </a>
                .
              </li>
              <li>
                Carriers are not liable for delayed or undelivered messages. See our{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                {' '}for how we handle your phone number and data.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Account &amp; Eligibility</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must be at least 13 years old to use the Service.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to provide accurate registration information and keep it up to date.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Billing</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Each set costs <strong>$10 USD per month</strong>, billed via Stripe.</li>
              <li>Subscriptions renew automatically at the end of each billing period.</li>
              <li>You may cancel at any time from your dashboard. Cancellation takes effect at the end of the current billing period; no partial refunds are issued.</li>
              <li>We reserve the right to change pricing with 30 days' notice.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Send spam, unsolicited messages, or harass others.</li>
              <li>Violate any applicable law or regulation.</li>
              <li>Attempt to reverse-engineer, scrape, or abuse the Service infrastructure.</li>
              <li>Share access credentials or resell the Service without authorisation.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Gmail Data &amp; Limited Use</h2>
            <p>
              SMSMail accesses your Gmail data solely to detect new emails and generate SMS
              summaries for delivery to your registered phone number. Your Gmail data is not used for
              advertising, is not sold, and is not shared with any third party beyond what is
              necessary to operate the Service (see our{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              ). This use complies with the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google API Services User Data Policy
              </a>
              , including Limited Use requirements.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Termination</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You may terminate your account at any time by cancelling your subscription and contacting us.</li>
              <li>We may suspend or terminate your access for violation of these Terms, non-payment, or abuse of the Service, with or without notice.</li>
              <li>Upon termination, your Gmail refresh token is deleted and SMS forwarding ceases immediately.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">9. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DO NOT GUARANTEE
              UNINTERRUPTED OR ERROR-FREE OPERATION. USE OF THE SERVICE IS AT YOUR OWN RISK.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SMSMAIL SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO
              USE THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL
              LIABILITY SHALL NOT EXCEED THE AMOUNTS PAID BY YOU IN THE TWELVE MONTHS PRIOR TO THE
              CLAIM.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">11. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. We will notify you of material changes via
              email or an in-app notice. Continued use of the Service after the effective date of
              the revised Terms constitutes acceptance.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">12. Contact</h2>
            <p>
              Questions about these Terms should be sent to{' '}
              <a href="mailto:yechiel1253@gmail.com" className="text-blue-600 hover:underline">
                yechiel1253@gmail.com
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400 mt-16">
        © {new Date().getFullYear()} SMSMail. All rights reserved.{' '}
        <Link to="/how-it-works" className="text-blue-600 hover:underline">How it works</Link>
        {' · '}
        <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
        {' · '}
        <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
      </footer>
    </div>
  );
}
