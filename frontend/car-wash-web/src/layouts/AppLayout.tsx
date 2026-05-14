import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config';
import NavMenu from '../components/NavMenu';
import { ROUTES } from '../routes';

export default function AppLayout() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
                    <Link
                        to={ROUTES.HOME}
                        className="font-bold text-gray-900 text-base shrink-0 hover:text-gray-700 transition-colors"
                    >
                        {APP_NAME}
                    </Link>

                    {user && (
                        <div className="flex-1 overflow-x-auto">
                            <NavMenu role={user.role} orientation="horizontal" />
                        </div>
                    )}

                    {user && (
                        <div className="flex items-center gap-3 shrink-0 ml-auto">
                            <span className="text-sm text-gray-600 hidden sm:block">
                                {user.firstName} {user.lastName}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                {user.role}
                            </span>
                            <button
                                onClick={logout}
                                className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}
