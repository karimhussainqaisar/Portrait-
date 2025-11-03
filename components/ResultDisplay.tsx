import React from 'react';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  generatedImage: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, generatedImage }) => {
  if (isLoading) {
    return (
      <div className="w-full h-80 flex flex-col items-center justify-center bg-gray-900/50 rounded-lg animate-pulse">
        <svg className="w-16 h-16 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg text-gray-400">Generating your headshot...</p>
        <p className="text-sm text-gray-500">This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-80 flex flex-col items-center justify-center bg-red-900/20 border border-red-500 rounded-lg text-center p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-4 text-lg font-semibold text-red-400">Generation Failed</p>
        <p className="text-sm text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  if (generatedImage) {
    return (
        <div className="w-full h-full flex flex-col items-center">
            <img src={generatedImage} alt="Generated headshot" className="max-h-[30rem] w-auto object-contain rounded-lg shadow-lg" />
            <a 
                href={generatedImage} 
                download="ai-headshot.jpg"
                className="mt-4 bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-all duration-300"
            >
                Download Image
            </a>
        </div>
    );
  }

  return (
    <div className="w-full h-80 flex flex-col items-center justify-center bg-gray-900/50 rounded-lg text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="mt-4 text-lg text-gray-500">Your generated headshot will appear here.</p>
        <p className="text-sm text-gray-600">Get started on the left!</p>
    </div>
  );
};

export default ResultDisplay;
