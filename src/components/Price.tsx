import React from "react";

interface PriceProps {
  price: number;
  oldPrice?: number;
  className?: string;
  priceClassName?: string;
  oldPriceClassName?: string;
  badgeClassName?: string;
}

const Price: React.FC<PriceProps> = ({
  price,
  oldPrice,
  className = "",
  priceClassName,
  oldPriceClassName,
  badgeClassName,
}) => {
  const hasDiscount = typeof oldPrice === "number" && oldPrice > price;
  const percent = hasDiscount && oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const basePriceClass = "text-2xl font-semibold";
  const baseOldPriceClass = "text-gray-500 line-through";
  const baseBadgeClass = "text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded";

  const mergedPriceClass = priceClassName
    ? `${basePriceClass} ${priceClassName}`
    : basePriceClass;
  const mergedOldPriceClass = oldPriceClassName
    ? `${baseOldPriceClass} ${oldPriceClassName}`
    : baseOldPriceClass;
  const mergedBadgeClass = badgeClassName
    ? `${baseBadgeClass} ${badgeClassName}`
    : baseBadgeClass;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={mergedPriceClass}>£{price.toFixed(2)}</span>
      {hasDiscount && (
        <>
          <span className={mergedOldPriceClass}>£{oldPrice!.toFixed(2)}</span>
          <span className={mergedBadgeClass}>-{percent}%</span>
        </>
      )}
    </div>
  );
};

export default Price;


