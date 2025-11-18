import type { StoreItem, DiscountType } from "../types/marketplace.types";

const clampCurrency = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const parseDateValue = (value?: string | Date | null): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const isProductDiscountActive = (
  item: Pick<
    StoreItem,
    "discountActive" | "discountStart" | "discountEnd" | "discountType"
  >,
  now: Date = new Date()
): boolean => {
  if (!item.discountActive || item.discountType === "NONE") {
    return false;
  }
  const startsAt = parseDateValue(item.discountStart);
  const endsAt = parseDateValue(item.discountEnd);
  if (startsAt && now < startsAt) return false;
  if (endsAt && now > endsAt) return false;
  return true;
};

const applyDiscount = (
  amount: number,
  type: DiscountType,
  value: number
): { finalAmount: number; discountAmount: number } => {
  if (type === "NONE") {
    return { finalAmount: clampCurrency(amount), discountAmount: 0 };
  }
  const sanitizedValue = Math.max(0, value || 0);
  let discountAmount = 0;
  if (type === "PERCENTAGE") {
    discountAmount = (amount * Math.min(sanitizedValue, 100)) / 100;
  } else {
    discountAmount = Math.min(sanitizedValue, amount);
  }
  return {
    finalAmount: clampCurrency(amount - discountAmount),
    discountAmount: clampCurrency(discountAmount),
  };
};

export const getStoreItemPricing = (item: StoreItem) => {
  const basePrice = item.price ?? 0;
  const discountActive = isProductDiscountActive(item);
  if (!discountActive || !item.discountType || !item.discountValue) {
    return {
      basePrice,
      currentPrice: basePrice,
      discountAmount: 0,
      discountPercent: 0,
      hasDiscount: false,
    };
  }

  const { finalAmount, discountAmount } = applyDiscount(
    basePrice,
    item.discountType,
    item.discountValue
  );

  const discountPercent =
    item.discountType === "PERCENTAGE"
      ? Math.min(Math.max(item.discountValue, 0), 100)
      : basePrice === 0
      ? 0
      : Math.round((discountAmount / basePrice) * 100);

  return {
    basePrice,
    currentPrice: finalAmount,
    discountAmount,
    discountPercent,
    hasDiscount: discountAmount > 0,
  };
};
