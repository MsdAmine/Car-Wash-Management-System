import { type ReactNode } from 'react';
import { CalendarDays, Car, Home, UserRound } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '@/router/routes';

interface ClientLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Home', path: ROUTES.CLIENT.HOME, icon: Home },
  { label: 'Bookings', path: ROUTES.CLIENT.BOOKINGS, icon: CalendarDays },
  { label: 'Vehicles', path: ROUTES.CLIENT.VEHICLES, icon: Car },
  { label: 'Profile', path: ROUTES.CLIENT.PROFILE, icon: UserRound },
];

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">
      <nav className="bg-white border-b border-gray-200 px-6">
        <div className="h-14 max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link
            to={ROUTES.CLIENT.HOME}
            className="text-lg font-semibold text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            WashFlow
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === ROUTES.CLIENT.HOME}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          <Link
            to={ROUTES.CLIENT.PROFILE}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full"
          >
            <img src="/images/avatar-customer.png" alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
          </Link>
        </div>
      </nav>
      {children}

      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)] sm:hidden">
        <div className="grid grid-cols-4">
          {navItems.map(item => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === ROUTES.CLIENT.HOME}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium ${
                    isActive ? 'text-indigo-600' : 'text-gray-500'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
