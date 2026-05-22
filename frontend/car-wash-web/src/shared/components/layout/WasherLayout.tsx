import { type ReactNode } from 'react';
import { Bell, Briefcase, Clock, User } from 'lucide-react';
import { BottomNav } from '@/shared/components/layout/BottomNav';
import { ROUTES } from '@/router/routes';

const WASHER_NAV = [
  { label: 'Jobs',    path: ROUTES.WASHER.HOME,    icon: Briefcase },
  { label: 'History', path: ROUTES.WASHER.HISTORY, icon: Clock },
  { label: 'Alerts',  path: ROUTES.WASHER.ALERTS,  icon: Bell },
  { label: 'Profile', path: ROUTES.WASHER.PROFILE,  icon: User },
];

interface WasherLayoutProps {
  children: ReactNode;
}

export function WasherLayout({ children }: WasherLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-sm mx-auto pb-20">
        {children}
      </div>
      <BottomNav items={WASHER_NAV} />
    </div>
  );
}
