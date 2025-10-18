import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { X, Crown } from "lucide-react";
import { getAuthToken } from "../lib/utils";
import { useSubscription } from "../hooks/useSubscription";
import SubscriptionPlansGrid from "./subscription/SubscriptionPlansGrid";
import SubscriptionHeader from "./subscription/SubscriptionHeader";

interface SubscriptionRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  programmeTitle?: string;
}

const SubscriptionRequiredModal: React.FC<SubscriptionRequiredModalProps> = ({
  isOpen,
  onClose,
  programmeTitle = "this programme",
}) => {
  const navigate = useNavigate();
  const {
    plans,
    activeSubscription,
    loading,
    checkoutLoading,
    handleSubscribe,
  } = useSubscription();

  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scrolling when modal is closed
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
                <Crown className="w-5 h-5 text-brand-purple" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Subscription Required
                </h2>
                <p className="text-sm text-gray-600">
                  Choose a plan to access {programmeTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!getAuthToken() ? (
            /* Not logged in state */
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-green/10 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Sign In Required
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You need to be logged in to subscribe to our wellness
                programmes. Sign in to continue or create a new account.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleLogin}
                  className="bg-brand-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-green-dark transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Logged in - show subscription plans */
            <div>
              <SubscriptionHeader
                title="Choose Your Plan"
                subtitle={`Subscribe to access ${programmeTitle}`}
                activeSubscription={activeSubscription}
                showActiveStatus={false}
              />

              <SubscriptionPlansGrid
                plans={plans}
                activeSubscription={activeSubscription}
                checkoutLoading={checkoutLoading}
                onSubscribe={handleSubscribe}
                loading={loading}
                compact={true}
              />

              {/* Additional info */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  All plans include access to our complete wellness library
                </p>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  Maybe later
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SubscriptionRequiredModal;
