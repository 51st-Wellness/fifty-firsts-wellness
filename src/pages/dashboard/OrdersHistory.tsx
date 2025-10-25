import React, { useState } from "react";
import { Package } from "lucide-react";

const OrdersHistory: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Delivered", "Cancelled", "Ongoing"];

  return (
    <div className="rounded-lg">
      <div className="border-b border-gray-200">
        <h2
          className="text-2xl font-semibold text-gray-900 mb-6"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Orders History
        </h2>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-full">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "text-brand-green border border-brand-green"
                  : " text-gray-600  border border-transparent"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
            <p className="text-gray-500 text-sm">
              Order history functionality will be available soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersHistory;
