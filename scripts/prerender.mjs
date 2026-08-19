/**
 * Post-build prerender.
 *
 * Turns the client-only SPA into real static HTML: for every route in
 * src/seo/routes.ts it renders the React tree to markup, injects a per-route
 * <head>, and writes dist/<path>.html. Also emits the noindex SPA shell
 * (dist/app.html) and dist/sitemap.xml.
 *
 * Runs after `vite build` and `vite build --ssr`. Plain .mjs, outside src/, so
 * the app's tsc pass ignores it (tsconfig excludes @types/node on purpose).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

// pathToFileURL is required: a bare Windows path in dynamic import() throws
// ERR_UNSUPPORTED_ESM_URL_SCHEME. Developed on Windows, built on Linux.
const { render, ROUTES, SITE_URL, APP_SHELL_META } = await import(
  pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href
);

// Read the template BEFORE the loop overwrites dist/index.html with the
// prerendered landing page.
const template = await readFile(path.join(dist, 'index.html'), 'utf8');

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Escaping `<` as \u003c keeps a literal `</script>` inside any content string
// from terminating the block early. Still valid JSON.
const ld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

const absUrl = (routePath) => SITE_URL + (routePath === '/' ? '/' : routePath);

function headTags(meta) {
  const url = absUrl(meta.path);
  const img = SITE_URL + (meta.image ?? '/og.png');
  const title = esc(meta.title);
  const desc = esc(meta.description);
  const ogTitle = esc(meta.ogTitle ?? meta.title);

  const tags = [`<title>${title}</title>`, `<meta name="description" content="${desc}" />`];

  if (meta.noindex) {
    tags.push('<meta name="robots" content="noindex, nofollow" />');
  } else {
    tags.push(
      `<link rel="canonical" href="${url}" />`,
      '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />',
      '<meta property="og:site_name" content="EmailOnText" />',
      `<meta property="og:type" content="${meta.ogType ?? 'website'}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:title" content="${ogTitle}" />`,
      `<meta property="og:description" content="${desc}" />`,
      `<meta property="og:image" content="${img}" />`,
      '<meta name="twitter:card" content="summary_large_image" />',
      `<meta name="twitter:title" content="${ogTitle}" />`,
      `<meta name="twitter:description" content="${desc}" />`,
      `<meta name="twitter:image" content="${img}" />`,
    );
  }

  if (meta.jsonLd) tags.push(...[].concat(meta.jsonLd).map(ld));

  return tags.join('\n    ');
}

function buildPage(meta, appHtml) {
  const withoutPlaceholderTitle = template.replace(/<title>[\s\S]*?<\/title>\s*/, '');
  if (!withoutPlaceholderTitle.includes('<!--app-head-->')) {
    throw new Error('index.html is missing the <!--app-head--> marker');
  }
  if (!withoutPlaceholderTitle.includes('<!--app-html-->')) {
    throw new Error('index.html is missing the <!--app-html--> marker');
  }
  return withoutPlaceholderTitle
    .replace('<!--app-head-->', headTags(meta))
    .replace('<!--app-html-->', appHtml);
}

// Sequential on purpose. Promise.all here is the one reliable way to blow
// memory on the RAM-constrained production box.
for (const meta of ROUTES) {
  const html = buildPage(meta, render(meta.path));
  // Flat `<path>.html`, not `<path>/index.html`. nginx resolves a directory
  // via try_files `$uri/`, and that issues an EXTERNAL 301 adding a trailing
  // slash — so /how-it-works would redirect to /how-it-works/ while the
  // canonical tag and sitemap both point at the no-slash form. Serving
  // `$uri.html` returns 200 on the canonical URL with no redirect hop.
  const out = meta.path === '/' ? path.join(dist, 'index.html') : path.join(dist, `${meta.path}.html`);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, html, 'utf8');
  console.log('prerendered', meta.path);
}

// Neutral noindex shell. nginx serves this for /login, /dashboard, /admin and
// every unknown URL, so app routes return 200 but can never be indexed.
await writeFile(path.join(dist, 'app.html'), buildPage(APP_SHELL_META, ''), 'utf8');
console.log('prerendered app.html (SPA fallback shell)');

const urls = ROUTES.filter((m) => !m.noindex)
  .map((m) => {
    const parts = [`<loc>${absUrl(m.path)}</loc>`];
    if (m.lastmod) parts.push(`<lastmod>${m.lastmod}</lastmod>`);
    parts.push(`<priority>${(m.priority ?? 0.7).toFixed(1)}</priority>`);
    return `  <url>${parts.join('')}</url>`;
  })
  .join('\n');

await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  'utf8',
);
console.log(`wrote sitemap.xml (${ROUTES.filter((m) => !m.noindex).length} urls)`);
