import React from "react";
import { Heart } from "lucide-react";

const Wishlist: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Wishlist</h2>
      </div>
      
      <div className="p-6">
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Your wishlist is empty</p>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

