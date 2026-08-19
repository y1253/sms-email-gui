/**
 * Single source of truth for every prerendered URL.
 *
 * Consumed by `entry-server.tsx` (which re-exports it) and, through that
 * bundle, by `scripts/prerender.mjs` — which emits one static HTML file, one
 * <head>, and one sitemap entry per RouteMeta. Adding a guide means adding a
 * component plus one GUIDES entry; route, prerendered file, sitemap row and
 * JSON-LD all follow automatically.
 *
 * Nothing in the browser imports this, so it costs zero client bytes.
 */

export const SITE_URL = 'https://emailontext.com';
export const BRAND = 'EmailOnText';
export const SUPPORT_EMAIL = 'support@emailontext.com';

/**
 * Shown when the live /pricing call hasn't resolved — which is always the case
 * during prerender, since react-query only fetches from an effect. Keep in sync
 * with the backend PRICE env var: the JSON-LD Offer below must match the price
 * a visitor actually sees, or rich results get flagged.
 */
export const FALLBACK_PRICE = 8.99;

export type RouteMeta = {
  /** Starts with '/', never ends with one (except the root itself). */
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogType?: 'website' | 'article';
  /** Site-root-relative; defaults to /og.png. */
  image?: string;
  jsonLd?: object | object[];
  noindex?: boolean;
  /** YYYY-MM-DD, emitted as <lastmod>. */
  lastmod?: string;
  priority?: number;
};

const ORG_ID = `${SITE_URL}/#org`;

const org = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: BRAND,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: SUPPORT_EMAIL,
  },
};

const breadcrumb = (trail: Array<[string, string]>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, url], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: SITE_URL + url,
  })),
});

const faq = (pairs: Array<[string, string]>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: pairs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

/**
 * Every question here is also rendered as visible text on the page it belongs
 * to — Google treats FAQ markup that isn't on the page as a violation.
 */
export const HOME_FAQ: Array<[string, string]> = [
  [
    'What is an email to text service?',
    'An email to text service delivers email to a mobile phone as an SMS message. EmailOnText watches a Gmail account you connect and sends each important email to your phone as a text, so you can read and answer email without opening an inbox.',
  ],
  [
    'Do I need internet or a data plan?',
    'No. Messages arrive over SMS, which works on any cell signal — including 2G, roaming, and areas with no data coverage. There is no app to install and nothing to keep logged in.',
  ],
  [
    'Can I reply to an email from a text message?',
    'Yes. Text back R followed by your message to reply to the most recent email, or R 42 followed by your message to reply to a specific one. You can also start a new email with S recipient@example.com followed by your message.',
  ],
  [
    'Does it work with a flip phone or a basic phone?',
    'Yes. Anything that can send and receive SMS works, because the whole product is text messages. No smartphone, browser, or app is required.',
  ],
  [
    'Will I get a text for every single email?',
    'No. Only email Gmail classifies as Primary or Important is forwarded, so newsletters and promotions stay out of your phone.',
  ],
  [
    'How does a long email fit in a text message?',
    'Each email is summarized to fit one 160-character SMS, with the sender and subject line kept intact so you can tell at a glance whether it needs an answer.',
  ],
  [
    'Why did my carrier email to text gateway stop working?',
    'Verizon, T-Mobile, and AT&T shut down their free email-to-SMS gateways between late 2024 and June 2025, because the gateways had no sender authentication and were being abused to send phishing texts. Addresses like number@vtext.com and number@tmomail.net no longer deliver.',
  ],
  [
    'How much does it cost?',
    `$${FALLBACK_PRICE} per month for one set — one Gmail account paired with one phone number. Unlimited forwarding, replies, and summaries are included.`,
  ],
];

export type Guide = {
  slug: string;
  /** <h1> and <title> stem. */
  title: string;
  /** Short label used in the footer link block. */
  linkText: string;
  description: string;
  published: string;
  updated: string;
  faq?: Array<[string, string]>;
};

export const GUIDES: Guide[] = [
  {
    slug: 'carrier-email-to-text-shutdown',
    title: 'Carrier Email to Text Is Dead: What Replaced vtext.com and tmomail.net',
    linkText: 'Why carrier email to text stopped working',
    description:
      'Verizon, T-Mobile, and AT&T shut off their free email-to-SMS gateways between 2024 and 2025. Here is why they did it, what broke, and what actually works now.',
    published: '2026-08-18',
    updated: '2026-08-18',
    faq: [
      [
        'Is vtext.com still working?',
        'No. Verizon discontinued the vtext.com email-to-SMS gateway in late 2024, and it was fully retired alongside the AT&T gateway in June 2025. Mail sent to number@vtext.com is no longer delivered as a text.',
      ],
      [
        'Is tmomail.net still working?',
        'No. The T-Mobile tmomail.net gateway became unreliable in November 2024 and stopped delivering entirely in December 2024.',
      ],
      [
        'Why did carriers shut down email to text?',
        'The gateways accepted mail from anyone with no sender authentication, no rate limiting, and no business verification, which made them an ideal relay for phishing texts with spoofed sender names.',
      ],
    ],
  },
  {
    slug: 'forward-gmail-to-text-message',
    title: 'How to Forward Gmail to a Text Message Automatically',
    linkText: 'Forward Gmail to a text message automatically',
    description:
      'Two ways to get Gmail delivered to your phone as SMS: the manual filter-and-forward method, and an automatic email to text service. What each one can and cannot do.',
    published: '2026-08-18',
    updated: '2026-08-18',
    faq: [
      [
        'Can Gmail send a text message directly?',
        'Not on its own. Gmail can only forward to an email address, so turning that into a text requires a gateway address or an email to text service that owns real SMS infrastructure.',
      ],
      [
        'Can I reply to a forwarded email from my phone?',
        'Not with Gmail forwarding. A forwarded message arrives from the gateway, so replying to the text does not reach the original sender. A two-way email to text service handles the reply routing for you.',
      ],
    ],
  },
  {
    slug: 'read-email-without-internet',
    title: 'How to Read and Answer Email Without Internet',
    linkText: 'Read and answer email without internet',
    description:
      'No Wi-Fi, no data plan, no signal for the mail app — but SMS still gets through. How to receive and reply to email using nothing but text messages.',
    published: '2026-08-18',
    updated: '2026-08-18',
    faq: [
      [
        'Can you get email without a data plan?',
        'Yes. SMS runs on the cellular control channel rather than a data connection, so a service that converts email into text messages delivers to any phone with a signal, including phones with no data plan at all.',
      ],
      [
        'Does this work on a flip phone?',
        'Yes. If the phone can send and receive SMS, it can receive email and send replies through an email to text service. No app, browser, or smartphone required.',
      ],
    ],
  },
  {
    slug: 'carrier-email-to-sms-gateway-list',
    title: 'Carrier Email to SMS Gateway List (2026): Which Ones Still Work',
    linkText: 'Carrier email to SMS gateway list (2026)',
    description:
      'The full list of US carrier email-to-SMS gateway addresses, marked with which ones are retired and which still deliver as of 2026, plus what to use instead.',
    published: '2026-08-18',
    updated: '2026-08-18',
  },
  {
    slug: 'email-alerts-by-text',
    title: 'Get Email Alerts as Text Messages: On-Call, Field, and Shift Work',
    linkText: 'Email alerts as text messages for on-call teams',
    description:
      'Monitoring alerts, dispatch, and customer email land in an inbox nobody is watching at 3am. How to route the email that matters to a phone as SMS.',
    published: '2026-08-18',
    updated: '2026-08-18',
  },
  {
    slug: 'email-to-text-vs-push-notifications',
    title: 'Email to Text vs Push Notifications: Which One Actually Reaches You',
    linkText: 'Email to text vs push notifications',
    description:
      'Push notifications need a data connection, a charged smartphone, and an app you have not muted. SMS needs a signal. An honest comparison of when each one wins.',
    published: '2026-08-18',
    updated: '2026-08-18',
  },
];

const homeJsonLd = [
  { '@context': 'https://schema.org', ...org },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND,
    publisher: { '@id': ORG_ID },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: BRAND,
    description:
      'Email to text service that forwards Gmail to your phone as SMS and lets you reply by text, with no internet connection required.',
    applicationCategory: 'CommunicationApplication',
    operatingSystem: 'Any (SMS)',
    url: SITE_URL,
    offers: {
      '@type': 'Offer',
      price: String(FALLBACK_PRICE),
      priceCurrency: 'USD',
      url: SITE_URL,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Email to text service',
    serviceType: 'Email to SMS forwarding',
    provider: { '@id': ORG_ID },
    areaServed: 'US',
  },
  faq(HOME_FAQ),
];

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    title: 'Email to Text Service — Get Your Gmail as SMS | EmailOnText',
    description:
      'EmailOnText is an email to text service that sends your Gmail to your phone as SMS and lets you reply by text. No internet, no data plan, no app. $8.99/month.',
    ogTitle: 'Email to Text Service — Get Your Gmail as SMS',
    priority: 1.0,
    jsonLd: homeJsonLd,
  },
  {
    path: '/how-it-works',
    title: 'How It Works — Email to Text in Three Steps | EmailOnText',
    description:
      'Connect Gmail, verify your phone, and start getting email as text messages. See the exact SMS commands for replying to and sending email from your phone.',
    priority: 0.9,
  },
  {
    path: '/guides',
    title: 'Email to Text Guides — Gmail, SMS, and Carrier Gateways',
    description:
      'Practical guides to getting email on your phone as text messages: carrier gateway shutdowns, Gmail forwarding, reading email with no internet, and more.',
    priority: 0.7,
  },
  {
    path: '/contact',
    title: 'Contact EmailOnText — Support for Email to Text',
    description:
      'Get help with your EmailOnText account, billing, phone verification, or Gmail connection. Reach support directly at support@emailontext.com.',
    priority: 0.4,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | EmailOnText',
    description:
      'How EmailOnText collects, uses, stores, and protects your Gmail data and phone number, including our Google API Limited Use disclosure and data retention.',
    priority: 0.3,
  },
  {
    path: '/terms',
    title: 'Terms of Service | EmailOnText',
    description:
      'The terms governing your use of EmailOnText, including the SMS messaging program, subscription billing, acceptable use, and Gmail data handling.',
    priority: 0.3,
  },
  ...GUIDES.map(
    (g): RouteMeta => ({
      path: `/guides/${g.slug}`,
      title: `${g.title} | ${BRAND}`,
      description: g.description,
      ogTitle: g.title,
      ogType: 'article',
      lastmod: g.updated,
      priority: 0.7,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: g.title,
          description: g.description,
          datePublished: g.published,
          dateModified: g.updated,
          author: { '@id': ORG_ID },
          publisher: { '@id': ORG_ID },
          mainEntityOfPage: `${SITE_URL}/guides/${g.slug}`,
          image: `${SITE_URL}/og.png`,
        },
        breadcrumb([
          ['Home', '/'],
          ['Guides', '/guides'],
          [g.title, `/guides/${g.slug}`],
        ]),
        ...(g.faq ? [faq(g.faq)] : []),
      ],
    }),
  ),
];

/**
 * The neutral shell nginx falls back to for every client-only route
 * (/login, /dashboard, /admin, and any unknown URL). Noindex by construction,
 * so app routes can never be indexed even though they return 200.
 */
export const APP_SHELL_META: RouteMeta = {
  path: '/app',
  title: BRAND,
  description: '',
  noindex: true,
};
