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


  // Membership plans - updated content
  const membershipPlans = [
    {
      id: "1",
      name: "Engage Wellness",
      price: 29.99,
      duration: 30,
      description: "Exclusive individual access to digital wellness guides and toolkits, member-only webinar content, wellness action plan development and support, monthly newsletter, menopause support, and member offers for products and coaching services.",
      badge: "Current Option",
      subscriptionAccess: [
        { id: "1", accessItem: "Digital wellness guides and toolkits" },
        { id: "2", accessItem: "Member-only webinar content" },
        { id: "3", accessItem: "Wellness action plan development" },
        { id: "4", accessItem: "Monthly newsletter" },
        { id: "5", accessItem: "Menopause support" },
        { id: "6", accessItem: "Member offers for products and coaching" }
      ]
    },
    {
      id: "2", 
      name: "Embrace Wellness",
      price: 59.99,
      duration: 30,
      description: "Individual access to all Engage benefits plus early access to new products and services, premium training programmes, personal check-ins and goal setting sessions, and Age Well, Live Well and Sleep Well insights.",
      subscriptionAccess: [
        { id: "1", accessItem: "All Engage benefits" },
        { id: "2", accessItem: "Early access to new products and services" },
        { id: "3", accessItem: "Premium training programmes" },
        { id: "4", accessItem: "Personal check-ins and goal setting" },
        { id: "5", accessItem: "Age Well, Live Well and Sleep Well insights" }
      ]
    },
    {
      id: "3",
      name: "Elevate Wellness",
      price: 339.99,
      duration: 365,
      description: "Individual access to all Embrace benefits plus access to full digital wellness library, individual self-care kits delivered quarterly, seasonal wellness challenges and community engagement, and expert-led workshops or focus groups.",
      badge: "Popular Option",
      specialLabel: "Best for Workplace Wellness",
      subscriptionAccess: [
        { id: "1", accessItem: "All Embrace benefits" },
        { id: "2", accessItem: "Access to full digital wellness library" },
        { id: "3", accessItem: "Individual self-care kits delivered quarterly" },
        { id: "4", accessItem: "Seasonal wellness challenges and community engagement" },
        { id: "5", accessItem: "Expert-led workshops or focus groups" }
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
            Wellness memberships built for real lives and real results. Nurture, Inspire, Connect and Empower to transform your wellbeing; stronger for longer.
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