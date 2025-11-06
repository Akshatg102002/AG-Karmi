import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-dark text-white pt-12 pb-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <div className="grid md:grid-cols-3 gap-8 items-start">
                     <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <img src="https://www.karmisalon.com/wp-content/uploads/2025/05/Karmi-Trademark-Logo.png" alt="Karmi Beauty Logo" className="h-12 w-auto bg-white rounded-full p-1"/>
                            <div>
                                <span className="text-2xl font-bold text-white">Karmi Beauty</span>
                                <p className="text-sm text-gray-300 -mt-1">Salon & Spa</p>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-400 max-w-xs">
                            Your sanctuary for style, wellness, and relaxation in the heart of New York.
                        </p>
                    </div>
                     <div className="text-center">
                        <h3 className="font-semibold text-lg text-brand-secondary mb-3 uppercase tracking-wider">Quick Links</h3>
                        <nav className="flex flex-col space-y-2">
                           <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                           <Link to="/book" className="text-gray-300 hover:text-white">Book Now</Link>
                           <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
                           <Link to="/privacy-policy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
                        </nav>
                    </div>
                     <div className="text-center md:text-left">
                        <h3 className="font-semibold text-lg text-brand-secondary mb-3 uppercase tracking-wider">Visit Us</h3>
                        <p className="text-gray-300">📍 147-13 Jamaica Avenue, New York, NY</p>
                        <p className="text-gray-300 mt-2">📞 (123) 456-7890</p>
                         <div className="mt-3">
                            <p className="text-gray-300">Mon-Sat: 9AM - 7PM</p>
                            <p className="text-gray-300">Sun: 10AM - 6PM</p>
                        </div>
                    </div>
                </div>
                <div className="mt-10 border-t border-amber-700 pt-6">
                    <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Karmi Beauty Salon. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
