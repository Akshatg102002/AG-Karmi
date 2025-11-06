import React, { useState } from 'react';
import CalendarDayView from '../../components/admin/CalendarDayView';

const CalendarView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };
  
  const goToToday = () => {
    setSelectedDate(new Date());
  }
  
  const changeDay = (amount: number) => {
      setSelectedDate(prev => {
          const newDate = new Date(prev);
          newDate.setDate(newDate.getDate() + amount);
          return newDate;
      })
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-brand-dark">Calendar</h1>
        <div className="flex items-center gap-2">
            <button onClick={() => changeDay(-1)} className="p-2 rounded-md hover:bg-gray-200">&lt;</button>
            <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={handleDateChange}
                className="border-gray-300 rounded-md shadow-sm focus:border-brand-primary focus:ring-brand-primary"
            />
            <button onClick={() => changeDay(1)} className="p-2 rounded-md hover:bg-gray-200">&gt;</button>
             <button onClick={goToToday} className="ml-4 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100">Today</button>
        </div>
      </div>
      <CalendarDayView date={selectedDate} />
    </div>
  );
};

export default CalendarView;
