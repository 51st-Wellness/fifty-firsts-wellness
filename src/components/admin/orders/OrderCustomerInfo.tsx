import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import type { AdminOrderDetail } from "../../../api/user.api";

interface OrderCustomerInfoProps {
  order: AdminOrderDetail;
}

const OrderCustomerInfo: React.FC<OrderCustomerInfoProps> = ({ order }) => {
  const customerName = useMemo(() => {
    if (!order?.customer) return "Unknown";
    if (order.customer.firstName && order.customer.lastName) {
      return `${order.customer.firstName} ${order.customer.lastName}`;
    }
    return order.customer.email;
  }, [order]);

  return (
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
  );
};

export default OrderCustomerInfo;

