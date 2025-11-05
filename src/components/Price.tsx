import React from "react";

interface PriceProps {
  price: number;
  oldPrice?: number;
  className?: string;
}

const Price: React.FC<PriceProps> = ({ price, oldPrice, className = "" }) => {
  const hasDiscount = typeof oldPrice === "number" && oldPrice > price;
  const percent = hasDiscount && oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-2xl font-semibold">£{price.toFixed(2)}</span>
      {hasDiscount && (
        <>
          <span className="text-gray-500 line-through">£{oldPrice!.toFixed(2)}</span>
          <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">-{percent}%</span>
        </>
      )}
    </div>
  );
};

export default Price;


