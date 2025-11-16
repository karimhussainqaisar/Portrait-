import React from 'react';
import type { Background } from '../App';

interface BackgroundSelectorProps {
  backgrounds: Background[];
  selectedBackgroundId: string | undefined;
  onSelectBackground: (backgroundId: string) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ backgrounds, selectedBackgroundId, onSelectBackground }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {backgrounds.map((bg) => (
        <button
          key={bg.id}
          onClick={() => onSelectBackground(bg.id)}
          className={`relative p-2 rounded-lg transition-all duration-200 focus:outline-none ${
            selectedBackgroundId === bg.id
              ? 'ring-4 ring-cyan-500'
              : 'ring-2 ring-gray-600 hover:ring-cyan-500'
          }`}
        >
          <img
            src={bg.thumbnail}
            alt={bg.name}
            className="w-full h-24 object-cover rounded-md"
          />
          <p className="mt-2 text-xs sm:text-sm font-medium text-center text-gray-200">{bg.name}</p>
          {selectedBackgroundId === bg.id && (
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

export default BackgroundSelector;
