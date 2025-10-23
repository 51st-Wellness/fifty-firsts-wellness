import React from "react";
import Footer from "../components/Footer";
import { useSubscription } from "../hooks/useSubscription";
import SubscriptionHeader from "../components/subscription/SubscriptionHeader";
import SubscriptionPlansGrid from "../components/subscription/SubscriptionPlansGrid";

const Subscriptions: React.FC = () => {
  const {
    plans,
    activeSubscription,
    loading,
    checkoutLoading,
    handleSubscribe,
  } = useSubscription();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium" style={{ fontFamily: '"League Spartan", sans-serif' }}>
            Loading subscription plans...
          </p>
        </div>
      </div>
    );
  }

  // Empty state if no plans available
  if (!plans || plans.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">👑</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              No Subscription Plans Available
            </h1>
            <p className="text-gray-600 mb-6">
              We're currently updating our subscription plans. Please check back
              later.
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="relative">
        {/* Header Section */}
        <section className="pt-16 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SubscriptionHeader activeSubscription={activeSubscription} />
          </div>
        </section>

        {/* Pricing Cards Section */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SubscriptionPlansGrid
              plans={plans}
              activeSubscription={activeSubscription}
              checkoutLoading={checkoutLoading}
              onSubscribe={handleSubscribe}
              loading={loading}
              showAll={true}
            />
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default Subscriptions;