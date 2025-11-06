
import React from 'react';
import { Booking } from '../../types';
import BookingActions from './BookingActions';

interface BookingListProps {
    title: string;
    bookings: Booking[];
}

const BookingList: React.FC<BookingListProps> = ({ title, bookings }) => {
    return (
        <section>
            <h2 className="text-2xl font-semibold text-brand-dark border-b pb-2 mb-4">{title}</h2>
            {bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="flex-grow">
                                <p className="font-bold text-lg text-brand-dark">{booking.serviceName} <span className="font-normal text-base">({booking.variantName})</span></p>
                                <p className="text-sm text-gray-600">
                                    {new Date(booking.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })} at {booking.appointmentTime}
                                </p>
                                <p className="text-sm text-gray-500">with {booking.employeeName}</p>
                                {booking.status !== 'confirmed' && (
                                     <p className="text-sm font-semibold capitalize mt-1">
                                        Status: <span className={`${booking.status === 'cancelled' ? 'text-red-600' : 'text-green-600'}`}>{booking.status}</span>
                                     </p>
                                )}
                            </div>
                            <div className="mt-4 md:mt-0">
                                <BookingActions booking={booking} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                    <p className="text-gray-500">You have no {title.toLowerCase()}.</p>
                </div>
            )}
        </section>
    );
};

export default BookingList;
