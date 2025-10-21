import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import SubscriptionsTable from "../../components/admin/SubscriptionsTable";
import SubscriptionDetailsModal from "../../components/admin/SubscriptionDetailsModal";

// Dedicated admin page for managing subscriptions
const AdminSubscriptions: React.FC = () => {
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewSubscription = (subscription: any) => {
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
