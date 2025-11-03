import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import ResultDisplay from './components/ResultDisplay';
import { generateHeadshot } from './services/geminiService';

export interface ImageData {
  b64: string;
  mimeType: string;
  url: string;
}

export interface Style {
  id: string;
  name: string;
  prompt: string;
  thumbnail: string;
}

const styles: Style[] = [
  {
    id: 'corporate-grey',
    name: 'Corporate Grey Backdrop',
    prompt: 'Transform this selfie into a professional corporate headshot. The subject should be wearing a sharp, dark business suit or blazer. The background should be a solid, neutral-grey, studio-quality backdrop. The lighting should be soft and flattering, typical of professional photography. Maintain the person\'s facial features and identity, but enhance the overall quality to a professional standard.',
    thumbnail: 'https://picsum.photos/seed/corporate/200'
  },
  {
    id: 'tech-office',
    name: 'Modern Tech Office',
    prompt: 'Transform this selfie into a professional headshot suitable for a tech company. The subject should be wearing smart-casual business attire. The background should be a modern, slightly blurred office environment with elements like glass walls, soft lighting, and perhaps a touch of green from a plant. The overall feel should be approachable yet professional. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/tech/200'
  },
  {
    id: 'outdoor-natural',
    name: 'Outdoor Natural Light',
    prompt: 'Transform this selfie into a friendly and professional outdoor headshot. The subject should be dressed in business-casual clothing. The background should be a pleasant, out-of-focus natural setting, like a park or modern urban architecture, with soft, natural daylight. The mood should be warm and engaging. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/outdoor/200'
  },
  {
    id: 'black-white',
    name: 'Classic Black & White',
    prompt: 'Transform this selfie into a classic, powerful black and white professional headshot. The subject should be in professional attire. The lighting should be dramatic and high-contrast (chiaroscuro), creating a timeless and confident look. The background should be a simple dark or grey texture. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/bw/200'
  },
  {
    id: 'academic-library',
    name: 'Scholarly Library',
    prompt: 'Transform this selfie into a professional headshot for an academic or author. The subject should be dressed in smart, intellectual attire (e.g., a tweed jacket, turtleneck, or collared shirt). The background should be a warm, softly-lit library or study, with bookshelves filled with books visible but blurred. The lighting should be thoughtful and slightly dramatic. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/library/200'
  },
  {
    id: 'creative-colorful',
    name: 'Vibrant Studio',
    prompt: 'Transform this selfie into a dynamic headshot for a creative professional. The subject should be in stylish, modern attire. The background should be a solid, vibrant color like teal, mustard yellow, or deep blue, creating a bold and energetic feel. The lighting should be bright and even. Maintain the person\'s facial features and identity while giving the photo a contemporary, creative agency look.',
    thumbnail: 'https://picsum.photos/seed/creative/200'
  },
  {
    id: 'urban-brick',
    name: 'Urban Brick Wall',
    prompt: 'Transform this selfie into a modern, confident headshot with an urban feel. The subject should be wearing smart-casual or business-casual clothing. The background should be a textured brick wall (red or brown), slightly out of focus. The lighting should appear natural, as if from a nearby window or open space, creating a relaxed yet professional atmosphere. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/urban/200'
  },
];

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (imageData: ImageData) => {
    setOriginalImage(imageData);
    setGeneratedImage(null);
    setError(null);
  };

  const handleStyleSelect = (styleId: string) => {
    const style = styles.find(s => s.id === styleId);
    setSelectedStyle(style || null);
  };
  
  const handleReset = () => {
    setOriginalImage(null);
    setSelectedStyle(null);
    setGeneratedImage(null);
    setIsLoading(false);
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!originalImage || !selectedStyle) {
      setError("Please upload an image and select a style.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultB64 = await generateHeadshot(originalImage.b64, originalImage.mimeType, selectedStyle.prompt);
      setGeneratedImage(`data:image/jpeg;base64,${resultB64}`);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, selectedStyle]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-6xl text-center mb-8">
         <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">AI Headshot Photographer</h1>
         <p className="mt-4 text-lg text-gray-400">Upload a selfie, pick a style, and generate a professional headshot in seconds.</p>
      </header>

      <main className="w-full max-w-6xl flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Step 1: Upload Your Photo</h2>
          <div className="flex-grow">
            <ImageUploader onImageUpload={handleImageUpload} originalImageUrl={originalImage?.url} />
          </div>
          
          {originalImage && (
            <>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-cyan-400">Step 2: Choose Your Style</h2>
              <StyleSelector styles={styles} selectedStyleId={selectedStyle?.id} onSelectStyle={handleStyleSelect} />
            </>
          )}

          <div className="mt-auto pt-6 flex space-x-4">
            <button
              onClick={handleGenerateClick}
              disabled={!originalImage || !selectedStyle || isLoading}
              className="flex-1 bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 shadow-lg"
            >
              {isLoading ? 'Generating...' : 'Generate Headshot'}
            </button>
            {originalImage && (
              <button
                onClick={handleReset}
                className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 shadow-lg"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Your Professional Headshot</h2>
            <ResultDisplay isLoading={isLoading} error={error} generatedImage={generatedImage} />
        </div>
      </main>
    </div>
  );
};

export default App;
