import React from 'react';
import { useData } from '../../hooks/useData';
import { Booking, TimeOff } from '../../types';

interface CalendarDayViewProps {
  date: Date;
}

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const CalendarDayView: React.FC<CalendarDayViewProps> = ({ date }) => {
  const { employees, bookings } = useData();
  const activeEmployees = employees.filter(e => e.isActive);

  const dayBookings = bookings.filter(b => {
    const bookingDate = new Date(b.appointmentDate);
    return bookingDate.toDateString() === date.toDateString();
  });

  const startHour = 8;
  const endHour = 20;
  const pixelsPerHour = 60;

  const renderTimeSlots = () => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(
        <div key={hour} className="relative h-[60px] border-t border-gray-200">
          <span className="absolute -top-3 left-2 text-xs text-gray-500 bg-white px-1">
            {hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? 'AM' : 'PM'}
          </span>
        </div>
      );
    }
    return slots;
  };

  const getBookingStyle = (booking: Booking) => {
    const top = (timeToMinutes(booking.appointmentTime) - startHour * 60) * (pixelsPerHour / 60);
    const height = booking.duration * (pixelsPerHour / 60);
    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };
  
  const getLeaveStyle = (timeOff: TimeOff) => {
    if (timeOff.type === 'full-day') {
        return { top: 0, height: '100%', left: 0, right: 0 };
    }
    if (!timeOff.startTime || !timeOff.endTime) return {};
    const top = (timeToMinutes(timeOff.startTime) - startHour * 60) * (pixelsPerHour / 60);
    const height = (timeToMinutes(timeOff.endTime) - timeToMinutes(timeOff.startTime)) * (pixelsPerHour / 60);
    return {
        top: `${top}px`,
        height: `${height}px`,
    };
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <div className="flex" style={{ minWidth: `${100 + activeEmployees.length * 200}px` }}>
        {/* Time Column */}
        <div className="w-20 border-r border-gray-200">
            <div className="h-12 border-b"></div> {/* Header space */}
            {renderTimeSlots()}
        </div>
        
        {/* Employee Columns */}
        <div className="flex-grow grid" style={{ gridTemplateColumns: `repeat(${activeEmployees.length}, minmax(0, 1fr))`}}>
          {activeEmployees.map(employee => (
            <div key={employee.id} className="relative border-r border-gray-200">
              <div className="h-12 border-b flex items-center justify-center p-2 sticky top-0 bg-white z-20">
                <p className="font-semibold text-center text-sm">{employee.name}</p>
              </div>
              <div className="relative">
                {/* Background grid lines */}
                {Array.from({ length: endHour - startHour }).map((_, i) => (
                  <div key={i} className="h-[60px] border-t border-gray-100"></div>
                ))}

                {/* Time Off */}
                {employee.timeOff
                    ?.filter(to => new Date(to.date).toDateString() === date.toDateString())
                    .map((timeOff, index) => (
                        <div
                            key={`leave-${index}`}
                            style={getLeaveStyle(timeOff)}
                            className="absolute left-0 right-0 bg-yellow-200 bg-opacity-75 border-l-4 border-yellow-500 p-1 z-[5]"
                        >
                            <p className="text-xs font-semibold text-yellow-800 truncate">On Leave</p>
                            <p className="text-xs text-yellow-700 truncate">{timeOff.reason}</p>
                        </div>
                 ))}

                {/* Bookings */}
                {dayBookings
                  .filter(b => b.employeeId === employee.id)
                  .map(booking => (
                    <div
                      key={booking.id}
                      style={getBookingStyle(booking)}
                      className="absolute left-1 right-1 bg-purple-600 text-white p-2 rounded-lg overflow-hidden shadow-md z-10"
                    >
                      <p className="text-xs font-bold truncate">{booking.customerInfo.fullName}</p>
                      <p className="text-xs truncate">{booking.serviceName} ({booking.variantName})</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarDayView;