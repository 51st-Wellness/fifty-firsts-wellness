import React from "react";
import { Crown, Check, Loader2, Star, Zap } from "lucide-react";
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

  const getAccessItemIcon = (accessItem: string) => {
    switch (accessItem) {
      case "PODCAST_ACCESS":
        return <Zap className="w-4 h-4 text-blue-500" />;
      case "PROGRAMME_ACCESS":
        return <Star className="w-4 h-4 text-purple-500" />;
      case "ALL_ACCESS":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      default:
        return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  if (compact) {
    return (
      <div
        className={`bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 transition-all duration-300 hover:shadow-xl ${
          isCurrent ? "ring-2 ring-brand-green" : ""
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-green/20 to-brand-green-light/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-brand-green" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 font-heading">
                  {plan.name}
                </h4>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
              <div className="text-2xl font-bold text-brand-green">
                {formatPrice(plan.price)}
              </div>
              <div className="text-sm text-gray-500">
                /{formatDuration(plan.duration)}
              </div>
            </div>
            <button
              onClick={() => onSubscribe(plan.id)}
              disabled={isLoading || isCurrent}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[120px] ${
                isCurrent
                  ? "bg-brand-green/10 text-brand-green cursor-not-allowed border border-brand-green/20 focus:ring-brand-green/50"
                  : "bg-gradient-to-r from-brand-green to-brand-green-light text-white hover:shadow-lg hover:shadow-brand-green/25 focus:ring-brand-green/50"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
      className={`relative group transition-all duration-500 hover:scale-105 ${
        isPopular ? "lg:scale-110" : ""
      }`}
    >
      {/* Card */}
      <div
        className={`relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border transition-all duration-300 ${
          isPopular
            ? "border-brand-purple/30 shadow-brand-purple/20"
            : isFree
            ? "border-gray-200/50"
            : "border-brand-green/30 shadow-brand-green/20"
        } ${isCurrent ? "ring-2 ring-brand-green" : ""}`}
      >
        {/* Popular badge */}
        {isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-brand-purple to-brand-purple-light text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              Most Popular
            </div>
          </div>
        )}

        {/* Current plan badge */}
        {isCurrent && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-brand-green text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              Current Plan
            </div>
          </div>
        )}

        {/* Plan icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
            isPopular
              ? "bg-gradient-to-br from-brand-purple/20 to-brand-purple-light/20"
              : isFree
              ? "bg-gray-100"
              : "bg-gradient-to-br from-brand-green/20 to-brand-green-light/20"
          }`}
        >
          {isFree ? (
            <Star className={`w-8 h-8 text-gray-600`} />
          ) : isPopular ? (
            <Crown className={`w-8 h-8 text-brand-purple`} />
          ) : (
            <Zap className={`w-8 h-8 text-brand-green`} />
          )}
        </div>

        {/* Plan name */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
          {plan.name}
        </h3>

        {/* Plan description */}
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          {plan.description}
        </p>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-4xl font-bold ${
                isPopular ? "text-brand-purple" : "text-brand-green"
              }`}
            >
              {formatPrice(plan.price)}
            </span>
            <span className="text-gray-500 text-sm">
              /{formatDuration(plan.duration)}
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {plan.subscriptionAccess.map((access) => (
            <div key={access.id} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  isPopular ? "bg-brand-purple/10" : "bg-brand-green/10"
                }`}
              >
                <Check
                  className={`w-3 h-3 ${
                    isPopular ? "text-brand-purple" : "text-brand-green"
                  }`}
                />
              </div>
              <span className="text-gray-700 text-sm">
                {getAccessItemLabel(access.accessItem)}
              </span>
            </div>
          ))}

          {/* Additional features */}
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                isPopular ? "bg-brand-purple/10" : "bg-brand-green/10"
              }`}
            >
              <Check
                className={`w-3 h-3 ${
                  isPopular ? "text-brand-purple" : "text-brand-green"
                }`}
              />
            </div>
            <span className="text-gray-700 text-sm">24/7 Support</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                isPopular ? "bg-brand-purple/10" : "bg-brand-green/10"
              }`}
            >
              <Check
                className={`w-3 h-3 ${
                  isPopular ? "text-brand-purple" : "text-brand-green"
                }`}
              />
            </div>
            <span className="text-gray-700 text-sm">Mobile App Access</span>
          </div>
          {plan.price > 0 && (
            <>
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isPopular ? "bg-brand-purple/10" : "bg-brand-green/10"
                  }`}
                >
                  <Check
                    className={`w-3 h-3 ${
                      isPopular ? "text-brand-purple" : "text-brand-green"
                    }`}
                  />
                </div>
                <span className="text-gray-700 text-sm">Priority Support</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isPopular ? "bg-brand-purple/10" : "bg-brand-green/10"
                  }`}
                >
                  <Check
                    className={`w-3 h-3 ${
                      isPopular ? "text-brand-purple" : "text-brand-green"
                    }`}
                  />
                </div>
                <span className="text-gray-700 text-sm">Offline Downloads</span>
              </div>
            </>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSubscribe(plan.id)}
          disabled={isLoading || isCurrent}
          aria-label={`${isCurrent ? "Current plan" : "Subscribe to"} ${
            plan.name
          }`}
          className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isCurrent
              ? "bg-brand-green/10 text-brand-green cursor-not-allowed border border-brand-green/20 focus:ring-brand-green/50"
              : isPopular
              ? "bg-gradient-to-r from-brand-purple to-brand-purple-light text-white hover:shadow-xl hover:shadow-brand-purple/25 transform hover:-translate-y-1 focus:ring-brand-purple/50"
              : isFree
              ? "bg-gray-900 text-white hover:bg-gray-800 transform hover:-translate-y-1 focus:ring-gray-500"
              : "bg-gradient-to-r from-brand-green to-brand-green-light text-white hover:shadow-xl hover:shadow-brand-green/25 transform hover:-translate-y-1 focus:ring-brand-green/50"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
