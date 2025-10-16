import type { Subscription, SubscriptionPlan } from "../api/subscription.api";

/**
 * Check if a subscription is currently active
 */
export const isSubscriptionActive = (subscription: Subscription | null): boolean => {
  if (!subscription) return false;
  
  return (
    subscription.status === "PAID" &&
    new Date(subscription.endDate) > new Date()
  );
};

/**
 * Check if a specific plan is the user's current active plan
 */
export const isCurrentPlan = (
  planId: string, 
  activeSubscription: Subscription | null
): boolean => {
  if (!activeSubscription) return false;
  
  return (
    activeSubscription.planId === planId &&
    isSubscriptionActive(activeSubscription)
  );
};

/**
 * Format subscription price for display
 */
export const formatPrice = (price: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
};

/**
 * Format subscription duration for display
 */
export const formatDuration = (days: number): string => {
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""}`;
  } else if (days >= 30) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""}`;
  } else {
    return `${days} day${days > 1 ? "s" : ""}`;
  }
};

/**
 * Get access item icon name for better type safety
 */
export const getAccessItemIcon = (accessItem: string): "zap" | "star" | "crown" | "shield" => {
  switch (accessItem) {
    case "PODCAST_ACCESS":
      return "zap";
    case "PROGRAMME_ACCESS":
      return "star";
    case "ALL_ACCESS":
      return "crown";
    default:
      return "shield";
  }
};

/**
 * Get human-readable access item label
 */
export const getAccessItemLabel = (accessItem: string): string => {
  switch (accessItem) {
    case "PODCAST_ACCESS":
      return "Podcast Access";
    case "PROGRAMME_ACCESS":
      return "Programme Access";
    case "ALL_ACCESS":
      return "Full Platform Access";
    default:
      return accessItem.replace(/_/g, " ");
  }
};

/**
 * Determine if a plan should be marked as popular/featured
 */
export const isPlanPopular = (plan: SubscriptionPlan, index: number): boolean => {
  return (
    index === 1 || 
    plan.name.toLowerCase().includes('premium') || 
    plan.name.toLowerCase().includes('pro') ||
    plan.name.toLowerCase().includes('popular')
  );
};

/**
 * Get subscription expiration date display
 */
export const getExpirationDisplay = (endDate: string): string => {
  const expiry = new Date(endDate);
  const now = new Date();
  const diffInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) {
    return "Expired";
  } else if (diffInDays === 0) {
    return "Expires today";
  } else if (diffInDays === 1) {
    return "Expires tomorrow";
  } else if (diffInDays <= 7) {
    return `Expires in ${diffInDays} days`;
  } else {
    return `Expires ${expiry.toLocaleDateString()}`;
  }
};

/**
 * Calculate savings for annual vs monthly plans
 */
export const calculateSavings = (
  annualPlan: SubscriptionPlan, 
  monthlyPlan: SubscriptionPlan
): { percentage: number; amount: number } | null => {
  if (!annualPlan || !monthlyPlan) return null;
  
  const monthlyYearlyTotal = monthlyPlan.price * 12;
  const savings = monthlyYearlyTotal - annualPlan.price;
  const percentage = Math.round((savings / monthlyYearlyTotal) * 100);
  
  return { percentage, amount: savings };
};