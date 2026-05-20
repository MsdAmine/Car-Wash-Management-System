import { NavLink } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';

interface BottomNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  items: BottomNavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 min-h-[56px] pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex-1"
            >
              {({ isActive }) => (
                <div
                  className={`flex flex-col items-center justify-center py-2 gap-1 text-xs ${
                    isActive ? 'text-indigo-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  <span className={isActive ? 'bg-indigo-600 rounded-full p-1.5' : ''}>
                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  </span>
                  <span>{item.label}</span>
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
