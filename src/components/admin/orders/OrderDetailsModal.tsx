import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Stack,
  Divider,
  Typography,
} from "@mui/material";
import type { AdminOrderDetail, AdminOrderStatus } from "../../../api/user.api";
import OrderCustomerInfo from "./OrderCustomerInfo";
import OrderItemsList from "./OrderItemsList";
import OrderDeliveryAddress from "./OrderDeliveryAddress";
import OrderPaymentInfo from "./OrderPaymentInfo";
import OrderStatusControls from "./OrderStatusControls";
import OrderShippingInfo from "./OrderShippingInfo";
import OrderSummary from "./OrderSummary";

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: AdminOrderDetail | null;
  loading?: boolean;
  onStatusUpdate?: (status: AdminOrderStatus) => Promise<void>;
  onTrackingUpdate?: () => Promise<void>;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  open,
  onClose,
  order,
  loading = false,
  onStatusUpdate,
  onTrackingUpdate,
}) => {
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
            <OrderCustomerInfo order={order} />

            <Divider />

            <OrderItemsList order={order} />

            <Divider />

            <OrderDeliveryAddress order={order} />
            {order.deliveryAddress && <Divider />}

            <OrderPaymentInfo order={order} />

            <Divider />

            <OrderStatusControls order={order} onStatusUpdate={onStatusUpdate} />
            <OrderShippingInfo order={order} />

            <Divider />

            <OrderSummary order={order} />

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

