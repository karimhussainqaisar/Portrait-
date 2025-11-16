import React from 'react';
import type { DressStyle } from '../App';

interface DressSelectorProps {
  dressStyles: DressStyle[];
  selectedDressStyleId: string | undefined;
  onSelectDressStyle: (dressStyleId: string) => void;
}

const DressSelector: React.FC<DressSelectorProps> = ({ dressStyles, selectedDressStyleId, onSelectDressStyle }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {dressStyles.map((dress) => (
        <button
          key={dress.id}
          onClick={() => onSelectDressStyle(dress.id)}
          className={`relative p-2 rounded-lg transition-all duration-200 focus:outline-none ${
            selectedDressStyleId === dress.id
              ? 'ring-4 ring-cyan-500'
              : 'ring-2 ring-gray-600 hover:ring-cyan-500'
          }`}
        >
          <img
            src={dress.thumbnail}
            alt={dress.name}
            className="w-full h-24 object-cover rounded-md"
          />
          <p className="mt-2 text-xs sm:text-sm font-medium text-center text-gray-200">{dress.name}</p>
          {selectedDressStyleId === dress.id && (
            <div className="absolute top-1 right-1 bg-cyan-500 rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default DressSelector;
