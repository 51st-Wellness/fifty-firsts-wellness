import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import SubscriptionsTable from "../../components/admin/SubscriptionsTable";
import SubscriptionDetailsModal from "../../components/admin/SubscriptionDetailsModal";
import { type AdminSubscriptionData } from "../../api/subscription.api";

// Dedicated management page for managing subscriptions
const ManagementSubscriptions: React.FC = () => {
  const [selectedSubscription, setSelectedSubscription] =
    useState<AdminSubscriptionData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewSubscription = (subscription: AdminSubscriptionData) => {
    setSelectedSubscription(subscription);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSubscription(null);
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 bg-gray-50 min-h-screen font-primary">
      {/* Header */}
      <div className="mb-3 sm:mb-4 lg:mb-6">
        <h1 
          className="text-lg sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2" 
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Subscription Management
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600 hidden sm:block">
          View and manage all user subscriptions, payment status, and
          subscription details
        </p>
      </div>

      {/* Subscriptions Table */}
      <SubscriptionsTable onViewDetails={handleViewSubscription} />

      {/* Subscription Details Modal */}
      <SubscriptionDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        subscription={selectedSubscription}
      />
    </div>
  );
};

export default ManagementSubscriptions;