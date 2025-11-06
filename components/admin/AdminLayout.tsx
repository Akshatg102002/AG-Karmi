
import React from 'react';
// FIX: Added Outlet for v6+ nested routing.
import { NavLink, Outlet } from 'react-router-dom';

const NavHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{children}</h3>
)

const AdminLayout: React.FC = () => {
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-brand-secondary ${isActive ? 'bg-brand-secondary font-semibold' : ''}`;

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-10rem)] bg-white rounded-lg shadow-xl">
            <aside className="w-full md:w-64 bg-gray-50 border-r p-4">
                <nav>
                    <NavLink to="/admin/dashboard" className={navLinkClasses}>
                        Dashboard
                    </NavLink>
                    
                    <NavHeader>Operations</NavHeader>
                    <NavLink to="/admin/calendar" className={navLinkClasses}>
                        Calendar
                    </NavLink>
                    <NavLink to="/admin/appointments" className={navLinkClasses}>
                        Appointments
                    </NavLink>
                    
                    <NavHeader>Management</NavHeader>
                    <NavLink to="/admin/services" className={navLinkClasses}>
                        Services
                    </NavLink>
                    <NavLink to="/admin/categories" className={navLinkClasses}>
                        Categories
                    </NavLink>
                    <NavLink to="/admin/employees" className={navLinkClasses}>
                        Employees
                    </NavLink>
                    <NavLink to="/admin/users" className={navLinkClasses}>
                        Users
                    </NavLink>

                    <NavHeader>Analytics</NavHeader>
                     <NavLink to="/admin/revenue" className={navLinkClasses}>
                        Revenue
                    </NavLink>
                     <NavLink to="/admin/performance" className={navLinkClasses}>
                        Employee Performance
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

export default AdminLayout;