import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
// FIX: Updated react-router-dom imports for v6+ compatibility.
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string; }> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
                 <h2 className="text-xl font-bold text-center text-brand-dark mb-4">{title}</h2>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                {children}
            </div>
        </div>
    );
};


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, sendResetEmail } = useAuth();
  // FIX: Replaced useHistory with useNavigate for v6+.
  const navigate = useNavigate();
  const location = useLocation();
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');


  useEffect(() => {
    // If user is already authenticated, redirect them away from login page
    if (isAuthenticated) {
        navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleNavigation = (userRole: string) => {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

    if (from && from !== '/login') {
        navigate(from, { replace: true });
    } else {
        switch (userRole) {
            case 'admin':
                navigate('/admin', { replace: true });
                break;
            case 'employee':
                navigate('/dashboard', { replace: true });
                break;
            default:
                navigate('/profile', { replace: true });
                break;
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      handleNavigation(loggedInUser.role);
    } catch (err: any) {
       // Error is already shown via toast in AuthContext
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordReset = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
          await sendResetEmail(resetEmail);
          setIsForgotModalOpen(false);
          setResetEmail('');
      } catch (err) {
           // Error is handled via toast in AuthContext
      } finally {
          setLoading(false);
      }
  }

  return (
    <>
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-brand-dark">
            Sign in to your account
          </h2>
           <p className="mt-2 text-center text-sm text-gray-600">
                For Customers, Employees, and Administrators.
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand-primary focus:outline-none focus:ring-brand-primary sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password-address" className="sr-only">Password</label>
              <input
                id="password-address"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand-primary focus:outline-none focus:ring-brand-primary sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="text-sm text-right">
             <button type="button" onClick={() => setIsForgotModalOpen(true)} className="font-medium text-brand-primary hover:text-brand-dark">
                  Forgot your password?
              </button>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-primary py-2 px-4 text-sm font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:bg-gray-400"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
            <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-brand-primary hover:text-brand-dark">
                    Sign up
                </Link>
            </p>
        </div>
      </div>
    </div>
    
    <Modal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} title="Reset Password">
        <form onSubmit={handlePasswordReset} className="space-y-4">
            <p className="text-sm text-gray-600">Enter your email address and we will send you a link to reset your password.</p>
            <div>
              <label htmlFor="reset-email" className="sr-only">Email address</label>
              <input
                id="reset-email" name="email" type="email" autoComplete="email" required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-brand-primary focus:outline-none focus:ring-brand-primary sm:text-sm"
                placeholder="Email address"
                value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-primary py-2 px-4 text-sm font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:bg-gray-400"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
        </form>
    </Modal>
    </>
  );
};

export default LoginPage;