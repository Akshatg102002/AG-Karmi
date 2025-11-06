import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
// FIX: Updated react-router-dom imports for v6+ compatibility.
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { isAuthenticated, user, isAdmin, isEmployee, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // FIX: Replaced useHistory with useNavigate for v6.
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Close menu on logout
    // FIX: Use navigate for navigation.
    navigate('/'); // Redirect to home
  };

  const navLinkClasses = "block py-2 px-3 text-brand-text rounded hover:bg-brand-light md:hover:bg-transparent md:border-0 md:hover:text-brand-primary md:p-0";
  const mobileNavLinkClasses = "block py-2 px-4 text-sm hover:bg-gray-100";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
               <img src="https://www.karmisalon.com/wp-content/uploads/2025/05/Karmi-Trademark-Logo.png" alt="Karmi Beauty Logo" className="h-12 w-auto"/>
               <div>
                  <span className="text-2xl font-bold text-brand-dark">Karmi Beauty</span>
                  <p className="text-sm text-gray-500 -mt-1">Salon & Spa</p>
               </div>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-default"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
             <Link to="/book" className={navLinkClasses}>Book Now</Link>
             <Link to="/contact" className={navLinkClasses}>Contact</Link>
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 hidden lg:inline">Welcome, {user?.name}!</span>
                {isAdmin ? (
                   <Link to="/admin" className="text-sm font-medium text-brand-primary hover:text-brand-dark">Admin Panel</Link>
                ) : isEmployee ? (
                   <Link to="/dashboard" className="text-sm font-medium text-brand-primary hover:text-brand-dark">My Dashboard</Link>
                ) : (
                  <Link to="/profile" className="text-sm font-medium text-brand-text hover:text-brand-primary">My Bookings</Link>
                )}
                <button onClick={handleLogout} className="text-sm font-medium text-brand-text hover:text-brand-primary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-brand-text hover:text-brand-primary">Login</Link>
                <Link to="/signup" className="bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-dark transition-colors">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden pb-4" id="navbar-default">
            <div className="font-medium flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClasses}>Home</Link>
                <Link to="/book" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClasses}>Book Now</Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClasses}>Contact</Link>
                 {isAuthenticated ? (
                    <>
                     {isAdmin ? (
                         <Link to="/admin" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClasses}>Admin Panel</Link>
                     ) : isEmployee ? (
                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClasses}>My Dashboard</Link>
                     ) : (
                         <Link to="/profile" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClasses}>My Bookings</Link>
                     )}
                     <button onClick={handleLogout} className={`${mobileNavLinkClasses} text-left`}>Logout</button>
                    </>
                 ) : (
                    <>
                     <Link to="/login" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClasses}>Login</Link>
                     <Link to="/signup" onClick={() => setIsMenuOpen(false)} className={`${mobileNavLinkClasses} text-brand-primary`}>Sign Up</Link>
                    </>
                 )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;