import React from "react";

// Simple overview with key metrics placeholders
const AdminOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-semibold mt-2">—</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Store Items</div>
          <div className="text-2xl font-semibold mt-2">—</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Orders (30d)</div>
          <div className="text-2xl font-semibold mt-2">—</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-2">Activity</h2>
        <p className="text-sm text-gray-600">
          Charts and recent events will appear here.
        </p>
      </div>
    </div>
  );
};

export default AdminOverview;
