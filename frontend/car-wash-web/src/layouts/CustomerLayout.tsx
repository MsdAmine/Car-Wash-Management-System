import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config';
import NavMenu from '../components/NavMenu';
import { ROUTES } from '../routes';

export default function CustomerLayout() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="px-4 h-14 flex items-center gap-3">
                    <Link
                        to={ROUTES.HOME}
                        className="font-bold text-gray-900 text-base shrink-0 hover:text-gray-700 transition-colors"
                    >
                        {APP_NAME}
                    </Link>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded uppercase tracking-wide shrink-0">
                        Customer
                    </span>

                    <div className="ml-auto flex items-center gap-3">
                        <span className="text-sm text-gray-600 hidden sm:block">
                            {user?.firstName} {user?.lastName}
                        </span>
                        <button
                            onClick={logout}
                            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                <aside className="w-52 bg-white border-r border-gray-200 shrink-0">
                    <div className="p-3 pt-4">
                        <NavMenu role="CUSTOMER" orientation="vertical" />
                    </div>
                </aside>

                <div className="flex-1 min-w-0">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
