import React from "react";
import { Check, Loader2 } from "lucide-react";
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
        className={`bg-white rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl ${
          isCurrent ? "ring-2 ring-brand-green border-brand-green" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: '"League Spartan", sans-serif' }}>
            {plan.name}
          </h3>
        </div>
        <p className="text-gray-600 mb-6 text-sm">
          {plan.description || "No description available."}
        </p>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-semibold text-gray-900" style={{ fontFamily: '"League Spartan", sans-serif' }}>
            {formatPrice(plan.price)}
            <span className="text-base font-medium text-gray-500">
              /{formatDuration(plan.duration)}
            </span>
          </p>
          <button
            onClick={() => onSubscribe(plan.id)}
            disabled={isCurrent || isLoading}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
              isCurrent
                ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                : "bg-brand-green text-white hover:bg-brand-green-dark"
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isCurrent ? "Current Plan" : isFree ? "Get Started" : "Subscribe"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col h-full relative">
      {/* Badge */}
      {(plan as any).badge && (
        <div className={`absolute -top-3 left-4 px-4 py-1 rounded-full text-xs font-semibold ${
          (plan as any).badge === "Current Option" 
            ? "bg-pink-500 text-white" 
            : "bg-yellow-500 text-white"
        }`}>
          {(plan as any).badge}
        </div>
      )}

      {/* Sparkle Icon - Fixed Height */}
      <div className="h-10 mb-4">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
            <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Plan Name - Fixed Height */}
      <div className="h-10 mb-2">
        <h3 className="text-2xl font-semibold text-gray-900 text-left" style={{ fontFamily: '"League Spartan", sans-serif' }}>
          {plan.name}
        </h3>
      </div>

      {/* Price - Fixed Height */}
      <div className="h-10 mb-2">
        <div className="flex items-baseline gap-2 text-left">
          <span className="text-4xl font-semibold text-gray-900" style={{ fontFamily: '"League Spartan", sans-serif' }}>
            {formatPrice(plan.price)}
          </span>
          <span className="text-gray-500 text-sm">
            /{formatDuration(plan.duration)}
          </span>
        </div>
      </div>

      {/* Description - Fixed Height */}
      <div className="h-20 mb-20">
        <p className="text-gray-600 text-sm leading-relaxed text-left">
          {plan.description || "No description available."}
        </p>
      </div>

      {/* Features - Flexible Height */}
      <div className="flex-1 mb-10">
        <div className="space-y-4 text-left">
          {plan.subscriptionAccess.map((access, idx) => (
            <div key={access.id}>
              <div className="text-gray-700 text-sm text-left">
                {getAccessItemLabel(access.accessItem)}
              </div>
              {idx < plan.subscriptionAccess.length - 1 && (
                <div className="border-t border-gray-200 mt-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button - Fixed at Bottom */}
      <div className="text-left">
        <button
          onClick={() => onSubscribe(plan.id)}
          disabled={isLoading || isCurrent}
          className={`py-3 px-6 rounded-full font-semibold text-sm ${
            isCurrent
              ? "bg-gray-200 text-gray-700 cursor-not-allowed"
              : "bg-[#580F41] text-white"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </div>
          ) : isCurrent ? (
            "Current Plan"
          ) : (
            "Get Started"
          )}
        </button>
      </div>

      {/* Special Label */}
      {(plan as any).specialLabel && (
        <div className="mt-4">
          <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-xs font-medium text-center">
            {(plan as any).specialLabel}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanCard;