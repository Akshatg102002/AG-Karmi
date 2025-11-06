
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import BookingList from '../components/profile/BookingList';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const { bookings } = useData();
    
    if (!user) {
        return <div>Loading...</div>;
    }

    const userBookings = bookings.filter(b => b.customerId === user.id);
    const upcomingBookings = userBookings
        .filter(b => new Date(b.appointmentDate) >= new Date() && b.status === 'confirmed')
        .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

    const pastBookings = userBookings
        .filter(b => new Date(b.appointmentDate) < new Date() || b.status !== 'confirmed')
        .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-brand-dark mb-2">My Bookings</h1>
            <p className="text-gray-600 mb-8">View and manage your appointments.</p>

            <div className="space-y-10">
                <BookingList title="Upcoming Appointments" bookings={upcomingBookings} />
                <BookingList title="Past Appointments" bookings={pastBookings} />
            </div>
        </div>
    );
};

export default ProfilePage;
