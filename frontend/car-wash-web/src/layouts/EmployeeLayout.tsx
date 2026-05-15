import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config';
import NavMenu from '../components/NavMenu';
import { ROUTES } from '../routes';

export default function EmployeeLayout() {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 bg-white px-4 py-2 rounded-md text-sm font-medium text-gray-900 shadow-lg"
            >
                Skip to main content
            </a>

            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20" inert={sidebarOpen || undefined}>
                <div className="px-4 h-14 flex items-center gap-3">
                    <button
                        className="md:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-900"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open navigation menu"
                        aria-expanded={sidebarOpen}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>

                    <Link
                        to={ROUTES.HOME}
                        className="font-bold text-gray-900 text-base shrink-0 hover:text-gray-700 transition-colors"
                    >
                        {APP_NAME}
                    </Link>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded uppercase tracking-wide shrink-0">
                        Staff
                    </span>

                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-sm text-gray-600 hidden sm:block">
                            {user?.firstName} {user?.lastName}
                        </span>
                        <button
                            onClick={logout}
                            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile sidebar — backdrop and panel are siblings so the nav is not inside aria-hidden */}
            {sidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30 bg-black/40 md:hidden"
                        aria-hidden="true"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <nav
                        role="dialog"
                        aria-modal="true"
                        aria-label="Mobile navigation"
                        className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl p-4 flex flex-col md:hidden"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-gray-900">{APP_NAME}</span>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-900"
                                aria-label="Close navigation menu"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <NavMenu role="STAFF" orientation="vertical" />
                    </nav>
                </>
            )}

            <div className="flex flex-1" inert={sidebarOpen || undefined}>
                <aside className="hidden md:block w-52 bg-white border-r border-gray-200 shrink-0" aria-label="Sidebar navigation">
                    <div className="p-3 pt-4">
                        <NavMenu role="STAFF" orientation="vertical" />
                    </div>
                </aside>

                <main id="main-content" className="flex-1 min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
