import { useState, useEffect } from 'react';
import { SafeImage } from '../common/SafeImage';
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageResolver';

interface FoodImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function FoodImage({ src, alt, className = '', priority = false }: FoodImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const resolvedSrc = resolveImageUrl(src, DEFAULT_FALLBACK_IMAGE);
  const finalSrc = hasError ? DEFAULT_FALLBACK_IMAGE : resolvedSrc;

  useEffect(() => {
    setHasError(false);
  }, [src]);

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


