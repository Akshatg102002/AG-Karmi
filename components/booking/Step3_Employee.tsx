
import React from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useData } from '../../hooks/useData';
import { Employee } from '../../types';

interface Step3_EmployeeProps {
  onNext: () => void;
  onBack: () => void;
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
);

const Step3_Employee: React.FC<Step3_EmployeeProps> = ({ onNext, onBack }) => {
  const { bookingState, selectEmployee } = useBooking();
  const { employees } = useData();
  const { service } = bookingState;

  if (!service) return null;

  const availableEmployees = employees.filter(e => e.assignedServices.includes(service.id) && e.isActive);

  const handleSelect = (employee: Employee | null) => {
    selectEmployee(employee);
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">Select a Stylist</h2>
      
      <div className="space-y-4">
        <div
          onClick={() => handleSelect(null)}
          className="bg-white p-4 rounded-lg shadow-sm border-2 border-brand-primary flex items-center gap-4 cursor-pointer hover:bg-brand-light transition-colors"
        >
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">Any</div>
          <div>
            <h3 className="font-bold text-lg">Any Available</h3>
            <p className="text-sm text-gray-500">We'll assign the first available stylist for your service.</p>
          </div>
        </div>
        {availableEmployees.length > 0 ? (
          availableEmployees.map(employee => (
            <div
              key={employee.id}
              onClick={() => handleSelect(employee)}
              className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4 cursor-pointer hover:bg-brand-light transition-colors"
            >
              <img src={employee.profileImage} alt={employee.name} className="w-16 h-16 rounded-full object-cover"/>
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-brand-dark">{employee.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <StarIcon className="w-4 h-4 text-amber-400" />
                  <span>{employee.rating} ({employee.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-600">No stylists are available for this specific service.</p>
            <p className="text-sm text-gray-500">Please try selecting a different service or check back later.</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="bg-gray-200 text-brand-text px-6 py-2 rounded-md font-semibold hover:bg-gray-300">Back</button>
      </div>
    </div>
  );
};

export default Step3_Employee;
