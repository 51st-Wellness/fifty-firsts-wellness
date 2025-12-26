import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Menu,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  LocalShippingOutlined as LocalShippingOutlinedIcon,
  QrCodeScanner as QrCodeScannerIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import OrderDetailsModal from "./orders";
import {
  getAdminOrders,
  updateOrderStatus,
  getAdminOrder,
  type AdminOrderStatus,
  type AdminOrderListItem,
  type AdminOrderDetail,
} from "../../api/user.api";
import { ResponseStatus } from "../../types/response.types";

const currency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value);

const statusConfig: Record<
  AdminOrderStatus | string,
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
  // Tracking statuses
  NOTFOUND: { label: "Not Found", color: "error" },
  DISPATCHED: { label: "Dispatched", color: "info" },
  TRANSIT: { label: "In Transit", color: "info" },
  PICKUP: { label: "Ready for Pickup", color: "warning" },
  UNDELIVERED: { label: "Undelivered", color: "error" },
  DELIVERED: { label: "Delivered", color: "success" },
  EXCEPTION: { label: "Exception", color: "error" },
  EXPIRED: { label: "Expired", color: "error" },
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

// Normalize status from backend (handles old payment statuses and tracking statuses)
const normalizeOrderStatus = (status: string): AdminOrderStatus | string => {
  // Map old payment statuses to new order statuses
  const statusMap: Record<string, AdminOrderStatus | string> = {
    PAID: "PROCESSING", // Paid orders should be in processing
    PENDING: "PENDING",
    CANCELLED: "PENDING", // Cancelled orders can't be changed, but show as pending for now
    FAILED: "PENDING",
    REFUNDED: "PENDING",
    // New order statuses
    PROCESSING: "PROCESSING",
    PACKAGING: "PACKAGING",
    IN_TRANSIT: "IN_TRANSIT",
    FULFILLED: "FULFILLED",
    // Tracking statuses (keep as-is)
    NOTFOUND: "NOTFOUND",
    DISPATCHED: "DISPATCHED",
    TRANSIT: "TRANSIT",
    PICKUP: "PICKUP",
    UNDELIVERED: "UNDELIVERED",
    DELIVERED: "DELIVERED",
    EXCEPTION: "EXCEPTION",
    EXPIRED: "EXPIRED",
  };

  return statusMap[status] || status || "PENDING";
};

// Get status config safely
const getStatusConfig = (status: string) => {
  const normalizedStatus = normalizeOrderStatus(status);
  return statusConfig[normalizedStatus] || statusConfig.PENDING;
};

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AdminOrderStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeOrder, setActiveOrder] = useState<AdminOrderListItem | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState<AdminOrderDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAdminOrders({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter || undefined,
        search: searchQuery || undefined,
      });
      if (response.status === ResponseStatus.SUCCESS && response.data) {
        // Ensure items array exists for each order
        const ordersWithItems = response.data.orders.map((order) => ({
          ...order,
          items: order.items || [],
        }));
        setOrders(ordersWithItems);
        setPagination({
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter, searchQuery]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const loadOrderDetail = useCallback(async (orderId: string) => {
    setLoadingDetail(true);
    try {
      const response = await getAdminOrder(orderId);
      if (response.status === ResponseStatus.SUCCESS && response.data) {
        setOrderDetail(response.data.order);
        setDetailsOpen(true);
      }
    } catch (error) {
      console.error("Failed to load order detail:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const handleRowClick = (order: AdminOrderListItem) => {
    loadOrderDetail(order.id);
  };

  const handleStatusClick = (
    event: React.MouseEvent<HTMLDivElement>,
    order: AdminOrderListItem
  ) => {
    event.stopPropagation();
    setActiveOrder(order);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    order: AdminOrderListItem
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveOrder(null);
  };

  const handleStatusUpdate = async (newStatus: AdminOrderStatus) => {
    if (!activeOrder) return;

    try {
      const response = await updateOrderStatus(activeOrder.id, newStatus);
      if (response.status === ResponseStatus.SUCCESS && response.data) {
        toast.success(
          `Order status updated to ${statusConfig[newStatus].label}`
        );
        await loadOrders();
        if (detailsOpen && orderDetail?.id === activeOrder.id) {
          setOrderDetail(response.data.order);
        }
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      handleMenuClose();
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const normalizedActiveStatus = activeOrder
    ? normalizeOrderStatus(activeOrder.status)
    : null;
  const nextStatus =
    normalizedActiveStatus &&
    statusFlow.includes(normalizedActiveStatus as AdminOrderStatus)
      ? getNextStatus(normalizedActiveStatus as AdminOrderStatus)
      : null;
  const previousStatus =
    normalizedActiveStatus &&
    statusFlow.includes(normalizedActiveStatus as AdminOrderStatus)
      ? getPreviousStatus(normalizedActiveStatus as AdminOrderStatus)
      : null;

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6 p-2 sm:p-4 lg:p-0">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between w-full">
            <h2
              className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Orders
            </h2>
            <Button
              variant="outlined"
              startIcon={<LocalShippingIcon />}
              onClick={loadOrders}
              size="small"
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
                fontFamily: '"League Spartan", sans-serif',
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 1.5, sm: 2 },
                ml: { xs: 2, sm: 4 },
              }}
            >
              <span className="hidden sm:inline">Refresh Orders</span>
              <span className="sm:hidden">Refresh</span>
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
            Track orders placed on the marketplace and update fulfillment status
          </p>
        </div>
      </div>

      <Card>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, lg: 3 } }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1.5, sm: 2 }, flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Search by customer, order ID, or product..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                ),
              }}
              sx={{
                flex: { xs: 1, sm: 1 },
                minWidth: { xs: "100%", sm: 220 },
                "& .MuiInputBase-root": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 } }}>
              <InputLabel sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value as AdminOrderStatus | "");
                  setPage(0);
                }}
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                <MenuItem value="" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>All</MenuItem>
                <MenuItem value="PENDING" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Pending</MenuItem>
                <MenuItem value="PROCESSING" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Processing</MenuItem>
                <MenuItem value="PACKAGING" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Packaging</MenuItem>
                <MenuItem value="IN_TRANSIT" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>In-Transit</MenuItem>
                <MenuItem value="FULFILLED" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Fulfilled</MenuItem>
                <MenuItem value="DISPATCHED" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Dispatched</MenuItem>
                <MenuItem value="TRANSIT" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>In Transit</MenuItem>
                <MenuItem value="DELIVERED" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Delivered</MenuItem>
                <MenuItem value="UNDELIVERED" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Undelivered</MenuItem>
                <MenuItem value="EXCEPTION" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Exception</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Order</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Customer</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 }, display: { xs: "none", md: "table-cell" } }}>Items</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Total</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Status</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>Placed</TableCell>
                <TableCell align="right" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: { xs: 3, sm: 4 } }}>
                    <CircularProgress size={20} sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    <Typography variant="body2" sx={{ mt: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                      Loading orders...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: { xs: 4, sm: 6 } }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <LocalShippingIcon
                        sx={{
                          fontSize: { xs: 48, sm: 64 },
                          color: "text.secondary",
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          fontFamily: '"League Spartan", sans-serif',
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        {searchQuery || statusFilter
                          ? "No orders found"
                          : "No orders yet"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {searchQuery || statusFilter
                          ? "Try adjusting your search or filter criteria"
                          : "Orders will appear here once customers place them"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const customerName =
                    order.customer?.firstName && order.customer?.lastName
                      ? `${order.customer.firstName} ${order.customer.lastName}`
                      : order.customer?.email || "Unknown Customer";
                  const paymentMethod = order.paymentProvider || "Unknown";
                  const shippingMethod = "Standard"; // This would come from delivery address metadata if available
                  const normalizedStatus = normalizeOrderStatus(
                    order.status || "PENDING"
                  );
                  const statusInfo = getStatusConfig(order.status || "PENDING");

                  return (
                    <TableRow
                      key={order.id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(order)}
                    >
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                          {order.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                          {paymentMethod} • {shippingMethod}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                          {customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                          {order.customer.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", md: "table-cell" } }}>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 220,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          {order.items && order.items.length > 0
                            ? order.items
                                .map(
                                  (item) =>
                                    `${item.name || "Unknown Product"} ×${
                                      item.quantity || 0
                                    }`
                                )
                                .join(", ")
                            : "No items"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                          {currency(order.totalAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                        <Chip
                          label={statusInfo.label}
                          color={statusInfo.color}
                          size="small"
                          onClick={(e) => handleStatusClick(e, order)}
                          sx={{
                            cursor: "pointer",
                            height: { xs: 20, sm: 24 },
                            fontSize: { xs: "0.65rem", sm: "0.75rem" },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        onClick={(e) => e.stopPropagation()}
                        sx={{ py: { xs: 1, sm: 1.5 } }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, order)}
                          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                        >
                          <MoreVertIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={pagination.total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            "& .MuiTablePagination-toolbar": {
              px: { xs: 1, sm: 2 },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
          }}
        />
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            minWidth: { xs: 180, sm: 200 },
          },
        }}
      >
        {nextStatus && (
          <MenuItem
            onClick={() => handleStatusUpdate(nextStatus)}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
          >
            <LocalShippingIcon sx={{ fontSize: { xs: 16, sm: 20 }, mr: 1 }} />
            Move to {statusConfig[nextStatus].label}
          </MenuItem>
        )}
        {previousStatus && (
          <MenuItem
            onClick={() => handleStatusUpdate(previousStatus)}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}
          >
            <LocalShippingOutlinedIcon sx={{ fontSize: { xs: 16, sm: 20 }, mr: 1 }} />
            Move back to {statusConfig[previousStatus].label}
          </MenuItem>
        )}
        {!nextStatus && !previousStatus && !activeOrder && (
          <MenuItem disabled sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, py: { xs: 0.75, sm: 1 } }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
              No status transitions available
            </Typography>
          </MenuItem>
        )}
      </Menu>

      <OrderDetailsModal
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setOrderDetail(null);
        }}
        order={orderDetail}
        loading={loadingDetail}
        onStatusUpdate={async (newStatus) => {
          if (orderDetail) {
            await handleStatusUpdate(newStatus);
          }
        }}
        onTrackingUpdate={async () => {
          if (orderDetail) {
            await loadOrderDetail(orderDetail.id);
          }
        }}
      />
    </div>
  );
};

export default OrdersManagement;
