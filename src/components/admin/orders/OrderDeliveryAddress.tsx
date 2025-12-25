import React from "react";
import { Box, Typography } from "@mui/material";
import type { AdminOrderDetail } from "../../../api/user.api";

interface OrderDeliveryAddressProps {
  order: AdminOrderDetail;
}

const OrderDeliveryAddress: React.FC<OrderDeliveryAddressProps> = ({
  order,
}) => {
  if (!order.deliveryAddress) return null;

  return (
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
  );
};

export default OrderDeliveryAddress;

