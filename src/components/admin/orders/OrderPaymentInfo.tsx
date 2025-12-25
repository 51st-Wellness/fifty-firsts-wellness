import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import type { AdminOrderDetail } from "../../../api/user.api";

interface OrderPaymentInfoProps {
  order: AdminOrderDetail;
}

const OrderPaymentInfo: React.FC<OrderPaymentInfoProps> = ({ order }) => {
  return (
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
  );
};

export default OrderPaymentInfo;

