import { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt, className, placeholder = null }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      {!isLoaded && placeholder && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}>
          {placeholder}
        </div>
      )}
      {hasError && (
        <div className={`absolute inset-0 bg-gray-300 flex items-center justify-center ${className}`}>
          <span className="text-gray-500 text-sm">Failed to load</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
