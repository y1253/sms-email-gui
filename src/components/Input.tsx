import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, id, className = '', type, ...rest }: Props) {
  const [visible, setVisible] = useState(false);

  // Every password field in the app goes through here, so the show/hide toggle
  // lives in the component rather than being repeated per page.
  const isPassword = type === 'password';
  const inputType = isPassword && visible ? 'text' : type;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {/* Wraps the input alone: the outer div also holds the label and the
          error line, so an absolute button anchored there would sit wrong. */}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          {...rest}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${isPassword ? 'pr-10' : ''} ${error ? 'border-red-400' : 'border-gray-300'} ${className}`}
        />
        {isPassword && (
          <button
            // type="button" — a bare button inside a <form> submits it.
            type="button"
            onClick={() => setVisible((v) => !v)}
            // Skipped by Tab so keyboard users move field to field.
            tabIndex={-1}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition-colors hover:text-gray-600"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
