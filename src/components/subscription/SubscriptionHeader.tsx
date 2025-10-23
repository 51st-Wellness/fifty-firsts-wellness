import React from "react";
// import { Check } from "lucide-react";
// import { Subscription } from "../../api/subscription.api";
// import { getExpirationDisplay } from "../../utils/subscription.utils";

interface SubscriptionHeaderProps {
  // activeSubscription?: Subscription | null;
  title?: string;
  subtitle?: string;
  // showActiveStatus?: boolean;
  planType: "personal" | "business";
  setPlanType: (type: "personal" | "business") => void;
}

const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({
  // activeSubscription,
  title = "Unlock access to the contents when you go premium",
  subtitle = "Flexible plans and solutions for personal use and business of all sizes",
  // showActiveStatus = true,
  planType,
  setPlanType,
}) => {
  return (
    <div className="text-center">
      {/* PRICING Label */}
      <p 
        className="text-sm font-semibold uppercase text-white/70 mb-4 tracking-wider"
        style={{ fontFamily: '"League Spartan", sans-serif' }}
      >
        PRICING
      </p>

      {/* Main Heading */}
      <h1 
        className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight"
        style={{ fontFamily: '"League Spartan", sans-serif' }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p 
        className="text-base md:text-lg text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed"
        style={{ fontFamily: '"League Spartan", sans-serif' }}
      >
        {subtitle}
      </p>

      {/* Personal/Business Toggle */}
      <div className="inline-flex bg-white rounded-full p-1 mb-8">
        <button
          className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
            planType === "personal"
              ? "bg-brand-green text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setPlanType("personal")}
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Personal
        </button>
        <button
          className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
            planType === "business"
              ? "bg-brand-green text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setPlanType("business")}
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Business
        </button>
      </div>

      {/* {showActiveStatus && activeSubscription && (
        <div className="inline-flex items-center gap-2 bg-brand-green/10 backdrop-blur-sm border border-brand-green/20 text-brand-green px-6 py-3 rounded-full">
          <Check className="w-5 h-5" />
          <span className="font-medium">
            Active: {activeSubscription.plan?.name}
          </span>
          <span className="text-brand-green/70">
            ({getExpirationDisplay(activeSubscription.endDate)})
          </span>
        </div>
      )} */}
    </div>
  );
};

export default SubscriptionHeader;