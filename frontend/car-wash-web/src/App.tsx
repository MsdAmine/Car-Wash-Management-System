import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { APP_NAME } from './config'; // Removed API_URL here
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import MyVehicles from './pages/MyVehicles';
import AddVehicle from './pages/AddVehicle';
import EditVehicle from './pages/EditVehicle';
import Services from './pages/Services';
import AdminServices from './pages/AdminServices';
import AddWashService from './pages/AddWashService';
import EditWashService from './pages/EditWashService';
import BookAppointment from './pages/BookAppointment';
import MyBookings from './pages/MyBookings';
import BookingDetails from './pages/BookingDetails';
import AdminBookings from './pages/AdminBookings';
import EmployeeBookings from './pages/EmployeeBookings';
import AdminEmployees from './pages/AdminEmployees';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeAssignedBookings from './pages/EmployeeAssignedBookings';
import EmployeeBookingWork from './pages/EmployeeBookingWork';

function App() {
    const { user, logout } = useAuth();

    return (
        <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
            <Route path="/services" element={<Services />} />

            {/* --- PROTECTED ROUTES (Layer 1: Must be logged in) --- */}
            <Route element={<ProtectedRoute />}>

                {/* Home Page: Accessible to any logged-in user */}
                <Route path="/" element={
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
                } />

                {/* --- ROLE-BASED GUARDS (Layer 2: Specific Permissions) --- */}

                {/* ADMIN ONLY */}
                <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                    <Route path="/admin/settings" element={<div className="p-8"><h1>Admin Settings</h1></div>} />
                    <Route path="/test-admin" element={
                        <div className="p-10 bg-green-100 border-2 border-green-500 rounded">
                            <h1 className="text-green-700 font-bold">ACCESS GRANTED: You are an ADMIN</h1>
                        </div>
                    } />
                    <Route path="/admin/services" element={<AdminServices />} />
                    <Route path="/admin/services/add" element={<AddWashService />} />
                    <Route path="/admin/services/:id/edit" element={<EditWashService />} />
                    <Route path="/admin/employees" element={<AdminEmployees />} />
                    <Route path="/admin/employees/add" element={<AddEmployee />} />
                    <Route path="/admin/employees/:id/edit" element={<EditEmployee />} />
                </Route>

                {/* CUSTOMER ONLY */}
                <Route element={<RoleGuard allowedRoles={['CUSTOMER']} />}>
                    <Route path="/test-customer" element={
                        <div className="p-10 bg-blue-100 border-2 border-blue-500 rounded">
                            <h1 className="text-blue-700 font-bold">ACCESS GRANTED: You are a CUSTOMER</h1>
                        </div>
                    } />
                    <Route path="/my-vehicles" element={<MyVehicles />} />
                    <Route path="/add-vehicle" element={<AddVehicle />} />
                    <Route path="/vehicles/:id/edit" element={<EditVehicle />} />
                    <Route path="/book-appointment" element={<BookAppointment />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                    <Route path="/bookings/:id" element={<BookingDetails />} />
                </Route>

                {/* ADMIN ONLY — bookings management */}
                <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                    <Route path="/admin/bookings" element={<AdminBookings />} />
                </Route>

                {/* STAFF & ADMIN */}
                <Route element={<RoleGuard allowedRoles={['ADMIN', 'STAFF']} />}>
                    <Route path="/manage-orders" element={<div className="p-8"><h1>Order Management</h1></div>} />
                    <Route path="/employee/daily-bookings" element={<EmployeeBookings />} />
                    <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                    <Route path="/employee/assigned-bookings" element={<EmployeeAssignedBookings />} />
                    <Route path="/employee/bookings/:bookingId/work" element={<EmployeeBookingWork />} />
                </Route>

            </Route>

            {/* --- FALLBACK --- */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;