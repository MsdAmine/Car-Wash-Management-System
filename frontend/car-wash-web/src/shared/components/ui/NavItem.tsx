interface NavItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export function NavItem({ label, isActive, onClick, variant = 'default' }: NavItemProps) {
  const base = 'text-sm px-3 py-2 rounded-lg cursor-pointer w-full text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';

  const variantClass =
    variant === 'danger'
      ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
      : isActive
        ? 'bg-indigo-50 text-indigo-700 font-medium'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';

  return (
    <button type="button" onClick={onClick} className={`${base} ${variantClass}`}>
      {label}
    </button>
  );
}
