import React from "react";
import { ShoppingCart } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  selectedIndex: number;
  productName: string;
  onImageSelect: (index: number) => void;
  imageFade: boolean;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  selectedIndex,
  productName,
  onImageSelect,
  imageFade,
}) => {
  const mainImage = images[selectedIndex] || images[0] || "";

  return (
    <div className="mb-8 lg:mb-8">
      <div className="bg-white rounded-2xl overflow-hidden mb-4 relative">
        <style>{`
          @media (min-width: 768px) {
            .product-image-container {
              min-height: 400px !important;
              max-height: 600px !important;
            }
          }
        `}</style>
        {/* Desktop: main image left, vertical gallery on the right */}
        <div className="flex flex-col md:flex-row gap-4 p-4">
          <div
            className="product-image-container flex-1 relative rounded-xl overflow-hidden bg-gray-50"
            style={{
              aspectRatio: "1",
              minHeight: "250px",
              maxHeight: "450px",
            }}
          >
            {mainImage ? (
              <img
                src={mainImage}
                alt={productName}
                className="w-full h-full object-cover"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: imageFade ? 1 : 0,
                  transition: "opacity 0.3s ease-in-out",
                }}
                key={selectedIndex}
              />
            ) : (
              <div
                className="h-full bg-gray-100 flex items-center justify-center"
                style={{ minHeight: "250px" }}
              >
                <ShoppingCart className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Desktop thumbnails stacked on the right */}
          {images.length > 1 && (
            <div className="hidden md:flex flex-col gap-2 w-24">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => onImageSelect(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedIndex === idx
                      ? "border-brand-green"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${productName} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile thumbnails: smaller and horizontally scrollable without affecting the whole page */}
      {images.length > 1 && (
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => onImageSelect(idx)}
                className={`min-w-[4.5rem] min-h-[4.5rem] max-w-[4.5rem] max-h-[4.5rem] rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                  selectedIndex === idx
                    ? "border-brand-green"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={img}
                  alt={`${productName} view ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;

