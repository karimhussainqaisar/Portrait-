import React from 'react';
import type { Style } from '../App';

interface StyleSelectorProps {
  styles: Style[];
  selectedStyleId: string | undefined;
  onSelectStyle: (styleId: string) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyleId, onSelectStyle }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {styles.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelectStyle(style.id)}
          className={`relative p-2 rounded-lg transition-all duration-200 focus:outline-none ${
            selectedStyleId === style.id
              ? 'ring-4 ring-cyan-500'
              : 'ring-2 ring-gray-600 hover:ring-cyan-500'
          }`}
        >
          <img 
            src={style.thumbnail}
            alt={style.name} 
            className="w-full h-24 object-cover rounded-md"
          />
          <p className="mt-2 text-xs sm:text-sm font-medium text-center text-gray-200">{style.name}</p>
          {selectedStyleId === style.id && (
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

export default StyleSelector;
