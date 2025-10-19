import React from "react";
import { ShoppingBag } from "lucide-react";

const MyCart: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">My Cart</h2>
      </div>
      
      <div className="p-6">
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Your cart is empty</p>
        </div>
      </div>
    </div>
  );
};

export default MyCart;

