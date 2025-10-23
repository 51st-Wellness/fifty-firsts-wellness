import React from "react";
import { Check, Loader2, Star } from "lucide-react";
import { SubscriptionPlan } from "../../api/subscription.api";
import {
  formatPrice,
  formatDuration,
  getAccessItemLabel,
  isPlanPopular,
} from "../../utils/subscription.utils";

interface PlanCardProps {
  plan: SubscriptionPlan;
  index: number;
  isCurrent: boolean;
  checkoutLoading: string | null;
  onSubscribe: (planId: string) => void;
  compact?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  index,
  isCurrent,
  checkoutLoading,
  onSubscribe,
  compact = false,
}) => {
  const isPopular = isPlanPopular(plan, index);
  const isFree = plan.price === 0;
  const isLoading = checkoutLoading === plan.id;

  if (compact) {
    return (
      <div
        className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:shadow-md ${
          isCurrent ? "ring-2 ring-brand-green border-brand-green" : "border-gray-200"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-brand-green" />
              </div>
              <div>
                <h4 
                  className="text-lg font-semibold text-gray-900"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  {plan.name}
                </h4>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              {plan.subscriptionAccess.map((access) => (
                <span key={access.id} className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-brand-green" />
                  {getAccessItemLabel(access.accessItem)}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xl font-bold text-brand-green" style={{ fontFamily: '"League Spartan", sans-serif' }}>
                {formatPrice(plan.price)}
              </div>
              <div className="text-sm text-gray-500">
                /{formatDuration(plan.duration)}
              </div>
            </div>
            <button
              onClick={() => onSubscribe(plan.id)}
              disabled={isLoading || isCurrent}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[120px] ${
                isCurrent
                  ? "bg-brand-green/10 text-brand-green cursor-not-allowed border border-brand-green/20 focus:ring-brand-green/50"
                  : "bg-brand-green text-white hover:bg-brand-green-dark focus:ring-brand-green/50"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isCurrent ? (
                "Current"
              ) : (
                "Subscribe"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative group transition-all duration-300 hover:scale-[1.02] ${
        isPopular ? "lg:scale-105" : ""
      }`}
    >
      {/* Card */}
      <div
        className={`relative bg-white rounded-2xl p-8 shadow-sm border transition-all duration-300 ${
          isPopular
            ? "border-brand-green shadow-md"
            : isFree
            ? "border-gray-200"
            : "border-gray-200"
        } ${isCurrent ? "ring-2 ring-brand-green" : ""}`}
      >
        {/* Popular badge */}
        {isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-brand-green text-white px-4 py-1 rounded-full text-xs font-semibold">
              Most Popular
            </div>
          </div>
        )}

        {/* Current plan badge */}
        {isCurrent && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-brand-green text-white px-4 py-1 rounded-full text-xs font-semibold">
              Current Plan
            </div>
          </div>
        )}

        {/* Plan name */}
        <h3 
          className="text-xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          {plan.name}
        </h3>

        {/* Plan description */}
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          {plan.description}
        </p>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-brand-green" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              {formatPrice(plan.price)}
            </span>
            <span className="text-gray-500 text-sm">
              /{formatDuration(plan.duration)}
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {plan.subscriptionAccess.map((access) => (
            <div key={access.id} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center">
                <Check className="w-3 h-3 text-brand-green" />
              </div>
              <span className="text-gray-700 text-sm">
                {getAccessItemLabel(access.accessItem)}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSubscribe(plan.id)}
          disabled={isLoading || isCurrent}
          aria-label={`${isCurrent ? "Current plan" : "Subscribe to"} ${plan.name}`}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isCurrent
              ? "bg-brand-green/10 text-brand-green cursor-not-allowed border border-brand-green/20 focus:ring-brand-green/50"
              : isFree
              ? "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500"
              : "bg-brand-green text-white hover:bg-brand-green-dark focus:ring-brand-green/50"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </div>
          ) : isCurrent ? (
            "Current Plan"
          ) : plan.price === 0 ? (
            "Get Started Free"
          ) : (
            "Subscribe Now"
          )}
        </button>

        {/* Plan Stats */}
        {plan._count && (
          <div className="mt-4 text-center text-xs text-gray-500">
            {plan._count.subscriptions} active subscribers
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanCard;