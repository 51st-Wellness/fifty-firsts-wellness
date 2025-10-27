import React from "react";
import { ShoppingBag } from "lucide-react";

const MyCart: React.FC = () => {
  return (
    <div className="rounded-lg">
      <div className="border-b border-gray-200 mb-6">
        <h2
          className="text-2xl font-semibold text-gray-900 mb-6"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          My Cart
        </h2>
      </div>

      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900" style={{ fontFamily: '"League Spartan", sans-serif' }}>Coming Soon</h3>
          <p className="text-gray-500 text-sm">
            Shopping cart functionality will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyCart;
