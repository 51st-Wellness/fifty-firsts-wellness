import React from "react";
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
} from "@mui/material";
import type { Order } from "./OrdersManagement";

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  open,
  onClose,
  order,
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}
      >
        Order {order.id}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: '"League Spartan", sans-serif', mb: 0.5 }}
            >
              Customer
            </Typography>
            <Typography fontWeight={600}>{order.customerName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {order.customerEmail}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: '"League Spartan", sans-serif', mb: 1 }}
            >
              Items
            </Typography>
            <Stack spacing={1}>
              {order.items.map((item) => (
                <Box
                  key={`${order.id}-${item.productId}`}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.95rem",
                  }}
                >
                  <Typography>{item.name}</Typography>
                  <Typography fontWeight={600}>×{item.quantity}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ display: "grid", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Payment method
            </Typography>
            <Typography fontWeight={500} sx={{ textTransform: "capitalize" }}>
              {order.paymentMethod}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Shipping method
            </Typography>
            <Typography fontWeight={500} sx={{ textTransform: "capitalize" }}>
              {order.shippingMethod}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: '"League Spartan", sans-serif', mb: 1 }}
            >
              Status
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={order.status} color="primary" size="small" />
              {order.fulfillmentEta && (
                <Typography variant="body2" color="text.secondary">
                  ETA {new Date(order.fulfillmentEta).toLocaleDateString("en-GB")}
                </Typography>
              )}
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontFamily: '"League Spartan", sans-serif', mb: 0.5 }}
            >
              Total Paid
            </Typography>
            <Typography fontWeight={700} fontSize="1.25rem">
              £{order.total.toFixed(2)}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;

