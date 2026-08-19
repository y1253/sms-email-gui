import { Link } from 'react-router-dom';
import SiteFooter from '@/components/marketing/SiteFooter';
import { GUIDES } from '@/seo/routes';

/**
 * Replaces the old `<Navigate to="/" />` catch-all, which made every unknown
 * URL return the homepage at HTTP 200 — a soft-404 pattern.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto w-full">
        <Link to="/" className="text-xl font-bold text-blue-600">EmailOnText</Link>
        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          ← Back to home
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-24 text-center flex-1">
        <p className="text-sm font-semibold text-blue-600 mb-3">404</p>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">This page doesn’t exist</h1>
        <p className="text-lg text-gray-500 mb-10">
          The link may be out of date. Here’s where most people are headed:
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link to="/" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700">
            Email to text service
          </Link>
          <Link to="/how-it-works" className="bg-gray-100 text-gray-800 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200">
            How it works
          </Link>
          <Link to="/contact" className="bg-gray-100 text-gray-800 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200">
            Contact support
          </Link>
        </div>

        <div className="text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Guides</h2>
          <ul className="space-y-2">
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <Link to={`/guides/${g.slug}`} className="text-blue-600 hover:underline">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
