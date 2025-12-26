import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  ShoppingBag as ShoppingBagIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import {
  getPreOrders,
  getAdminOrder,
  sendBulkEmailToPreOrders,
} from "../../api/user.api";
import { BulkEmailDialog } from "./BulkEmailDialog";
import type { AdminOrderListItem, AdminOrderDetail } from "../../api/user.api";
import { ResponseStatus } from "../../types/response.types";

const PreOrdersManagement: React.FC = () => {
  const [preOrders, setPreOrders] = useState<AdminOrderListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [preOrderStatusFilter, setPreOrderStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [orderDetail, setOrderDetail] = useState<AdminOrderDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [bulkEmailOpen, setBulkEmailOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const loadPreOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPreOrders({
        page: page + 1,
        limit: rowsPerPage,
        preOrderStatus: preOrderStatusFilter || undefined,
        search: searchQuery || undefined,
      });

      if (response.status === ResponseStatus.SUCCESS && response.data) {
        setPreOrders(response.data.orders);
        setTotalCount(response.data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to load pre-orders:", error);
      toast.error("Failed to load pre-orders");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, preOrderStatusFilter, searchQuery]);

  useEffect(() => {
    loadPreOrders();
  }, [loadPreOrders]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = async (order: AdminOrderListItem) => {
    setLoadingDetail(true);
    setDetailOpen(true);
    try {
      const response = await getAdminOrder(order.id);
      if (response.status === ResponseStatus.SUCCESS && response.data) {
        setOrderDetail(response.data.order);
      }
    } catch (error) {
      console.error("Failed to load order details:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSendBulkEmail = async (data: {
    productId: string;
    subject: string;
    message: string;
  }) => {
    try {
      setSendingEmail(true);
      const response = await sendBulkEmailToPreOrders({
        ...data,
        preOrderStatus: preOrderStatusFilter || undefined,
      });

      if (response.status === ResponseStatus.SUCCESS && response.data) {
        toast.success(
          `Email sent to ${response.data.totalSent} pre-order customer(s) for "${response.data.productName}"`
        );
        setBulkEmailOpen(false);
        loadPreOrders();
      }
    } catch (error: any) {
      console.error("Failed to send bulk email:", error);
      toast.error(
        error?.response?.data?.message || "Failed to send bulk email"
      );
    } finally {
      setSendingEmail(false);
    }
  };

  const filteredPreOrders = useMemo(() => {
    if (!searchQuery.trim()) return preOrders;

    return preOrders.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.email?.toLowerCase().includes(searchLower) ||
        order.customer.firstName?.toLowerCase().includes(searchLower) ||
        order.customer.lastName?.toLowerCase().includes(searchLower) ||
        order.items.some((item) =>
          item.name?.toLowerCase().includes(searchLower)
        )
      );
    });
  }, [preOrders, searchQuery]);

  const preOrderStats = useMemo(() => {
    const placed = preOrders.filter(
      (o) => (o as any).preOrderStatus === "PLACED"
    ).length;
    const confirmed = preOrders.filter(
      (o) => (o as any).preOrderStatus === "CONFIRMED"
    ).length;
    const fulfilled = preOrders.filter(
      (o) => (o as any).preOrderStatus === "FULFILLED"
    ).length;
    const cancelled = preOrders.filter(
      (o) => (o as any).preOrderStatus === "CANCELLED"
    ).length;
    return { total: totalCount, placed, confirmed, fulfilled, cancelled };
  }, [preOrders, totalCount]);

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case "FULFILLED":
        return "success";
      case "CONFIRMED":
        return "info";
      case "PLACED":
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between w-full">
            <h2
              className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Pre-Orders
            </h2>
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={() => setBulkEmailOpen(true)}
              size="small"
              sx={{
                bgcolor: "#00969b",
                "&:hover": { bgcolor: "#007a7f" },
                fontFamily: '"League Spartan", sans-serif',
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 1.5, sm: 2 },
                ml: { xs: 2, sm: 4 },
              }}
            >
              <span className="hidden sm:inline">Send Bulk Email</span>
              <span className="sm:hidden">Send Email</span>
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
            Manage pre-orders and notify customers
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, lg: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 } }}>
            <Box
              sx={{
                bgcolor: "#00969b",
                borderRadius: { xs: 1, sm: 2 },
                p: { xs: 1.5, sm: 2 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingBagIcon sx={{ color: "white", fontSize: { xs: 20, sm: 28 } }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  fontFamily: '"League Spartan", sans-serif',
                  fontSize: { xs: "0.875rem", sm: "1rem", lg: "1.25rem" },
                }}
              >
                Pre-Orders Summary
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                Total: {preOrderStats.total} • Placed: {preOrderStats.placed} •
                Confirmed: {preOrderStats.confirmed} • Fulfilled:{" "}
                {preOrderStats.fulfilled} • Cancelled: {preOrderStats.cancelled}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, lg: 3 } }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1.5, sm: 2 }, flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Search by order ID, customer, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                ),
              }}
              sx={{
                flex: { xs: 1, sm: 1 },
                minWidth: { xs: "100%", sm: 200 },
                "& .MuiInputBase-root": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
              <InputLabel sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Pre-Order Status</InputLabel>
              <Select
                value={preOrderStatusFilter}
                label="Pre-Order Status"
                onChange={(e) => setPreOrderStatusFilter(e.target.value)}
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                <MenuItem value="" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>All</MenuItem>
                <MenuItem value="PLACED" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Placed</MenuItem>
                <MenuItem value="CONFIRMED" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Confirmed</MenuItem>
                <MenuItem value="FULFILLED" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Fulfilled</MenuItem>
                <MenuItem value="CANCELLED" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Pre-Orders Table */}
      <Card>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Order ID</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Customer</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 }, display: { xs: "none", md: "table-cell" } }}>Items</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Total Amount</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 } }}>Pre-Order Status</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>Order Status</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem", lg: "0.875rem" }, py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>Order Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: { xs: 3, sm: 4 } }}>
                    <CircularProgress size={20} sx={{ fontSize: { xs: 20, sm: 32 } }} />
                  </TableCell>
                </TableRow>
              ) : filteredPreOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: { xs: 4, sm: 6 } }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <ShoppingBagIcon
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
                        {searchQuery || preOrderStatusFilter
                          ? "No pre-orders found"
                          : "No pre-orders yet"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                      >
                        {searchQuery || preOrderStatusFilter
                          ? "Try adjusting your search or filter criteria"
                          : "Pre-orders will appear here once customers place them"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPreOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(order)}
                  >
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        {order.id.slice(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#00969b",
                            width: { xs: 28, sm: 32 },
                            height: { xs: 28, sm: 32 },
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          {order.customer.firstName?.[0]?.toUpperCase() ||
                            order.customer.email?.[0]?.toUpperCase() ||
                            "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                            {order.customer.firstName} {order.customer.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                            {order.customer.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", md: "table-cell" } }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        {order.items.length} item(s)
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                        {order.items
                          .map((item) => `${item.name} (x${item.quantity})`)
                          .join(", ")}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                      <Chip
                        label={(order as any).preOrderStatus || "N/A"}
                        color={getStatusColor((order as any).preOrderStatus)}
                        size="small"
                        sx={{
                          height: { xs: 20, sm: 24 },
                          fontSize: { xs: "0.65rem", sm: "0.75rem" },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>
                      <Chip
                        label={order.status}
                        size="small"
                        variant="outlined"
                        color="default"
                        sx={{
                          height: { xs: 20, sm: 24 },
                          fontSize: { xs: "0.65rem", sm: "0.75rem" },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1, sm: 1.5 }, display: { xs: "none", lg: "table-cell" } }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                        {formatDate(order.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalCount}
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

      {/* Order Detail Modal */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 1, sm: 2 },
            width: { xs: "calc(100% - 16px)", sm: "auto" },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: '"League Spartan", sans-serif',
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: { xs: "1rem", sm: "1.25rem" },
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 2 },
          }}
        >
          Order Details
          <IconButton
            aria-label="close"
            onClick={() => setDetailOpen(false)}
            edge="end"
            size="small"
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
          {loadingDetail ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : orderDetail ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Customer Info */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Customer Information
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <Box sx={{ flex: "1 1 45%", minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body2">
                      {orderDetail.customer.firstName}{" "}
                      {orderDetail.customer.lastName}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: "1 1 45%", minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body2">
                      {orderDetail.customer.email}
                    </Typography>
                  </Box>
                  {orderDetail.customer.phone && (
                    <Box sx={{ flex: "1 1 45%", minWidth: 200 }}>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body2">
                        {orderDetail.customer.phone}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Divider />

              {/* Order Info */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Order Information
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <Box sx={{ flex: "1 1 45%", minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">
                      Order ID
                    </Typography>
                    <Typography variant="body2">{orderDetail.id}</Typography>
                  </Box>
                  <Box sx={{ flex: "1 1 45%", minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Chip label={orderDetail.status} size="small" />
                  </Box>
                  <Box sx={{ flex: "1 1 45%", minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">
                      Pre-Order Status
                    </Typography>
                    <Chip
                      label={(orderDetail as any).preOrderStatus || "N/A"}
                      color={getStatusColor(
                        (orderDetail as any).preOrderStatus
                      )}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ flex: "1 1 45%", minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(orderDetail.totalAmount)}
                    </Typography>
                  </Box>
                  {(orderDetail as any).expectedFulfillmentDate && (
                    <Box sx={{ flex: "1 1 45%", minWidth: 200 }}>
                      <Typography variant="caption" color="text.secondary">
                        Expected Fulfillment
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(
                          (orderDetail as any).expectedFulfillmentDate
                        )}
                      </Typography>
                    </Box>
                  )}
                  {(orderDetail as any).fulfillmentNotes && (
                    <Box sx={{ flex: "1 1 100%" }}>
                      <Typography variant="caption" color="text.secondary">
                        Fulfillment Notes
                      </Typography>
                      <Typography variant="body2">
                        {(orderDetail as any).fulfillmentNotes}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Divider />

              {/* Order Items */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Order Items
                </Typography>
                {orderDetail.orderItems.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {item.product?.storeItem?.name || "Unknown Product"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Quantity: {item.quantity} • Price:{" "}
                      {formatCurrency(item.price)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Delivery Address */}
              {orderDetail.deliveryAddress && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Delivery Address
                    </Typography>
                    <Typography variant="body2">
                      {orderDetail.deliveryAddress.recipientName}
                    </Typography>
                    <Typography variant="body2">
                      {orderDetail.deliveryAddress.addressLine1}
                    </Typography>
                    <Typography variant="body2">
                      {orderDetail.deliveryAddress.postTown},{" "}
                      {orderDetail.deliveryAddress.postcode}
                    </Typography>
                    {orderDetail.deliveryAddress.deliveryInstructions && (
                      <Typography variant="body2" color="text.secondary">
                        {orderDetail.deliveryAddress.deliveryInstructions}
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </Box>
          ) : (
            <Typography>No order details available</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
          <Button
            onClick={() => setDetailOpen(false)}
            size="small"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Email Dialog */}
      <BulkEmailDialog
        open={bulkEmailOpen}
        onClose={() => setBulkEmailOpen(false)}
        onSend={handleSendBulkEmail}
        defaultSubject="Your Pre-Order Update from Fifty Firsts Wellness"
        defaultMessage={`Hi <First Name>,

We have an important update regarding your pre-order for "<Product Name>".

<Your custom message here>

Thank you for your patience,
The Fifty Firsts Wellness Team`}
        title="Send Bulk Email to Pre-Order Customers"
        sending={sendingEmail}
      />
    </div>
  );
};

export default PreOrdersManagement;
