import React, { useCallback } from 'react';
import type { ImageData } from '../App';

interface ImageUploaderProps {
  onImageUpload: (imageData: ImageData) => void;
  originalImageUrl: string | null | undefined;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, originalImageUrl }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fullDataUrl = e.target?.result as string;
        if (fullDataUrl) {
            const [header, b64] = fullDataUrl.split(',');
            const mimeTypeMatch = header.match(/:(.*?);/);
            if(mimeTypeMatch && mimeTypeMatch[1] && b64) {
                onImageUpload({ b64, mimeType: mimeTypeMatch[1], url: fullDataUrl });
            } else {
                console.error("Could not parse image data URL");
            }
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

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
        className="cursor-pointer w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg p-4 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
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
    </div>
  );
};

export default ImageUploader;
