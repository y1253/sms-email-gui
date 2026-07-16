import { cn } from '@/lib/utils';

/**
 * Checkmark that draws itself: the ring sweeps in, then the tick strokes on.
 * Size comes from the caller — size-16 for a full-page moment, size-8 inline.
 * Keyframes and the stroke-dasharray lengths live in index.css.
 */
export function SuccessCheck({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 52 52"
      className={cn('size-16 animate-success-pop', className)}
      aria-hidden
    >
      <circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        strokeWidth="2"
        className="stroke-success/30 animate-success-ring"
        style={{ strokeDasharray: 151 }}
      />
      <path
        d="M14 27l8 8 16-16"
        fill="none"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-success animate-success-check"
        style={{ strokeDasharray: 36 }}
      />
    </svg>
  );
}
