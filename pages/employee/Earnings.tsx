import React, { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import StatCard from '../../components/admin/StatCard'; // Reuse

const Earnings: React.FC = () => {
    const { user } = useAuth();
    const { bookings, employees } = useData();

    const { totalRevenue, completedBookingsCount, avgRevenuePerBooking } = useMemo(() => {
        if (!user) return { totalRevenue: 0, completedBookingsCount: 0, avgRevenuePerBooking: 0 };
        
        const currentEmployee = employees.find(e => e.userId === user.id);
        if (!currentEmployee) return { totalRevenue: 0, completedBookingsCount: 0, avgRevenuePerBooking: 0 };

        const employeeBookings = bookings.filter(b => b.employeeId === currentEmployee.id && b.status === 'completed');
        
        const totalRevenue = employeeBookings.reduce((sum, b) => sum + b.price, 0);
        const completedBookingsCount = employeeBookings.length;
        const avgRevenuePerBooking = completedBookingsCount > 0 ? totalRevenue / completedBookingsCount : 0;
        
        return { totalRevenue, completedBookingsCount, avgRevenuePerBooking };
    }, [user, bookings, employees]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark mb-6">My Earnings</h1>
            <p className="text-gray-600 mb-8">This is a summary of your earnings from completed appointments.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Revenue (All Time)" value={`$${totalRevenue.toFixed(2)}`} />
                <StatCard title="Completed Appointments" value={completedBookingsCount} />
                <StatCard title="Avg. Revenue per Booking" value={`$${avgRevenuePerBooking.toFixed(2)}`} />
            </div>
        </div>
    );
};

export default Earnings;
