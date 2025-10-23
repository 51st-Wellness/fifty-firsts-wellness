import React from "react";
import { Check } from "lucide-react";
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
  title = "Choose Your Plan",
  subtitle = "Unlock your wellness journey",
  showActiveStatus = true,
}) => {
  return (
    <div className="text-center">
      <h1 
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
        style={{ fontFamily: '"League Spartan", sans-serif' }}
      >
        {title}
      </h1>
      <p 
        className="text-lg text-gray-600 mb-8"
        style={{ fontFamily: '"League Spartan", sans-serif' }}
      >
        {subtitle}
      </p>

      {showActiveStatus && activeSubscription && (
        <div className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/20 text-brand-green px-4 py-2 rounded-full mb-8">
          <Check className="w-4 h-4" />
          <span className="font-medium text-sm" style={{ fontFamily: '"League Spartan", sans-serif' }}>
            Active: {activeSubscription.plan?.name}
          </span>
          <span className="text-brand-green/70 text-sm">
            ({getExpirationDisplay(activeSubscription.endDate)})
          </span>
        </div>
      )}
    </div>
  );
};

export default SubscriptionHeader;