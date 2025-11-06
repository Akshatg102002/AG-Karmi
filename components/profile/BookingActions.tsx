
import React, { useState } from 'react';
import { Booking } from '../../types';
import { useData } from '../../hooks/useData';

interface BookingActionsProps {
    booking: Booking;
}

// A simplified modal component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">&times;</button>
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                {children}
            </div>
        </div>
    );
};

const BookingActions: React.FC<BookingActionsProps> = ({ booking }) => {
    const { updateBooking } = useData();
    const [modal, setModal] = useState<'details' | 'reschedule' | 'cancel' | null>(null);

    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            updateBooking({ ...booking, status: 'cancelled' });
            setModal(null);
        }
    };
    
    // Reschedule logic is complex, this is a placeholder
    const handleReschedule = () => {
        alert("Rescheduling is not yet implemented. Please contact the salon directly.");
        setModal(null);
    }

    const isActionable = booking.status === 'confirmed' && new Date(booking.appointmentDate) >= new Date();

    return (
        <div className="flex gap-2 justify-end">
            <button onClick={() => setModal('details')} className="text-sm font-medium text-brand-primary hover:underline">View Details</button>
            {isActionable && (
                <>
                    <button onClick={() => setModal('reschedule')} className="text-sm font-medium text-brand-primary hover:underline">Reschedule</button>
                    <button onClick={() => setModal('cancel')} className="text-sm font-medium text-red-600 hover:underline">Cancel</button>
                </>
            )}

            {/* Details Modal */}
            <Modal isOpen={modal === 'details'} onClose={() => setModal(null)} title="Appointment Details">
                <div className="space-y-2 text-sm">
                    <p><strong>Service:</strong> {booking.serviceName} ({booking.variantName})</p>
                    <p><strong>Stylist:</strong> {booking.employeeName}</p>
                    <p><strong>Date:</strong> {new Date(booking.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
                    <p><strong>Time:</strong> {booking.appointmentTime}</p>
                    <p><strong>Duration:</strong> {booking.duration} minutes</p>
                    <p><strong>Status:</strong> <span className="capitalize font-semibold">{booking.status}</span></p>
                    <p><strong>Payment:</strong> {booking.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} ({booking.paymentStatus})</p>
                    {booking.customerInfo.notes && <p><strong>Notes:</strong> {booking.customerInfo.notes}</p>}
                </div>
                 <div className="mt-6 flex justify-end">
                    <button onClick={() => setModal(null)} className="bg-gray-200 text-brand-text px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Close</button>
                </div>
            </Modal>

            {/* Reschedule Modal */}
            <Modal isOpen={modal === 'reschedule'} onClose={() => setModal(null)} title="Reschedule Appointment">
                <p>To reschedule your appointment, please contact the salon directly. This feature will be available online soon!</p>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={() => setModal(null)} className="bg-gray-200 text-brand-text px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                    <button onClick={handleReschedule} className="bg-brand-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-dark">Okay</button>
                </div>
            </Modal>
            
            {/* Cancel Modal */}
            <Modal isOpen={modal === 'cancel'} onClose={() => setModal(null)} title="Cancel Appointment">
                <p>Are you sure you want to cancel this appointment?</p>
                <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={() => setModal(null)} className="bg-gray-200 text-brand-text px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Keep Appointment</button>
                    <button onClick={handleCancel} className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700">Yes, Cancel</button>
                </div>
            </Modal>
        </div>
    );
};

export default BookingActions;
