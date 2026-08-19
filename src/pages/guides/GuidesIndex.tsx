import { Link } from 'react-router-dom';
import SiteFooter from '@/components/marketing/SiteFooter';
import { GUIDES } from '@/seo/routes';

export default function GuidesIndex() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
        <Link to="/" className="text-xl font-bold text-blue-600">EmailOnText</Link>
        <div className="flex gap-3">
          <Link to="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
            How it works
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Get started
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:underline">Home</Link>
          {' / Guides'}
        </nav>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Email to text guides</h1>
        <p className="text-lg text-gray-500 mb-12">
          Getting email onto a phone as SMS used to be a solved problem — you emailed
          <code className="mx-1 px-1.5 py-0.5 bg-gray-100 rounded text-sm">number@vtext.com</code>
          and it arrived. The carriers switched that off. These guides cover what changed, what
          still works, and how to set up an{' '}
          <Link to="/" className="text-blue-600 hover:underline">email to text service</Link>{' '}
          that does the job properly.
        </p>

        <ul className="space-y-8">
          {GUIDES.map((g) => (
            <li key={g.slug} className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                <Link to={`/guides/${g.slug}`} className="hover:text-blue-600">
                  {g.title}
                </Link>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">{g.description}</p>
              <Link to={`/guides/${g.slug}`} className="text-blue-600 font-medium hover:underline">
                Read the guide →
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </div>
  );
}
