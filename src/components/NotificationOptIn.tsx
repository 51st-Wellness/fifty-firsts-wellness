import React, { useState } from "react";
import { X, Bell } from "lucide-react";
import type { StoreItem } from "../types/marketplace.types";

interface NotificationOptInProps {
  item: StoreItem;
  isOpen: boolean;
  onClose: () => void;
}

const NotificationOptIn: React.FC<NotificationOptInProps> = ({ item, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      // Placeholder: integrate API in later task
      await new Promise((r) => setTimeout(r, 700));
      setSuccess(true);
      setTimeout(onClose, 900);
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
          <h3 className="text-lg font-semibold" style={{ fontFamily: '"League Spartan", sans-serif' }}>
            Notify me when available
          </h3>
        </div>
        {success ? (
          <p className="text-sm text-gray-700">We will email you once “{item.name}” is back in stock.</p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              You will receive an email when this product is restocked.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={onClose} className="px-4 py-2 rounded-full border border-gray-300 text-sm">
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


