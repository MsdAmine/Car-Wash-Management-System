import { NavLink } from 'react-router-dom';
import { ROUTES } from '../routes';

interface NavItem {
    label: string;
    to: string;
}

const ADMIN_NAV: NavItem[] = [
    { label: 'Dashboard', to: ROUTES.ADMIN_DASHBOARD },
    { label: 'Bookings', to: ROUTES.ADMIN_BOOKINGS },
    { label: 'Services', to: ROUTES.ADMIN_SERVICES },
    { label: 'Employees', to: ROUTES.ADMIN_EMPLOYEES },
    { label: 'Settings', to: ROUTES.ADMIN_SETTINGS },
];

const CUSTOMER_NAV: NavItem[] = [
    { label: 'Dashboard', to: ROUTES.CUSTOMER_DASHBOARD },
    { label: 'Book Appointment', to: ROUTES.BOOK_APPOINTMENT },
    { label: 'My Bookings', to: ROUTES.MY_BOOKINGS },
    { label: 'My Vehicles', to: ROUTES.MY_VEHICLES },
    { label: 'Services', to: ROUTES.SERVICES },
];

const EMPLOYEE_NAV: NavItem[] = [
    { label: 'Dashboard', to: ROUTES.EMPLOYEE_DASHBOARD },
    { label: 'Daily Schedule', to: ROUTES.EMPLOYEE_DAILY_BOOKINGS },
    { label: 'My Assignments', to: ROUTES.EMPLOYEE_ASSIGNED_BOOKINGS },
];

const NAV_BY_ROLE: Record<string, NavItem[]> = {
    ADMIN: ADMIN_NAV,
    CUSTOMER: CUSTOMER_NAV,
    STAFF: EMPLOYEE_NAV,
};

interface NavMenuProps {
    role: string;
    orientation?: 'horizontal' | 'vertical';
}

export default function NavMenu({ role, orientation = 'horizontal' }: NavMenuProps) {
    const items = NAV_BY_ROLE[role] ?? [];

    const containerClass = orientation === 'vertical'
        ? 'flex flex-col gap-0.5'
        : 'flex items-center gap-1';

    const linkBase = orientation === 'vertical'
        ? 'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors w-full'
        : 'px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap';

    return (
        <nav className={containerClass} aria-label="Role navigation">
            {items.map(item => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        `${linkBase} ${isActive
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
}
