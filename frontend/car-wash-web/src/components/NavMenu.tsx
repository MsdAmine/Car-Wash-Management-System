import { NavLink } from 'react-router-dom';
import { ROUTES } from '../routes';
import type { UserRole } from '../types/auth';

interface NavItem {
    label: string;
    to: string;
    disabled?: boolean;
}

const ADMIN_NAV: NavItem[] = [
    { label: 'Overview', to: ROUTES.ADMIN_DASHBOARD },
    { label: 'Bookings', to: ROUTES.ADMIN_BOOKINGS },
    { label: 'Services', to: ROUTES.ADMIN_SERVICES },
    { label: 'Payments', to: ROUTES.ADMIN_PAYMENTS },
    { label: 'Employees', to: ROUTES.ADMIN_EMPLOYEES },
    { label: 'Settings', to: ROUTES.ADMIN_SETTINGS },
];

const CUSTOMER_NAV: NavItem[] = [
    { label: 'Dashboard', to: ROUTES.CUSTOMER_DASHBOARD },
    { label: 'Book a Wash', to: ROUTES.BOOK_APPOINTMENT },
    { label: 'My Bookings', to: ROUTES.MY_BOOKINGS },
    { label: 'My Vehicles', to: ROUTES.MY_VEHICLES },
    { label: 'Services', to: ROUTES.SERVICES },
    { label: 'Payments', to: '#', disabled: true },
];

const EMPLOYEE_NAV: NavItem[] = [
    { label: "Today's Work", to: ROUTES.EMPLOYEE_DASHBOARD },
    { label: 'Daily Bookings', to: ROUTES.EMPLOYEE_DAILY_BOOKINGS },
    { label: 'Assigned Bookings', to: ROUTES.EMPLOYEE_ASSIGNED_BOOKINGS },
];

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
    ADMIN: ADMIN_NAV,
    CUSTOMER: CUSTOMER_NAV,
    EMPLOYEE: EMPLOYEE_NAV,
};

interface NavMenuProps {
    role: UserRole;
    orientation?: 'horizontal' | 'vertical';
    onNavigate?: () => void;
}

export default function NavMenu({ role, orientation = 'horizontal', onNavigate }: NavMenuProps) {
    const items = NAV_BY_ROLE[role];

    const containerClass = orientation === 'vertical'
        ? 'flex flex-col gap-1'
        : 'flex items-center gap-1';

    const linkBase = orientation === 'vertical'
        ? 'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full'
        : 'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap';

    return (
        <nav className={containerClass} aria-label="Workspace navigation">
            {items.map(item => {
                if (item.disabled) {
                    return (
                        <a
                            key={item.label}
                            href={item.to}
                            onClick={(event) => event.preventDefault()}
                            className={`${linkBase} text-gray-400 cursor-default`}
                            aria-disabled="true"
                        >
                            {item.label}
                        </a>
                    );
                }

                return (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                            `${linkBase} ${isActive
                                ? 'bg-gray-900 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-white hover:text-gray-950'
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                );
            })}
        </nav>
    );
}
