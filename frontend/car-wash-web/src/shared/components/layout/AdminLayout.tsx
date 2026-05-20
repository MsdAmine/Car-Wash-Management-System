import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  ClipboardList,
  Sparkles,
  Users,
  UserCircle,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { ROUTES } from '@/router/routes';

interface SidebarNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarItem {
  groupLabel?: string;
  items: SidebarNavItem[];
}

const ADMIN_NAV: SidebarItem[] = [
  {
    groupLabel: 'Operations',
    items: [
      { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
      { label: 'Bookings', path: ROUTES.ADMIN.BOOKINGS, icon: CalendarCheck },
      { label: 'Assign Jobs', path: '/admin/assign', icon: ClipboardList },
    ],
  },
  {
    groupLabel: 'Management',
    items: [
      { label: 'Services', path: ROUTES.ADMIN.SERVICES, icon: Sparkles },
      { label: 'Staff', path: ROUTES.ADMIN.STAFF, icon: Users },
      { label: 'Clients', path: ROUTES.ADMIN.CLIENTS, icon: UserCircle },
      { label: 'Analytics', path: ROUTES.ADMIN.ANALYTICS, icon: BarChart3 },
    ],
  },
  {
    items: [
      { label: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
];

interface AdminLayoutProps {
  topBar: ReactNode;
  children: ReactNode;
}

export function AdminLayout({ topBar, children }: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const bottomSlot = (
    <div className={`flex items-center gap-3 px-3 py-2 ${isCollapsed ? 'justify-center' : ''}`}>
      <ImagePlaceholder label="Admin avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
      {!isCollapsed && (
        <div>
          <p className="text-sm font-medium text-gray-900">Admin User</p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        items={ADMIN_NAV}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((c) => !c)}
        bottomSlot={bottomSlot}
      />

      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-200 ${
          isCollapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between flex-shrink-0 px-6">
          {topBar}
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
