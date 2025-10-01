import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = React.memo(({
  src,
  alt,
  className,
  placeholder = '/assets/images/placeholder.webp',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imageClasses = cn(
    'lazy-image',
    isLoaded && 'lazy-image--loaded',
    hasError && 'lazy-image--error',
    className
  );

  return (
    <div ref={imgRef} className={imageClasses}>
      {isInView && (
        <img
          src={hasError ? placeholder : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          className="lazy-image__img"
        />
      )}
      {!isLoaded && !hasError && (
        <div className="lazy-image__placeholder">
          <div className="lazy-image__spinner"></div>
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

