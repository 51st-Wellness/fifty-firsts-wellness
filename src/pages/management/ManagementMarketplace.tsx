import React, { useState } from "react";
import ReviewManagement from "../../components/admin/ReviewManagement";
import NotificationsPreOrdersManagement from "../../components/admin/NotificationsPreOrdersManagement";
import OrdersManagement from "../../components/admin/OrdersManagement";
import DiscountManagement from "../../components/admin/discounts";
import { StoreItemsTab, MarketplaceTabs } from "../../components/admin/marketplace";

// Enhanced marketplace management with Material UI dialogs and full CRUD support
const ManagementMarketplace: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [query, setQuery] = useState({ page: 1, limit: 12, search: "" });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 font-primary">
      {/* Header */}
      <h1
        className="text-lg sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-6"
        style={{ fontFamily: '"League Spartan", sans-serif' }}
      >
        Marketplace Management
      </h1>

      {/* Tabs */}
      <MarketplaceTabs value={tabValue} onChange={handleTabChange} />

      {/* Tab Content */}
      {tabValue === 0 && (
        <StoreItemsTab query={query} onQueryChange={setQuery} />
      )}

      {tabValue === 1 && (
        <div>
          <OrdersManagement />
        </div>
      )}

      {tabValue === 2 && (
        <div>
          <ReviewManagement />
        </div>
      )}

      {tabValue === 3 && (
        <div>
          <NotificationsPreOrdersManagement />
        </div>
      )}

      {tabValue === 4 && (
        <div>
          <DiscountManagement />
      </div>
      )}
    </div>
  );
};

export default ManagementMarketplace;
