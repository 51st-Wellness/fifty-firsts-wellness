import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import type { AdminOrderDetail } from "../../../api/user.api";
import { currency } from "./utils";

interface OrderSummaryProps {
  order: AdminOrderDetail;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const subtotal =
    order.orderItems?.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ) || 0;

  return (
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
          {currency(subtotal)}
        </Typography>
      </Box>

      {order.shippingCost !== null &&
        order.shippingCost !== undefined &&
        order.shippingCost > 0 && (
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
              Shipping
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {currency(order.shippingCost)}
            </Typography>
          </Box>
        )}

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
  );
};

export default OrderSummary;

