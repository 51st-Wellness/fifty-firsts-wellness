import React, { useState, useEffect } from "react";
import { X, Bell } from "lucide-react";
import type { StoreItem } from "../types/marketplace.types";
import {
  subscribeToProduct,
  checkSubscription,
} from "../api/product-subscriber.api";
import toast from "react-hot-toast";

interface NotificationOptInProps {
  item: StoreItem;
  isOpen: boolean;
  onClose: () => void;
}

const NotificationOptIn: React.FC<NotificationOptInProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  // Check if already subscribed when modal opens
  useEffect(() => {
    if (isOpen) {
      checkExistingSubscription();
    }
  }, [isOpen, item.productId]);

  const checkExistingSubscription = async () => {
    try {
      const response = await checkSubscription(item.productId);
      if (response.data?.isSubscribed) {
        setAlreadySubscribed(true);
      }
    } catch (error) {
      console.error("Failed to check subscription:", error);
    }
  };

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (alreadySubscribed) {
      toast.info(
        "You are already subscribed to notifications for this product"
      );
      onClose();
      return;
    }

    try {
      setLoading(true);
      await subscribeToProduct(item.productId);
      setSuccess(true);
      toast.success("Successfully subscribed to notifications!");
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (error: any) {
      console.error("Failed to subscribe:", error);
      toast.error(
        error?.response?.data?.message || "Failed to subscribe to notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full sm:w-[28rem] rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-2 rounded-lg hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-brand-green/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-brand-green" />
          </div>
          <h3
            className="text-lg font-semibold"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Notify me when available
          </h3>
        </div>
        {success ? (
          <p className="text-sm text-gray-700">
            We will email you once "{item.name}" is back in stock or available.
          </p>
        ) : alreadySubscribed ? (
          <div>
            <p className="text-sm text-gray-700 mb-4">
              You are already subscribed to notifications for this product.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-brand-green text-white text-sm font-semibold"
              >
                OK
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              You will receive an email when this product is restocked or
              available for purchase.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-5 py-2 rounded-full bg-brand-green text-white text-sm font-semibold hover:bg-brand-green-dark disabled:opacity-50"
              >
                {loading ? "Adding…" : "Notify me"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationOptIn;
