import { ChevronDown } from 'lucide-react';
import { type SelectHTMLAttributes, useId } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Select({
  label,
  error,
  required,
  hint,
  children,
  className,
  ...props
}: SelectProps) {
  const id = useId();

  const selectClasses = [
    'w-full border rounded-lg px-3 py-2 pr-9 text-sm text-gray-900 bg-white appearance-none',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error ? 'border-red-500' : 'border-gray-200',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select id={id} required={required} className={selectClasses} {...props}>
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!error && hint && <p className="text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
