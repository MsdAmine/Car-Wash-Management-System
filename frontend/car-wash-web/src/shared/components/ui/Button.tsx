import { Loader2 } from 'lucide-react';
import { type ButtonHTMLAttributes } from 'react';

const variants = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500',
  secondary:
    'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus-visible:ring-gray-300',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-300',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
} as const;

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    variants[variant],
    sizes[size],
    isDisabled ? 'opacity-50 cursor-not-allowed' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button disabled={isDisabled} className={classes} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
