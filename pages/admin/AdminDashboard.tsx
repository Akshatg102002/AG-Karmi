import React from 'react';
import { useData } from '../../hooks/useData';
import StatCard from '../../components/admin/StatCard';

const Dashboard: React.FC = () => {
    const { services, employees, bookings } = useData();

    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.price, 0);

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Services" value={services.length} />
                <StatCard title="Total Employees" value={employees.length} />
                <StatCard title="Today's Bookings" value={bookings.length} />
                <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-brand-dark mb-4">Booking Analytics</h2>
                <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Analytics chart would be displayed here.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
