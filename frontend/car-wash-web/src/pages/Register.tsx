import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '', // Fix for image_dcc21c.png
        role: 'CUSTOMER'
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await register(formData);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input name="firstName" placeholder="First Name" required className="border p-2 rounded" onChange={handleChange} />
                        <input name="lastName" placeholder="Last Name" required className="border p-2 rounded" onChange={handleChange} />
                    </div>
                    <input name="email" type="email" placeholder="Email" required className="w-full border p-2 rounded" onChange={handleChange} />

                    {/* Added Phone Field to fix the TS error */}
                    <input name="phone" type="tel" placeholder="Phone Number" required className="w-full border p-2 rounded" onChange={handleChange} />

                    <input name="password" type="password" placeholder="Password" required className="w-full border p-2 rounded" onChange={handleChange} />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;