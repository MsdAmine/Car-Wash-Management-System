import { type InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Checkbox({
  label,
  error,
  disabled,
  className,
  ...props
}: CheckboxProps) {
  const inputClasses = [
    'w-4 h-4 rounded accent-indigo-600',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex flex-col gap-1">
      <label
        className={[
          'inline-flex items-center gap-2',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        ].join(' ')}
      >
        <input
          type="checkbox"
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        <span className="text-sm text-gray-700">{label}</span>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
