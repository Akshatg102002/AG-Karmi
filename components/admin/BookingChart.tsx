import React, { useMemo } from 'react';
import { Booking } from '../../types';

interface BookingChartProps {
    bookings: Booking[];
}

const BookingChart: React.FC<BookingChartProps> = ({ bookings }) => {
    const chartData = useMemo(() => {
        const data: { [key: string]: number } = {};
        const labels: string[] = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const day = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            labels.push(day);
            data[dateString] = 0;
        }

        bookings.forEach(booking => {
            if (data[booking.appointmentDate] !== undefined) {
                data[booking.appointmentDate]++;
            }
        });
        
        return {
            labels,
            data: Object.values(data),
        };
    }, [bookings]);
    
    const maxVal = Math.max(...chartData.data, 5); // Minimum height for 5 bookings

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-grow flex items-end justify-around gap-2 px-2 pt-4 border-b border-gray-200">
                {chartData.data.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="text-sm font-semibold text-gray-600 mb-1">{value}</div>
                        <div
                            className="w-full bg-brand-secondary hover:bg-brand-primary rounded-t-md transition-all duration-300"
                            style={{ height: `${(value / maxVal) * 100}%` }}
                            title={`${value} bookings`}
                        ></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-around text-xs text-gray-500 font-medium mt-1">
                {chartData.labels.map((label, index) => (
                    <div key={index} className="flex-1 text-center">{label}</div>
                ))}
            </div>
        </div>
    );
};

export default BookingChart;
