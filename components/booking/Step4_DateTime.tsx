import React, { useState, useMemo } from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useData } from '../../hooks/useData';
import { settings } from '../../data/mockData';
import { getAvailableTimeSlots } from '../../utils/timeUtils';

interface Step4_DateTimeProps {
  onNext: () => void;
  onBack: () => void;
}

const Step4_DateTime: React.FC<Step4_DateTimeProps> = ({ onNext, onBack }) => {
  const { bookingState, selectDateTime } = useBooking();
  const { employees, bookings } = useData();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const { employee, variant, service } = bookingState;
  
  const employeeToUse = useMemo(() => {
    if (employee) return employee;
    if (!service) return null;
    return employees.find(e => e.assignedServices.includes(service.id) && e.isActive) || null;
  }, [employee, service, employees]);
  
  const availableSlots = useMemo(() => {
    if (!selectedDate || !employeeToUse || !variant) return [];
    return getAvailableTimeSlots(selectedDate, employeeToUse, variant, bookings, settings);
  }, [selectedDate, employeeToUse, variant, bookings]);

  const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      setSelectedTime(null);
  }

  const handleConfirm = () => {
    if(selectedDate && selectedTime) {
      selectDateTime(selectedDate, selectedTime);
      onNext();
    }
  };

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const startingDay = firstDayOfMonth(currentMonth, currentYear);
    const calendarDays = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    const maxDate = new Date();
    maxDate.setDate(new Date().getDate() + settings.advanceBookingDays);

    for (let i = 0; i < startingDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="p-2 border border-transparent"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isPast = date < today;
      const isTooFar = date > maxDate;
      const isDisabled = isPast || isTooFar;
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      
      calendarDays.push(
        <div key={day}
          onClick={() => !isDisabled && handleDateSelect(date)}
          className={`p-2 border text-center rounded-full transition-colors ${
            isDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
            isSelected ? 'bg-brand-primary text-white' : 
            'hover:bg-brand-light cursor-pointer'
          }`}
        >
          {day}
        </div>
      );
    }
    return calendarDays;
  };
  
  const nextMonth = () => {
      if(currentMonth === 11) {
          setCurrentMonth(0);
          setCurrentYear(currentYear + 1);
      } else {
          setCurrentMonth(currentMonth + 1);
      }
  };

  const prevMonth = () => {
    const today = new Date();
    today.setDate(1);
    today.setHours(0,0,0,0);

    if(new Date(currentYear, currentMonth, 1) > today) {
        if(currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    }
  };

  const isPrevMonthDisabled = new Date(currentYear, currentMonth, 1) <= new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">Select a Date & Time</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
            <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} disabled={isPrevMonthDisabled} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">&lt;</button>
                <h3 className="font-semibold">{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-200">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-sm items-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day} className="font-semibold text-center text-gray-500">{day}</div>)}
                {renderCalendar()}
            </div>
        </div>
        <div className="md:w-1/2">
          {/* FIX: Corrected typo from toLocaleDate_String to toLocaleDateString */}
          <h3 className="font-semibold text-center mb-4">{selectedDate ? `Available slots for ${selectedDate.toLocaleDateString()}` : 'Please select a date'}</h3>
          {selectedDate && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded">
              {availableSlots.length > 0 ? (
                availableSlots.map(time => (
                  <button 
                    key={time} 
                    onClick={() => setSelectedTime(time)} 
                    className={`p-2 border rounded-md text-sm transition-colors ${selectedTime === time ? 'bg-brand-primary text-white' : 'bg-white hover:bg-brand-secondary'}`}
                  >
                    {time}
                  </button>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-4">No available slots for this day.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="bg-gray-200 text-brand-text px-6 py-2 rounded-md font-semibold hover:bg-gray-300">Back</button>
        <button onClick={handleConfirm} disabled={!selectedTime} className="bg-brand-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-brand-dark disabled:bg-gray-300 disabled:cursor-not-allowed">
          Next
        </button>
      </div>
    </div>
  );
};

export default Step4_DateTime;
