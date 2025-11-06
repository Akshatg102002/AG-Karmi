import React from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useData } from '../../hooks/useData';

interface Step1_CategoryProps {
  onCategorySelect: () => void;
}

const Step1_Category: React.FC<Step1_CategoryProps> = ({ onCategorySelect }) => {
  const { selectCategory } = useBooking();
  const { categories } = useData();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {categories.filter(c => c.isActive).map(category => (
        <div
          key={category.id}
          onClick={() => {
            selectCategory(category);
            onCategorySelect();
          }}
          className="group relative cursor-pointer overflow-hidden rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 bg-white"
        >
          <img src={category.image} alt={category.name} className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300"></div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/60 to-transparent">
             <h3 className="text-base sm:text-lg font-semibold text-white text-center">{category.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Step1_Category;