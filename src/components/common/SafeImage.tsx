import React, { useState, useEffect } from 'react';

export const FALLBACK_IMAGE = '/default-fallback_image.webp';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
}

export function SafeImage({ src, alt, fallbackSrc = FALLBACK_IMAGE, className, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (!src || src.trim() === '' || src.includes('unsplash.com')) {
      return fallbackSrc;
    }
    return src;
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src || src.trim() === '' || src.includes('unsplash.com')) {
      setImgSrc(fallbackSrc);
      setHasError(false);
    } else {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src, fallbackSrc]);

  return (
    <img
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
      {...props}
    />
  );
}
