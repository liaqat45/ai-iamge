
import React from 'react';
import { GeneratedImage } from '../types';
import { DownloadIcon } from './Icons';

interface ImageCardProps {
  image: GeneratedImage;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    // Sanitize prompt for filename
    const fileName = image.prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `ai-image-${fileName}-${image.id}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group relative bg-brand-dark-secondary rounded-lg overflow-hidden shadow-lg border border-gray-700 transition-transform duration-300 hover:scale-105">
      <img src={image.url} alt={image.prompt} className="w-full h-auto object-cover aspect-square" />
      <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <p className="text-white text-sm mb-4 line-clamp-3">{image.prompt}</p>
        <button
          onClick={handleDownload}
          className="bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 self-start transition-colors duration-200"
        >
          <DownloadIcon />
          Download
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
