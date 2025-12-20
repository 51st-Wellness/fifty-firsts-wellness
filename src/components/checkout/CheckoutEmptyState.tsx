import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

interface CheckoutEmptyStateProps {
  // No props needed - this is a static component
}

const CheckoutEmptyState: React.FC<CheckoutEmptyStateProps> = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        <h1
          className="text-3xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Your cart is empty
        </h1>
        <p className="text-gray-600 mb-8">
          Add some wellness products to your cart to start the checkout
          process.
        </p>
        <Link
          to="/marketplace"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-green text-white font-semibold hover:bg-brand-green-dark transition-colors"
        >
          Browse Marketplace
        </Link>
      </div>
    </div>
  );
};

export default CheckoutEmptyState;

