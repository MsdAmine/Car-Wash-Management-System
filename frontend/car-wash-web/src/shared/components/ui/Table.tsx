import { type ReactNode } from 'react';

interface BaseProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: BaseProps) {
  return (
    <div className={['w-full overflow-x-auto', className].filter(Boolean).join(' ')}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children, className }: BaseProps) {
  return <thead className={className}>{children}</thead>;
}

export function TableHeader({ children, className }: BaseProps) {
  return (
    <th
      className={[
        'bg-white px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </th>
  );
}

export function TableBody({ children, className }: BaseProps) {
  return <tbody className={className}>{children}</tbody>;
}

interface TableRowProps extends BaseProps {
  selected?: boolean;
  onClick?: () => void;
}

export function TableRow({ children, className, selected = false, onClick }: TableRowProps) {
  return (
    <tr
      className={[
        selected ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50',
        onClick !== undefined ? 'cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      tabIndex={onClick !== undefined ? 0 : undefined}
      onKeyDown={
        onClick !== undefined
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick();
            }
          : undefined
      }
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className }: BaseProps) {
  return (
    <td
      className={[
        'whitespace-nowrap px-4 py-3 text-sm text-gray-700',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </td>
  );
}
