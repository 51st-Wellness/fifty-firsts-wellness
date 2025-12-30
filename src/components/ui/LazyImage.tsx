import React, { useState, useEffect, useRef, ImgHTMLAttributes } from "react";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  blurDataURL?: string;
  threshold?: number;
  rootMargin?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  blurDataURL,
  threshold = 0.1,
  rootMargin = "50px",
  className = "",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // If browser supports native lazy loading, use it
    if ("loading" in HTMLImageElement.prototype) {
      setIsInView(true);
      return;
    }

    // Fallback to Intersection Observer
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const shouldLoad = isInView || "loading" in HTMLImageElement.prototype;
  const displaySrc = shouldLoad ? src : placeholder || blurDataURL || "";
  const showBlur = isInView && !isLoaded && blurDataURL;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ minHeight: props.height ? `${props.height}px` : "auto" }}>
      {showBlur && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      <img
        ref={imgRef}
        src={displaySrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading={shouldLoad ? "lazy" : "eager"}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${showBlur ? "relative z-10" : ""} ${className}`}
        {...props}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
