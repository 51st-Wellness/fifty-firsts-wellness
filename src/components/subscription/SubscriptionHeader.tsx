import React from "react";
import { Check, Sparkles } from "lucide-react";
import { Subscription } from "../../api/subscription.api";
import { getExpirationDisplay } from "../../utils/subscription.utils";

interface SubscriptionHeaderProps {
  activeSubscription?: Subscription | null;
  title?: string;
  subtitle?: string;
  showActiveStatus?: boolean;
}

const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({
  activeSubscription,
  title = "Select The Perfect Plan",
  subtitle = "For Your Wellness Journey",
  showActiveStatus = true,
}) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-heading">
        {title}
      </h1>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-heading">
        {subtitle}
      </h2>
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="w-12 h-1 bg-brand-green rounded-full"></div>
        <div className="w-3 h-3 bg-brand-purple rounded-full"></div>
        <div className="w-12 h-1 bg-brand-green rounded-full"></div>
      </div>

      {showActiveStatus && activeSubscription && (
        <div className="inline-flex items-center gap-2 bg-brand-green/10 backdrop-blur-sm border border-brand-green/20 text-brand-green px-6 py-3 rounded-full">
          <Check className="w-5 h-5" />
          <span className="font-medium">
            Active: {activeSubscription.plan?.name}
          </span>
          <span className="text-brand-green/70">
            ({getExpirationDisplay(activeSubscription.endDate)})
          </span>
        </div>
      )}
    </div>
  );
};

export default SubscriptionHeader;
