import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Avatar,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { type AdminSubscriptionData } from "../../api/subscription.api";

interface SubscriptionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  subscription: AdminSubscriptionData | null;
}

const SubscriptionDetailsModal: React.FC<SubscriptionDetailsModalProps> = ({
  open,
  onClose,
  subscription,
}) => {
  if (!subscription) return null;

  // Get status color for chip
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PENDING":
        return "warning";
      case "FAILED":
        return "error";
      case "CANCELLED":
        return "default";
      case "REFUNDED":
        return "info";
      default:
        return "default";
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  // Calculate days remaining
  const getDaysRemaining = () => {
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
          height: "auto",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight={600} sx={{ fontFamily: '"League Spartan", sans-serif' }}>
            Subscription Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* User Information */}
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "grey.50" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: "primary.main" }}>
                {subscription.userFirstName.charAt(0)}
                {subscription.userLastName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ fontFamily: '"League Spartan", sans-serif' }}>
                  {subscription.userFirstName} {subscription.userLastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subscription.userEmail}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">
                  {subscription.userPhone || "Not provided"}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  City
                </Typography>
                <Typography variant="body1">
                  {subscription.userCity || "Not provided"}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Subscription and Timeline Row */}
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {/* Subscription Information */}
            <Paper sx={{ p: 3, borderRadius: 2, flex: 1, minWidth: 300 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CreditCardIcon color="primary" />
                <Typography variant="h6" fontWeight={600} sx={{ fontFamily: '"League Spartan", sans-serif' }}>
                  Subscription Details
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Plan Name
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {subscription.planName}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={subscription.status}
                  color={getStatusColor(subscription.status) as any}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Amount
                </Typography>
                <Typography variant="h6" color="primary.main" fontWeight={600} sx={{ fontFamily: '"League Spartan", sans-serif' }}>
                  {formatCurrency(subscription.planPrice)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1">
                  {subscription.planDuration} days
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Auto Renew
                </Typography>
                <Chip
                  label={subscription.autoRenew ? "Enabled" : "Disabled"}
                  color={subscription.autoRenew ? "success" : "default"}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Billing Cycle
                </Typography>
                <Typography variant="body1">
                  #{subscription.billingCycle}
                </Typography>
              </Box>
            </Paper>

            {/* Dates and Timeline */}
            <Paper sx={{ p: 3, borderRadius: 2, flex: 1, minWidth: 300 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CalendarIcon color="primary" />
                <Typography variant="h6" fontWeight={600} sx={{ fontFamily: '"League Spartan", sans-serif' }}>
                  Timeline
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(subscription.startDate)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(subscription.endDate)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Days Remaining
                </Typography>
                <Typography
                  variant="h6"
                  color={daysRemaining > 0 ? "success.main" : "error.main"}
                  fontWeight={600}
                >
                  {daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">
                  {formatDate(subscription.createdAt)}
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Payment Information */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <MoneyIcon color="primary" />
              <Typography variant="h6" fontWeight={600} sx={{ fontFamily: '"League Spartan", sans-serif' }}>
                Payment Information
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  Payment ID
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                  {subscription.paymentId || "N/A"}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  Provider Subscription ID
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                  {subscription.providerSubscriptionId || "N/A"}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  Invoice ID
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                  {subscription.invoiceId || "N/A"}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  Subscription ID
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                  {subscription.id}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Plan Description */}
          {subscription.planDescription && (
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1, fontFamily: '"League Spartan", sans-serif' }}>
                Plan Description
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {subscription.planDescription}
              </Typography>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionDetailsModal;
