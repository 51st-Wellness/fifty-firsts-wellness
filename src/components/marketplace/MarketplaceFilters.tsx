import React from "react";
import { ChevronDown } from "lucide-react";

interface PriceInput {
  inputMode: "numeric" | "text" | "decimal";
  displayValue: string;
  handleChange: (value: string) => void;
  handleBlur: () => void;
}

interface MarketplaceFiltersProps {
  // Price filter
  minPrice: number;
  maxPrice: number;
  minPriceInput: PriceInput;
  maxPriceInput: PriceInput;
  onMinPriceClear: () => void;
  onMaxPriceClear: () => void;
  onPriceApply: () => void;

  // Rating filter
  selectedRating: string;
  onRatingChange: (rating: string) => void;
  onRatingClear: () => void;
  onRatingApply: () => void;

  // Mobile modals
  priceDropdownOpen: boolean;
  ratingDropdownOpen: boolean;
  onPriceDropdownClose: () => void;
  onRatingDropdownClose: () => void;
  onPriceDropdownOpen: () => void;
  onRatingDropdownOpen: () => void;
}

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  minPrice,
  maxPrice,
  minPriceInput,
  maxPriceInput,
  onMinPriceClear,
  onMaxPriceClear,
  onPriceApply,
  selectedRating,
  onRatingChange,
  onRatingClear,
  onRatingApply,
  priceDropdownOpen,
  ratingDropdownOpen,
  onPriceDropdownClose,
  onRatingDropdownClose,
  onPriceDropdownOpen,
  onRatingDropdownOpen,
}) => {
  const ratingOptions = [
    { value: "4+", label: "& Above", stars: 4 },
    { value: "3+", label: "& Above", stars: 3 },
    { value: "2+", label: "& Above", stars: 2 },
    { value: "1+", label: "& Above", stars: 1 },
  ];

  const PriceRangeSection = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onMinPriceClear();
              onMaxPriceClear();
            }}
            className="px-2 py-1.5 rounded-full border border-brand-green text-brand-green text-xs hover:bg-brand-green/5 transition-colors"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Clear
          </button>
          <button
            onClick={onPriceApply}
            className="px-2 py-1.5 rounded-full border border-brand-green text-brand-green text-xs hover:bg-brand-green/5 transition-colors"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Apply
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-2xl p-3">
          <div className="text-xs text-gray-600 mb-1">Minimum Price</div>
          <input
            type="text"
            inputMode={minPriceInput.inputMode}
            value={minPriceInput.displayValue}
            onChange={(e) => minPriceInput.handleChange(e.target.value)}
            onBlur={minPriceInput.handleBlur}
            placeholder="0"
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
          />
        </div>
        <div className="bg-gray-50 rounded-2xl p-3">
          <div className="text-xs text-gray-600 mb-1">Maximum Price</div>
          <input
            type="text"
            inputMode={maxPriceInput.inputMode}
            value={maxPriceInput.displayValue}
            onChange={(e) => maxPriceInput.handleChange(e.target.value)}
            onBlur={maxPriceInput.handleBlur}
            placeholder="0"
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
          />
        </div>
      </div>
    </div>
  );

  const RatingSection = () => (
    <div className="pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Product Rating
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onRatingClear}
            className="px-2 py-1.5 rounded-full border border-brand-green text-brand-green text-xs hover:bg-brand-green/5 transition-colors"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Clear
          </button>
          <button
            onClick={onRatingApply}
            className="px-2 py-1.5 rounded-full border border-brand-green text-brand-green text-xs hover:bg-brand-green/5 transition-colors"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Apply
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {ratingOptions.map((rating) => (
          <label
            key={rating.value}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="radio"
              name="rating"
              value={rating.value}
              checked={selectedRating === rating.value}
              onChange={(e) => onRatingChange(e.target.value)}
              className="w-5 h-5 text-brand-green accent-brand-green cursor-pointer"
            />
            <div className="flex items-center">
              {[...Array(rating.stars)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 fill-[#FFA500]"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              {[...Array(5 - rating.stars)].map((_, i) => (
                <svg
                  key={`empty-${i}`}
                  className="w-4 h-4 fill-gray-200"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <span className="text-sm text-gray-700 ml-1">{rating.label}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Buttons */}
      <div className="mt-4 flex gap-2 md:hidden">
        <button
          onClick={onPriceDropdownOpen}
          className="px-4 py-2 rounded-full border border-brand-green text-brand-green text-sm hover:bg-brand-green/5 transition-colors flex items-center gap-2"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Price Range
          <ChevronDown className="w-4 h-4" />
        </button>

        <button
          onClick={onRatingDropdownOpen}
          className="px-4 py-2 rounded-full border border-brand-green text-brand-green text-sm hover:bg-brand-green/5 transition-colors flex items-center gap-2"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Product Rating
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop Filters Sidebar */}
      <div className="hidden lg:block lg:col-span-1">
        <div className="sticky top-20">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
            <PriceRangeSection />
            <RatingSection />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet Modal - Price Range */}
      {priceDropdownOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onPriceDropdownClose}
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slide-up">
            {/* Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-lg font-semibold text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Price Range
              </h3>
              <button
                onClick={onPriceDropdownClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-3">
                <div className="text-xs text-gray-600 mb-1">Minimum Price</div>
                <input
                  type="text"
                  inputMode={minPriceInput.inputMode}
                  value={minPriceInput.displayValue}
                  onChange={(e) => minPriceInput.handleChange(e.target.value)}
                  onBlur={minPriceInput.handleBlur}
                  placeholder="0"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                />
              </div>
              <div className="bg-gray-50 rounded-2xl p-3">
                <div className="text-xs text-gray-600 mb-1">Maximum Price</div>
                <input
                  type="text"
                  inputMode={maxPriceInput.inputMode}
                  value={maxPriceInput.displayValue}
                  onChange={(e) => maxPriceInput.handleChange(e.target.value)}
                  onBlur={maxPriceInput.handleBlur}
                  placeholder="0"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    onMinPriceClear();
                    onMaxPriceClear();
                    onPriceDropdownClose();
                  }}
                  className="flex-1 px-4 py-3 rounded-full border border-brand-green text-brand-green text-sm hover:bg-brand-green/5 transition-colors"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    onPriceApply();
                    onPriceDropdownClose();
                  }}
                  className="flex-1 px-4 py-3 rounded-full border border-brand-green text-brand-green text-sm hover:bg-brand-green/5 transition-colors"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet Modal - Product Rating */}
      {ratingDropdownOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onRatingDropdownClose}
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slide-up">
            {/* Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-lg font-semibold text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Product Rating
              </h3>
              <button
                onClick={onRatingDropdownClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {ratingOptions.map((rating) => (
                <label
                  key={rating.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="rating-mobile"
                    value={rating.value}
                    checked={selectedRating === rating.value}
                    onChange={(e) => onRatingChange(e.target.value)}
                    className="w-5 h-5 text-brand-green accent-brand-green cursor-pointer"
                  />
                  <div className="flex items-center">
                    {[...Array(rating.stars)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 fill-[#FFA500]"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    {[...Array(5 - rating.stars)].map((_, i) => (
                      <svg
                        key={`empty-${i}`}
                        className="w-4 h-4 fill-gray-200"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-700 ml-1">
                      {rating.label}
                    </span>
                  </div>
                </label>
              ))}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    onRatingClear();
                    onRatingDropdownClose();
                  }}
                  className="flex-1 px-4 py-3 rounded-full border border-brand-green text-brand-green text-sm hover:bg-brand-green/5 transition-colors"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    onRatingApply();
                    onRatingDropdownClose();
                  }}
                  className="flex-1 px-4 py-3 rounded-full border border-brand-green text-brand-green text-sm hover:bg-brand-green/5 transition-colors"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketplaceFilters;
