import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import SubscriptionsTable from "../../components/admin/SubscriptionsTable";
import SubscriptionDetailsModal from "../../components/admin/SubscriptionDetailsModal";
import { type AdminSubscriptionData } from "../../api/subscription.api";

// Dedicated admin page for managing subscriptions
const AdminSubscriptions: React.FC = () => {
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
    <div className="p-6 bg-gray-50 min-h-screen font-primary">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-accent font-semibold text-gray-900 mb-2">
          Subscription Management
        </h1>
        <p className="text-base text-gray-600">
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

export default AdminSubscriptions;
