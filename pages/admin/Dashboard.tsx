import React from 'react';
import { useData } from '../../hooks/useData';
import StatCard from '../../components/admin/StatCard';
import BookingChart from '../../components/admin/BookingChart';

const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.18-3.185m-3.181 9.348a8.25 8.25 0 00-11.664 0l-3.18 3.185m3.181-9.348l-3.181-3.183a8.25 8.25 0 00-11.664 0l-3.18 3.185" />
    </svg>
);


const Dashboard: React.FC = () => {
    const { services, employees, bookings, refetchData, reloading } = useData();

    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.price, 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-dark">Admin Dashboard</h1>
                <button
                    onClick={refetchData}
                    disabled={reloading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-wait"
                >
                    <RefreshIcon className={`w-4 h-4 ${reloading ? 'animate-spin' : ''}`} />
                    {reloading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Services" value={services.length} />
                <StatCard title="Total Employees" value={employees.length} />
                <StatCard title="Today's Bookings" value={bookings.filter(b => b.appointmentDate === new Date().toISOString().split('T')[0]).length} />
                <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-brand-dark mb-4">Booking Analytics (Last 7 Days)</h2>
                <div className="h-64 rounded-md flex items-center justify-center">
                    <BookingChart bookings={bookings} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;