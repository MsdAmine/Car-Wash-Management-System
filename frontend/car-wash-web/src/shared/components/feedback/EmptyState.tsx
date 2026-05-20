import { Button } from '../ui/Button';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  action?: EmptyStateAction;
}

export function EmptyState({ title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-12">
      <div className="flex flex-col items-center">
        <div className="h-4 w-48 rounded-lg bg-gray-100" />
        <div className="mt-2 h-3 w-32 rounded-lg bg-gray-100" />
      </div>
      <p className="mt-4 text-base font-semibold text-gray-900">{title}</p>
      {subtitle !== undefined && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
      {action !== undefined && (
        <Button variant="primary" size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
