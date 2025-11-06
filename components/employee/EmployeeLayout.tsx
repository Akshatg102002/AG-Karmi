import React from 'react';
// FIX: Added Outlet for v6+ nested routing.
import { NavLink, Outlet } from 'react-router-dom';

const EmployeeLayout: React.FC = () => {
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-brand-secondary ${isActive ? 'bg-brand-secondary font-semibold' : ''}`;

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-10rem)] bg-white rounded-lg shadow-xl">
            <aside className="w-full md:w-64 bg-gray-50 border-r p-4">
                <nav className="space-y-2">
                    <NavLink to="/dashboard/appointments" className={navLinkClasses}>
                        My Appointments
                    </NavLink>
                     <NavLink to="/dashboard/earnings" className={navLinkClasses}>
                        My Earnings
                    </NavLink>
                     <NavLink to="/dashboard/profile" className={navLinkClasses}>
                        My Profile
                    </NavLink>
                    <NavLink to="/dashboard/leave" className={navLinkClasses}>
                        Manage Leave
                    </NavLink>
                </nav>
            </aside>
            <main className="flex-1 p-6">
                {/* FIX: Replaced children with Outlet for v6 nested routing. */}
                <Outlet />
            </main>
        </div>
    );
};

export default EmployeeLayout;
