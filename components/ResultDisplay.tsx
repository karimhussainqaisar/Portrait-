import React, { useState, useEffect } from 'react';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  generatedImage: string | null;
}

const loadingExamples = [
  {
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=800&auto=format&fit=crop',
    text: 'A great headshot is your digital handshake.'
  },
  {
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    text: 'Crafting the perfect first impression...'
  },
  {
    image: 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?q=80&w=800&auto=format&fit=crop',
    text: 'Confidence is the best outfit. We\'re just adjusting the lighting.'
  },
  {
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop',
    text: 'Polishing your professional image...'
  }
];


const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, generatedImage }) => {
  const [loadingIndex, setLoadingIndex] = useState(0);

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = window.setInterval(() => {
        setLoadingIndex(prevIndex => (prevIndex + 1) % loadingExamples.length);
      }, 3500); // Change image and quote every 3.5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);
  
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-full aspect-square max-w-sm overflow-hidden rounded-lg shadow-lg">
          {loadingExamples.map((example, index) => (
            <img
              key={example.image}
              src={example.image}
              alt="Example generated headshot"
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                loadingIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
             <p className="text-white font-medium text-sm transition-opacity duration-500">{loadingExamples[loadingIndex].text}</p>
          </div>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-cyan-400">Generating your headshot...</h3>
        <p className="mt-1 text-sm text-gray-400">The AI is working its magic. This may take a moment.</p>
         <div className="w-full max-w-sm bg-gray-700 rounded-full h-2 mt-4 overflow-hidden">
          <div className="bg-cyan-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
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
    const appUrl = "https://aistudio.google.com/app/kits/10f21422b404414002638e68b31a54a2";
    const shareText = "Check out my new AI-generated headshot! Created with this AI Headshot Photographer app.";
    const encodedShareText = encodeURIComponent(shareText);
    const encodedAppUrl = encodeURIComponent(appUrl);

    const shareLinks = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedAppUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedAppUrl}&quote=${encodedShareText}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedAppUrl}&title=My%20New%20AI%20Headshot&summary=${encodedShareText}`
    };

    return (
        <div className="w-full h-full flex flex-col items-center">
            <img src={generatedImage} alt="Generated headshot" className="max-h-[30rem] w-auto object-contain rounded-lg shadow-lg" />
            <div className="mt-6 w-full max-w-xs flex flex-col items-center space-y-4">
                <a 
                    href={generatedImage} 
                    download="ai-headshot.jpg"
                    className="w-full text-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                >
                    Download Image
                </a>

                <div className="w-full flex items-center justify-between space-x-2">
                    <div className="flex-grow h-px bg-gray-600"></div>
                    <span className="text-gray-400 text-sm">Share</span>
                    <div className="flex-grow h-px bg-gray-600"></div>
                </div>

                <div className="flex justify-center space-x-4">
                    {/* X (Twitter) Share Button */}
                    <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="p-3 bg-gray-700 rounded-full hover:bg-cyan-500 transition-colors">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
                        </svg>
                    </a>
                    {/* Facebook Share Button */}
                    <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="p-3 bg-gray-700 rounded-full hover:bg-cyan-500 transition-colors">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.603 0 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H11.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                        </svg>
                    </a>
                    {/* LinkedIn Share Button */}
                    <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="p-3 bg-gray-700 rounded-full hover:bg-cyan-500 transition-colors">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                        </svg>
                    </a>
                </div>
            </div>
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