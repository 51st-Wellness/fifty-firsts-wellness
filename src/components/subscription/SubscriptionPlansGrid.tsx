import React from "react";
import { Loader2 } from "lucide-react";
import { SubscriptionPlan } from "../../api/subscription.api";
import PlanCard from "./PlanCard";

interface SubscriptionPlansGridProps {
  plans: SubscriptionPlan[];
  activeSubscription: any;
  checkoutLoading: string | null;
  onSubscribe: (planId: string) => void;
  loading?: boolean;
  compact?: boolean;
  showAll?: boolean;
}

const SubscriptionPlansGrid: React.FC<SubscriptionPlansGridProps> = ({
  plans,
  activeSubscription,
  checkoutLoading,
  onSubscribe,
  loading = false,
  compact = false,
  showAll = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No subscription plans available</p>
      </div>
    );
  }

  const displayPlans = showAll ? plans : plans.slice(0, 3);
  const additionalPlans = showAll ? [] : plans.slice(3);

  const isCurrentPlan = (planId: string): boolean => {
    if (!activeSubscription) return false;
    return (
      activeSubscription.planId === planId &&
      activeSubscription.status === "PAID"
    );
  };

  return (
    <div className="w-full">
      {/* First 3 plans in grid */}
      <div
        className={`grid gap-6 ${
          compact
            ? "grid-cols-1"
            : displayPlans.length === 1
            ? "grid-cols-1 max-w-md mx-auto"
            : displayPlans.length === 2
            ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {displayPlans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            index={index}
            isCurrent={isCurrentPlan(plan.id)}
            checkoutLoading={checkoutLoading}
            onSubscribe={onSubscribe}
            compact={compact}
          />
        ))}
      </div>

      {/* Additional plans (vertical layout) */}
      {additionalPlans.length > 0 && (
        <div className="mt-8 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8 font-heading">
            More Options
          </h3>
          {additionalPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={0}
              isCurrent={isCurrentPlan(plan.id)}
              checkoutLoading={checkoutLoading}
              onSubscribe={onSubscribe}
              compact={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlansGrid;
