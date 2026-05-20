import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <AlertCircle className="w-10 h-10 text-red-400" />
      <p className="text-base font-semibold text-gray-900">Something went wrong</p>
      <p className="text-sm text-gray-500">{message}</p>
      {onRetry !== undefined && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
