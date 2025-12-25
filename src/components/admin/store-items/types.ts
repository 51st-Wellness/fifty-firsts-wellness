import type { DiscountType } from "../../../types/marketplace.types";

export type StoreItemFormState = {
  name: string;
  description: string;
  productUsage: string;
  productBenefits: string;
  productIngredients: string[];
  price: number;
  stock: number;
  categories: string[];
  isFeatured: boolean;
  isPublished: boolean;
  discountType: DiscountType;
  discountValue: number;
  discountActive: boolean;
  discountStart: string;
  discountEnd: string;
  preOrderEnabled: boolean;
  // Shipping information for Click & Drop
  weight: number; // in grams
  length: number; // in mm
  width: number; // in mm
  height: number; // in mm
};

export const createDefaultFormState = (): StoreItemFormState => ({
  name: "",
  description: "",
  productUsage: "",
  productBenefits: "",
  productIngredients: [],
  price: 0,
  stock: 0,
  categories: [],
  isFeatured: false,
  isPublished: false,
  discountType: "NONE",
  discountValue: 0,
  discountActive: false,
  discountStart: "",
  discountEnd: "",
  preOrderEnabled: false,
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
});

export const cloneFormState = (state: StoreItemFormState): StoreItemFormState => ({
  ...state,
  productIngredients: [...state.productIngredients],
  categories: [...state.categories],
});

export const areStringArraysEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
};

