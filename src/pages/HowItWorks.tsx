import { Link } from 'react-router-dom';

/** A single SMS bubble. `from` = the service (left, gray), `you` = the user (right, blue). */
function Bubble({ side, children }: { side: 'from' | 'you'; children: React.ReactNode }) {
  const isYou = side === 'you';
  return (
    <div className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-mono leading-relaxed',
          'whitespace-pre-line break-words',
          isYou
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  );
}

/** A phone-like framed thread of bubbles. */
function Chat({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-3">{children}</div>
  );
}

/** A titled scene: heading + chat thread + caption. */
function Scene({
  title,
  caption,
  children,
}: {
  title: string;
  caption: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
      <Chat>{children}</Chat>
      <p className="text-sm text-gray-500 mt-3">{caption}</p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
        <Link to="/" className="text-xl font-bold text-blue-600">SMSMail</Link>
        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          ← Back to home
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">How it works</h1>
        <p className="text-gray-500 text-lg mb-10 max-w-2xl">
          SMSMail turns your inbox into text messages. When an email arrives, you get a short SMS
          summary — and you can reply or send new emails just by texting back. Here's exactly what
          that looks like.
        </p>

        <section className="space-y-12">
          <Scene
            title="1. You get an email as a text"
            caption={
              <>
                The whole alert fits in one text. <strong>📎+2</strong> shows how many attachments
                the email had (only appears when there are some), and <strong>Reply: R 42</strong>{' '}
                is the message number you use to reply to it.
              </>
            }
          >
            <Bubble side="from">
              {`To: you@gmail.com
From: Bob Smith bob@work.com

Invoice #204 is due Friday — reply to confirm receipt.

📎+2  |  Reply: R 42`}
            </Bubble>
          </Scene>

          <Scene
            title="2. Reply to the latest email"
            caption={
              <>
                Text <strong>R</strong> followed by your message to reply to the{' '}
                <strong>most recent</strong> email. You'll get a <code>Sent to …</code> confirmation
                back.
              </>
            }
          >
            <Bubble side="you">R On my way, thanks!</Bubble>
            <Bubble side="from">{'Sent to Bob Smith <bob@work.com>'}</Bubble>
          </Scene>

          <Scene
            title="3. Reply to a specific email by number"
            caption={
              <>
                Use the number from the alert (<code>Reply: R 42</code>). Just the plain number —{' '}
                <strong>no #</strong>.
              </>
            }
          >
            <Bubble side="you">R 42 Confirmed, received.</Bubble>
            <Bubble side="from">{'Sent to Bob Smith <bob@work.com>'}</Bubble>
          </Scene>

          <Scene
            title="4. Send a brand-new email"
            caption={
              <>
                Text <strong>S</strong>, the recipient's address, then your message. The email goes
                out with no subject line.
              </>
            }
          >
            <Bubble side="you">S alice@acme.com Running 10 min late</Bubble>
            <Bubble side="from">Sent to alice@acme.com</Bubble>
          </Scene>

          <Scene
            title="5. Send with your own subject"
            caption={
              <>
                Separate the recipient, subject, and body with <code>|</code> to set a custom
                subject line.
              </>
            }
          >
            <Bubble side="you">S alice@acme.com | Lunch | Pushing to 1pm</Bubble>
            <Bubble side="from">Sent to alice@acme.com</Bubble>
          </Scene>

          <Scene
            title="6. Choosing which inbox to send from"
            caption={
              <>
                Only happens if you have more than one Gmail connected. Reply with the number within
                5 minutes and your email goes out.
              </>
            }
          >
            <Bubble side="you">S alice@acme.com Hi there</Bubble>
            <Bubble side="from">
              {`Send from which email? Reply with the number:
1 you@gmail.com
2 work@company.com`}
            </Bubble>
            <Bubble side="you">2</Bubble>
            <Bubble side="from">Sent to alice@acme.com</Bubble>
          </Scene>

          <Scene
            title="7. Pausing and resuming alerts"
            caption={
              <>
                Text <strong>HELP</strong> any time for the command list, <strong>STOP</strong> to
                pause all messages, and <strong>START</strong> to turn them back on.
              </>
            }
          >
            <Bubble side="you">STOP</Bubble>
            <Bubble side="from">
              SMSMail: You're unsubscribed and will get no more messages. Reply START to resubscribe.
            </Bubble>
            <Bubble side="you">START</Bubble>
            <Bubble side="from">
              SMSMail: You're resubscribed to SMSMail alerts. Reply HELP for help, STOP to
              unsubscribe.
            </Bubble>
          </Scene>
        </section>

        {/* Command reference */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Command reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-3 pr-6 font-semibold">You text</th>
                  <th className="py-3 font-semibold">What happens</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {[
                  ['R your message', 'Reply to the most recent email'],
                  ['R 42 your message', 'Reply to email #42 (the number from the alert)'],
                  ['S email@x.com your message', 'New email (no subject)'],
                  ['S email@x.com | Subject | Body', 'New email with a custom subject'],
                  ['HELP', 'Get the command list'],
                  ['STOP', 'Stop all messages'],
                  ['START', 'Resume messages'],
                ].map(([cmd, desc]) => (
                  <tr key={cmd} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-6">
                      <code className="font-mono text-gray-900 whitespace-nowrap">{cmd}</code>
                    </td>
                    <td className="py-3">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-xl bg-gray-50 border border-gray-200 p-5 text-sm text-gray-600 leading-relaxed">
            <strong className="text-gray-900">Good to know:</strong> commands aren't
            case-sensitive, and the emails you reply to or send can be as long as you like — the
            160-character limit only applies to the summary we text you. If something goes wrong,
            you'll get a reply starting with <code className="font-mono">Error:</code> (for example,{' '}
            <code className="font-mono">Error: Message #42 not found</code>).
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 text-lg"
          >
            Get started
          </Link>
        </div>
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
