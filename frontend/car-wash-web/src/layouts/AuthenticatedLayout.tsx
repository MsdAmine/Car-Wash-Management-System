import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import NavMenu from '../components/NavMenu';
import { useAuth } from '../context/AuthContext';
import { dashboardPathByRole } from '../lib/authRoutes';
import { ROUTES } from '../routes';
import type { UserRole } from '../types/auth';

interface AuthenticatedLayoutProps {
    role: UserRole;
}

const workspaceSubtitle: Record<UserRole, string> = {
    ADMIN: 'Business command center',
    EMPLOYEE: 'Employee workspace',
    CUSTOMER: 'Customer workspace',
};

const roleLabel: Record<UserRole, string> = {
    ADMIN: 'Admin',
    EMPLOYEE: 'Employee',
    CUSTOMER: 'Customer',
};

const settingsRouteByRole: Partial<Record<UserRole, string>> = {
    ADMIN: ROUTES.ADMIN_SETTINGS,
};

const MenuIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CloseIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const SearchIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const BellIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022 23.848 23.848 0 0 0 5.455 1.31m5.714 0a3 3 0 0 1-5.714 0" />
    </svg>
);

export default function AuthenticatedLayout({ role }: AuthenticatedLayoutProps) {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const settingsRoute = settingsRouteByRole[role];
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Account';
    const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'CW';

    const sidebar = (
        <div className="flex h-full flex-col bg-white">
            <div className="border-b border-gray-200 p-5">
                <Link to={dashboardPathByRole[role]} className="block" onClick={() => setSidebarOpen(false)}>
                    <span className="block text-base font-semibold text-gray-950">CarWash Pro</span>
                    <span className="mt-1 block text-xs font-medium text-gray-500">{workspaceSubtitle[role]}</span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
                <NavMenu role={role} orientation="vertical" onNavigate={() => setSidebarOpen(false)} />
            </div>

            <div className="border-t border-gray-200 p-3">
                <div className="mb-3 space-y-1">
                    {settingsRoute && (
                        <Link
                            to={settingsRoute}
                            onClick={() => setSidebarOpen(false)}
                            className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-950"
                        >
                            Settings
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-950"
                    >
                        Sign out
                    </button>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-xs font-semibold text-white">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-950">{fullName}</p>
                        <p className="text-xs font-medium text-gray-500">{roleLabel[role]}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-100 text-gray-950">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-lg"
            >
                Skip to main content
            </a>

            <div className="flex min-h-screen">
                <aside className="hidden w-72 shrink-0 border-r border-gray-200 lg:flex lg:sticky lg:top-0 lg:h-screen" aria-label="Sidebar navigation">
                    {sidebar}
                </aside>

                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
                        <button
                            type="button"
                            className="absolute inset-0 bg-gray-950/40"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close navigation menu"
                        />
                        <aside className="relative h-full w-80 max-w-[86vw] border-r border-gray-200 shadow-xl">
                            <div className="absolute right-3 top-3 z-10">
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(false)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-900"
                                    aria-label="Close navigation menu"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                            {sidebar}
                        </aside>
                    </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="sticky top-0 z-30 border-b border-gray-200 bg-stone-100/95 backdrop-blur">
                        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
                            <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                                aria-label="Open navigation menu"
                                aria-expanded={sidebarOpen}
                            >
                                <MenuIcon />
                            </button>

                            <div className="relative max-w-xl flex-1">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <SearchIcon />
                                </span>
                                <input
                                    type="search"
                                    placeholder="Search bookings, customers, vehicles..."
                                    className="h-10 w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                                />
                            </div>

                            <button
                                type="button"
                                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-900"
                                aria-label="Notifications"
                            >
                                <BellIcon />
                            </button>
                        </div>
                    </header>

                    <main id="main-content" className="min-w-0 flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
