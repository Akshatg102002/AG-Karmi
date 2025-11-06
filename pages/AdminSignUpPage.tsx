import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
// FIX: Updated react-router-dom imports for v6+ compatibility.
import { useNavigate, Link } from 'react-router-dom';

const AdminSignUpPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const { users, loading: dataLoading } = useData();
    // FIX: Replaced useHistory with useNavigate for v6+.
    const navigate = useNavigate();

    useEffect(() => {
        if (!dataLoading) {
            const hasAdmin = users.some(user => user.role === 'admin');
            if (hasAdmin) {
                // If an admin already exists, redirect to login page.
                // This page is only for initial setup.
                // FIX: Use navigate with replace for navigation.
                navigate('/login', { replace: true });
            }
        }
    }, [users, dataLoading, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signup(formData, 'admin');
            // FIX: Use navigate for navigation.
            navigate('/admin');
        } catch (err: any) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('An account with this email already exists.');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak. It must be at least 6 characters long.');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.');
                    break;
                default:
                    setError('Could not sign up. Please try again.');
                    console.error("Admin Signup error:", err);
            }
        } finally {
            setLoading(false);
        }
    };
    
    if (dataLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p>Checking system configuration...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-brand-dark">
                        Create Administrator Account
                    </h2>
                     <p className="mt-2 text-center text-sm text-gray-600">
                        This page is for registering the first administrator only.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input id="name" name="name" type="text" required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand-primary focus:outline-none focus:ring-brand-primary sm:text-sm" placeholder="Full Name" value={formData.name} onChange={handleChange} />
                        </div>
                         <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input id="email-address" name="email" type="email" autoComplete="email" required className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand-primary focus:outline-none focus:ring-brand-primary sm:text-sm" placeholder="Email address" value={formData.email} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="phone" className="sr-only">Phone Number</label>
                            <input id="phone" name="phone" type="tel" required className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand-primary focus:outline-none focus:ring-brand-primary sm:text-sm" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="password-new" className="sr-only">Password</label>
                            <input id="password-new" name="password" type="password" required className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand-primary focus:outline-none focus:ring-brand-primary sm:text-sm" placeholder="Password" value={formData.password} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={loading} className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-primary py-2 px-4 text-sm font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:bg-gray-400">
                            {loading ? 'Creating account...' : 'Create Admin Account'}
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-brand-primary hover:text-brand-dark">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminSignUpPage;
