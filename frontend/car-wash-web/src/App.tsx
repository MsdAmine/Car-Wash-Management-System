import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import LandingPage from './pages/LandingPage';
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
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import { getDashboardPath } from './lib/authRoutes';

function App() {
    const { user } = useAuth();
    const dashboardPath = getDashboardPath(user?.role);

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to={dashboardPath} replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to={dashboardPath} replace />} />
            <Route path="/services" element={<Services />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/bookings" element={<AdminBookings />} />
                        <Route path="/admin/services" element={<AdminServices />} />
                        <Route path="/admin/services/add" element={<AddWashService />} />
                        <Route path="/admin/services/:id/edit" element={<EditWashService />} />
                        <Route path="/admin/payments" element={<div className="p-8"><h1>Admin Payments</h1></div>} />
                        <Route path="/admin/employees" element={<AdminEmployees />} />
                        <Route path="/admin/employees/add" element={<AddEmployee />} />
                        <Route path="/admin/employees/:id/edit" element={<EditEmployee />} />
                        <Route path="/admin/settings" element={<div className="p-8"><h1>Admin Settings</h1></div>} />
                    </Route>
                </Route>

                <Route element={<RoleGuard allowedRoles={['CUSTOMER']} />}>
                    <Route element={<CustomerLayout />}>
                        <Route path="/dashboard" element={<CustomerDashboard />} />
                        <Route path="/book-appointment" element={<BookAppointment />} />
                        <Route path="/my-bookings" element={<MyBookings />} />
                        <Route path="/bookings/:id" element={<BookingDetails />} />
                        <Route path="/my-vehicles" element={<MyVehicles />} />
                        <Route path="/add-vehicle" element={<AddVehicle />} />
                        <Route path="/vehicles/:id/edit" element={<EditVehicle />} />
                    </Route>
                </Route>

                <Route element={<RoleGuard allowedRoles={['EMPLOYEE']} />}>
                    <Route element={<EmployeeLayout />}>
                        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                        <Route path="/employee/daily-bookings" element={<EmployeeBookings />} />
                        <Route path="/employee/assigned-bookings" element={<EmployeeAssignedBookings />} />
                        <Route path="/employee/bookings/:bookingId/work" element={<EmployeeBookingWork />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
