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
} from "@mui/icons-material";
import toast from "react-hot-toast";
import OrderDetailsModal from "./OrderDetailsModal";
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
  // Map old payment statuses to new order statuses
  const statusMap: Record<string, AdminOrderStatus> = {
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
  };

  return statusMap[status] || "PENDING";
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

  const nextStatus = activeOrder
    ? getNextStatus(normalizeOrderStatus(activeOrder.status))
    : null;
  const previousStatus = activeOrder
    ? getPreviousStatus(normalizeOrderStatus(activeOrder.status))
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2
            className="text-2xl font-semibold text-gray-900"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Orders
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Track orders placed on the marketplace and update fulfillment status
          </p>
        </div>
        <Button
          variant="outlined"
          startIcon={<LocalShippingIcon />}
          onClick={loadOrders}
          sx={{
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 600,
            fontFamily: '"League Spartan", sans-serif',
          }}
        >
          Refresh Orders
        </Button>
      </div>

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
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
                  <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              sx={{ flex: 1, minWidth: 220 }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value as AdminOrderStatus | "");
                  setPage(0);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="PROCESSING">Processing</MenuItem>
                <MenuItem value="PACKAGING">Packaging</MenuItem>
                <MenuItem value="IN_TRANSIT">In-Transit</MenuItem>
                <MenuItem value="FULFILLED">Fulfilled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Placed</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Loading orders...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No orders found
                    </Typography>
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
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {order.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {paymentMethod} • {shippingMethod}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.customer.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 220,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
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
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {currency(order.totalAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusInfo.label}
                          color={statusInfo.color}
                          size="small"
                          onClick={(e) => handleStatusClick(e, order)}
                          sx={{ cursor: "pointer" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
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
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, order)}
                        >
                          <MoreVertIcon />
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
        />
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
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
      />
    </div>
  );
};

export default OrdersManagement;
