import { Link } from 'react-router-dom';
import SiteFooter from '@/components/marketing/SiteFooter';
import { GUIDES, type Guide } from '@/seo/routes';

/** Prose helpers so the six articles stay visually consistent. */
export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">{children}</h2>;
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-2">{children}</h3>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-700 leading-relaxed mb-4">{children}</p>;
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">{children}</ul>;
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-lg px-5 py-4 my-6 text-gray-800">
      {children}
    </div>
  );
}

/**
 * FAQ block. The pairs come from the same GUIDES entry that generates the
 * FAQPage JSON-LD, so the markup can never describe questions the page doesn't
 * actually show — which Google treats as a structured-data violation.
 */
export function Faq({ pairs }: { pairs: Array<[string, string]> }) {
  return (
    <section>
      <H2>Frequently asked questions</H2>
      <dl className="space-y-6">
        {pairs.map(([q, a]) => (
          <div key={q}>
            <dt className="font-semibold text-gray-900 mb-1">{q}</dt>
            <dd className="text-gray-700 leading-relaxed">{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Formatted by hand rather than with toLocaleDateString: Intl output can differ
 * between Node and the browser (ICU build, default locale), and any difference
 * on a prerendered page is a hydration mismatch.
 */
const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
};

export default function GuideLayout({
  guide,
  children,
}: {
  guide: Guide;
  children: React.ReactNode;
}) {
  // Two siblings for onward linking, wrapping around the end of the list.
  const i = GUIDES.findIndex((g) => g.slug === guide.slug);
  const siblings = [GUIDES[(i + 1) % GUIDES.length], GUIDES[(i + 2) % GUIDES.length]].filter(
    (g) => g.slug !== guide.slug,
  );

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
        <Link to="/" className="text-xl font-bold text-blue-600">EmailOnText</Link>
        <div className="flex gap-3">
          <Link to="/guides" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
            Guides
          </Link>
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
          {' / '}
          <Link to="/guides" className="hover:underline">Guides</Link>
        </nav>

        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-3">{guide.title}</h1>
        <p className="text-lg text-gray-500 mb-2">{guide.description}</p>
        <p className="text-sm text-gray-400 mb-10">
          Published{' '}
          <time dateTime={guide.published}>{fmtDate(guide.published)}</time>
          {guide.updated !== guide.published && (
            <>
              {' · Updated '}
              <time dateTime={guide.updated}>{fmtDate(guide.updated)}</time>
            </>
          )}
        </p>

        <article>{children}</article>

        <section className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Get your email as text messages
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            EmailOnText forwards important Gmail to your phone as SMS and lets you reply by text —
            no internet, no data plan, no app to install.
          </p>
          <Link
            to="/register"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700"
          >
            Get started
          </Link>
        </section>

        {siblings.length > 0 && (
          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Keep reading
            </h2>
            <ul className="space-y-2">
              {siblings.map((g) => (
                <li key={g.slug}>
                  <Link to={`/guides/${g.slug}`} className="text-blue-600 hover:underline">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
