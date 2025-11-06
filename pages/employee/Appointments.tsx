import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { Booking } from '../../types';

const EmployeeBookingCard: React.FC<{ booking: Booking }> = ({ booking }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex-grow">
            <p className="font-bold text-lg text-brand-dark">{booking.serviceName} <span className="font-normal text-base">({booking.variantName})</span></p>
            <p className="text-sm text-gray-600">
                {new Date(booking.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })} at {booking.appointmentTime}
            </p>
            <p className="text-sm text-gray-500">Client: {booking.customerInfo.fullName}</p>
        </div>
        <div className="mt-2 sm:mt-0">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
                {booking.status}
            </span>
        </div>
    </div>
);

const Appointments: React.FC = () => {
    const { user } = useAuth();
    const { bookings, employees } = useData();
    
    if (!user) return <div>Loading...</div>;
    
    const currentEmployee = employees.find(e => e.userId === user.id);
    if (!currentEmployee) return <div>Employee data not found for this user.</div>;

    const employeeBookings = bookings.filter(b => b.employeeId === currentEmployee.id);
    
    const upcomingBookings = employeeBookings
        .filter(b => new Date(b.appointmentDate) >= new Date() && b.status === 'confirmed')
        .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

    const pastBookings = employeeBookings
        .filter(b => new Date(b.appointmentDate) < new Date() || b.status !== 'confirmed')
        .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
        
    const Section: React.FC<{title: string; bookings: Booking[]}> = ({title, bookings}) => (
        <section>
            <h2 className="text-2xl font-semibold text-brand-dark border-b pb-2 mb-4">{title}</h2>
            {bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map(booking => <EmployeeBookingCard key={booking.id} booking={booking} />)}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                    <p className="text-gray-500">You have no {title.toLowerCase()}.</p>
                </div>
            )}
        </section>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark mb-8">My Appointments</h1>
            <div className="space-y-10">
                <Section title="Upcoming Appointments" bookings={upcomingBookings} />
                <Section title="Past Appointments" bookings={pastBookings} />
            </div>
        </div>
    );
};

export default Appointments;
