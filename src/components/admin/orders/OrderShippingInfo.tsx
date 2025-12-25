import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import {
  LocalShipping as LocalShippingIcon,
  QrCodeScanner as QrCodeScannerIcon,
} from "@mui/icons-material";
import type { AdminOrderDetail } from "../../../api/user.api";
import { currency, normalizeOrderStatus, getStatusConfig } from "./utils";

interface OrderShippingInfoProps {
  order: AdminOrderDetail;
}

const OrderShippingInfo: React.FC<OrderShippingInfoProps> = ({ order }) => {
  if (
    !order.clickDropOrderIdentifier &&
    !order.trackingReference &&
    order.shippingCost === null &&
    order.shippingCost === undefined
  ) {
    return null;
  }

  return (
    <Card sx={{ mt: 2, bgcolor: "grey.50" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <LocalShippingIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2" fontWeight={600}>
            Shipping Details
          </Typography>
        </Stack>

        <Stack spacing={1}>
          {order.clickDropOrderIdentifier && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Click & Drop Order ID
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                #{order.clickDropOrderIdentifier}
              </Typography>
            </Box>
          )}

          {order.trackingReference && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Tracking Number
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {order.trackingReference}
              </Typography>
              {order.status && (
                <Chip
                  label={normalizeOrderStatus(order.status)}
                  size="small"
                  color={getStatusConfig(normalizeOrderStatus(order.status)).color}
                  sx={{ mt: 0.5 }}
                />
              )}
            </Box>
          )}

          {order.shippingCost !== null &&
            order.shippingCost !== undefined && (
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                >
                  Shipping Cost
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {currency(order.shippingCost)}
                </Typography>
              </Box>
            )}

          {order.serviceCode && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Service
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {order.serviceCode}
              </Typography>
            </Box>
          )}

          {order.parcelWeight && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Weight
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {(order.parcelWeight / 1000).toFixed(2)} kg
              </Typography>
            </Box>
          )}

          {order.labelBase64 && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<QrCodeScannerIcon />}
              onClick={() => {
                const link = document.createElement("a");
                link.href = `data:application/pdf;base64,${order.labelBase64}`;
                link.download = `shipping-label-${order.id}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              sx={{ mt: 1, alignSelf: "flex-start" }}
            >
              Download Shipping Label
            </Button>
          )}

          {order.trackingReference && (
            <Button
              size="small"
              variant="text"
              href={`https://www.royalmail.com/track-your-item#/tracking-results/${order.trackingReference}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ alignSelf: "flex-start" }}
            >
              Track on Royal Mail
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OrderShippingInfo;

