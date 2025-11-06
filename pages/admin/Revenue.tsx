import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { Booking } from '../../types';
import StatCard from '../../components/admin/StatCard';

type FilterType = 'today' | 'week' | 'month';

const dateToYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Revenue: React.FC = () => {
    const { bookings } = useData();
    const [filter, setFilter] = useState<FilterType>('today');

    const filteredBookings = useMemo(() => {
        const now = new Date();
        
        if (filter === 'today') {
            const todayStr = dateToYYYYMMDD(now);
            return bookings.filter(b => b.appointmentDate === todayStr);
        }
        if (filter === 'week') {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            const startOfWeekStr = dateToYYYYMMDD(startOfWeek);
            return bookings.filter(b => b.appointmentDate >= startOfWeekStr);
        }
        if (filter === 'month') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfMonthStr = dateToYYYYMMDD(startOfMonth);
            return bookings.filter(b => b.appointmentDate >= startOfMonthStr);
        }
        return [];
    }, [bookings, filter]);

    const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.price, 0);
    const paidRevenue = filteredBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.price, 0);
    const pendingRevenue = totalRevenue - paidRevenue;
    const totalBookings = filteredBookings.length;

    const getFilterButtonClass = (f: FilterType) => 
        `px-4 py-2 rounded-md text-sm font-medium ${filter === f ? 'bg-brand-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-dark">Revenue</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setFilter('today')} className={getFilterButtonClass('today')}>Today</button>
                    <button onClick={() => setFilter('week')} className={getFilterButtonClass('week')}>This Week</button>
                    <button onClick={() => setFilter('month')} className={getFilterButtonClass('month')}>This Month</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
                <StatCard title="Total Bookings" value={totalBookings} />
                <StatCard title="Paid Revenue" value={`$${paidRevenue.toFixed(2)}`} />
                <StatCard title="Pending Revenue" value={`$${pendingRevenue.toFixed(2)}`} />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <h2 className="text-xl font-semibold text-brand-dark p-4 border-b">Recent Transactions</h2>
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBookings.slice(0, 10).map(booking => (
                            <tr key={booking.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.customerInfo.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.serviceName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {booking.paymentStatus}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredBookings.length === 0 && <p className="text-center text-gray-500 p-6">No transactions for this period.</p>}
            </div>
        </div>
    );
};

export default Revenue;
