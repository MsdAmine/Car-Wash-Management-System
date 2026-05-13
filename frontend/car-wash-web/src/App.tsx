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

function App() {
    const { user, logout } = useAuth();

    return (
        <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

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

                        {user?.role === 'CUSTOMER' && (
                            <div className="p-6 border rounded-lg bg-white shadow-sm">
                                <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
                                <Link
                                    to="/my-vehicles"
                                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                                >
                                    My Vehicles
                                </Link>
                            </div>
                        )}
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
                </Route>

                {/* STAFF & ADMIN */}
                <Route element={<RoleGuard allowedRoles={['ADMIN', 'STAFF']} />}>
                    <Route path="/manage-orders" element={<div className="p-8"><h1>Order Management</h1></div>} />
                </Route>

            </Route>

            {/* --- FALLBACK --- */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;