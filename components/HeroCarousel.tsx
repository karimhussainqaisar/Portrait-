import React, { useState, useEffect } from 'react';

const images = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286de2?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1610624921695-535af1797548?q=80&w=1400&auto=format&fit=crop"
];

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-2xl mx-auto overflow-hidden rounded-2xl shadow-2xl border border-gray-700">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Example headshot ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'w-4 bg-cyan-400' : 'bg-gray-500/50'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;