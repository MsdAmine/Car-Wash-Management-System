import { Link } from 'react-router-dom';

export default function StatusStrip() {
    return (
        <div className="bg-gray-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-sm font-semibold">Welcome to CarWash Pro</span>
                    <span className="hidden sm:inline text-gray-500">·</span>
                    <span className="text-xs text-gray-400">
                        Manage bookings, vehicles, and payments in one place
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        to="/my-bookings"
                        className="text-xs text-gray-300 hover:text-white transition-colors"
                    >
                        My Bookings
                    </Link>
                    <Link
                        to="#"
                        className="text-xs text-gray-300 hover:text-white transition-colors"
                    >
                        Payments
                    </Link>
                    <Link
                        to="#"
                        className="text-xs text-gray-300 hover:text-white transition-colors"
                    >
                        Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
