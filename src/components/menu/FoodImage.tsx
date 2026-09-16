import { useState } from 'react';
import { SafeImage } from '../common/SafeImage';

interface FoodImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function FoodImage({ src, alt, className = '', priority = false }: FoodImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const finalSrc = !src || src.trim() === '' || hasError ? '/default-fallback_image.webp' : src;

  return (
    <div className={`relative overflow-hidden bg-[#18181C] ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#222228] animate-pulse" />
      )}

      <SafeImage
        src={finalSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

