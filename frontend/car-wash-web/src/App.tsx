import { useEffect, useState } from 'react';
import { APP_NAME, API_URL } from './config';
import authService from './services/authService';
import type { User } from './types/auth';

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const profile = await authService.getProfile();
                    setUser(profile);
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                }
            }
            setLoading(false);
        };

        fetchProfile();
    }, []);

    return (
        <div className="App">
            <h1>Welcome to {APP_NAME}</h1>
            <p>Backend API: {API_URL}</p>
            
            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2>Authentication Status</h2>
                {loading ? (
                    <p>Checking status...</p>
                ) : user ? (
                    <div>
                        <p>Logged in as: <strong>{user.firstName} {user.lastName}</strong></p>
                        <p>Role: {user.role}</p>
                        <button onClick={() => authService.logout()}>Logout</button>
                    </div>
                ) : (
                    <p>Not logged in. Use <code>authService.login()</code> in console to test.</p>
                )}
            </div>
        </div>
    );
}

export default App;