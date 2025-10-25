import React from "react";
import { Heart } from "lucide-react";

const Wishlist: React.FC = () => {
  return (
    <div className="rounded-lg">
      <div className="border-b border-gray-200 mb-6">
        <h2
          className="text-2xl font-semibold text-gray-900 mb-6"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Wishlist
        </h2>
      </div>

      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
          <p className="text-gray-500 text-sm">
            Wishlist functionality will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
