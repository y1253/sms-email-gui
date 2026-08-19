import { Link } from 'react-router-dom';
import { GUIDES } from '@/seo/routes';

/**
 * Shared marketing footer. Was copy-pasted across all five marketing pages;
 * the guide pages need it too, and it now carries the guide link block so every
 * article is one hop from the homepage.
 *
 * `mt` exists because Landing sits flush against the pricing section while the
 * other pages want breathing room above.
 */
export default function SiteFooter({ mt = true }: { mt?: boolean }) {
  return (
    <footer className={`border-t border-gray-100 py-10 text-sm text-gray-400 ${mt ? 'mt-16' : ''}`}>
      <div className="max-w-5xl mx-auto px-6">
        <nav aria-label="Guides" className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Email to text guides
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <Link to={`/guides/${g.slug}`} className="text-gray-600 hover:text-blue-600 hover:underline">
                  {g.linkText}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-center">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> EmailOnText. All rights reserved.{' '}
          <Link to="/" className="text-blue-600 hover:underline">Email to text service</Link>
          {' · '}
          <Link to="/how-it-works" className="text-blue-600 hover:underline">How it works</Link>
          {' · '}
          <Link to="/guides" className="text-blue-600 hover:underline">Guides</Link>
          {' · '}
          <Link to="/contact" className="text-blue-600 hover:underline">Contact</Link>
          {' · '}
          <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          {' · '}
          <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
