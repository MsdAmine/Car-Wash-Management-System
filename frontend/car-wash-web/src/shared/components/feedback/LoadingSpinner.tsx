import { Loader2 } from 'lucide-react';

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
} as const;

interface LoadingSpinnerProps {
  size?: keyof typeof sizeClasses;
  label?: string;
}

export function LoadingSpinner({ size = 'md', label = 'Loading…' }: LoadingSpinnerProps) {
  return (
    <div className="flex w-full items-center justify-center" aria-label={label}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600`} />
    </div>
  );
}
