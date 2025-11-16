import React, { useCallback, useState, useEffect } from 'react';
import type { ImageData } from '../App';

interface ImageUploaderProps {
  onImageUpload: (imageData: ImageData) => void;
  originalImageUrl: string | null | undefined;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, originalImageUrl }) => {
  const [quality, setQuality] = useState(75);
  const [originalDataUrl, setOriginalDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!originalDataUrl) return;

    const processImage = () => {
      const img = new Image();
      img.src = originalDataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIMENSION = 1024;
        
        let { width, height } = img;
        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
          const [, b64] = compressedDataUrl.split(',');
          if (b64) {
            onImageUpload({ b64, mimeType: 'image/jpeg', url: compressedDataUrl });
          } else {
            console.error("Could not create compressed image data URL");
          }
        }
      };
      img.onerror = () => {
        console.error("Failed to load image for processing.");
      }
    };

    processImage();
  }, [originalDataUrl, quality, onImageUpload]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fullDataUrl = e.target?.result as string;
        if (fullDataUrl) {
            setOriginalDataUrl(fullDataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return (
    <div className="w-full h-full">
      <input
        type="file"
        id="imageUpload"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor="imageUpload"
        className="cursor-pointer w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg p-4 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
      >
        {originalImageUrl ? (
          <img src={originalImageUrl} alt="Uploaded selfie" className="max-h-80 w-auto object-contain rounded-md" />
        ) : (
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm font-medium">Click to upload a selfie</p>
            <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
          </div>
        )}
      </label>
       {originalImageUrl && (
        <div className="mt-4">
          <label htmlFor="qualitySlider" className="flex justify-between items-center text-sm font-medium text-gray-300 mb-1">
            <span>Image Quality</span>
            <span className="font-bold text-cyan-400">{quality}%</span>
          </label>
          <input
            id="qualitySlider"
            type="range"
            min="10"
            max="100"
            step="1"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            aria-label="Image quality slider"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
