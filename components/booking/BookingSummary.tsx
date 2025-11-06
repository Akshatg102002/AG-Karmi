
import React from 'react';
import { useBooking } from '../../hooks/useBooking';
import { settings } from '../../data/mockData';

interface BookingSummaryProps {
    goToStep: (step: number) => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ goToStep }) => {
    const { bookingState } = useBooking();
    const { category, service, variant, employee, date, time } = bookingState;

    if (!service) {
        return (
            <div className="sticky top-28 bg-white rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-bold text-brand-dark mb-4">Your Booking</h3>
                <p className="text-sm text-gray-500">Your selections will appear here as you proceed through the booking steps.</p>
            </div>
        );
    }
    
    const subtotal = variant?.price || 0;
    const tax = (subtotal * settings.taxRate) / 100;
    const total = subtotal + tax;

    return (
        <div className="sticky top-28 bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-bold text-brand-dark mb-4 border-b pb-2">Your Booking Summary</h3>
            <div className="space-y-4 text-sm">
                <div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Service</span>
                        <button onClick={() => goToStep(1)} className="text-brand-primary hover:underline text-xs font-semibold">Change</button>
                    </div>
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-gray-600">{variant?.name}</p>
                </div>

                {employee !== undefined && (
                    <div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Stylist</span>
                           {/* Show the change button only when past the stylist selection step (i.e., when date is being selected or has been selected) */}
                           {date && <button onClick={() => goToStep(2)} className="text-brand-primary hover:underline text-xs font-semibold">Change</button>}
                        </div>
                        <p className="font-semibold">{employee ? employee.name : 'Any Available'}</p>
                    </div>
                )}

                {date && time && (
                    <div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Date & Time</span>
                            <button onClick={() => goToStep(3)} className="text-brand-primary hover:underline text-xs font-semibold">Change</button>
                        </div>
                        <p className="font-semibold">{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {time}</p>
                    </div>
                )}

                {variant && (
                     <div className="border-t pt-4 mt-4 space-y-2">
                        <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span> <span className="font-semibold">{subtotal.toLocaleString('en-US', { style: 'currency', currency: settings.currency })}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Taxes:</span> <span className="font-semibold">{tax.toLocaleString('en-US', { style: 'currency', currency: settings.currency })}</span></div>
                        <div className="flex justify-between text-base font-bold text-brand-dark mt-2 pt-2 border-t"><span >Total:</span> <span>{total.toLocaleString('en-US', { style: 'currency', currency: settings.currency })}</span></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingSummary;