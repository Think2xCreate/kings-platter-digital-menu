import React, { useState, useEffect } from 'react';
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageResolver';

export const FALLBACK_IMAGE = DEFAULT_FALLBACK_IMAGE;

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
}

export function SafeImage({ src, alt, fallbackSrc = DEFAULT_FALLBACK_IMAGE, className, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => resolveImageUrl(src, fallbackSrc));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(resolveImageUrl(src, fallbackSrc));
    setHasError(false);
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

