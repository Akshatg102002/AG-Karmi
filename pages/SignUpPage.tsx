import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
// FIX: Updated react-router-dom imports for v6+ compatibility.
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

const SignUpPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, login } = useAuth();
    // FIX: Replaced useHistory with useNavigate for v6+.
    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signup(formData);
            // Log the user in automatically after signup
            await login(formData.email, formData.password);
            // FIX: Use navigate for navigation.
            navigate('/profile', { replace: true });
        } catch (err: any) {
            let errorMessage = 'Could not sign up. Please try again.';
            if (err.message && err.message.includes('phone number')) {
                errorMessage = err.message;
            } else {
                 switch (err.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'An account with this email already exists.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password is too weak. It must be at least 6 characters long.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address.';
                        break;
                }
            }
            toast.error(errorMessage);
            console.error("Signup error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-brand-dark">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                            {loading ? 'Creating account...' : 'Sign up'}
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
                 <div className="text-sm text-center pt-4 border-t">
                    <p className="text-gray-600">
                        Are you an Admin or Employee?{' '}
                        <Link to="/login" className="font-medium text-brand-primary hover:text-brand-dark">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;