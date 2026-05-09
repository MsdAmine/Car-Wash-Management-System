import { Routes, Route, Navigate } from 'react-router-dom';
import { APP_NAME, API_URL } from './config';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';

function App() {
    const { user, loading, logout } = useAuth();

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        // Adding a key tied to user status helps force a re-render on login
        <div key={user ? user.email : 'guest'}>
            <Routes>
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

                <Route path="/" element={
                    <div className="App p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Welcome to {APP_NAME}</h1>
                            {user && (
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            )}
                        </div>

                        <p className="text-gray-600 mb-6">Backend API: {API_URL}</p>

                        <div className="mt-5 p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Authentication Status</h2>
                            {user ? (
                                <div className="space-y-2">
                                    <p>Logged in as: <span className="font-bold text-gray-800">{user.firstName} {user.lastName}</span></p>
                                    <p>Email: <span className="text-gray-600">{user.email}</span></p>
                                    <p>Role: <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">{user.role}</span></p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-red-500 mb-4 font-medium">Not logged in.</p>
                                    <button
                                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
                                        onClick={() => window.location.href = '/login'}
                                    >
                                        Sign In Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                } />
            </Routes>
        </div>
    );
}

export default App;