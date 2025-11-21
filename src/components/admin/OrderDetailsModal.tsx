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
  Card,
  CardContent,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  LocalShipping as LocalShippingIcon,
  LocalShippingOutlined as LocalShippingOutlinedIcon,
  Image as ImageIcon,
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

// Normalize status from backend (handles old payment statuses)
const normalizeOrderStatus = (status: string): AdminOrderStatus => {
  const statusMap: Record<string, AdminOrderStatus> = {
    PAID: "PROCESSING",
    PENDING: "PENDING",
    CANCELLED: "PENDING",
    FAILED: "PENDING",
    REFUNDED: "PENDING",
    PROCESSING: "PROCESSING",
    PACKAGING: "PACKAGING",
    IN_TRANSIT: "IN_TRANSIT",
    FULFILLED: "FULFILLED",
  };

  return statusMap[status] || "PENDING";
};

// Get status config safely
const getStatusConfig = (status: string) => {
  const normalizedStatus = normalizeOrderStatus(status);
  return statusConfig[normalizedStatus] || statusConfig.PENDING;
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

  const normalizedStatus = order ? normalizeOrderStatus(order.status) : null;
  const nextStatus = normalizedStatus ? getNextStatus(normalizedStatus) : null;
  const previousStatus = normalizedStatus
    ? getPreviousStatus(normalizedStatus)
    : null;

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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                sx={{
                  fontFamily: '"League Spartan", sans-serif',
                  mb: 1.5,
                  fontWeight: 600,
                }}
                color="text.secondary"
              >
                Order Items ({order.orderItems?.length || 0})
              </Typography>
              <Stack spacing={1.5}>
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item) => {
                    const storeItem = item.product?.storeItem;
                    const productName = storeItem?.name || "Unknown Product";
                    const productImage =
                      storeItem?.display?.url || storeItem?.images?.[0] || null;
                    const productDescription = storeItem?.description;
                    const productCategories = storeItem?.categories || [];
                    const itemTotal = item.quantity * item.price;

                    return (
                      <Card
                        key={`${order.id}-${item.id}`}
                        variant="outlined"
                        sx={{
                          "&:hover": {
                            boxShadow: 1,
                          },
                        }}
                      >
                        <CardContent sx={{ py: 1.5, px: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: 1.5,
                              alignItems: "flex-start",
                            }}
                          >
                            {/* Product Image */}
                            <Box
                              sx={{
                                width: { xs: "80px", sm: "100px" },
                                flexShrink: 0,
                              }}
                            >
                              <Box
                                sx={{
                                  width: "100%",
                                  aspectRatio: "1",
                                  bgcolor: "grey.100",
                                  borderRadius: 1.5,
                                  overflow: "hidden",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {productImage ? (
                                  storeItem?.display?.type === "video" ? (
                                    <video
                                      src={productImage}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                      controls={false}
                                    />
                                  ) : (
                                    <img
                                      src={productImage}
                                      alt={productName}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )
                                ) : (
                                  <ImageIcon
                                    sx={{ fontSize: 32, color: "grey.400" }}
                                  />
                                )}
                              </Box>
                            </Box>

                            {/* Product Details */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Stack spacing={0.5}>
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    sx={{
                                      fontFamily:
                                        '"League Spartan", sans-serif',
                                    }}
                                  >
                                    {productName}
                                  </Typography>
                                  {productDescription && (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mt: 0.25 }}
                                    >
                                      {productDescription.length > 100
                                        ? `${productDescription.substring(
                                            0,
                                            100
                                          )}...`
                                        : productDescription}
                                    </Typography>
                                  )}
                                </Box>

                                {/* Quantity and Price Info */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mt: 0.5,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Qty: <strong>{item.quantity}</strong>
                                  </Typography>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                    color="primary"
                                  >
                                    {currency(itemTotal)}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })
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
                  label={getStatusConfig(order.status).label}
                  color={getStatusConfig(order.status).color}
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontFamily: '"League Spartan", sans-serif' }}
                  color="text.secondary"
                >
                  Subtotal ({order.orderItems?.length || 0} items)
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {currency(
                    order.orderItems?.reduce(
                      (sum, item) => sum + item.quantity * item.price,
                      0
                    ) || 0
                  )}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontFamily: '"League Spartan", sans-serif' }}
                  fontWeight={600}
                >
                  Total Amount
                </Typography>
                <Typography fontWeight={700} fontSize="1.5rem" color="primary">
                  {currency(order.totalAmount)}
                </Typography>
              </Box>
              {order.payment?.currency && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: "block" }}
                >
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
