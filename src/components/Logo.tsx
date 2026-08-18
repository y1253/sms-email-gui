import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * The EmailOnText mark: a chat bubble with an "@" inside — SMS carrying email.
 *
 * Same artwork as `public/favicon.svg`, but painted with theme tokens instead of
 * hardcoded hex so it inverts in dark mode (where `--primary` flips to near-white).
 * Keep the two in sync if the geometry ever changes.
 */
export default function Logo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" className={cn('size-7', className)} aria-hidden="true">
      <path
        className="fill-primary"
        d="M8 2H24A7 7 0 0 1 31 9V17A7 7 0 0 1 24 24H13L7.4 29.3Q7.8 26.3 8 24A7 7 0 0 1 1 17V9A7 7 0 0 1 8 2Z"
      />
      <g
        className="stroke-primary-foreground"
        fill="none"
        strokeWidth={2.4}
        strokeLinecap="round"
      >
        <circle cx="16" cy="13" r="2.7" />
        <path d="M18.9 10.1V13.7A2.16 2.16 0 0 0 23.22 13.7V13A7.2 7.2 0 1 0 20.4 18.72" />
      </g>
    </svg>
  );
}
