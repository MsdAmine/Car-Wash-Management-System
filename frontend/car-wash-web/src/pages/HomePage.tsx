import { Link } from 'react-router-dom';
import { APP_NAME } from '../config';
import { useAuth } from '../context/AuthContext';

function HomePage() {
    const { user, logout } = useAuth();

    return (
        <div className="App p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Welcome to {APP_NAME}</h1>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>

            <div className="p-6 border rounded-lg bg-white shadow-sm mb-4">
                <h2 className="text-xl font-semibold mb-4">User Profile</h2>
                <p>Name: <strong>{user?.firstName} {user?.lastName}</strong></p>
                <p>Role: <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{user?.role}</span></p>
            </div>

            <div className="p-6 border rounded-lg bg-white shadow-sm">
                <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
                <div className="flex flex-wrap gap-2">
                    <Link
                        to="/services"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                    >
                        Our Services
                    </Link>
                    {user?.role === 'CUSTOMER' && (
                        <>
                            <Link
                                to="/dashboard"
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                            >
                                My Dashboard
                            </Link>
                            <Link
                                to="/my-vehicles"
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                            >
                                My Vehicles
                            </Link>
                            <Link
                                to="/my-bookings"
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                            >
                                My Bookings
                            </Link>
                            <Link
                                to="/book-appointment"
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                            >
                                Book Appointment
                            </Link>
                        </>
                    )}
                    {user?.role === 'ADMIN' && (
                        <>
                            <Link
                                to="/admin/dashboard"
                                className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm font-medium"
                            >
                                Admin Dashboard
                            </Link>
                            <Link
                                to="/admin/services"
                                className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm font-medium"
                            >
                                Manage Services
                            </Link>
                            <Link
                                to="/admin/bookings"
                                className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm font-medium"
                            >
                                Manage Bookings
                            </Link>
                            <Link
                                to="/admin/employees"
                                className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm font-medium"
                            >
                                Manage Employees
                            </Link>
                        </>
                    )}
                    {(user?.role === 'STAFF' || user?.role === 'ADMIN') && (
                        <>
                            <Link
                                to="/employee/dashboard"
                                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition text-sm font-medium"
                            >
                                Employee Dashboard
                            </Link>
                            <Link
                                to="/employee/daily-bookings"
                                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition text-sm font-medium"
                            >
                                Daily Schedule
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
