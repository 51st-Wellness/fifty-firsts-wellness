import React from "react";

const MarketplaceActivity: React.FC = () => {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: '"League Spartan", sans-serif' }}>Pre‑ordered products</h3>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600">No pre‑orders yet.</p>
        </div>
      </section>
      <section>
        <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: '"League Spartan", sans-serif' }}>In‑stock notifications</h3>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600">You are not tracking any out‑of‑stock items.</p>
        </div>
      </section>
      <section>
        <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: '"League Spartan", sans-serif' }}>Orders</h3>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600">No orders found.</p>
        </div>
      </section>
    </div>
  );
};

export default MarketplaceActivity;


