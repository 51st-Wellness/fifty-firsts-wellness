import React from "react";
import { Loader2 } from "lucide-react";
import { SubscriptionPlan } from "../../api/subscription.api";
import PlanCard from "./PlanCard";

interface SubscriptionPlansGridProps {
  plans: SubscriptionPlan[];
  // activeSubscription: any;
  checkoutLoading: string | null;
  onSubscribe: (planId: string) => void;
  loading?: boolean;
  compact?: boolean;
  showAll?: boolean;
}

const SubscriptionPlansGrid: React.FC<SubscriptionPlansGridProps> = ({
  plans,
  // activeSubscription,
  checkoutLoading,
  onSubscribe,
  loading = false,
  compact = false,
  showAll = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-12 text-white/80" style={{ fontFamily: '"League Spartan", sans-serif' }}>
        No subscription plans available for the selected category.
      </div>
    );
  }

  // const isCurrentPlan = (planId: string): boolean => {
  //   if (!activeSubscription) return false;
  //   return (
  //     activeSubscription.planId === planId &&
  //     activeSubscription.status === "PAID"
  //   );
  // };

  return (
    <div className="w-full">
      {/* Main plans grid - responsive layout */}
      <div
        className={`grid gap-8 ${
          compact
            ? "grid-cols-1"
            : plans.length === 1
            ? "grid-cols-1 max-w-md mx-auto"
            : plans.length === 2
            ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            index={index}
            isCurrent={false}
            checkoutLoading={checkoutLoading}
            onSubscribe={onSubscribe}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlansGrid;