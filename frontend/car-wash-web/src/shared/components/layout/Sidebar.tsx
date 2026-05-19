import { type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';

interface SidebarNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarGroup {
  groupLabel?: string;
  items: SidebarNavItem[];
}

type SidebarItem = SidebarGroup;

interface SidebarProps {
  items: SidebarItem[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  bottomSlot?: ReactNode;
}

export function Sidebar({ items, isCollapsed, onToggleCollapse, bottomSlot }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-200 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top: logo + collapse toggle */}
      <div
        className={`flex items-center px-3 py-4 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!isCollapsed && (
          <span className="text-lg font-semibold text-indigo-600">WashFlow</span>
        )}
        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {items.map((group, groupIndex) => (
          <div key={groupIndex}>
            {group.groupLabel && !isCollapsed && (
              <p
                className={`text-xs font-medium text-gray-500 uppercase tracking-wide px-3 mb-1 ${
                  groupIndex === 0 ? 'mt-0' : 'mt-4'
                }`}
              >
                {group.groupLabel}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 px-3 py-2 mx-2 text-sm rounded-lg',
                      isCollapsed ? 'justify-center' : '',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                    ]
                      .filter(Boolean)
                      .join(' ')
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom slot */}
      {bottomSlot && (
        <div className={`pb-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {bottomSlot}
        </div>
      )}
    </aside>
  );
}
