import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  LocalShipping as LocalShippingIcon,
  LocalShippingOutlined as LocalShippingOutlinedIcon,
} from "@mui/icons-material";
import type { AdminOrderDetail, AdminOrderStatus } from "../../../api/user.api";
import {
  normalizeOrderStatus,
  getStatusConfig,
  getNextStatus,
  getPreviousStatus,
  statusConfig,
} from "./utils";

interface OrderStatusControlsProps {
  order: AdminOrderDetail;
  onStatusUpdate?: (status: AdminOrderStatus) => Promise<void>;
}

const OrderStatusControls: React.FC<OrderStatusControlsProps> = ({
  order,
  onStatusUpdate,
}) => {
  const [statusMenuAnchor, setStatusMenuAnchor] =
    useState<null | HTMLElement>(null);

  const normalizedStatus = order
    ? normalizeOrderStatus(order.status)
    : null;
  const nextStatus =
    normalizedStatus && statusConfig[normalizedStatus]
      ? getNextStatus(normalizedStatus as AdminOrderStatus)
      : null;
  const previousStatus =
    normalizedStatus && statusConfig[normalizedStatus]
      ? getPreviousStatus(normalizedStatus as AdminOrderStatus)
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

  return (
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
                <MenuItem onClick={() => handleStatusUpdate(nextStatus)}>
                  <LocalShippingIcon sx={{ fontSize: 20, mr: 1 }} />
                  Move to {statusConfig[nextStatus].label}
                </MenuItem>
              )}
              {previousStatus && (
                <MenuItem onClick={() => handleStatusUpdate(previousStatus)}>
                  <LocalShippingOutlinedIcon sx={{ fontSize: 20, mr: 1 }} />
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
  );
};

export default OrderStatusControls;

