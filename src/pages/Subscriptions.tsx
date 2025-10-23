import React, { useState } from "react";
import Footer from "../components/Footer";
import { useSubscription } from "../hooks/useSubscription";
import SubscriptionHeader from "../components/subscription/SubscriptionHeader";
import SubscriptionPlansGrid from "../components/subscription/SubscriptionPlansGrid";

const Subscriptions: React.FC = () => {
  const {
    plans,
    loading,
    checkoutLoading,
    handleSubscribe,
  } = useSubscription();


  // Membership plans - simplified content
  const membershipPlans = [
    {
      id: "1",
      name: "Engage Wellness",
      price: 29.99,
      duration: 30,
      description: "Perfect for beginners exploring wellness.",
      badge: "Current Option",
      subscriptionAccess: [
        { id: "1", accessItem: "DIGITAL_GUIDES" },
        { id: "2", accessItem: "WEBINAR_CONTENT" },
        { id: "3", accessItem: "WELLNESS_PLAN" },
        { id: "4", accessItem: "NEWSLETTER" },
        { id: "5", accessItem: "MENOPAUSE_SUPPORT" }
      ]
    },
    {
      id: "2", 
      name: "Embrace Wellness",
      price: 59.99,
      duration: 30,
      description: "Your next step in comprehensive wellness support.",
      subscriptionAccess: [
        { id: "1", accessItem: "ENGAGE_BENEFITS" },
        { id: "2", accessItem: "EARLY_ACCESS" },
        { id: "3", accessItem: "PREMIUM_TRAINING" },
        { id: "4", accessItem: "PERSONAL_CHECKINS" }
      ]
    },
    {
      id: "3",
      name: "Elevate Wellness",
      price: 339.99,
      duration: 365,
      description: "Complete wellness solution for individuals and workplaces.",
      badge: "Popular Option",
      specialLabel: "Best for Workplace Wellness",
      subscriptionAccess: [
        { id: "1", accessItem: "EMBRACE_BENEFITS" },
        { id: "2", accessItem: "DIGITAL_LIBRARY" },
        { id: "3", accessItem: "SELFCARE_KITS" },
        { id: "4", accessItem: "WELLNESS_CHALLENGES" }
      ]
    }
  ];

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center text-white"
        style={{ backgroundImage: 'url(/assets/contact/contact-bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent mx-auto mb-4"></div>
          <p className="text-white font-medium" style={{ fontFamily: '"League Spartan", sans-serif' }}>
            Loading subscription plans...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main 
      className="min-h-screen text-white"
      style={{ backgroundImage: 'url(/assets/contact/contact-bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="relative">
        {/* Header Section */}
        <section className="pt-16 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: '"League Spartan", sans-serif' }}>
              Choose Your Wellness Journey
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Transform your life with our comprehensive wellness programs designed to support you at every stage of your journey.
            </p>
          </div>
        </section>

        {/* Pricing Cards Section */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SubscriptionPlansGrid
              plans={membershipPlans as any}
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