
import React from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useData } from '../../hooks/useData';
import { ServiceVariant, Service } from '../../types';

interface Step2_ServiceProps {
  onNext: () => void;
  onBack: () => void;
}

const Step2_Service: React.FC<Step2_ServiceProps> = ({ onNext, onBack }) => {
  const { bookingState, selectService } = useBooking();
  const { services } = useData();
  const { category } = bookingState;

  if (!category) return null;

  const filteredServices = services.filter(s => s.categoryId === category.id && s.isActive);
  
  const handleSelectVariant = (service: Service, variant: ServiceVariant) => {
    selectService(service, variant);
    onNext();
  };

  return (
    <div>
      <div className="space-y-6">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img src={service.image} alt={service.name} className="w-24 h-24 rounded-md object-cover flex-shrink-0"/>
            <div className="flex-grow">
              <h3 className="font-bold text-lg text-brand-dark">{service.name}</h3>
              <div className="mt-2 space-y-2">
                {service.variants.map(variant => (
                  <div key={variant.name} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 rounded-md hover:bg-brand-light">
                    <div>
                      <p className="font-semibold">{variant.name}</p>
                      <p className="text-sm text-gray-500">{variant.duration} min &bull; ${variant.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => handleSelectVariant(service, variant)}
                      className="mt-2 sm:mt-0 bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-dark transition-colors"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-start">
        <button onClick={onBack} className="bg-gray-200 text-brand-text px-6 py-2 rounded-md font-semibold hover:bg-gray-300">Back</button>
      </div>
    </div>
  );
};

export default Step2_Service;