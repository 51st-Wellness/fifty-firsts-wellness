import React, { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
  Stack,
  CircularProgress,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  LocalShipping as LocalShippingIcon,
  LocalShippingOutlined as LocalShippingOutlinedIcon,
} from "@mui/icons-material";
import type { AdminOrderDetail, AdminOrderStatus } from "../../api/user.api";

const currency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value);

const statusConfig: Record<
  AdminOrderStatus,
  {
    label: string;
    color: "default" | "warning" | "success" | "primary" | "info" | "error";
  }
> = {
  PENDING: { label: "Pending", color: "warning" },
  PROCESSING: { label: "Processing", color: "primary" },
  PACKAGING: { label: "Packaging", color: "info" },
  IN_TRANSIT: { label: "In-Transit", color: "info" },
  FULFILLED: { label: "Fulfilled", color: "success" },
};

const statusFlow: AdminOrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "PACKAGING",
  "IN_TRANSIT",
  "FULFILLED",
];

const getNextStatus = (
  currentStatus: AdminOrderStatus
): AdminOrderStatus | null => {
  const currentIndex = statusFlow.indexOf(currentStatus);
  if (currentIndex < statusFlow.length - 1) {
    return statusFlow[currentIndex + 1];
  }
  return null;
};

const getPreviousStatus = (
  currentStatus: AdminOrderStatus
): AdminOrderStatus | null => {
  const currentIndex = statusFlow.indexOf(currentStatus);
  if (currentIndex > 0) {
    return statusFlow[currentIndex - 1];
  }
  return null;
};

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: AdminOrderDetail | null;
  loading?: boolean;
  onStatusUpdate?: (status: AdminOrderStatus) => Promise<void>;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  open,
  onClose,
  order,
  loading = false,
  onStatusUpdate,
}) => {
  const [statusMenuAnchor, setStatusMenuAnchor] =
    React.useState<null | HTMLElement>(null);

  const nextStatus = order ? getNextStatus(order.status) : null;
  const previousStatus = order ? getPreviousStatus(order.status) : null;

  const handleStatusMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setStatusMenuAnchor(event.currentTarget);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
  };

  const handleStatusUpdate = async (newStatus: AdminOrderStatus) => {
    if (onStatusUpdate) {
      await onStatusUpdate(newStatus);
    }
    handleStatusMenuClose();
  };

  const customerName = useMemo(() => {
    if (!order?.customer) return "Unknown";
    if (order.customer.firstName && order.customer.lastName) {
      return `${order.customer.firstName} ${order.customer.lastName}`;
    }
    return order.customer.email;
  }, [order]);

  if (!order && !loading) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}
      >
        Order {order?.id || "Loading..."}
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : order ? (
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontFamily: '"League Spartan", sans-serif', mb: 0.5 }}
                color="text.secondary"
              >
                Customer
              </Typography>
              <Typography fontWeight={600}>{customerName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {order.customer.email}
              </Typography>
              {order.customer.phone && (
                <Typography variant="body2" color="text.secondary">
                  {order.customer.phone}
                </Typography>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontFamily: '"League Spartan", sans-serif', mb: 1 }}
                color="text.secondary"
              >
                Items
              </Typography>
              <Stack spacing={1}>
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item) => (
                    <Box
                      key={`${order.id}-${item.id}`}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.95rem",
                      }}
                    >
                      <Typography>
                        {item.product?.storeItem?.name || "Unknown Product"}
                      </Typography>
                      <Typography fontWeight={600}>
                        ×{item.quantity} @ {currency(item.price)}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No items found
                  </Typography>
                )}
              </Stack>
            </Box>

            <Divider />

            {order.deliveryAddress && (
              <>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontFamily: '"League Spartan", sans-serif', mb: 1 }}
                    color="text.secondary"
                  >
                    Delivery Address
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {order.deliveryAddress.recipientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.deliveryAddress.addressLine1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.deliveryAddress.postTown},{" "}
                    {order.deliveryAddress.postcode}
                  </Typography>
                  {order.deliveryAddress.contactPhone && (
                    <Typography variant="body2" color="text.secondary">
                      {order.deliveryAddress.contactPhone}
                    </Typography>
                  )}
                  {order.deliveryAddress.deliveryInstructions && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, fontStyle: "italic" }}
                    >
                      Note: {order.deliveryAddress.deliveryInstructions}
                    </Typography>
                  )}
                </Box>
                <Divider />
              </>
            )}

            <Box sx={{ display: "grid", gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Payment method
              </Typography>
              <Typography fontWeight={500} sx={{ textTransform: "capitalize" }}>
                {order.payment?.provider || "Unknown"}
              </Typography>
              {order.payment?.status && (
                <>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Payment status
                  </Typography>
                  <Chip
                    label={order.payment.status}
                    size="small"
                    color={
                      order.payment.status === "PAID"
                        ? "success"
                        : order.payment.status === "FAILED"
                        ? "error"
                        : "warning"
                    }
                  />
                </>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontFamily: '"League Spartan", sans-serif', mb: 1 }}
                color="text.secondary"
              >
                Order Status
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={statusConfig[order.status].label}
                  color={statusConfig[order.status].color}
                  size="small"
                  onClick={onStatusUpdate ? handleStatusMenuOpen : undefined}
                  sx={onStatusUpdate ? { cursor: "pointer" } : {}}
                />
                {onStatusUpdate && (
                  <>
                    <IconButton
                      size="small"
                      onClick={handleStatusMenuOpen}
                      sx={{ ml: 1 }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                    <Menu
                      anchorEl={statusMenuAnchor}
                      open={Boolean(statusMenuAnchor)}
                      onClose={handleStatusMenuClose}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                      {nextStatus && (
                        <MenuItem
                          onClick={() => handleStatusUpdate(nextStatus)}
                        >
                          <LocalShippingIcon sx={{ fontSize: 20, mr: 1 }} />
                          Move to {statusConfig[nextStatus].label}
                        </MenuItem>
                      )}
                      {previousStatus && (
                        <MenuItem
                          onClick={() => handleStatusUpdate(previousStatus)}
                        >
                          <LocalShippingOutlinedIcon
                            sx={{ fontSize: 20, mr: 1 }}
                          />
                          Move back to {statusConfig[previousStatus].label}
                        </MenuItem>
                      )}
                      {!nextStatus && !previousStatus && (
                        <MenuItem disabled>
                          <Typography variant="body2" color="text.secondary">
                            No status transitions available
                          </Typography>
                        </MenuItem>
                      )}
                    </Menu>
                  </>
                )}
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontFamily: '"League Spartan", sans-serif', mb: 0.5 }}
                color="text.secondary"
              >
                Total Amount
              </Typography>
              <Typography fontWeight={700} fontSize="1.25rem">
                {currency(order.totalAmount)}
              </Typography>
              {order.payment?.currency && (
                <Typography variant="caption" color="text.secondary">
                  Currency: {order.payment.currency}
                </Typography>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontFamily: '"League Spartan", sans-serif', mb: 0.5 }}
                color="text.secondary"
              >
                Order Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Placed: {new Date(order.createdAt).toLocaleString("en-GB")}
              </Typography>
              {order.updatedAt && (
                <Typography variant="body2" color="text.secondary">
                  Last updated:{" "}
                  {new Date(order.updatedAt).toLocaleString("en-GB")}
                </Typography>
              )}
              {order.paymentId && (
                <Typography variant="body2" color="text.secondary">
                  Payment ID: {order.paymentId}
                </Typography>
              )}
            </Box>
          </Stack>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;
