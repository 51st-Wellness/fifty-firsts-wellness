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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-purple/10 via-brand-green/5 to-brand-purple/20">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-brand-purple border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading subscription plans...
          </p>
        </div>
      </div>
    );
  }

  // Empty state if no plans available
  if (!plans || plans.length === 0) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 via-brand-green/10 to-brand-purple/30"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-8">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">👑</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
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
    <main className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and blur effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 via-brand-green/10 to-brand-purple/30"></div>
      <div className="absolute inset-0 backdrop-blur-3xl"></div>

      {/* Floating background elements */}
      <div className="absolute top-20 left-4 lg:left-10 w-48 h-48 lg:w-72 lg:h-72 bg-brand-green/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-4 lg:right-20 w-64 h-64 lg:w-96 lg:h-96 bg-brand-purple/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 lg:left-1/3 w-56 h-56 lg:w-80 lg:h-80 bg-brand-green/15 rounded-full blur-3xl animate-pulse delay-2000"></div>

      <div className="relative z-10">
        {/* Header Section */}
        <section className="pt-20 pb-16 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
