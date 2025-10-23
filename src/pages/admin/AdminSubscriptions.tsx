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
    <Box
      sx={{ p: 4, backgroundColor: "background.default", minHeight: "100vh" }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="700" sx={{ mb: 1 }}>
          Subscription Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all user subscriptions, payment status, and
          subscription details
        </Typography>
      </Box>

      {/* Subscriptions Table */}
      <SubscriptionsTable onViewDetails={handleViewSubscription} />

      {/* Subscription Details Modal */}
      <SubscriptionDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        subscription={selectedSubscription}
      />
    </Box>
  );
};

export default AdminSubscriptions;
