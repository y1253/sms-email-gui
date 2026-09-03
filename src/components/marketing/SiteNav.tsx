import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * Shared marketing nav, the companion to SiteFooter. The bar was copy-pasted
 * across the public pages in three slightly different variants; Landing and
 * WhatIsEmailToText share this one. The remaining pages still carry their own
 * and can be migrated onto it separately.
 */
const LINKS = [
  { to: '/how-it-works', label: 'How it works', compact: false },
  { to: '/guides', label: 'Guides', compact: false },
  { to: '/login', label: 'Log in', compact: true },
];

export default function SiteNav() {
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between border-b border-border px-6 py-4">
      <Link to="/" className="text-xl font-bold tracking-tight text-primary">
        EmailOnText
      </Link>
      <div className="flex items-center gap-1">
        {LINKS.map((l) => (
          <Button
            key={l.to}
            variant="ghost"
            className={`h-9 px-3 text-muted-foreground ${l.compact ? '' : 'hidden sm:inline-flex'}`}
            render={<Link to={l.to} />}
          >
            {l.label}
          </Button>
        ))}
        <Button className="ml-1 h-9 px-4" render={<Link to="/register" />}>
          Get started
        </Button>
      </div>
    </nav>
  );
}
