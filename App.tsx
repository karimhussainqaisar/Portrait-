import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './StyleSelector';
import DressSelector from './components/DressSelector';
import BackgroundSelector from './components/BackgroundSelector';
import ResultDisplay from './components/ResultDisplay';
import { generateHeadshot } from './geminiService';
import Header from './components/Header';
import HowItWorks from './components/HowItWorks';
import HeroCarousel from './components/HeroCarousel';

export interface ImageData {
  b64: string;
  mimeType: string;
  url: string;
}

export interface Style {
  id: string;
  name: string;
  promptTemplate: string;
  thumbnail: string;
  defaultBackgroundId: string;
  defaultDressStyleId: string;
}

export interface DressStyle {
  id: string;
  name: string;
  prompt: string;
  thumbnail: string;
}

export interface Background {
  id: string;
  name: string;
  prompt: string;
  thumbnail: string;
}

const dressStyles: DressStyle[] = [
  {
    id: 'dark-suit',
    name: 'Dark Suit',
    prompt: 'The subject should be wearing a sharp, dark business suit or blazer with a light-colored dress shirt.',
    thumbnail: 'https://picsum.photos/seed/darksuit/200'
  },
  {
    id: 'light-suit',
    name: 'Light Suit',
    prompt: 'The subject should be wearing a professional light-colored (e.g., grey, beige) business suit with a dress shirt.',
    thumbnail: 'https://picsum.photos/seed/lightsuit/200'
  },
  {
    id: 'smart-casual',
    name: 'Smart Casual',
    prompt: 'The subject should be wearing smart-casual business attire, such as a collared shirt, a polo shirt, or a sweater.',
    thumbnail: 'https://picsum.photos/seed/smartcasual/200'
  },
  {
    id: 'blouse',
    name: 'Blouse/Dress Shirt',
    prompt: 'The subject should be wearing a professional and elegant blouse or a simple, crisp dress shirt.',
    thumbnail: 'https://picsum.photos/seed/blouse/200'
  },
  {
    id: 'turtleneck',
    name: 'Turtleneck',
    prompt: 'The subject should be wearing a stylish turtleneck sweater.',
    thumbnail: 'https://picsum.photos/seed/turtleneck/200'
  },
  {
    id: 'tweed-jacket',
    name: 'Tweed Jacket',
    prompt: 'The subject should be wearing a classic tweed jacket, conveying a scholarly or intellectual look.',
    thumbnail: 'https://picsum.photos/seed/tweedjacket/200'
  },
  {
    id: 'lab-coat',
    name: 'Lab Coat/Scrubs',
    prompt: 'The subject should be wearing professional healthcare attire, like a lab coat over a shirt or medical scrubs.',
    thumbnail: 'https://picsum.photos/seed/labcoat/200'
  },
  {
    id: 'denim-apron',
    name: 'Artisan Wear',
    prompt: 'The subject should be wearing practical, stylish work clothes like a denim shirt or an apron.',
    thumbnail: 'https://picsum.photos/seed/apron/200'
  },
  {
    id: 't-shirt',
    name: 'T-shirt',
    prompt: 'The subject should be wearing a simple, high-quality plain t-shirt (e.g., black, white, or grey).',
    thumbnail: 'https://picsum.photos/seed/tshirt/200'
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    prompt: 'The subject should be wearing a comfortable and stylish hoodie.',
    thumbnail: 'https://picsum.photos/seed/hoodie/200'
  },
  {
    id: 'flannel-shirt',
    name: 'Flannel Shirt',
    prompt: 'The subject should be wearing a classic flannel shirt, giving a relaxed and friendly vibe.',
    thumbnail: 'https://picsum.photos/seed/flannel/200'
  },
  {
    id: 'leather-jacket',
    name: 'Leather Jacket',
    prompt: 'The subject should be wearing a cool leather jacket over a simple shirt.',
    thumbnail: 'https://picsum.photos/seed/leatherjacket/200'
  },
  {
    id: 'denim-jacket',
    name: 'Denim Jacket',
    prompt: 'The subject should be wearing a classic denim jacket for a casual and timeless look.',
    thumbnail: 'https://picsum.photos/seed/denimjacket/200'
  },
];

const backgrounds: Background[] = [
  {
    id: 'solid-grey',
    name: 'Solid Grey',
    prompt: 'The background should be a solid, neutral-grey, studio-quality backdrop.',
    thumbnail: 'https://i.imgur.com/gEvsp2j.png'
  },
  {
    id: 'office-blur',
    name: 'Office Blur',
    prompt: 'The background should be a modern, slightly blurred office environment with elements like glass walls, soft lighting, and perhaps a touch of green from a plant.',
    thumbnail: 'https://i.imgur.com/L8f9AgQ.png'
  },
  {
    id: 'outdoor-blur',
    name: 'Outdoor Blur',
    prompt: 'The background should be a pleasant, out-of-focus natural setting, like a park or modern urban architecture, with soft, natural daylight.',
    thumbnail: 'https://i.imgur.com/gK223OR.png'
  },
  {
    id: 'dark-texture',
    name: 'Dark Texture',
    prompt: 'The background should be a simple dark or grey texture.',
    thumbnail: 'https://i.imgur.com/yv92Ifl.png'
  },
  {
    id: 'library-blur',
    name: 'Library Blur',
    prompt: 'The background should be a warm, softly-lit library or study, with bookshelves filled with books visible but blurred.',
    thumbnail: 'https://i.imgur.com/eBf2sH3.png'
  },
  {
    id: 'vibrant-color',
    name: 'Vibrant Color',
    prompt: 'The background should be a solid, vibrant color like teal, mustard yellow, or deep blue, creating a bold and energetic feel.',
    thumbnail: 'https://i.imgur.com/yLg6X39.png'
  },
  {
    id: 'brick-wall',
    name: 'Brick Wall',
    prompt: 'The background should be a textured brick wall (red or brown), slightly out of focus.',
    thumbnail: 'https://i.imgur.com/wPBRzZm.png'
  },
  {
    id: 'geometric-pattern',
    name: 'Geometric Pattern',
    prompt: 'The background should be a subtle and professional geometric pattern, using a muted color palette.',
    thumbnail: 'https://i.imgur.com/sXlKiMa.png'
  },
  {
    id: 'golden-gate-blur',
    name: 'Golden Gate Blur',
    prompt: 'The background should feature the iconic Golden Gate Bridge, artistically blurred with beautiful bokeh, suggesting a location in San Francisco.',
    thumbnail: 'https://i.imgur.com/O6P5u7S.png',
  },
  {
    id: 'eiffel-tower-blur',
    name: 'Eiffel Tower Blur',
    prompt: 'The background should be an artistic, out-of-focus view of the Eiffel Tower in Paris, creating a sophisticated and worldly atmosphere.',
    thumbnail: 'https://i.imgur.com/yNqfW8b.png',
  },
  {
    id: 'art-gallery-blur',
    name: 'Art Gallery Blur',
    prompt: 'The background should be a modern art gallery with large, abstract paintings, clean white walls, and track lighting, all softly blurred.',
    thumbnail: 'https://i.imgur.com/mJz0JzH.png',
  },
  {
    id: 'coffee-shop-blur',
    name: 'Coffee Shop Blur',
    prompt: 'The background is a cozy, modern coffee shop with warm lighting, wood accents, and blurred patrons, giving a relaxed and creative vibe.',
    thumbnail: 'https://i.imgur.com/lZ2xY7c.png',
  },
  {
    id: 'mountain-blur',
    name: 'Mountain Blur',
    prompt: 'The background should be a majestic mountain range at sunrise or sunset, with soft, golden light and a beautifully blurred landscape, suggesting adventure and vision.',
    thumbnail: 'https://i.imgur.com/9v6Zz4A.png',
  },
  {
    id: 'coastline-blur',
    name: 'Coastline Blur',
    prompt: 'The background should be a serene coastline with waves gently breaking, the horizon softly blurred, creating a calm and expansive feel.',
    thumbnail: 'https://i.imgur.com/pB3gX7q.png',
  },
  {
    id: 'industrial-loft-blur',
    name: 'Industrial Loft Blur',
    prompt: 'The background should be a stylish industrial loft with exposed brick, large windows, and metal pipes, all tastefully blurred for a modern, edgy look.',
    thumbnail: 'https://i.imgur.com/7g6z3Jt.png',
  },
  {
    id: 'coworking-blur',
    name: 'Co-working Blur',
    prompt: 'The background should be a vibrant, modern co-working space with collaborative areas, plants, and good lighting, all blurred to suggest innovation and community.',
    thumbnail: 'https://i.imgur.com/rD9tB2j.png',
  },
  {
    id: 'city-skyline-blur',
    name: 'City Skyline Blur',
    prompt: 'The background is a glittering city skyline at night, with beautiful bokeh from the city lights, conveying ambition and sophistication.',
    thumbnail: 'https://i.imgur.com/Zz9W4kM.png',
  },
  {
    id: 'wood-panel-wall',
    name: 'Wood Panel Wall',
    prompt: 'The background should be a warm, textured wall made of vertical wooden panels or slats, providing a clean yet organic and modern feel.',
    thumbnail: 'https://i.imgur.com/fJ7eD4z.png',
  },
];

const styles: Style[] = [
  {
    id: 'corporate',
    name: 'Corporate',
    promptTemplate: 'Transform this selfie into a professional corporate headshot. {dress_style} {background} The lighting should be soft and flattering, typical of professional photography. Maintain the person\'s facial features and identity, but enhance the overall quality to a professional standard.',
    thumbnail: 'https://picsum.photos/seed/corporate/200',
    defaultBackgroundId: 'solid-grey',
    defaultDressStyleId: 'dark-suit',
  },
  {
    id: 'tech',
    name: 'Tech',
    promptTemplate: 'Transform this selfie into a professional headshot suitable for a tech company. {dress_style} {background} The overall feel should be approachable yet professional. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/tech/200',
    defaultBackgroundId: 'office-blur',
    defaultDressStyleId: 'smart-casual',
  },
  {
    id: 'outdoor',
    name: 'Natural',
    promptTemplate: 'Transform this selfie into a friendly and professional outdoor headshot. {dress_style} {background} The mood should be warm and engaging. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/outdoor/200',
    defaultBackgroundId: 'outdoor-blur',
    defaultDressStyleId: 'smart-casual',
  },
  {
    id: 'classic-bw',
    name: 'Black & White',
    promptTemplate: 'Transform this selfie into a classic, powerful black and white professional headshot. {dress_style} {background} The lighting should be dramatic and high-contrast (chiaroscuro), creating a timeless and confident look. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/bw/200',
    defaultBackgroundId: 'dark-texture',
    defaultDressStyleId: 'dark-suit',
  },
  {
    id: 'academic',
    name: 'Scholarly',
    promptTemplate: 'Transform this selfie into a professional headshot for an academic or author. {dress_style} {background} The lighting should be thoughtful and slightly dramatic. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/library/200',
    defaultBackgroundId: 'library-blur',
    defaultDressStyleId: 'tweed-jacket',
  },
  {
    id: 'creative',
    name: 'Creative',
    promptTemplate: 'Transform this selfie into a dynamic headshot for a creative professional. {dress_style} {background} The lighting should be bright and even. Maintain the person\'s facial features and identity while giving the photo a contemporary, creative agency look.',
    thumbnail: 'https://picsum.photos/seed/creative/200',
    defaultBackgroundId: 'vibrant-color',
    defaultDressStyleId: 'turtleneck',
  },
  {
    id: 'urban',
    name: 'Urban',
    promptTemplate: 'Transform this selfie into a modern, confident headshot with an urban feel. {dress_style} {background} The lighting should appear natural, as if from a nearby window or open space, creating a relaxed yet professional atmosphere. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/urban/200',
    defaultBackgroundId: 'brick-wall',
    defaultDressStyleId: 'smart-casual',
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    promptTemplate: 'Convert this selfie into a dramatic, high-impact headshot. {dress_style} {background} The lighting should be high-contrast and moody, creating strong shadows and highlights, similar to cinematic character posters. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/dramatic/200',
    defaultBackgroundId: 'dark-texture',
    defaultDressStyleId: 'turtleneck'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    promptTemplate: 'Transform this selfie into a clean, minimalist professional headshot. {dress_style} {background} The lighting should be soft, even, and bright. The overall aesthetic should be uncluttered and sophisticated. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/minimalist/200',
    defaultBackgroundId: 'solid-grey',
    defaultDressStyleId: 'blouse'
  },
  {
    id: 'warm-approachable',
    name: 'Warm & Approachable',
    promptTemplate: 'Create a warm, friendly, and approachable professional headshot from this selfie. {dress_style} {background} The lighting should be soft and warm, like natural morning light. The expression should be genuine and welcoming. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/warm/200',
    defaultBackgroundId: 'library-blur',
    defaultDressStyleId: 'smart-casual'
  },
  {
    id: 'executive',
    name: 'Executive',
    promptTemplate: 'Transform this selfie into a powerful and confident executive headshot. {dress_style} {background} The lighting should be professional and polished, conveying authority and leadership. The posture and expression should be strong and assured. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/executive/200',
    defaultBackgroundId: 'office-blur',
    defaultDressStyleId: 'dark-suit'
  },
  {
    id: 'healthcare',
    name: 'Healthcare Pro',
    promptTemplate: 'Generate a professional headshot suitable for a healthcare professional from this selfie. {dress_style} {background} The lighting should be clean and bright, conveying trustworthiness and expertise. The expression should be reassuring and competent. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/healthcare/200',
    defaultBackgroundId: 'solid-grey',
    defaultDressStyleId: 'lab-coat'
  },
  {
    id: 'artisan',
    name: 'Artisan',
    promptTemplate: 'Create an authentic, character-rich headshot for an artisan or craftsperson. {dress_style} {background} The lighting should be natural and slightly rustic, highlighting textures. The feel should be genuine and skilled. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/artisan/200',
    defaultBackgroundId: 'brick-wall',
    defaultDressStyleId: 'denim-apron'
  },
  {
    id: 'financial',
    name: 'Financial Advisor',
    promptTemplate: 'Transform this selfie into a headshot for a financial professional. {dress_style} {background} The setting should look professional and trustworthy. The lighting should be clean and direct, conveying stability and confidence. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/financial/200',
    defaultBackgroundId: 'office-blur',
    defaultDressStyleId: 'light-suit'
  },
  {
    id: 'futuristic',
    name: 'Futuristic',
    promptTemplate: 'Generate a futuristic, high-tech style headshot. {dress_style} {background} The lighting should incorporate subtle neon or holographic accents against a dark, clean setting, creating a forward-thinking and innovative mood. Maintain the person\'s facial features and identity.',
    thumbnail: 'https://picsum.photos/seed/futuristic/200',
    defaultBackgroundId: 'geometric-pattern',
    defaultDressStyleId: 'turtleneck'
  }
];


const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [selectedDressStyle, setSelectedDressStyle] = useState<DressStyle | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<Background | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((imageData: ImageData) => {
    setOriginalImage(imageData);
    setGeneratedImage(null);
    setError(null);
  }, []);

  const handleStyleSelect = (styleId: string) => {
    const style = styles.find(s => s.id === styleId);
    setSelectedStyle(style || null);
     if (style) {
        const defaultBg = backgrounds.find(b => b.id === style.defaultBackgroundId);
        setSelectedBackground(defaultBg || backgrounds[0] || null);
        const defaultDress = dressStyles.find(d => d.id === style.defaultDressStyleId);
        setSelectedDressStyle(defaultDress || dressStyles[0] || null);
    } else {
        setSelectedBackground(null);
        setSelectedDressStyle(null);
    }
  };

  const handleDressStyleSelect = (dressStyleId: string) => {
    const dress = dressStyles.find(d => d.id === dressStyleId);
    setSelectedDressStyle(dress || null);
  }
  
  const handleBackgroundSelect = (backgroundId: string) => {
    const bg = backgrounds.find(b => b.id === backgroundId);
    setSelectedBackground(bg || null);
  }

  const handleReset = () => {
    setOriginalImage(null);
    setSelectedStyle(null);
    setSelectedDressStyle(null);
    setSelectedBackground(null);
    setGeneratedImage(null);
    setIsLoading(false);
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!originalImage || !selectedStyle || !selectedDressStyle || !selectedBackground) {
      setError("Please upload an image and select a style, dress style, and background.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const promptWithDressStyle = selectedStyle.promptTemplate.replace('{dress_style}', selectedDressStyle.prompt);
      const finalPrompt = promptWithDressStyle.replace('{background}', selectedBackground.prompt);
      const resultB64 = await generateHeadshot(originalImage.b64, originalImage.mimeType, finalPrompt);
      setGeneratedImage(`data:image/jpeg;base64,${resultB64}`);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, selectedStyle, selectedDressStyle, selectedBackground]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <Header />
      
      <div className="w-full max-w-6xl text-center mx-auto px-4 pt-24 pb-12">
        <HeroCarousel />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mt-8">AI Headshot Photographer</h1>
        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">Upload a casual selfie, choose a professional style, and let AI generate your new headshot in seconds.</p>
      </div>
      
      <HowItWorks />

      <main className="w-full max-w-6xl flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700 flex flex-col space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Step 1: Upload Your Photo</h2>
            <ImageUploader onImageUpload={handleImageUpload} originalImageUrl={originalImage?.url} />
          </div>
          
          {originalImage && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Step 2: Choose Your Style</h2>
              <StyleSelector styles={styles} selectedStyleId={selectedStyle?.id} onSelectStyle={handleStyleSelect} />
            </div>
          )}
          
          {selectedStyle && (
            <>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Step 3: Choose Dress Style</h2>
                <DressSelector dressStyles={dressStyles} selectedDressStyleId={selectedDressStyle?.id} onSelectDressStyle={handleDressStyleSelect} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Step 4: Choose a Background</h2>
                <BackgroundSelector backgrounds={backgrounds} selectedBackgroundId={selectedBackground?.id} onSelectBackground={handleBackgroundSelect} />
              </div>
            </>
          )}

          <div className="!mt-auto pt-6 flex space-x-4">
            <button
              onClick={handleGenerateClick}
              disabled={!originalImage || !selectedStyle || !selectedDressStyle || !selectedBackground || isLoading}
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
      
      <footer className="w-full text-center p-8 text-gray-500">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
