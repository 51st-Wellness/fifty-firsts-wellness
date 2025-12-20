import React from "react";
import { Search } from "lucide-react";

interface MarketplaceHeaderProps {
  title: string;
  description: string;
  globalDiscountActive: boolean;
  globalDiscount?: {
    label?: string;
    type?: string;
    value?: number;
  } | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formatCurrency: (value: number, currency?: string) => string;
}

const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  title,
  description,
  globalDiscountActive,
  globalDiscount,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  formatCurrency,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-12 lg:py-16">
      <div className="mb-6">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-3"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          {title}
        </h1>
          <p className="text-sm sm:text-base text-[#475464] leading-relaxed max-w-3xl">
            {description}
          </p>

          {globalDiscountActive && (
            <div className="mt-4 inline-flex flex-col gap-1 rounded-2xl border border-brand-green/40 bg-white px-4 py-3 text-sm text-brand-green shadow-sm">
              <span className="font-semibold">
                {globalDiscount?.label || "Storewide savings"}
              </span>
              <span className="text-[#475464] text-xs">
                Save{" "}
                {globalDiscount?.type === "PERCENTAGE"
                  ? `${globalDiscount.value}%`
                  : formatCurrency(globalDiscount?.value || 0)}{" "}
                on every marketplace item while this offer lasts.
              </span>
            </div>
          )}

          {/* Search Bar */}
          <div className="mt-6 max-w-xl">
            <form
              onSubmit={onSearchSubmit}
              className="flex items-center bg-white rounded-xl overflow-hidden focus-within:border-brand-green transition-colors"
            >
              <div className="pl-4 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="What product are you looking for?"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 px-3 py-3 text-base focus:outline-none bg-white"
              />
            </form>
          </div>
        </div>
    </div>
  );
};

export default MarketplaceHeader;

